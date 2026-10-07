import { ALL_PRESETS } from "./effects.js";
import {
	buildSequence,
	bytesToBase64,
	DEFAULTS,
	exportAseprite,
	exportAtlas,
	exportFrame,
	exportGif,
	exportMeta,
	exportSheet,
	exportTres,
	goldenHashes,
	sanitizeParams,
} from "./pipeline.js";
import { LUTS } from "./pixel.js";
import { expandFrames, markers, totalTime } from "./timing.js";

const $ = (id) => document.getElementById(id);
const canvas = $("preview");
const ctx = canvas.getContext("2d");
const stage = $("stage");
const logEl = $("log");

const state = {
	...DEFAULTS,
	camera: { ...DEFAULTS.camera },
	camera3d: { ...DEFAULTS.camera3d },
	userMarkers: [],
	holds: null,
	from: 0,
	to: 9999,
};
let seq = null;
let messages = [];
const logs = [];
let lastExport = null;
let currentFrame = 0;
let playing = true;
let dirty = true;
let imageData = null;

function log(msg) {
	const t = new Date().toTimeString().slice(0, 8);
	logs.push(`${t} ${msg}`);
	const line = document.createElement("div");
	line.textContent = `${t} ${msg}`;
	logEl.prepend(line);
	while (logEl.children.length > 40) logEl.removeChild(logEl.lastChild);
}

function setParam(path, raw) {
	if (path.startsWith("camera3d.")) {
		state.camera3d[path.slice(9)] = raw;
	} else if (path.startsWith("camera.")) {
		state.camera[path.slice(7)] = raw;
	} else {
		state[path] = raw;
	}
	dirty = true;
}

function coerceInput(el, _path) {
	if (el.type === "checkbox") return el.checked;
	if (el.type === "number" || el.type === "range")
		return el.value === "" ? "" : Number(el.value);
	return el.value;
}

function bindControls() {
	const presetSel = $("preset");
	for (const p of ALL_PRESETS) {
		const o = document.createElement("option");
		o.value = p.id;
		o.textContent = p.kind === "3d" ? `${p.name} (3D)` : p.name;
		presetSel.appendChild(o);
	}
	const recSel = $("recolor");
	for (const k of Object.keys(LUTS)) {
		const o = document.createElement("option");
		o.value = k;
		o.textContent = k;
		recSel.appendChild(o);
	}
	for (const el of document.querySelectorAll("[data-param]")) {
		const handler = () => {
			setParam(el.dataset.param, coerceInput(el, el.dataset.param));
		};
		el.addEventListener("input", handler);
		el.addEventListener("change", handler);
	}
	$("seed-random").addEventListener("click", () => {
		state.seed = String(Math.floor(Math.random() * 1000000000));
		$("seed").value = state.seed;
		dirty = true;
		log(`seed randomized to ${state.seed}`);
	});
	$("bg").addEventListener("change", () => {
		stage.className = `bg-${$("bg").value}`;
	});
	$("play").addEventListener("click", () => {
		playing = !playing;
		$("play").textContent = playing ? "Pause" : "Play";
	});
	$("step-back").addEventListener("click", () => {
		playing = false;
		$("play").textContent = "Play";
		currentFrame = Math.max(0, currentFrame - 1);
		renderCurrent();
	});
	$("step-fwd").addEventListener("click", () => {
		playing = false;
		$("play").textContent = "Play";
		currentFrame = Math.min(seq.frameCount - 1, currentFrame + 1);
		renderCurrent();
	});
	$("scrub").addEventListener("input", () => {
		playing = false;
		$("play").textContent = "Play";
		currentFrame = Number($("scrub").value);
		renderCurrent();
	});
	$("holds-reset").addEventListener("click", () => {
		state.holds = null;
		dirty = true;
		log("holds reset to 1:1");
	});
	$("holds-suggest").addEventListener("click", () => {
		state.holds = null;
		const s = sanitizeParams(state);
		state.holds = s.params.holds.map((_, i) => (i % 2 === 0 ? 2 : 1));
		dirty = true;
		log("suggested holds applied (even frames x2)");
	});
	$("export-sheet").addEventListener("click", () => doExport("sheet"));
	$("export-gif").addEventListener("click", () => doExport("gif"));
	$("export-frame").addEventListener("click", () => doExport("frame"));
	$("export-atlas").addEventListener("click", () => doExport("atlas"));
	$("export-aseprite").addEventListener("click", () => doExport("aseprite"));
	$("export-tres").addEventListener("click", () => doExport("tres"));
	$("export-meta").addEventListener("click", () => doExport("meta"));
	$("marker-add").addEventListener("click", addMarker);
	let orbiting = false;
	let lastP = { x: 0, y: 0 };
	canvas.addEventListener("pointerdown", (e) => {
		if (!is3dActive()) return;
		orbiting = true;
		lastP = { x: e.clientX, y: e.clientY };
		try {
			canvas.setPointerCapture(e.pointerId);
		} catch {
			/* synthetic automation events carry no active pointer to capture */
		}
	});
	canvas.addEventListener("pointermove", (e) => {
		if (!orbiting) return;
		const dx = e.clientX - lastP.x;
		const dy = e.clientY - lastP.y;
		lastP = { x: e.clientX, y: e.clientY };
		state.camera3d.yaw = (state.camera3d.yaw ?? 0.7) + dx * 0.01;
		state.camera3d.pitch = Math.max(
			-1.45,
			Math.min(1.45, (state.camera3d.pitch ?? 0.4) + dy * 0.01),
		);
		dirty = true;
	});
	const endOrbit = () => {
		orbiting = false;
	};
	canvas.addEventListener("pointerup", endOrbit);
	canvas.addEventListener("pointercancel", endOrbit);
	canvas.addEventListener(
		"wheel",
		(e) => {
			if (!is3dActive()) return;
			e.preventDefault();
			const d = (state.camera3d.dist ?? 3.4) + (e.deltaY > 0 ? 0.2 : -0.2);
			state.camera3d.dist = Math.max(1.5, Math.min(10, d));
			dirty = true;
		},
		{ passive: false },
	);
}

function syncInputsFromState() {
	for (const el of document.querySelectorAll("[data-param]")) {
		if (document.activeElement === el) continue;
		const path = el.dataset.param;
		const v = path.startsWith("camera3d.")
			? state.camera3d[path.slice(9)]
			: path.startsWith("camera.")
				? state.camera[path.slice(7)]
				: state[path];
		if (el.type === "checkbox") el.checked = !!v;
		else el.value = v;
	}
	$("alpha-val").textContent = Number(state.alphaThreshold).toFixed(2);
	$("zoom-val").textContent = Number(state.camera.zoom).toFixed(2);
	$("panx-val").textContent = Number(state.camera.panX).toFixed(2);
	$("pany-val").textContent = Number(state.camera.panY).toFixed(2);
	$("yaw-val").textContent = Number(state.camera3d.yaw).toFixed(2);
	$("pitch-val").textContent = Number(state.camera3d.pitch).toFixed(2);
	$("dist-val").textContent = Number(state.camera3d.dist).toFixed(1);
	$("fov-val").textContent = String(Math.round(state.camera3d.fov));
}

function renderCurrent() {
	if (!seq) return;
	currentFrame = Math.min(seq.frameCount - 1, Math.max(0, currentFrame));
	const W = seq.params.width;
	const H = seq.params.height;
	if (!imageData || canvas.width !== W || canvas.height !== H) {
		canvas.width = W;
		canvas.height = H;
		imageData = ctx.createImageData(W, H);
		const scale = Math.max(1, Math.floor(448 / Math.max(W, H)));
		canvas.style.width = `${W * scale}px`;
		canvas.style.height = `${H * scale}px`;
	}
	imageData.data.set(seq.frames[currentFrame]);
	ctx.putImageData(imageData, 0, 0);
	$("scrub").max = String(seq.frameCount - 1);
	$("scrub").value = String(currentFrame);
	$("frame-readout").textContent =
		"f " +
		currentFrame +
		"/" +
		(seq.frameCount - 1) +
		" · " +
		state.fps +
		"fps · " +
		seq.params.width +
		"x" +
		seq.params.height;
}

function renderHolds() {
	const head = $("holds-head");
	const body = $("holds-body");
	head.innerHTML = "";
	body.innerHTML = "";
	const from = seq.params.from;
	const to = seq.params.to;
	const th0 = document.createElement("th");
	th0.textContent = "src";
	head.appendChild(th0);
	for (let i = from; i <= to; i++) {
		const th = document.createElement("th");
		th.textContent = String(i);
		head.appendChild(th);
	}
	const tr = document.createElement("tr");
	const td0 = document.createElement("td");
	td0.textContent = "hold";
	tr.appendChild(td0);
	for (let i = from; i <= to; i++) {
		const td = document.createElement("td");
		const inp = document.createElement("input");
		inp.type = "number";
		inp.min = "0";
		inp.max = "8";
		inp.value = String(seq.params.holds[i]);
		inp.addEventListener("input", () => {
			const v = Math.min(8, Math.max(0, Math.round(Number(inp.value) || 0)));
			state.holds = state.holds || seq.params.holds.slice();
			state.holds[i] = v;
			updateHoldSummary();
		});
		td.appendChild(inp);
		tr.appendChild(td);
	}
	body.appendChild(tr);
	updateHoldSummary();
}

function updateHoldSummary() {
	const holds = state.holds || (seq ? seq.params.holds : []);
	const idx = expandFrames(holds, seq.params.from, seq.params.to);
	const total = totalTime(idx.length, seq.params.fps);
	$("hold-summary").textContent =
		"output frames: " +
		idx.length +
		" / source " +
		(seq.params.to - seq.params.from + 1) +
		" · total " +
		total.toFixed(3) +
		"s @ " +
		seq.params.fps +
		"fps";
	$("markers-readout").textContent =
		`markers: ${markers(seq.frameCount, 4).join(",")}`;
}

function is3dActive() {
	const p = ALL_PRESETS.find((x) => x.id === state.effectId);
	return !!p && p.kind === "3d";
}

function update3dSection() {
	const on = is3dActive();
	const rows = $("camera-2d-rows");
	if (rows) rows.hidden = on;
	$("camera3d-section").hidden = !on;
}

function renderMarkers() {
	const list = $("markers-list");
	list.innerHTML = "";
	const ms = state.userMarkers || [];
	ms.forEach((m, i) => {
		const li = document.createElement("li");
		li.className = "marker-item";
		const span = document.createElement("span");
		span.textContent = `f${m.frame}${m.label ? ` · ${m.label}` : ""}`;
		const rm = document.createElement("button");
		rm.type = "button";
		rm.textContent = "x";
		rm.title = "remove marker";
		rm.addEventListener("click", () => {
			state.userMarkers = state.userMarkers.filter((_, j) => j !== i);
			dirty = true;
		});
		li.appendChild(span);
		li.appendChild(rm);
		list.appendChild(li);
	});
}

function addMarker() {
	const frame = Math.max(0, Math.round(Number($("marker-frame").value) || 0));
	const label = String($("marker-label").value || "").slice(0, 40);
	state.userMarkers = [...(state.userMarkers || []), { frame, label }];
	$("marker-label").value = "";
	dirty = true;
	log(`marker added @${frame}${label ? ` (${label})` : ""}`);
}

function rebuild() {
	const res = buildSequence(state);
	seq = res;
	for (const k of Object.keys(DEFAULTS)) {
		if (k === "camera" || k === "holds" || k === "from" || k === "to") continue;
		state[k] = res.params[k];
	}
	state.from = res.params.from;
	state.to = res.params.to;
	state.holds = res.params.holds;
	state.frameCount = res.params.frameCount;
	messages = res.messages;
	for (const m of messages) log(`clamp: ${m}`);
	syncInputsFromState();
	renderCurrent();
	renderHolds();
	renderMarkers();
	update3dSection();
}

function meta(r) {
	return {
		name: r.name,
		kind: r.kind,
		base64: bytesToBase64(r.bytes),
		byteLength: r.bytes.length,
		width: r.width,
		height: r.height,
		cellCount: r.cellCount,
		delayCs: r.delayCs,
		totalMs: r.totalMs,
		frameIndex: r.frameIndex,
		params: {
			effectId: r.params.effectId,
			seed: r.params.seed,
			fps: r.params.fps,
			width: r.params.width,
			height: r.params.height,
			from: r.params.from,
			to: r.params.to,
			paletteSize: r.params.paletteSize,
			dither: r.params.dither,
			recolor: r.params.recolor,
			outline: r.params.outline,
			pixelScale: r.params.pixelScale,
			alphaThreshold: r.params.alphaThreshold,
			camera: r.params.camera,
			camera3d: r.params.camera3d,
			userMarkers: r.params.userMarkers,
		},
	};
}

function download(bytes, name, mime) {
	const blob = new Blob([bytes], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function doExport(kind) {
	try {
		let r;
		if (kind === "sheet") r = exportSheet(state);
		else if (kind === "gif") r = exportGif(state);
		else if (kind === "frame") r = exportFrame(state, currentFrame);
		else if (kind === "aseprite") r = exportAseprite(state);
		else if (kind === "tres") r = exportTres(state);
		else if (kind === "meta") r = exportMeta(state);
		else r = exportAtlas(state);
		const m = meta(r);
		lastExport = m;
		const mime =
			kind === "gif"
				? "image/gif"
				: kind === "atlas"
					? "application/json"
					: kind === "aseprite"
						? "application/octet-stream"
						: kind === "tres" || kind === "meta"
							? "text/plain"
							: "image/png";
		download(r.bytes, r.name, mime);
		let info = `${r.name} · ${r.width}x${r.height}`;
		if (r.cellCount !== undefined) info += ` · frames ${r.cellCount}`;
		if (r.totalSeconds !== undefined) info += ` · ${r.totalSeconds.toFixed(3)}s`;
		if (r.totalMs !== undefined)
			info += ` · ${r.totalMs}ms (delay ${r.delayCs}cs)`;
		$("export-info").textContent = info;
		log(`exported ${info} (${r.bytes.length} bytes)`);
		return m;
	} catch (e) {
		// Format-specific guidance instead of a silent uncaught throw: the GIF
		// encoder floor is 2cs per frame (boundary-scheduled quality presets do
		// not clamp), while sheet/frame exports accept fps up to 60.
		const msg = e && e.message ? e.message : String(e);
		const hint =
			kind === "gif"
				? " — GIF needs ≥2cs per frame: quality presets export GIF only at fps ≤ 50 (fps 51–60 is rejected at the encoder floor); sheet/frame/atlas exports accept fps up to 60"
				: "";
		const text = `export ${kind} failed: ${msg}${hint}`;
		$("export-info").textContent = text;
		log(text);
		return null;
	}
}

let last = performance.now();
let acc = 0;
function tick(now) {
	if (dirty) {
		dirty = false;
		rebuild();
	}
	if (playing && seq) {
		acc += ((now - last) / 1000) * seq.params.fps;
		while (acc >= 1) {
			acc -= 1;
			currentFrame++;
			if (currentFrame >= seq.frameCount) {
				if ($("loop").checked) currentFrame = 0;
				else {
					currentFrame = seq.frameCount - 1;
					playing = false;
					$("play").textContent = "Play";
					break;
				}
			}
		}
		renderCurrent();
	}
	last = now;
	requestAnimationFrame(tick);
}

window.PixelVFX = {
	version: "1.0.0",
	get params() {
		return JSON.parse(JSON.stringify({ ...state, effect: undefined }));
	},
	get logs() {
		return logs.slice();
	},
	get lastExport() {
		return lastExport;
	},
	get frameInfo() {
		return {
			current: currentFrame,
			frameCount: seq ? seq.frameCount : 0,
			from: seq ? seq.params.from : 0,
			to: seq ? seq.params.to : 0,
			playing,
		};
	},
	setParam(path, value) {
		setParam(path, value);
		dirty = true;
		return true;
	},
	rebuild() {
		rebuild();
		return { frameCount: seq.frameCount, messages };
	},
	exportSheet() {
		return doExport("sheet");
	},
	exportGif() {
		return doExport("gif");
	},
	exportFrame() {
		return doExport("frame");
	},
	exportAtlas() {
		return doExport("atlas");
	},
	exportAseprite() {
		return doExport("aseprite");
	},
	exportTres() {
		return doExport("tres");
	},
	exportMeta() {
		return doExport("meta");
	},
	sanitize(p) {
		const r = sanitizeParams(p);
		return { messages: r.messages, params: { ...r.params, effect: undefined } };
	},
	hashes() {
		return goldenHashes();
	},
	renderFrame(i) {
		playing = false;
		$("play").textContent = "Play";
		currentFrame = i;
		rebuild();
		renderCurrent();
		return { frame: currentFrame, image: canvas.toDataURL("image/png") };
	},
};

bindControls();
stage.className = "bg-checker";
log(`pixel-vfx-local ready · ${ALL_PRESETS.length} original presets`);
requestAnimationFrame(tick);
