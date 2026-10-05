import { execSync, spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { connectCdp, sleep, waitFor } from "./cdp.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = {};
for (const a of process.argv.slice(2)) {
	const [k, ...rest] = a.replace(/^--/, "").split("=");
	args[k] = rest.join("=");
}
const gifRel = args.gif || "out/fire_seed-996060781_preview.gif";
const sheetRel = args.sheet || "out/fire_seed-996060781_sheet.png";
const name = args.name || "fire";
const evDir = join(root, "evidence", "browser-gif");
const profileDir = join(evDir, "chrome-profile");
rmSync(profileDir, { recursive: true, force: true });
mkdirSync(evDir, { recursive: true });

let serverPort = null;
let pythonProc = null;
let chromeProc = null;
let browserCdp = null;
let pageCdp = null;
let failed = false;
const consoleErrors = [];

async function main() {
	for (const p of [8131, 8132, 8133]) {
		try {
			const r = await fetch(`http://127.0.0.1:${p}/scripts/gif-check.html`);
			if ((await r.text()).includes('id="gifcheck"')) {
				serverPort = p;
				break;
			}
		} catch {}
	}
	if (serverPort === null) {
		for (const p of [8131, 8132, 8133]) {
			try {
				pythonProc = spawn(
					"python",
					["-m", "http.server", String(p), "--bind", "127.0.0.1"],
					{ cwd: root, stdio: "ignore", windowsHide: true },
				);
				await waitFor(
					async () => {
						try {
							const r = await fetch(`http://127.0.0.1:${p}/scripts/gif-check.html`);
							return (await r.text()).includes('id="gifcheck"');
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
				pythonProc?.kill();
				pythonProc = null;
			}
		}
	}
	if (serverPort === null) throw new Error("could not start static server");

	const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
	let cdpPort = null;
	for (let p = 9441; p < 9452; p++) {
		try {
			await fetch(`http://127.0.0.1:${p}/json/version`, {
				signal: AbortSignal.timeout(400),
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
			"--window-size=600,520",
			"--force-device-scale-factor=1",
			"--no-first-run",
			"--no-default-browser-check",
			"--disable-extensions",
			"--disable-sync",
			"--disable-background-networking",
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
		20000,
		"chrome devtools",
	);
	browserCdp = await connectCdp(version.webSocketDebuggerUrl);
	const targets = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json();
	const pageTarget = targets.find((t) => t.type === "page");
	pageCdp = await connectCdp(pageTarget.webSocketDebuggerUrl);
	await pageCdp.send("Page.enable");
	await pageCdp.send("Runtime.enable");
	pageCdp.on("Runtime.exceptionThrown", (p) => {
		const d =
			p.exceptionDetails?.exception?.description || p.exceptionDetails?.text;
		if (d && !d.includes("favicon")) consoleErrors.push(`exception: ${d}`);
	});

	const url =
		`http://127.0.0.1:${serverPort}/scripts/gif-check.html` +
		`?gif=/${encodeURIComponent(gifRel).replace(/%2F/gi, "/")}` +
		`&sheet=/${encodeURIComponent(sheetRel).replace(/%2F/gi, "/")}`;
	await pageCdp.send("Page.navigate", { url });
	await waitFor(
		async () => {
			const r = await pageCdp.send("Runtime.evaluate", {
				expression: "window.GIFCHECK ? 1 : 0",
				returnByValue: true,
			});
			return r.result.value === 1;
		},
		60000,
		"gif decode",
	);
	const ev = await pageCdp.send("Runtime.evaluate", {
		expression: "JSON.stringify(window.GIFCHECK)",
		returnByValue: true,
	});
	const result = JSON.parse(ev.result.value);

	const shots = [];
	for (let i = 0; i < 2; i++) {
		if (i) await sleep(450);
		const r = await pageCdp.send("Page.captureScreenshot", { format: "png" });
		const file = join(evDir, `${name}-browser-${i + 1}.png`);
		writeFileSync(file, Buffer.from(r.data, "base64"));
		shots.push(`evidence/browser-gif/${name}-browser-${i + 1}.png`);
	}

	const doc = {
		when: new Date().toISOString(),
		platform: process.platform,
		browser: version.Browser,
		gif: gifRel,
		sheet: sheetRel,
		url,
		consoleErrors,
		screenshots: shots,
		result,
	};
	writeFileSync(
		join(evDir, `${name}-browser.json`),
		`${JSON.stringify(doc, null, 1)}\n`,
	);
	console.log(JSON.stringify(doc, null, 1));
	failed = !result.ok || result.totalDiff !== 0 || consoleErrors.length > 0;
}

try {
	await main();
} catch (err) {
	failed = true;
	console.error("DRIVER ERROR:", err);
}
try {
	pageCdp?.close();
	browserCdp?.close();
} catch {}
for (const proc of [chromeProc, pythonProc]) {
	if (!proc?.pid) continue;
	if (process.platform === "win32") {
		try {
			execSync(`taskkill /PID ${proc.pid} /T /F`, { stdio: "ignore" });
		} catch {}
	} else {
		try {
			proc.kill();
		} catch {}
	}
}
process.exit(failed ? 1 : 0);
