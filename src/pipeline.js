import { ALL_PRESETS, getPreset } from "./effects.js";
import { render3dFrame } from "./frame3d.js";
import { encodeGIF } from "./gifenc.js";
import {
	alphaThreshold,
	buildLut,
	LUTS,
	medianCutPalette,
	outlineFrame,
	quantizeFrame,
	recolor,
} from "./pixel.js";
import { encodePNG, zlibStored } from "./pngenc.js";
import { rasterFrame } from "./raster.js";
import {
	renderQualityFrame,
	validatePeriodicTongue,
} from "./quality-render.js";
import { buildSheet, sheetLayout } from "./sheet.js";
import { Sim } from "./sim.js";
import { clampRange, expandFrames, markers, totalTime } from "./timing.js";

export const DEFAULTS = {
	effectId: "ember_burst",
	seed: "42",
	width: 128,
	height: 128,
	fps: 12,
	pixelScale: 2,
	paletteSize: 16,
	dither: "bayer4",
	outline: false,
	outlineColor: "#000000",
	recolor: "none",
	alphaThreshold: 0.28,
	camera: { zoom: 1, panX: 0, panY: 0 },
	from: 0,
	to: 9999,
	holds: null,
	userMarkers: [],
	camera3d: { yaw: 0.7, pitch: 0.4, dist: 3.4, fov: 55 },
};

const DITHERS = ["none", "bayer2", "bayer4"];
const MAX_INTERNAL = 2048;

function num(v, def) {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : def;
}

function clampInt(v, lo, hi, def, label, messages) {
	const raw = Number(v);
	if (!Number.isFinite(raw)) {
		messages.push(`${label} invalid → ${def}`);
		return def;
	}
	const n = Math.round(raw);
	const c = Math.min(hi, Math.max(lo, n));
	if (c !== n) messages.push(`${label} ${n} out of range → ${c}`);
	return c;
}

function clampNum(v, lo, hi, def, label, messages) {
	const raw = Number(v);
	if (!Number.isFinite(raw)) {
		messages.push(`${label} invalid → ${def}`);
		return def;
	}
	const c = Math.min(hi, Math.max(lo, raw));
	if (c !== raw) messages.push(`${label} ${raw} out of range → ${c}`);
	return c;
}

function hexToRgb(hex) {
	const m = /^#?([0-9a-fA-F]{6})$/.exec(String(hex || ""));
	if (!m) return null;
	const v = parseInt(m[1], 16);
	return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

export function sanitizeParams(p) {
	const d = DEFAULTS;
	const messages = [];
	const s = {
		...d,
		...p,
		camera: { ...d.camera, ...(p.camera || {}) },
		camera3d: { ...d.camera3d, ...(p.camera3d || {}) },
	};
	// Explicit effect override (M3): sanitize an authored/diagnostic variant
	// whose id matches the requested effectId (e.g. primary-only layer subsets
	// for the quality packets). No caller change when p.effect is absent —
	// resolution falls back to the registered preset exactly as before.
	const effect =
		p.effect && p.effect.id === p.effectId
			? p.effect
			: ALL_PRESETS.find((x) => x.id === p.effectId);
	if (!effect) {
		messages.push(`unknown effect "${p.effectId}" → ${d.effectId}`);
		s.effectId = d.effectId;
	}
	if (String(s.seed) === "") {
		messages.push(`empty seed → "${d.seed}"`);
		s.seed = d.seed;
	} else {
		s.seed = String(s.seed);
	}
	s.width = clampInt(s.width, 8, 512, d.width, "width", messages);
	s.height = clampInt(s.height, 8, 512, d.height, "height", messages);
	s.fps = clampInt(s.fps, 1, 60, d.fps, "fps", messages);
	s.pixelScale = clampInt(
		s.pixelScale,
		1,
		8,
		d.pixelScale,
		"pixelScale",
		messages,
	);
	const cap = Math.max(1, Math.floor(MAX_INTERNAL / s.width));
	if (s.pixelScale > cap) {
		messages.push(
			`pixelScale ${s.pixelScale} exceeds internal render cap → ${cap}`,
		);
		s.pixelScale = cap;
	}
	s.paletteSize = clampInt(
		s.paletteSize,
		2,
		256,
		d.paletteSize,
		"paletteSize",
		messages,
	);
	if (!DITHERS.includes(s.dither)) {
		messages.push(`invalid dither "${s.dither}" → ${d.dither}`);
		s.dither = d.dither;
	}
	s.outline = !!s.outline;
	const rgb = hexToRgb(s.outlineColor);
	if (!rgb) {
		messages.push(`invalid outline color "${s.outlineColor}" → #000000`);
		s.outlineColor = "#000000";
	}
	s.recolor = Object.hasOwn(LUTS, s.recolor) ? s.recolor : "none";
	s.alphaThreshold = clampNum(
		s.alphaThreshold,
		0.02,
		0.98,
		d.alphaThreshold,
		"alphaThreshold",
		messages,
	);
	s.camera.zoom = clampNum(
		s.camera.zoom,
		0.25,
		8,
		d.camera.zoom,
		"zoom",
		messages,
	);
	s.camera.panX = clampNum(
		s.camera.panX,
		-0.5,
		0.5,
		d.camera.panX,
		"panX",
		messages,
	);
	s.camera.panY = clampNum(
		s.camera.panY,
		-0.5,
		0.5,
		d.camera.panY,
		"panY",
		messages,
	);
	const fc = frameCountOf(s);
	const r = clampRange(s.from, s.to, fc);
	const rawFrom = p.from === undefined ? null : Number(p.from);
	const rawTo = p.to === undefined ? null : Number(p.to);
	if (
		(rawFrom !== null && rawFrom !== r.from) ||
		(rawTo !== null && rawTo !== r.to)
	) {
		messages.push(`frame range repaired to ${r.from}..${r.to}`);
	}
	s.from = r.from;
	s.to = r.to;
	const holds = [];
	for (let i = 0; i < fc; i++) {
		const raw =
			p.holds && p.holds[i] !== undefined
				? p.holds[i]
				: d.holds && d.holds[i] !== undefined
					? d.holds[i]
					: 1;
		const h = Math.round(num(raw, 1));
		holds.push(Math.min(8, Math.max(0, h)));
	}
	s.holds = holds;

	const c3 = { ...d.camera3d, ...(p.camera3d || {}) };
	c3.yaw = clampNum(c3.yaw, -12, 12, d.camera3d.yaw, "yaw", messages);
	c3.pitch = clampNum(
		c3.pitch,
		-1.45,
		1.45,
		d.camera3d.pitch,
		"pitch",
		messages,
	);
	c3.dist = clampNum(c3.dist, 1.5, 10, d.camera3d.dist, "dist", messages);
	c3.fov = clampNum(c3.fov, 30, 85, d.camera3d.fov, "fov", messages);
	s.camera3d = c3;

	const rawU = Array.isArray(p.userMarkers) ? p.userMarkers : [];
	const um = [];
	for (const m of rawU.slice(0, 32)) {
		if (!m || typeof m !== "object") continue;
		const fr = Math.round(
			clampNum(Number(m.frame), 0, 999, 0, "marker.frame", messages),
		);
		um.push({ frame: fr, label: String(m.label ?? "").slice(0, 40) });
	}
	um.sort((a, b) => a.frame - b.frame);
	s.userMarkers = um;

	s.frameCount = fc;
	s.effect = effect || getPreset(d.effectId);
	return { params: s, messages };
}

export function frameCountOf(p) {
	const fx = getPreset(p.effectId);
	const fps = Math.min(60, Math.max(1, Math.round(num(p.fps, DEFAULTS.fps))));
	return Math.max(2, Math.ceil(fx.duration * fps));
}

function downsample(src, sw, sh, scale) {
	const W = sw / scale;
	const H = sh / scale;
	const out = new Uint8ClampedArray(W * H * 4);
	const n = scale * scale;
	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			let r = 0;
			let g = 0;
			let b = 0;
			let a = 0;
			for (let sy = 0; sy < scale; sy++) {
				for (let sx = 0; sx < scale; sx++) {
					const i = ((y * scale + sy) * sw + x * scale + sx) * 4;
					r += src[i];
					g += src[i + 1];
					b += src[i + 2];
					a += src[i + 3];
				}
			}
			const o = (y * W + x) * 4;
			out[o] = r / n;
			out[o + 1] = g / n;
			out[o + 2] = b / n;
			out[o + 3] = a / n;
		}
	}
	return out;
}

export function buildSequence(p) {
	const { params, messages } = sanitizeParams(p);
	const fx = params.effect;
	if (fx.kind === "quality") {
		const st = renderQualityStages(fx, params);
		return {
			frames: st.final,
			palette: st.palette,
			params,
			messages,
			frameCount: params.frameCount,
			geometryVariant: st.geometryVariant,
		};
	}
	const is3d = fx.kind === "3d";
	const sim = is3d ? null : new Sim(fx, params.seed);
	const IW = params.width * params.pixelScale;
	const IH = params.height * params.pixelScale;
	const frames = [];
	for (let i = 0; i < params.frameCount; i++) {
		let raw;
		if (is3d) {
			raw = render3dFrame(
				fx,
				i / params.fps,
				params.seed,
				params.camera3d,
				IW,
				IH,
			);
		} else {
			sim.frame(i, params.fps);
			raw = rasterFrame(sim, fx, IW, IH, params.camera);
		}
		frames.push(
			params.pixelScale === 1
				? raw
				: downsample(raw, IW, IH, params.pixelScale),
		);
	}
	const lut = params.recolor !== "none" ? buildLut(LUTS[params.recolor]) : null;
	const outlineRgb = hexToRgb(params.outlineColor) || [0, 0, 0];
	const palette = medianCutPalette(frames, params.paletteSize);
	for (const f of frames) {
		alphaThreshold(f, params.alphaThreshold);
		recolor(f, lut);
		quantizeFrame(f, palette, params.dither, params.width);
		if (params.outline)
			outlineFrame(f, params.width, params.height, [...outlineRgb, 255]);
	}
	return { frames, palette, params, messages, frameCount: params.frameCount };
}

// Runs the ACTUAL quality-path stages and returns them separately, so
// diagnostic exports and boards observe exactly the bytes the export uses.
// Stages are the real code order — nothing invented:
//   unthresholded — renderQualityFrame output (straight RGBA, SOFT alpha)
//   policyApplied — after shared alphaThreshold + recolor (binary alpha)
//   final         — after the one sequence palette quantize (+outline)
// Pass { keepStages: true } to retain the two pre-final copies; the default
// keeps only `final` so ordinary builds allocate no extra frame buffers.
const FLAME16_REVISION = "flame16-v1";
const FLAME16_IDS = new Set([
	"perimeter",
	"tongue_tall_outer",
	"tongue_short_outer",
	"tongue_tall_inner",
	"tongue_short_inner",
	"base",
	"core",
]);
const FLAME16_KIND_BY_ID = {
	perimeter: "puff",
	base: "puff",
	tongue_tall_outer: "arc",
	tongue_short_outer: "arc",
	tongue_tall_inner: "arc",
	tongue_short_inner: "arc",
	core: "radial",
};
const FLAME16_FIELDS_BY_KIND = {
	puff: new Set(["cx", "cy", "r", "lobes", "amp", "phase", "feather"]),
	arc: new Set([
		"cx",
		"cy",
		"radius",
		"ang0",
		"ang1",
		"thick0",
		"thick1",
		"rot",
		"feather",
		"periodicTongue",
	]),
	radial: new Set(["cx", "cy", "r0", "r1", "feather"]),
};
const FLAME16_PT_KEYS = new Set([
	"periodSeconds",
	"phaseRadians",
	"swayPixels",
	"widthFraction",
	"heightFraction",
]);

export function validateFlame16Definition(fx) {
	const def = fx.flame16Geometry;
	if (!def || typeof def !== "object" || Array.isArray(def)) {
		throw new Error("flame16Geometry: definition must be an object");
	}
	for (const key of Object.keys(def)) {
		if (key !== "revision" && key !== "overrides") {
			throw new Error(`flame16Geometry: unknown top-level field '${key}'`);
		}
	}
	if (def.revision !== FLAME16_REVISION) {
		throw new Error(
			`flame16Geometry: revision must be exactly '${FLAME16_REVISION}', got ${JSON.stringify(def.revision)}`,
		);
	}
	const ov = def.overrides;
	if (!ov || typeof ov !== "object" || Array.isArray(ov)) {
		throw new Error("flame16Geometry: overrides must be an object");
	}
	for (const id of Object.keys(ov)) {
		if (!FLAME16_IDS.has(id)) {
			throw new Error(
				`flame16Geometry: unknown override ID '${id}' (must be one of the seven approved IDs)`,
			);
		}
		const o = ov[id];
		if (!o || typeof o !== "object" || Array.isArray(o)) {
			throw new Error(`flame16Geometry: override '${id}' must be an object`);
		}
		const allowed = FLAME16_FIELDS_BY_KIND[FLAME16_KIND_BY_ID[id]];
		for (const key of Object.keys(o)) {
			if (!allowed.has(key)) {
				throw new Error(`flame16Geometry: override '${id}' has disallowed field '${key}'`);
			}
		}
		for (const key of Object.keys(o)) {
			if (key === "periodicTongue") continue;
			const v = o[key];
			if (typeof v !== "number" || !Number.isFinite(v)) {
				throw new Error(
					`flame16Geometry: override '${id}.${key}' must be a finite number, got ${JSON.stringify(v)}`,
				);
			}
		}
		if (o.periodicTongue !== undefined) {
			const pt = o.periodicTongue;
			if (!pt || typeof pt !== "object" || Array.isArray(pt)) {
				throw new Error(`flame16Geometry: override '${id}.periodicTongue' must be an object`);
			}
			for (const key of Object.keys(pt)) {
				if (!FLAME16_PT_KEYS.has(key)) {
					throw new Error(
						`flame16Geometry: override '${id}.periodicTongue' has unknown field '${key}'`,
					);
				}
			}
			for (const key of FLAME16_PT_KEYS) {
				if (!Object.prototype.hasOwnProperty.call(pt, key)) {
					throw new Error(
						`flame16Geometry: override '${id}.periodicTongue' missing '${key}'`,
					);
				}
				const v = pt[key];
				if (typeof v !== "number" || !Number.isFinite(v)) {
					throw new Error(
						`flame16Geometry: override '${id}.periodicTongue.${key}' must be a finite number`,
					);
				}
			}
			if (pt.periodSeconds !== 2) {
				throw new Error(
					`flame16Geometry: override '${id}.periodicTongue.periodSeconds' must be exactly 2, got ${JSON.stringify(pt.periodSeconds)}`,
				);
			}
		}
	}
}

export function renderQualityStages(fx, p, opts = {}) {
	const keep = opts.keepStages === true;
	if (fx.flame16Geometry) {
		validateFlame16Definition(fx);
	}
	// flame16-v1: shared exact-16x16 selection, additive provenance only.
	let renderFx = fx;
	let geometryVariant = fx.id === "quality_flame" ? "quality_flame:r2" : null;
	if (
		fx.id === "quality_flame" &&
		fx.flame16Geometry &&
		p.width === 16 &&
		p.height === 16
	) {
		geometryVariant = `quality_flame:${fx.flame16Geometry.revision}`;
		const overrides = fx.flame16Geometry.overrides;
		renderFx = {
			...fx,
			layers: fx.layers.map((layer) => {
				const ov = Object.hasOwn(overrides, layer.id) ? overrides[layer.id] : undefined;
				if (!ov) return layer;
				const merged = { ...layer, ...ov };
				if (ov.periodicTongue) {
					merged.periodicTongue = { ...ov.periodicTongue };
				}
				return merged;
			}),
		};
		// Contract-validate merged overridden layers once per invocation,
		// outside every pixel/frame loop; misuse throws, no silent fallback.
		for (const layer of renderFx.layers) {
			if (Object.hasOwn(overrides, layer.id) && overrides[layer.id].periodicTongue) {
				validatePeriodicTongue(renderFx, layer);
			}
		}
	}
	const lut = p.recolor !== "none" ? buildLut(LUTS[p.recolor]) : null;
	const outlineRgb = hexToRgb(p.outlineColor) || [0, 0, 0];
	const unthresholded = [];
	const policyApplied = [];
	const final = [];
	for (let i = 0; i < p.frameCount; i++) {
		const raw = renderQualityFrame(
			renderFx,
			i / p.fps,
			p.seed,
			p.camera,
			p.width,
			p.height,
		);
		if (keep) unthresholded.push(raw.slice());
		alphaThreshold(raw, p.alphaThreshold);
		recolor(raw, lut);
		if (keep) policyApplied.push(raw.slice());
		final.push(raw);
	}
	const palette = medianCutPalette(final, p.paletteSize);
	for (const f of final) {
		quantizeFrame(f, palette, p.dither, p.width);
		if (p.outline) outlineFrame(f, p.width, p.height, [...outlineRgb, 255]);
	}
	return { unthresholded, policyApplied, final, palette, geometryVariant };
}

function outputFrames(seq) {
	const { params } = seq;
	const idx = expandFrames(params.holds, params.from, params.to);
	return { idx, frames: idx.map((i) => seq.frames[i]) };
}

export function exportSheet(p) {
	const seq = buildSequence(p);
	const { idx, frames } = outputFrames(seq);
	const sheet = buildSheet(frames, seq.params.width, seq.params.height);
	const bytes = encodePNG(sheet.rgba, sheet.width, sheet.height);
	return {
		bytes,
		kind: "sheet",
		width: sheet.width,
		height: sheet.height,
		cellCount: frames.length,
		layout: sheet.layout,
		sourceFrames: idx,
		totalSeconds: totalTime(frames.length, seq.params.fps),
		params: seq.params,
		name:
			seq.params.effectId +
			"_seed" +
			seq.params.seed +
			"_" +
			seq.params.width +
			"x" +
			seq.params.height +
			"_sheet.png",
	};
}

export function exportFrame(p, frameIndex) {
	const seq = buildSequence(p);
	const i = Math.min(
		seq.frameCount - 1,
		Math.max(0, Math.round(num(frameIndex, 0))),
	);
	const rgba = seq.frames[i];
	const bytes = encodePNG(rgba, seq.params.width, seq.params.height);
	return {
		bytes,
		kind: "frame",
		width: seq.params.width,
		height: seq.params.height,
		frameIndex: i,
		params: seq.params,
		name: `${seq.params.effectId}_seed${seq.params.seed}_f${i}.png`,
	};
}

export function exportGif(p) {
	const seq = buildSequence(p);
	const { idx, frames } = outputFrames(seq);
	const { params } = seq;
	const actualColors = seq.palette.length / 3;
	const gifColors = Math.min(255, actualColors);
	const paddedEntries = 1 << Math.ceil(Math.log2(gifColors + 1));
	const palette = new Uint8Array(paddedEntries * 3);
	palette.set(seq.palette.subarray(0, gifColors * 3));
	const transIdx = paddedEntries - 1;
	palette[transIdx * 3] = 0;
	palette[transIdx * 3 + 1] = 0;
	palette[transIdx * 3 + 2] = 0;
	const pmap = new Map();
	for (let i = 0; i < gifColors; i++) {
		pmap.set(
			(seq.palette[i * 3] << 16) |
				(seq.palette[i * 3 + 1] << 8) |
				seq.palette[i * 3 + 2],
			i,
		);
	}
	const indices = frames.map((f) => {
		const idxBuf = new Uint8Array(params.width * params.height);
		for (let i = 0, j = 0; i < f.length; i += 4, j++) {
			if (f[i + 3] === 0) {
				idxBuf[j] = transIdx;
			} else {
				const key = (f[i] << 16) | (f[i + 1] << 8) | f[i + 2];
				idxBuf[j] = pmap.has(key)
					? pmap.get(key)
					: nearestInPalette(seq.palette, f[i], f[i + 1], f[i + 2]);
			}
		}
		return idxBuf;
	});
	const delayCs = Math.max(2, Math.round(100 / params.fps));
	// Opt-in boundary-rounded delay schedule (M3 quality one-shots declare
	// `delaySchedule: "boundary"`): per-frame centiseconds from rounded
	// cumulative boundaries, so the ENCODED length is exactly frameCount/fps
	// (750ms for 9 frames at 12fps) instead of frameCount*round(100/fps).
	// The default (no declaration) keeps the historical scalar delay and is
	// byte-identical to prior exports; gifenc's delayCsList handles the list.
	let delaysCs = null;
	if (String(params.effect?.delaySchedule) === "boundary") {
		delaysCs = Array.from({ length: frames.length }, (_, i) =>
			Math.round(((i + 1) * 100) / params.fps) -
			Math.round((i * 100) / params.fps),
		);
		if (delaysCs.some((d) => d < 2)) {
			throw new Error(
				`delaySchedule=boundary: fps=${params.fps} yields a sub-2cs delay at the encoder floor; unsupported candidate fps`,
			);
		}
	}
	const bytes = encodeGIF({
		width: params.width,
		height: params.height,
		frames: indices,
		palette,
		transparentIndex: transIdx,
		...(delaysCs ? { delayCsList: delaysCs } : { delayCs }),
		loop: 0,
	});
	return {
		bytes,
		kind: "gif",
		width: params.width,
		height: params.height,
		cellCount: frames.length,
		delayCs,
		delaysCs,
		totalMs: delaysCs
			? delaysCs.reduce((a, b) => a + b, 0) * 10
			: frames.length * delayCs * 10,
		nominalMs: (frames.length / params.fps) * 1000,
		sourceFrames: idx,
		params,
		name:
			params.effectId +
			"_seed" +
			params.seed +
			"_" +
			params.width +
			"x" +
			params.height +
			".gif",
	};
}

function nearestInPalette(palette, r, g, b) {
	let best = 0;
	let bestD = Infinity;
	for (let i = 0; i < palette.length; i += 3) {
		const dr = palette[i] - r;
		const dg = palette[i + 1] - g;
		const db = palette[i + 2] - b;
		const d = dr * dr + dg * dg + db * db;
		if (d < bestD) {
			bestD = d;
			best = i / 3;
		}
	}
	return best;
}

export function exportAtlas(p) {
	const seq = buildSequence(p);
	const { idx } = outputFrames(seq);
	const layout = sheetLayout(idx.length, seq.params.width, seq.params.height);
	const frames = {};
	idx.forEach((src, i) => {
		frames[String(i)] = {
			x: (i % layout.cols) * seq.params.width,
			y: Math.floor(i / layout.cols) * seq.params.height,
			w: seq.params.width,
			h: seq.params.height,
			source: src,
		};
	});
	const doc = {
		meta: {
			app: "pixel-vfx-local",
			version: 1,
			effect: seq.params.effectId,
			seed: seq.params.seed,
			width: seq.params.width,
			height: seq.params.height,
			fps: seq.params.fps,
			sheet: {
				cols: layout.cols,
				rows: layout.rows,
				width: layout.width,
				height: layout.height,
			},
			markers: markers(seq.frameCount, 4),
			userMarkers: seq.params.userMarkers || [],
			totalSeconds: totalTime(idx.length, seq.params.fps),
		},
		frames,
	};
	const text = JSON.stringify(doc, null, 2);
	const bytes = new Uint8Array(text.length);
	for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i) & 0xff;
	return {
		bytes,
		kind: "atlas",
		doc,
		name: `${seq.params.effectId}_seed${seq.params.seed}_atlas.json`,
		width: layout.width,
		height: layout.height,
		cellCount: idx.length,
		delayCs: Math.round(100 / seq.params.fps),
		totalMs: Math.round(100 / seq.params.fps) * 10 * idx.length,
		frameIndex: null,
		params: seq.params,
	};
}

function utf8Bytes(str) {
	return new TextEncoder().encode(str);
}

function u16le(v) {
	return [v & 255, (v >> 8) & 255];
}

function u32le(v) {
	return [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];
}

function aseString(str) {
	const b = utf8Bytes(str);
	return [...u16le(b.length), ...b];
}

function aseChunk(type, data) {
	return [...u32le(6 + data.length), ...u16le(type), ...data];
}

export function writeAseprite(frames, W, H, fps) {
	const duration = Math.max(20, Math.round(1000 / Math.max(1, fps)));
	const header = [
		...u32le(0), // file size, patched last
		...u16le(0xa5e0),
		...u16le(frames.length),
		...u16le(W),
		...u16le(H),
		...u16le(32), // RGBA
		...u32le(1), // flags: layer opacity valid
		...u16le(duration),
		...u32le(0),
		...u32le(0),
		0, // transparent index
		0,
		0,
		0,
		...u16le(0),
		1, // pixel width
		1, // pixel height
		...u16le(0),
		...u16le(0),
		...u16le(16),
		...u16le(16),
		...new Array(84).fill(0),
	];
	if (header.length !== 128)
		throw new Error(`ase header ${header.length} != 128`);
	const layerChunk = aseChunk(0x2004, [
		...u16le(3), // editable | visible
		...u16le(0), // image layer
		...u16le(0), // child level
		...u16le(0),
		...u16le(0),
		...u16le(0), // normal blend
		255,
		0,
		0,
		0,
		...aseString("Layer"),
	]);
	const out = [...header];
	for (let f = 0; f < frames.length; f++) {
		const rgba = frames[f];
		const z = zlibStored(
			new Uint8Array(rgba.buffer, rgba.byteOffset, rgba.byteLength),
		);
		const cel = aseChunk(0x2005, [
			...u16le(0), // layer index
			...u16le(0), // x
			...u16le(0), // y
			255, // opacity
			...u16le(2), // compressed image
			...u16le(W),
			...u16le(H),
			...z,
		]);
		const chunkCount = f === 0 ? 2 : 1;
		const body = f === 0 ? [...layerChunk, ...cel] : [...cel];
		const frameBytes = [
			...u32le(0), // frame size, patched below
			...u16le(0xf1fa),
			...u16le(chunkCount),
			...u16le(duration),
			0,
			0,
			...u32le(chunkCount),
			...body,
		];
		const size = u32le(frameBytes.length);
		for (let i = 0; i < 4; i++) frameBytes[i] = size[i];
		out.push(...frameBytes);
	}
	const total = u32le(out.length);
	for (let i = 0; i < 4; i++) out[i] = total[i];
	return Uint8Array.from(out);
}

function inflateStored(z) {
	if (z[0] !== 0x78) throw new Error("bad zlib header");
	let i = 2;
	const out = [];
	for (;;) {
		if (i >= z.length) throw new Error("truncated zlib stream");
		const b = z[i++];
		const last = b & 1;
		const type = (b >> 1) & 3;
		if (type !== 0) throw new Error(`unsupported deflate type ${type}`);
		const len = z[i] | (z[i + 1] << 8);
		i += 4; // LEN + NLEN
		for (let k = 0; k < len; k++) out.push(z[i++]);
		if (last) break;
	}
	return Uint8Array.from(out);
}

// Independent structural reader used to round-trip our own writer output.
export function parseAseprite(bytes) {
	const u16 = (o) => bytes[o] | (bytes[o + 1] << 8);
	const u32 = (o) =>
		(bytes[o] |
			(bytes[o + 1] << 8) |
			(bytes[o + 2] << 16) |
			(bytes[o + 3] << 24)) >>>
		0;
	if (u16(4) !== 0xa5e0) throw new Error("bad aseprite magic");
	const frameCount = u16(6);
	const width = u16(8);
	const height = u16(10);
	const depth = u16(12);
	let off = 128;
	const cels = [];
	for (let f = 0; f < frameCount; f++) {
		const fsize = u32(off);
		if (u16(off + 4) !== 0xf1fa) throw new Error(`bad frame magic ${f}`);
		const chunkCount = u32(off + 12) || u16(off + 6);
		let co = off + 16;
		for (let c = 0; c < chunkCount; c++) {
			const csize = u32(co);
			const ctype = u16(co + 4);
			const d = co + 6;
			if (ctype === 0x2005) {
				const layer = u16(d);
				const type = u16(d + 7);
				if (type !== 2) throw new Error(`cel type ${type} != 2`);
				const w = u16(d + 9);
				const h = u16(d + 11);
				const z = bytes.subarray(d + 13, co + csize);
				cels.push({ frame: f, layer, w, h, rgba: inflateStored(z) });
			}
			co += csize;
		}
		off += fsize;
	}
	return { frameCount, width, height, depth, cels };
}

export function exportAseprite(p) {
	const seq = buildSequence(p);
	const { frames } = outputFrames(seq);
	const bytes = writeAseprite(
		frames,
		seq.params.width,
		seq.params.height,
		seq.params.fps,
	);
	const dur = Math.round(1000 / seq.params.fps);
	return {
		bytes,
		kind: "aseprite",
		width: seq.params.width,
		height: seq.params.height,
		cellCount: frames.length,
		delayCs: Math.round(100 / seq.params.fps),
		totalMs: dur * frames.length,
		frameIndex: null,
		params: seq.params,
		name: `${seq.params.effectId}_seed${seq.params.seed}_${seq.params.width}x${seq.params.height}.aseprite`,
	};
}

export function exportTres(p) {
	const sheet = exportSheet(p);
	const lay = sheet.layout;
	const fx = getPreset(p.effectId);
	const regions = [];
	for (let k = 0; k < sheet.cellCount; k++) {
		const col = k % lay.cols;
		const row = Math.floor(k / lay.cols);
		regions.push(
			`{\n"duration": 1.0,\n"texture": ExtResource( 1 ),\n"region": Rect2( ${col * lay.cellW}, ${row * lay.cellH}, ${lay.cellW}, ${lay.cellH} )\n}`,
		);
	}
	const text =
		'[gd_resource type="SpriteFrames" load_steps=2 format=2]\n\n' +
		`[ext_resource path="res://pixelvfx/${sheet.name}" type="Texture" id=1]\n\n` +
		"[resource]\n\n" +
		"animations = [ {\n" +
		`\t"frames": [ ${regions.join(", ")} ],\n` +
		`\t"loop": ${fx.loop ? "true" : "false"},\n` +
		`\t"name": "${p.effectId || fx.id}",\n` +
		`\t"speed": ${Math.round(Number(p.fps) || 12)}.0\n` +
		"} ]\n";
	return {
		bytes: utf8Bytes(text),
		kind: "tres",
		width: sheet.width,
		height: sheet.height,
		cellCount: sheet.cellCount,
		delayCs: Math.round(100 / (Number(p.fps) || 12)),
		totalMs: sheet.cellCount * Math.round(1000 / (Number(p.fps) || 12)),
		frameIndex: null,
		params: sheet.params,
		name: `${sheet.params.effectId}_seed${sheet.params.seed}_spriteframes.tres`,
	};
}

function guidFrom(str) {
	let h1 = 0x811c9dc5;
	let h2 = 0x01000193;
	for (let i = 0; i < str.length; i++) {
		const c = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
		h2 = Math.imul(h2 + c + i, 2246822519) >>> 0;
	}
	const hex = (n) => (n >>> 0).toString(16).padStart(8, "0");
	return (
		hex(h1) + hex(h2) + hex((h1 ^ h2) >>> 0) + hex((h1 * 3 + h2 * 7) >>> 0)
	);
}

export function exportMeta(p) {
	const sheet = exportSheet(p);
	const lay = sheet.layout;
	const rows = [];
	for (let k = 0; k < sheet.cellCount; k++) {
		const col = k % lay.cols;
		const row = Math.floor(k / lay.cols);
		const x = col * lay.cellW;
		const y = lay.height - (row + 1) * lay.cellH;
		const sid = guidFrom(`${sheet.name}:${k}`);
		rows.push(
			`    - serializedVersion: 2\n      name: ${sid.slice(0, 8)}_${k}\n      rect:\n        serializedVersion: 2\n        x: ${x}\n        y: ${y}\n        width: ${lay.cellW}\n        height: ${lay.cellH}\n      alignment: 0\n      pivot: {x: 0.5, y: 0.5}\n      border: {x: 0, y: 0, z: 0, w: 0}\n      outline: []\n      physicsShape: []\n      tessellationDetail: 0\n      bones: []\n      spriteID: ${sid.slice(0, 8)}\n      internalID: ${-100000 - k}\n      vertices: []\n      indices:\n      edges: []\n      weights: []\n      secondaryTextures: []`,
		);
	}
	const text =
		`fileFormatVersion: 2\nguid: ${guidFrom(sheet.name)}\nTextureImporter:\n` +
		"  internalIDToNameTable: []\n  externalObjects: {}\n" +
		"  serializedVersion: 12\n  mipmaps:\n    mipMapMode: 0\n    enableMipMap: 0\n" +
		"  spriteMode: 2\n  spritePixelsToUnits: 100\n" +
		"  spritePivot: {x: 0.5, y: 0.5}\n" +
		"  spriteBorder: {x: 0, y: 0, z: 0, w: 0}\n" +
		"  spriteSheet:\n    serializedVersion: 2\n    sprites:\n" +
		`${rows.join("\n")}\n` +
		"    outline: []\n  spritePackingTag:\n  userData:\n" +
		"  assetBundleName:\n  assetBundleVariant:\n";
	return {
		bytes: utf8Bytes(text),
		kind: "meta",
		width: sheet.width,
		height: sheet.height,
		cellCount: sheet.cellCount,
		delayCs: Math.round(100 / (Number(p.fps) || 12)),
		totalMs: sheet.cellCount * Math.round(1000 / (Number(p.fps) || 12)),
		frameIndex: null,
		params: sheet.params,
		name: `${sheet.name}.meta`,
	};
}

export function bytesToBase64(bytes) {
	let bin = "";
	const CH = 0x8000;
	for (let i = 0; i < bytes.length; i += CH) {
		bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
	}
	if (typeof btoa === "function") return btoa(bin);
	return Buffer.from(bin, "binary").toString("base64");
}

function fnv(bytes) {
	let h = 0x811c9dc5;
	for (let i = 0; i < bytes.length; i++) {
		h ^= bytes[i];
		h = Math.imul(h, 0x01000193);
	}
	return (h >>> 0).toString(16).padStart(8, "0");
}

export const GOLDEN_PARAMS = {
	effectId: "ember_burst",
	seed: "777",
	width: 64,
	height: 64,
	fps: 12,
	pixelScale: 1,
	paletteSize: 16,
	dither: "bayer4",
	outline: true,
	recolor: "ember",
	from: 0,
	to: 9999,
	alphaThreshold: 0.28,
	camera: { zoom: 1, panX: 0, panY: 0 },
	holds: null,
};

export function goldenHashes() {
	const seq = buildSequence(GOLDEN_PARAMS);
	let total = 0;
	for (const f of seq.frames) total += f.length;
	const all = new Uint8Array(total);
	let o = 0;
	for (const f of seq.frames) {
		all.set(f, o);
		o += f.length;
	}
	const sheet = exportSheet(GOLDEN_PARAMS);
	const gif = exportGif(GOLDEN_PARAMS);
	return {
		frameCount: seq.frameCount,
		frame0: fnv(seq.frames[0]),
		allFrames: fnv(all),
		sheet: fnv(sheet.bytes),
		gif: fnv(gif.bytes),
	};
}
