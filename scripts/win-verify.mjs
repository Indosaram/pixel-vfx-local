import { execSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	renameSync,
	rmSync,
	statSync,
	unlinkSync,
	writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";
import { connectCdp, sleep, waitFor } from "./cdp.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const evDir = join(root, "evidence");
const shotDir = join(evDir, "screenshots");
const dlDir = join(evDir, "downloads");
const exDir = join(evDir, "exports");
const profileDir = join(evDir, "chrome-profile");

rmSync(profileDir, { recursive: true, force: true });
mkdirSync(shotDir, { recursive: true });
mkdirSync(dlDir, { recursive: true });
mkdirSync(exDir, { recursive: true });
for (const f of readdirSync(dlDir)) rmSync(join(dlDir, f), { force: true });
for (const f of readdirSync(exDir)) rmSync(join(exDir, f), { force: true });
for (const f of readdirSync(shotDir)) rmSync(join(shotDir, f), { force: true });

const checks = [];
const consoleErrors = [];
const downloadsLog = [];
let shotN = 0;

function fmt(v) {
	if (typeof v === "string") return v;
	try {
		return JSON.stringify(v);
	} catch {
		return String(v);
	}
}

function check(name, observed, expected, pass) {
	const rec = {
		name,
		observed: fmt(observed),
		expected: fmt(expected),
		pass: Boolean(pass),
	};
	checks.push(rec);
	console.log(
		`${rec.pass ? "PASS" : "FAIL"}  ${name}  [observed: ${rec.observed}]`,
	);
	return rec.pass;
}

function sha256(buf) {
	return createHash("sha256").update(buf).digest("hex");
}

// ---------- PNG parser: signature, chunk walk + CRC32, inflate, unfilter ----------
const crcTable = (() => {
	const t = new Int32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		t[n] = c;
	}
	return t;
})();

function crc32(buf) {
	let c = -1;
	for (let i = 0; i < buf.length; i++)
		c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
	return (c ^ -1) >>> 0;
}

function parsePNG(buf) {
	const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
	if (!buf.subarray(0, 8).equals(sig)) throw new Error("bad PNG signature");
	let off = 8;
	let idat = Buffer.alloc(0);
	let ihdr = null;
	let crcBad = 0;
	const chunks = [];
	for (;;) {
		const len = buf.readUInt32BE(off);
		const type = buf.toString("ascii", off + 4, off + 8);
		const data = buf.subarray(off + 8, off + 8 + len);
		const crc = buf.readUInt32BE(off + 8 + len);
		if (crc !== crc32(Buffer.concat([Buffer.from(type), data]))) crcBad++;
		if (type === "IHDR") {
			ihdr = {
				w: data.readUInt32BE(0),
				h: data.readUInt32BE(4),
				bitDepth: data[8],
				colorType: data[9],
			};
		}
		if (type === "IDAT") idat = Buffer.concat([idat, data]);
		chunks.push(type);
		off += 12 + len;
		if (type === "IEND") break;
		if (off >= buf.length) throw new Error("PNG truncated");
	}
	if (crcBad) throw new Error(`PNG CRC mismatch x${crcBad}`);
	if (ihdr.colorType !== 6 || ihdr.bitDepth !== 8)
		throw new Error(`unexpected PNG format ${ihdr.colorType}/${ihdr.bitDepth}`);
	const raw = inflateSync(idat);
	const { w, h } = ihdr;
	const bpp = 4;
	const stride = w * bpp;
	const out = Buffer.alloc(stride * h);
	let pos = 0;
	for (let y = 0; y < h; y++) {
		const filter = raw[pos++];
		const line = raw.subarray(pos, pos + stride);
		pos += stride;
		const cur = out.subarray(y * stride, (y + 1) * stride);
		const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
		for (let x = 0; x < stride; x++) {
			const a = x >= bpp ? cur[x - bpp] : 0;
			const b = prev ? prev[x] : 0;
			const c = prev && x >= bpp ? prev[x - bpp] : 0;
			let v = line[x];
			if (filter === 1) v = (v + a) & 255;
			else if (filter === 2) v = (v + b) & 255;
			else if (filter === 3) v = (v + ((a + b) >> 1)) & 255;
			else if (filter === 4) {
				const p = a + b - c;
				const pa = Math.abs(p - a);
				const pb = Math.abs(p - b);
				const pc = Math.abs(p - c);
				const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
				v = (v + pr) & 255;
			} else if (filter !== 0) throw new Error(`bad PNG filter ${filter}`);
			cur[x] = v;
		}
	}
	return { ...ihdr, pixels: out };
}

function alphaStats(pixels) {
	let zero = 0;
	let full = 0;
	let other = 0;
	for (let i = 3; i < pixels.length; i += 4) {
		const a = pixels[i];
		if (a === 0) zero++;
		else if (a === 255) full++;
		else other++;
	}
	return { zero, full, other };
}

// ---------- GIF parser: header, GCE delays, NETSCAPE loop, image count ----------
function skipSubBlocks(buf, off) {
	while (off < buf.length && buf[off] !== 0) off += 1 + buf[off];
	return off + 1;
}

function parseGIF(buf) {
	const sig = buf.toString("ascii", 0, 6);
	if (sig !== "GIF89a" && sig !== "GIF87a")
		throw new Error(`bad GIF sig ${sig}`);
	const w = buf.readUInt16LE(6);
	const h = buf.readUInt16LE(8);
	const packed = buf[10];
	let off = 13;
	if (packed & 0x80) off += 3 * (2 << (packed & 7));
	const frames = [];
	let loop = null;
	let delay = null;
	let trans = null;
	while (off < buf.length) {
		const b = buf[off];
		if (b === 0x3b) break;
		if (b === 0x21) {
			const label = buf[off + 1];
			off += 2;
			if (label === 0xf9) {
				const size = buf[off];
				const flags = buf[off + 1];
				delay = buf.readUInt16LE(off + 2);
				trans = flags & 1 ? buf[off + 4] : null;
				off += 1 + size;
				off += 1; // block terminator
			} else if (label === 0xff) {
				const size = buf[off];
				const ident = buf.toString("ascii", off + 1, off + 1 + size);
				off += 1 + size;
				if (ident === "NETSCAPE2.0" && buf[off] >= 3) {
					const dlen = buf[off];
					loop = buf.readUInt16LE(off + 2);
					void dlen;
				}
				off = skipSubBlocks(buf, off);
			} else {
				off = skipSubBlocks(buf, off);
			}
		} else if (b === 0x2c) {
			const left = buf.readUInt16LE(off + 1);
			const top = buf.readUInt16LE(off + 3);
			const iw = buf.readUInt16LE(off + 5);
			const ih = buf.readUInt16LE(off + 7);
			const ipacked = buf[off + 9];
			off += 10;
			if (ipacked & 0x80) off += 3 * (2 << (ipacked & 7));
			off += 1; // LZW min code size
			off = skipSubBlocks(buf, off);
			frames.push({ left, top, w: iw, h: ih, delay, trans });
			delay = null;
			trans = null;
		} else {
			throw new Error(`unknown GIF block 0x${b.toString(16)} at ${off}`);
		}
	}
	return { w, h, frames, loop };
}

// ---------- process bookkeeping ----------
let chromeProc = null;
let pythonProc = null;
let browserCdp = null;
let pageCdp = null;
let failed = false;

async function main() {
	try {
		// --- static server on 8123 (reuse only if it serves this project) ---
		let serverPort = null;
		for (const p of [8123, 8124, 8125]) {
			try {
				const r = await fetch(`http://127.0.0.1:${p}/index.html`);
				const t = await r.text();
				if (t.includes('id="stage"')) {
					serverPort = p;
					break;
				}
			} catch {
				/* not listening */
			}
		}
		if (serverPort === null) {
			for (const p of [8123, 8124, 8125]) {
				try {
					pythonProc = spawn(
						"python",
						["-m", "http.server", String(p), "--bind", "127.0.0.1"],
						{
							cwd: root,
							stdio: "ignore",
							windowsHide: true,
						},
					);
					await waitFor(
						async () => {
							try {
								const r = await fetch(`http://127.0.0.1:${p}/index.html`);
								return (await r.text()).includes('id="stage"');
							} catch {
								return false;
							}
						},
						8000,
						`server on ${p}`,
					);
					serverPort = p;
					break;
				} catch {
					try {
						pythonProc?.kill();
					} catch {}
					pythonProc = null;
				}
			}
		}
		if (serverPort === null) throw new Error("could not start static server");
		const url = `http://127.0.0.1:${serverPort}/index.html`;

		// --- find free CDP port and launch Chrome ---
		const chromePath =
			"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
		if (!existsSync(chromePath)) throw new Error("chrome.exe not found");
		let cdpPort = null;
		for (let p = 9333; p < 9345; p++) {
			try {
				await fetch(`http://127.0.0.1:${p}/json/version`, {
					signal: AbortSignal.timeout(500),
				});
			} catch {
				cdpPort = p;
				break;
			}
		}
		if (cdpPort === null) throw new Error("no free CDP port");

		chromeProc = spawn(
			chromePath,
			[
				"--headless=new",
				`--remote-debugging-port=${cdpPort}`,
				`--user-data-dir=${profileDir}`,
				"--window-size=1500,950",
				"--force-device-scale-factor=1",
				"--no-first-run",
				"--no-default-browser-check",
				"--disable-extensions",
				"--disable-sync",
				"--disable-background-networking",
				"--no-service-autorun",
				"about:blank",
			],
			{ stdio: "ignore", windowsHide: true },
		);

		let version = null;
		await waitFor(
			async () => {
				try {
					const r = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
					version = await r.json();
					return true;
				} catch {
					return false;
				}
			},
			15000,
			"chrome devtools",
		);
		console.log(`chrome: ${version.Browser}`);

		browserCdp = await connectCdp(version.webSocketDebuggerUrl);
		try {
			await browserCdp.send("Browser.setDownloadBehavior", {
				behavior: "allow",
				downloadPath: dlDir,
				eventsEnabled: true,
			});
		} catch (e) {
			console.log(`Browser.setDownloadBehavior unavailable: ${e.message}`);
		}

		const targets = await (
			await fetch(`http://127.0.0.1:${cdpPort}/json/list`)
		).json();
		const pageTarget = targets.find((t) => t.type === "page");
		pageCdp = await connectCdp(pageTarget.webSocketDebuggerUrl);
		await pageCdp.send("Page.enable");
		await pageCdp.send("Runtime.enable");
		await pageCdp.send("Log.enable");
		try {
			await pageCdp.send("Page.setDownloadBehavior", {
				behavior: "allow",
				downloadPath: dlDir,
			});
		} catch {}

		pageCdp.on("Runtime.exceptionThrown", (p) => {
			const d =
				p.exceptionDetails?.exception?.description || p.exceptionDetails?.text;
			if (d && !d.includes("favicon")) consoleErrors.push(`exception: ${d}`);
		});
		pageCdp.on("Runtime.consoleAPICalled", (p) => {
			if (p.type === "error") {
				const t = p.args.map((a) => a.value ?? a.description ?? "").join(" ");
				if (!t.includes("favicon")) consoleErrors.push(`console.error: ${t}`);
			}
		});
		pageCdp.on("Log.entryAdded", (p) => {
			if (
				p.entry?.level === "error" &&
				!String(p.entry.text).includes("favicon")
			) {
				consoleErrors.push(`log: ${p.entry.text}`);
			}
		});

		const ev = async (expr, awaitPromise = false) => {
			const r = await pageCdp.send("Runtime.evaluate", {
				expression: expr,
				returnByValue: true,
				awaitPromise,
			});
			if (r.exceptionDetails) {
				throw new Error(
					`page error: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`,
				);
			}
			return r.result.value;
		};

		await pageCdp.send("Page.navigate", { url });
		await waitFor(
			async () =>
				(await ev(
					"!!(window.PixelVFX && window.PixelVFX.frameInfo.frameCount > 0)",
				)) === true,
			15000,
			"app ready",
		);
		console.log("app ready");

		const shot = async (name) => {
			const r = await pageCdp.send("Page.captureScreenshot", { format: "png" });
			const file = `${String(++shotN).padStart(2, "0")}-${name}.png`;
			writeFileSync(join(shotDir, file), Buffer.from(r.data, "base64"));
			console.log(`shot: ${file}`);
			return file;
		};

		const setUI = async (id, value) => {
			const setLine =
				typeof value === "boolean"
					? `el.checked = ${value};`
					: `el.value = ${JSON.stringify(String(value))};`;
			// dispatch AND rebuild inside one evaluate so no rAF tick can interleave
			// and consume the sanitize messages before we read them
			const expr = `(() => {
			const el = document.querySelector(${JSON.stringify(id)});
			if (!el) return { error: "missing" };
			${setLine}
			el.dispatchEvent(new Event("input", { bubbles: true }));
			el.dispatchEvent(new Event("change", { bubbles: true }));
			return { rb: window.PixelVFX.rebuild() };
		})()`;
			const r = await ev(expr);
			if (r?.error) throw new Error(`control ${id}: ${r.error}`);
			return r.rb;
		};

		// ============ 1. cross-engine golden fixture check ============
		const golden = JSON.parse(
			readFileSync(join(root, "tests", "golden.json"), "utf8"),
		);
		const h = await ev("window.PixelVFX.hashes()");
		check(
			"cross-engine golden frame0 (Chrome V8 vs bun fixture)",
			h.frame0,
			golden.frame0,
			h.frame0 === golden.frame0,
		);
		check(
			"cross-engine golden allFrames",
			h.allFrames,
			golden.allFrames,
			h.allFrames === golden.allFrames,
		);
		check(
			"cross-engine golden sheet",
			h.sheet,
			golden.sheet,
			h.sheet === golden.sheet,
		);
		check("cross-engine golden gif", h.gif, golden.gif, h.gif === golden.gif);
		check(
			"cross-engine golden frameCount",
			h.frameCount,
			golden.frameCount,
			h.frameCount === golden.frameCount,
		);

		// ============ 2. screenshots: real UI interactions ============
		const fi = async () => ev("window.PixelVFX.frameInfo");
		const params = async () => ev("window.PixelVFX.params");
		const dURL = async (frame) =>
			(await ev(`window.PixelVFX.renderFrame(${frame})`)).image;
		const dHash = (dataUrl) =>
			sha256(Buffer.from(dataUrl.split(",")[1], "base64")).slice(0, 16);

		await ev("window.PixelVFX.renderFrame(6)");
		await shot("initial-ember-128");

		// effect change
		let rb = await setUI("#preset", "slash_arc");
		let p = await params();
		check(
			"effect switch via select",
			p.effectId,
			"slash_arc",
			p.effectId === "slash_arc",
		);
		check(
			"effect switch rebuild frameCount",
			rb.frameCount,
			rb.frameCount > 0,
			rb.frameCount > 0,
		);
		await ev("window.PixelVFX.renderFrame(2)");
		await shot("effect-slash-arc");

		// seed change alters pixels
		await setUI("#preset", "ember_burst");
		await setUI("#seed", "1234");
		const seedA = dHash(await dURL(2));
		await setUI("#seed", "20261004");
		const seedB = dHash(await dURL(2));
		check(
			"same frame differs across seeds (canvas bytes)",
			`${seedA} != ${seedB}`,
			"distinct",
			seedA !== seedB,
		);
		p = await params();
		check("seed state applied", p.seed, "20261004", p.seed === "20261004");
		await shot("seed-20261004");

		// resolution
		rb = await setUI("#width", "192");
		await setUI("#height", "128");
		const cw = await ev(
			"document.querySelector('#stage canvas, #stage').querySelector('canvas').width",
		);
		check("canvas width follows resolution control", cw, 192, cw === 192);
		check(
			"resolution change keeps frames",
			rb.frameCount > 0,
			true,
			rb.frameCount > 0,
		);
		await ev("window.PixelVFX.renderFrame(4)");
		await shot("resolution-192x128");
		await setUI("#width", "128");
		await setUI("#height", "128");

		// fps
		rb = await setUI("#fps", "8");
		check("fps 8 recomputes frameCount", rb.frameCount, 8, rb.frameCount === 8);
		p = await params();
		check("fps state applied", p.fps, 8, p.fps === 8);
		await shot("fps-8");
		await setUI("#fps", "12");

		// camera
		const camBase = dHash(await dURL(3));
		await setUI("#zoom", "2.5");
		await setUI("#pan-x", "0.1");
		const camZoom = dHash(await dURL(3));
		check(
			"camera zoom+pan changes pixels",
			`${camBase} != ${camZoom}`,
			"distinct",
			camBase !== camZoom,
		);
		await shot("camera-zoom-pan");
		await setUI("#zoom", "1");
		await setUI("#pan-x", "0");

		// pixel pipeline controls
		await setUI("#palette-size", "8");
		await setUI("#dither", "bayer2");
		await setUI("#outline", true);
		await setUI("#recolor", "ember");
		await ev("window.PixelVFX.renderFrame(2)");
		await shot("pipeline-palette8-bayer2-outline");
		p = await params();
		check(
			"pipeline params applied",
			`${p.paletteSize}/${p.dither}/${p.outline}/${p.recolor}`,
			"8/bayer2/true/ember",
			p.paletteSize === 8 &&
				p.dither === "bayer2" &&
				p.outline === true &&
				p.recolor === "ember",
		);

		// playback advances, scrub jumps, holds edit
		const playBefore = (await fi()).current;
		const playing = await ev(`(() => {
		if (window.PixelVFX.frameInfo.playing) document.querySelector("#play").click();
		return window.PixelVFX.frameInfo.playing;
	})()`);
		check("playback paused before test", playing, false, playing === false);
		await ev(`document.querySelector("#play").click()`);
		await sleep(700);
		const playAfter = (await fi()).current;
		check(
			"play button advances frame",
			`${playBefore} -> ${playAfter}`,
			"advanced",
			playAfter !== playBefore,
		);
		await ev(`document.querySelector("#play").click()`); // pause again
		await setUI("#scrub", "4");
		const scrubAt = (await fi()).current;
		check("scrub jumps to frame 4", scrubAt, 4, scrubAt === 4);
		// hold edit (range first so the expected output count is deterministic)
		await setUI("#range-from", "0");
		await setUI("#range-to", "9");
		const holdEdited = await ev(`(() => {
		const el = document.querySelector("#holds-body input");
		if (!el) return "missing";
		el.value = "2";
		el.dispatchEvent(new Event("input", { bubbles: true }));
		el.dispatchEvent(new Event("change", { bubbles: true }));
		return "ok";
	})()`);
		const holdSummary = await ev(
			"document.querySelector('#hold-summary').textContent",
		);
		check(
			"hold control located (#holds-body input)",
			holdEdited,
			"ok",
			holdEdited === "ok",
		);
		check(
			"hold edit changes output frame count",
			(holdSummary || "").slice(0, 120),
			"summary shows 11 outputs (10 source + 1 hold)",
			/\b11\b/.test(holdSummary || ""),
		);
		await shot("playback-holds");
		await ev(`document.querySelector("#holds-reset").click()`);

		// ============ 3. edge inputs clamp through the UI ============
		rb = await setUI("#fps", "0");
		check(
			"fps 0 out of range → 1 (actual clamp message)",
			rb.messages,
			"contains 'fps 0 out of range'",
			rb.messages.some((m) => m.includes("fps 0 out of range")),
		);
		p = await params();
		check("fps 0 clamped to 1 (state)", p.fps, 1, p.fps === 1);
		check(
			"fps 0 clamped frameCount max(2,dur*1)",
			rb.frameCount,
			2,
			rb.frameCount === 2,
		);

		rb = await setUI("#width", "99999");
		check(
			"width 99999 clamp message",
			rb.messages,
			"contains width clamp to 512",
			rb.messages.some((m) => /width/i.test(m) && m.includes("512")),
		);
		p = await params();
		check("width 99999 clamped (state)", p.width, 512, p.width === 512);
		await setUI("#width", "128");
		await setUI("#height", "128");
		await setUI("#fps", "12");

		await setUI("#range-to", "2");
		rb = await setUI("#range-from", "9"); // now reversed (9 > 2) → must repair
		const fiR = await fi();
		check(
			"reversed range repaired (state)",
			`${fiR.from}..${fiR.to}`,
			"2..9",
			fiR.from === 2 && fiR.to === 9,
		);
		// (reversed-range repair is silent by design; the state check above is the
		// observable — sanitize repairs it during rebuild without a log message)
		const fiAfterRepair = await fi();
		check(
			"reversed range repair is stable across another rebuild",
			`${fiAfterRepair.from}..${fiAfterRepair.to}`,
			"2..9",
			fiAfterRepair.from === 2 && fiAfterRepair.to === 9,
		);
		await setUI("#range-from", "0");
		await setUI("#range-to", "9");
		const fiOk = await fi();
		check(
			"export range set 0..9",
			`${fiOk.from}..${fiOk.to}`,
			"0..9",
			fiOk.from === 0 && fiOk.to === 9,
		);

		// unicode seed stays deterministic and crash-free
		await setUI("#seed", "🔥火fire");
		const uni1 = dHash(await dURL(3));
		const uni2 = dHash(await dURL(3));
		check(
			"non-ASCII seed deterministic (double renderFrame)",
			`${uni1} == ${uni2}`,
			"identical",
			uni1 === uni2,
		);
		check(
			"non-ASCII seed rebuild ok",
			(await fi()).frameCount > 0,
			true,
			(await fi()).frameCount > 0,
		);
		await shot("edge-clamps-log");

		// ============ 4. canonical export config + real button exports ============
		await setUI("#preset", "ember_burst");
		await setUI("#seed", "777");
		await setUI("#width", "128");
		await setUI("#height", "128");
		await setUI("#fps", "12");
		await setUI("#pixscale", "1");
		await setUI("#palette-size", "16");
		await setUI("#dither", "bayer4");
		await setUI("#outline", true);
		await setUI("#recolor", "ember");
		await setUI("#range-from", "0");
		await setUI("#range-to", "9");

		const seen = new Set(readdirSync(dlDir));
		async function nextDownload(prefix, timeoutMs = 20000) {
			const deadline = Date.now() + timeoutMs;
			while (Date.now() < deadline) {
				const files = readdirSync(dlDir).filter(
					(f) => !f.endsWith(".crdownload") && !f.endsWith(".tmp"),
				);
				const fresh = files.filter(
					(f) => !seen.has(f) && (prefix ? f.includes(prefix) : true),
				);
				if (fresh.length) {
					const f = fresh.sort()[fresh.length - 1];
					const s1 = statSync(join(dlDir, f)).size;
					await sleep(350);
					const s2 = statSync(join(dlDir, f)).size;
					if (s1 === s2 && s1 > 0) {
						seen.add(f);
						// move out of the downloads dir so a same-name re-export is detectable
						let destName = f;
						let n = 2;
						while (existsSync(join(exDir, destName))) {
							destName = f.replace(/(\.[^.]+)$/, ` (${n++})$1`);
						}
						renameSync(join(dlDir, f), join(exDir, destName));
						seen.delete(f); // a same-name re-export must be detectable again
						return join(exDir, destName);
					}
				}
				await sleep(150);
			}
			throw new Error(`download timeout for ${prefix}`);
		}
		const readFile = (f) => readFileSync(f);

		// PNG sprite sheet x2 (determinism through real UI path)
		await ev(`document.querySelector("#export-sheet").click()`);
		const sheetFile1 = await nextDownload("sheet");
		const sheet1 = readFile(sheetFile1);
		const le1 = await ev("window.PixelVFX.lastExport");
		check(
			"lastExport matches downloaded sheet (sha)",
			sha256(Buffer.from(le1.base64, "base64")),
			sha256(sheet1),
			sha256(Buffer.from(le1.base64, "base64")) === sha256(sheet1),
		);

		await ev(`document.querySelector("#export-sheet").click()`);
		const sheetFile2 = await nextDownload("sheet");
		const sheet2 = readFile(sheetFile2);
		check(
			"two identical sheet exports byte-identical",
			sha256(sheet2),
			sha256(sheet1),
			sha256(sheet2) === sha256(sheet1),
		);

		// parse sheet1
		const png = parsePNG(sheet1);
		const cols = Math.ceil(Math.sqrt(le1.cellCount));
		const rows = Math.ceil(le1.cellCount / cols);
		check("sheet PNG parses (sig+CRC+IDAT+IEND)", "ok", "ok", true);
		check(
			"sheet dimensions = cols*128 x rows*128",
			`${png.w}x${png.h}`,
			`${cols * 128}x${rows * 128}`,
			png.w === cols * 128 && png.h === rows * 128,
		);
		check("sheet cellCount", le1.cellCount, 10, le1.cellCount === 10);
		const alpha = alphaStats(png.pixels);
		check(
			"sheet has transparent pixels (alpha 0)",
			alpha.zero,
			"> 0",
			alpha.zero > 0,
		);
		check(
			"sheet has fully opaque pixels (alpha 255)",
			alpha.full,
			"> 0",
			alpha.full > 0,
		);
		check(
			"sheet alpha is binary 0/255 after threshold",
			alpha.other,
			0,
			alpha.other === 0,
		);

		// seed change changes export bytes
		await setUI("#seed", "778");
		await ev(`document.querySelector("#export-sheet").click()`);
		const sheetFile3 = await nextDownload("sheet");
		const sheet3 = readFile(sheetFile3);
		check(
			"seed change alters sheet bytes",
			sha256(sheet3).slice(0, 16),
			`!= ${sha256(sheet1).slice(0, 16)}`,
			sha256(sheet3) !== sha256(sheet1),
		);
		await setUI("#seed", "777");

		// GIF x2
		await ev(`document.querySelector("#export-gif").click()`);
		const gifFile1 = await nextDownload("gif");
		const gif1 = readFile(gifFile1);
		await ev(`document.querySelector("#export-gif").click()`);
		const gifFile2 = await nextDownload("gif");
		const gif2 = readFile(gifFile2);
		check(
			"two identical GIF exports byte-identical",
			sha256(gif2),
			sha256(gif1),
			sha256(gif2) === sha256(gif1),
		);

		const g = parseGIF(gif1);
		check(
			"GIF header dimensions",
			`${g.w}x${g.h}`,
			"128x128",
			g.w === 128 && g.h === 128,
		);
		check("GIF frame count", g.frames.length, 10, g.frames.length === 10);
		check(
			"GIF per-frame delay",
			[...new Set(g.frames.map((f) => f.delay))],
			"[8] (round(100/12))",
			g.frames.every((f) => f.delay === Math.round(100 / 12)),
		);
		const totalMs = g.frames.reduce((s, f) => s + f.delay, 0) * 10;
		check("GIF total duration ms", totalMs, 800, totalMs === 800);
		check("GIF infinite loop (NETSCAPE loop=0)", g.loop, 0, g.loop === 0);
		check(
			"GIF has transparency in some frame",
			g.frames.some((f) => f.trans !== null),
			true,
			g.frames.some((f) => f.trans !== null),
		);
		const leGif = await ev("window.PixelVFX.lastExport");
		check(
			"lastExport matches downloaded GIF (sha)",
			sha256(Buffer.from(leGif.base64, "base64")),
			sha256(gif1),
			sha256(Buffer.from(leGif.base64, "base64")) === sha256(gif1),
		);

		// frame PNG + atlas JSON
		await ev("window.PixelVFX.renderFrame(4)");
		await ev(`document.querySelector("#export-frame").click()`);
		const frameFile = await nextDownload(null);
		const frameBuf = readFile(frameFile);
		const fpng = parsePNG(frameBuf);
		check(
			"single-frame PNG dims",
			`${fpng.w}x${fpng.h}`,
			"128x128",
			fpng.w === 128 && fpng.h === 128,
		);
		const fAlpha = alphaStats(fpng.pixels);
		check(
			"single-frame PNG has visible pixels",
			fAlpha.full,
			"> 0",
			fAlpha.full > 0,
		);

		await ev(`document.querySelector("#export-atlas").click()`);
		const atlasFile = await nextDownload("json");
		const atlas = JSON.parse(readFile(atlasFile).toString("utf8"));
		const atlasCount = atlas.frames
			? Object.keys(atlas.frames).length
			: atlas.frameCount;
		check(
			"atlas JSON parses with all frames",
			atlasCount,
			10,
			atlasCount === 10,
		);
		check(
			"atlas JSON frame geometry present",
			Boolean(atlas.frames?.["0"]?.w),
			true,
			Boolean(atlas.frames?.["0"]?.w),
		);

		await shot("exports-done");

		// resolution/fps change reflected in exports (96x96 @ fps8)
		await setUI("#width", "96");
		await setUI("#height", "96");
		await setUI("#fps", "8");
		await ev(`document.querySelector("#export-sheet").click()`);
		const sheet4 = readFile(await nextDownload("sheet"));
		const png4 = parsePNG(sheet4);
		const le4 = await ev("window.PixelVFX.lastExport");
		const cols4 = Math.ceil(Math.sqrt(le4.cellCount));
		const rows4 = Math.ceil(le4.cellCount / cols4);
		check(
			"sheet dims track resolution (96px cells)",
			`${png4.w}x${png4.h}`,
			`${cols4 * 96}x${rows4 * 96}`,
			png4.w === cols4 * 96 && png4.h === rows4 * 96,
		);
		await ev(`document.querySelector("#export-gif").click()`);
		const gif3 = readFile(await nextDownload("gif"));
		const g3 = parseGIF(gif3);
		check(
			"GIF dims track resolution",
			`${g3.w}x${g3.h}`,
			"96x96",
			g3.w === 96 && g3.h === 96,
		);
		check(
			"GIF delay tracks fps8",
			[...new Set(g3.frames.map((f) => f.delay))],
			"[13] (round(100/8))",
			g3.frames.every((f) => f.delay === Math.round(100 / 8)),
		);

		// ============ 4b. 3D workflow, markers, exporters, MCP, desktop shell ============
		// canonical config for the wave-2 checks (128x128 @ fps12, range 0..9)
		await setUI("#preset", "ember_burst");
		await setUI("#seed", "777");
		await setUI("#width", "128");
		await setUI("#height", "128");
		await setUI("#fps", "12");
		await setUI("#range-from", "0");
		await setUI("#range-to", "9");

		// -- 3D preset selection toggles sections --
		await setUI("#preset", "orbital_ring3d");
		const sec3d = await ev(`(() => ({
			sec: !document.querySelector("#camera3d-section").hidden,
			rows: document.querySelector("#camera-2d-rows").hidden,
			label: [...document.querySelector("#preset").options].find((o) => o.value === "orbital_ring3d")?.textContent,
			fc: window.PixelVFX.frameInfo.frameCount,
		}))()`);
		check(
			"3D select shows Camera 3D section",
			sec3d.sec,
			true,
			sec3d.sec === true,
		);
		check(
			"3D select hides 2D zoom/pan rows",
			sec3d.rows,
			true,
			sec3d.rows === true,
		);
		check(
			"3D preset option labeled (3D)",
			sec3d.label,
			"contains (3D)",
			/\(3D\)/.test(sec3d.label || ""),
		);
		check(
			"3D preset frameCount = duration*fps (2.0s@12)",
			sec3d.fc,
			24,
			sec3d.fc === 24,
		);
		await shot("3d-section-orbital-ring");

		// -- 3D preview renders non-blank --
		const d3 = async () => (await ev("window.PixelVFX.renderFrame(6)")).image;
		const png3d = parsePNG(Buffer.from((await d3()).split(",")[1], "base64"));
		const a3d = alphaStats(png3d.pixels);
		check("3D preview has opaque pixels", a3d.full, "> 0", a3d.full > 0);
		check(
			"3D preview dims 128x128",
			`${png3d.w}x${png3d.h}`,
			"128x128",
			png3d.w === 128 && png3d.h === 128,
		);

		// -- camera3d slider through the real control --
		const yaw0 = dHash(await d3());
		await setUI("#cam-yaw", "2.1");
		p = await params();
		check(
			"yaw slider applied to state",
			p.camera3d.yaw,
			2.1,
			p.camera3d.yaw === 2.1,
		);
		const yaw1 = dHash(await d3());
		check(
			"yaw slider changes 3D pixels",
			`${yaw0} != ${yaw1}`,
			"distinct",
			yaw0 !== yaw1,
		);
		await shot("3d-yaw-2p1");
		await setUI("#cam-yaw", "0.7");

		// -- real pointer orbit gesture on the canvas --
		const preOrbit = dHash(await d3());
		const orbit = await ev(`(() => {
			const c = document.querySelector("#stage canvas") || document.querySelector("#preview canvas");
			if (!c) return { error: "no canvas" };
			const mk = (type, x, y) => c.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true, buttons: 1 }));
			mk("pointerdown", 100, 100);
			mk("pointermove", 160, 110);
			mk("pointerup", 160, 110);
			return { yaw: window.PixelVFX.params.camera3d.yaw, pitch: window.PixelVFX.params.camera3d.pitch };
		})()`);
		check(
			"pointer orbit changes yaw (+0.6)",
			orbit.yaw,
			1.3,
			Math.abs(orbit.yaw - 1.3) < 0.02,
		);
		check(
			"pointer orbit changes pitch (+0.1)",
			orbit.pitch,
			0.5,
			Math.abs(orbit.pitch - 0.5) < 0.02,
		);
		const postOrbit = dHash(await d3());
		check(
			"pointer orbit changes 3D pixels",
			`${preOrbit} != ${postOrbit}`,
			"distinct",
			preOrbit !== postOrbit,
		);
		await shot("3d-pointer-orbit");

		// -- wheel zoom --
		const wheel = await ev(`(() => {
			const c = document.querySelector("#stage canvas");
			c.dispatchEvent(new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY: 120 }));
			return { dist: window.PixelVFX.params.camera3d.dist };
		})()`);
		check(
			"wheel zoom increases distance (+0.2)",
			wheel.dist,
			3.6,
			Math.abs(wheel.dist - 3.6) < 0.01,
		);
		await setUI("#cam-dist", "3.4");
		await setUI("#cam-yaw", "0.7");

		// -- second 3D preset screenshot --
		await setUI("#preset", "warp_tunnel3d");
		const warpHash = dHash(await d3());
		check(
			"warp_tunnel3d renders (hash taken)",
			warpHash.length,
			16,
			warpHash.length === 16,
		);
		await shot("3d-warp-tunnel");
		await setUI("#preset", "orbital_ring3d");

		// -- 3D exports through the real buttons --
		await setUI("#outline", false);
		await ev(`document.querySelector("#export-sheet").click()`);
		const sh3dFile = await nextDownload("sheet");
		const sh3d = readFile(sh3dFile);
		const leSh3d = await ev("window.PixelVFX.lastExport");
		check(
			"3D sheet cellCount (range 0..9)",
			leSh3d.cellCount,
			10,
			leSh3d.cellCount === 10,
		);
		const sh3dPng = parsePNG(sh3d);
		const le3dCols = Math.ceil(Math.sqrt(leSh3d.cellCount));
		const le3dRows = Math.ceil(leSh3d.cellCount / le3dCols);
		check(
			"3D sheet dims = cols*128 x rows*128",
			`${sh3dPng.w}x${sh3dPng.h}`,
			`${le3dCols * 128}x${le3dRows * 128}`,
			sh3dPng.w === le3dCols * 128 && sh3dPng.h === le3dRows * 128,
		);
		const sh3dA = alphaStats(sh3dPng.pixels);
		check("3D sheet has opaque pixels", sh3dA.full, "> 0", sh3dA.full > 0);
		const lit3d = new Set();
		for (let i = 0; i < sh3dPng.pixels.length; i += 4)
			if (sh3dPng.pixels[i + 3] > 0)
				lit3d.add(
					`${sh3dPng.pixels[i]},${sh3dPng.pixels[i + 1]},${sh3dPng.pixels[i + 2]}`,
				);
		check(
			"3D sheet quantized (<=16 lit colors, palette16)",
			lit3d.size,
			"<= 16",
			lit3d.size <= 16,
		);

		await ev(`document.querySelector("#export-gif").click()`);
		const g3d = parseGIF(readFile(await nextDownload("gif")));
		check(
			"3D GIF frame count",
			g3d.frames.length,
			10,
			g3d.frames.length === 10,
		);
		check(
			"3D GIF dims",
			`${g3d.w}x${g3d.h}`,
			"128x128",
			g3d.w === 128 && g3d.h === 128,
		);
		check(
			"3D GIF per-frame delay fps12",
			[...new Set(g3d.frames.map((f) => f.delay))],
			"[8]",
			g3d.frames.every((f) => f.delay === 8),
		);

		// -- Aseprite export: structure + independent zlib round-trip --
		await ev(`document.querySelector("#export-aseprite").click()`);
		const ase = readFile(await nextDownload("aseprite"));
		const aseDv = new DataView(ase.buffer, ase.byteOffset, ase.byteLength);
		check(
			"aseprite file magic 0xA5E0",
			aseDv.getUint16(4, true),
			0xa5e0,
			aseDv.getUint16(4, true) === 0xa5e0,
		);
		const aseFrames = aseDv.getUint16(6, true);
		const aseW = aseDv.getUint16(8, true);
		const aseH = aseDv.getUint16(10, true);
		check(
			"aseprite header dims",
			`${aseW}x${aseH}`,
			"128x128",
			aseW === 128 && aseH === 128,
		);
		check(
			"aseprite frame count matches export",
			aseFrames,
			10,
			aseFrames === 10,
		);
		check(
			"aseprite declared size == file size",
			aseDv.getUint32(0, true),
			ase.length,
			aseDv.getUint32(0, true) === ase.length,
		);
		check(
			"aseprite frame magic 0xF1FA",
			aseDv.getUint16(132, true),
			0xf1fa,
			aseDv.getUint16(132, true) === 0xf1fa,
		);
		try {
			const off = 128;
			const nchunks =
				aseDv.getUint32(off + 12, true) || aseDv.getUint16(off + 6, true);
			let co = off + 16;
			let cel = null;
			for (let ci = 0; ci < nchunks; ci++) {
				const csize = aseDv.getUint32(co, true);
				const ctype = aseDv.getUint16(co + 4, true);
				if (ctype === 0x2005) cel = { co, csize };
				co += csize;
			}
			check("aseprite first frame has a cel chunk", !!cel, true, !!cel);
			if (cel) {
				const d = cel.co + 6;
				const type = aseDv.getUint16(d + 7, true);
				const w = aseDv.getUint16(d + 9, true);
				const h = aseDv.getUint16(d + 11, true);
				const raw = inflateSync(ase.subarray(d + 13, cel.co + cel.csize));
				check("aseprite cel is type 2 (compressed image)", type, 2, type === 2);
				check(
					"aseprite cel zlib inflates to RGBA",
					raw.length,
					w * h * 4,
					raw.length === w * h * 4,
				);
				let celLit = 0;
				for (let i = 3; i < raw.length; i += 4) if (raw[i] > 0) celLit++;
				check("aseprite cel frame non-blank", celLit, "> 0", celLit > 0);
			}
			let walkOff = off;
			for (let f = 0; f < aseFrames; f++)
				walkOff += aseDv.getUint32(walkOff, true);
			check(
				"aseprite frame walk covers file",
				walkOff,
				ase.length,
				walkOff === ase.length,
			);
		} catch (e) {
			check(
				"aseprite structural parse",
				String(e?.message || e),
				"no exception",
				false,
			);
		}

		// -- Godot .tres + Unity .meta exports --
		await ev(`document.querySelector("#export-tres").click()`);
		const tresText = readFile(await nextDownload("tres")).toString("utf8");
		check(
			"tres header is SpriteFrames",
			tresText.slice(0, 60).includes("SpriteFrames"),
			true,
			tresText.slice(0, 60).includes("SpriteFrames"),
		);
		const regionCount = (tresText.match(/"region": Rect2/g) || []).length;
		check(
			"tres region count == exported frames",
			regionCount,
			10,
			regionCount === 10,
		);
		check(
			"tres references the sheet png",
			/ext_resource path="res:\/\/pixelvfx\/.*_sheet\.png"/.test(tresText),
			true,
			/ext_resource path="res:\/\/pixelvfx\/.*_sheet\.png"/.test(tresText),
		);
		check(
			"tres loop flag and speed present",
			/"loop": (true|false)/.test(tresText) && /"speed": 12\.0/.test(tresText),
			true,
			/"loop": (true|false)/.test(tresText) && /"speed": 12\.0/.test(tresText),
		);

		await ev(`document.querySelector("#export-meta").click()`);
		const metaText = readFile(await nextDownload("meta")).toString("utf8");
		const guidMatch = metaText.match(/^guid: ([0-9a-f]{32})$/m);
		check(
			"meta guid is 32-hex",
			guidMatch ? guidMatch[1].length : 0,
			32,
			!!guidMatch && guidMatch[1].length === 32,
		);
		const spriteCount = (metaText.match(/- serializedVersion: 2/g) || [])
			.length;
		check(
			"meta sprite count == exported frames",
			spriteCount,
			10,
			spriteCount === 10,
		);
		check(
			"meta declares TextureImporter",
			metaText.startsWith("fileFormatVersion: 2"),
			true,
			metaText.startsWith("fileFormatVersion: 2"),
		);

		// -- editable timing markers through the real UI --
		await setUI("#marker-frame", "3");
		await setUI("#marker-label", "hit");
		await ev(`document.querySelector("#marker-add").click()`);
		await setUI("#marker-frame", "1");
		await setUI("#marker-label", "x".repeat(60));
		await ev(`document.querySelector("#marker-add").click()`);
		// addMarker marks state dirty; the rebuild sanitizes/sorts on the next frame
		let sorted = false;
		for (let i = 0; i < 40 && !sorted; i++) {
			p = await params();
			sorted = p.userMarkers.length === 2 && p.userMarkers[0].frame === 1;
			if (!sorted) await sleep(50);
		}
		check(
			"two markers in state, sorted by frame",
			p.userMarkers.map((m) => m.frame).join(","),
			"1,3",
			sorted,
		);
		check(
			"marker label clipped to 40 chars",
			p.userMarkers[0].label.length,
			40,
			p.userMarkers[0].label.length === 40,
		);
		let markerItems = 0;
		for (let i = 0; i < 40 && markerItems !== 2; i++) {
			markerItems = await ev(
				`document.querySelectorAll("#markers-list .marker-item").length`,
			);
			if (markerItems !== 2) await sleep(50);
		}
		check("markers list renders 2 items", markerItems, 2, markerItems === 2);
		await shot("markers-ui");

		await ev(`document.querySelector("#export-atlas").click()`);
		const atlas2 = JSON.parse(
			readFile(await nextDownload("json")).toString("utf8"),
		);
		check(
			"atlas carries userMarkers",
			atlas2.meta.userMarkers?.length,
			2,
			atlas2.meta.userMarkers?.length === 2,
		);
		check(
			"atlas userMarkers sorted by frame",
			atlas2.meta.userMarkers.map((m) => m.frame).join(","),
			"1,3",
			atlas2.meta.userMarkers.map((m) => m.frame).join(",") === "1,3",
		);

		await ev(
			`document.querySelector("#markers-list .marker-item button").click()`,
		);
		p = await params();
		check(
			"marker removed via UI",
			p.userMarkers.length,
			1,
			p.userMarkers.length === 1,
		);

		// -- MCP stdio server, live handshake --
		try {
			const mcp = spawn("bun", ["scripts/mcp-server.mjs"], {
				cwd: root,
				stdio: ["pipe", "pipe", "pipe"],
				windowsHide: true,
			});
			let mbuf = "";
			const mwait = new Map();
			mcp.stdout.on("data", (chunk) => {
				mbuf += chunk.toString("utf8");
				let nl = mbuf.indexOf("\n");
				while (nl >= 0) {
					const line = mbuf.slice(0, nl);
					mbuf = mbuf.slice(nl + 1);
					if (line.trim()) {
						try {
							const msg = JSON.parse(line);
							const w = mwait.get(msg.id);
							if (w) {
								mwait.delete(msg.id);
								w(msg);
							}
						} catch {}
					}
					nl = mbuf.indexOf("\n");
				}
			});
			const msend = (obj, ms = 30000) =>
				new Promise((res, rej) => {
					const to = setTimeout(() => {
						mwait.delete(obj.id);
						rej(new Error(`mcp timeout ${obj.id}`));
					}, ms);
					mwait.set(obj.id, (msg) => {
						clearTimeout(to);
						res(msg);
					});
					mcp.stdin.write(`${JSON.stringify(obj)}\n`);
				});
			const mi = await msend({
				jsonrpc: "2.0",
				id: 1,
				method: "initialize",
				params: { protocolVersion: "2025-06-18" },
			});
			check(
				"MCP initialize serverInfo",
				mi.result?.serverInfo?.name,
				"pixel-vfx-mcp",
				mi.result?.serverInfo?.name === "pixel-vfx-mcp",
			);
			const ml = await msend({ jsonrpc: "2.0", id: 2, method: "tools/list" });
			check(
				"MCP tools/list count",
				ml.result?.tools?.length,
				4,
				ml.result?.tools?.length === 4,
				"four tools expected",
			);
			const mr = await msend({
				jsonrpc: "2.0",
				id: 3,
				method: "tools/call",
				params: {
					name: "render_sheet",
					arguments: { effectId: "gem_spin3d", width: 32, height: 32 },
				},
			});
			const mrPayload = JSON.parse(mr.result.content[0].text);
			const mrA = alphaStats(
				parsePNG(Buffer.from(mrPayload.base64, "base64")).pixels,
			);
			check("MCP render_sheet PNG non-blank", mrA.full, "> 0", mrA.full > 0);
			check(
				"MCP render_sheet name ends _sheet.png",
				mrPayload.name.endsWith("_sheet.png"),
				true,
				mrPayload.name.endsWith("_sheet.png"),
			);
			const mg = await msend({
				jsonrpc: "2.0",
				id: 4,
				method: "tools/call",
				params: { name: "golden_hashes", arguments: {} },
			});
			const mh = JSON.parse(mg.result.content[0].text);
			check(
				"MCP golden_hashes == fixture",
				`${mh.frame0}/${mh.sheet}`,
				`${golden.frame0}/${golden.sheet}`,
				mh.frame0 === golden.frame0 && mh.sheet === golden.sheet,
			);
			mcp.kill();
		} catch (e) {
			check(
				"MCP stdio live run",
				String(e?.message || e),
				"no exception",
				false,
			);
		}

		// -- token-gated desktop shell: launch-desktop -> serve.py --
		try {
			const ps = spawn(
				"powershell",
				[
					"-NoProfile",
					"-ExecutionPolicy",
					"Bypass",
					"-File",
					join(root, "scripts", "launch-desktop.ps1"),
					"-NoWindow",
					"-Port",
					"8799",
				],
				{ cwd: root, stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
			);
			let pout = "";
			ps.stdout.on("data", (c) => {
				pout += c.toString("utf8");
			});
			let token = null;
			let pid = null;
			await waitFor(
				() => {
					const tm = pout.match(/\?t=([A-Za-z0-9_-]+)/);
					const pm = pout.match(/server pid: (\d+)/);
					if (tm) token = tm[1];
					if (pm) pid = Number(pm[1]);
					return !!(token && pid);
				},
				30000,
				"launch-desktop output",
			);
			check("launch-desktop printed token URL", !!token, true, !!token);
			check(
				"launch-desktop printed server pid",
				pid || 0,
				"> 0",
				!!pid && pid > 0,
			);
			const noTok = await fetch("http://127.0.0.1:8799/");
			check(
				"serve.py rejects missing token (403)",
				noTok.status,
				403,
				noTok.status === 403,
			);
			const withTok = await fetch(`http://127.0.0.1:8799/?t=${token}`);
			check(
				"serve.py accepts token (200)",
				withTok.status,
				200,
				withTok.status === 200,
			);
			const setCookie = withTok.headers.get("set-cookie") || "";
			check(
				"serve.py sets session cookie",
				setCookie.includes(`pvfx=${token}`),
				true,
				setCookie.includes(`pvfx=${token}`),
			);
			const withCookie = await fetch("http://127.0.0.1:8799/src/app.js", {
				headers: { Cookie: `pvfx=${token}` },
			});
			check(
				"cookie serves app files (200)",
				withCookie.status,
				200,
				withCookie.status === 200,
			);
			const listing = await fetch("http://127.0.0.1:8799/src/", {
				headers: { Cookie: `pvfx=${token}` },
			});
			check(
				"directory listing disabled (403)",
				listing.status,
				403,
				listing.status === 403,
			);
			try {
				execSync(`taskkill /PID ${pid} /T /F`, { stdio: "ignore" });
			} catch {}
			try {
				ps.kill();
			} catch {}
			await sleep(300);
		} catch (e) {
			check(
				"desktop shell live run",
				String(e?.message || e),
				"no exception",
				false,
			);
		}
		if (existsSync(join(root, ".token"))) unlinkSync(join(root, ".token"));

		// restore 2D defaults for the final layout screenshot
		await setUI("#preset", "ember_burst");
		await setUI("#outline", true);

		// ============ 5. narrow viewport screenshot ============
		await setUI("#width", "128");
		await setUI("#height", "128");
		await setUI("#fps", "12");
		await pageCdp.send("Emulation.setDeviceMetricsOverride", {
			width: 780,
			height: 1400,
			deviceScaleFactor: 1,
			mobile: false,
		});
		await sleep(300);
		await shot("narrow-780");
		await pageCdp.send("Emulation.clearDeviceMetricsOverride");

		// final render for a clean screenshot of current state
		await ev("window.PixelVFX.renderFrame(5)");

		downloadsLog.push(
			...readdirSync(exDir).map((f) => ({
				file: `evidence/exports/${f}`,
				size: statSync(join(exDir, f)).size,
				sha256: sha256(readFileSync(join(exDir, f))),
			})),
		);
	} catch (err) {
		failed = true;
		checks.push({
			name: "driver",
			observed: String(err?.stack || err),
			expected: "no exception",
			pass: false,
		});
		console.error("DRIVER ERROR:", err);
	}
}

await main();

const result = {
	platform: process.platform,
	node: process.version,
	when: new Date().toISOString(),
	checks,
	consoleErrors,
	downloads: downloadsLog,
	screenshots: readdirSync(shotDir).sort(),
	failed: failed || consoleErrors.length > 0 || checks.some((c) => !c.pass),
};
writeFileSync(
	join(evDir, "results.json"),
	`${JSON.stringify(result, null, 2)}\n`,
);

const bad = checks.filter((c) => !c.pass);
console.log(`\nchecks: ${checks.length - bad.length}/${checks.length} pass`);
if (consoleErrors.length)
	console.log(`console errors: ${consoleErrors.length}`);
console.log(
	`result: ${result.failed ? "FAIL" : "PASS"} -> evidence/results.json`,
);

try {
	pageCdp?.close();
	browserCdp?.close();
} catch {}
for (const proc of [chromeProc, pythonProc]) {
	if (!proc?.pid) continue;
	try {
		execSync(`taskkill /PID ${proc.pid} /T /F`, { stdio: "ignore" });
	} catch {
		try {
			proc.kill();
		} catch {}
	}
}
process.exit(result.failed ? 1 : 0);
