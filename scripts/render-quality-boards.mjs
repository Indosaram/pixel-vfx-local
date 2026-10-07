#!/usr/bin/env bun
// M1 stage/fixture boards — rendered through the REAL quality pipeline.
//
// Stage names follow the actual code order in src/pipeline.js
// (renderQualityStages); no stage is invented:
//   01 unthresholded : renderQualityFrame output — straight RGBA, SOFT alpha
//   02 policy        : after shared alphaThreshold (params) + recolor (params)
//   03 final         : after the ONE sequence palette quantize (+outline),
//                      byte-identical to buildSequence/export frames
// The *-on-<bg> variants are presentation composites of a stage over the
// backgrounds declared in the quality plan (#000000, #808080, #f0f0f0,
// checkerboard) — compositing is not a pipeline stage.
//
// Fixtures are board renderings of the plan's §2.2 analytic fixtures; they are
// NOT registered presets and say nothing about M3 aesthetics.
//
// Usage: bun scripts/render-quality-boards.mjs <outDir> [only-substring]
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync, statSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import {
	sanitizeParams,
	renderQualityStages,
} from "../src/pipeline.js";
import { compositeOnBackground, renderQualityFrame } from "../src/quality-render.js";
import { encodePNG } from "../src/pngenc.js";
import { buildSheet } from "../src/sheet.js";
import { QUALITY_PRESETS } from "../src/quality-effects.js";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const W = Number(process.env.BOARD_SIZE ?? 64);
const H = W;
const FPS = 12;
const SEED = "42";
const BG_BLACK = [0, 0, 0];
const BG_GRAY = [128, 128, 128];
const BG_LIGHT = [240, 240, 240];
const CHECKER_A = [255, 255, 255];
const CHECKER_B = [192, 192, 192];
const CHECKER_SIZE = 8;
const CELL = W;

const outDir = resolve(process.argv[2] ?? "");
// optional substring filter: regenerate ONLY affected boards (Astra rereview:
// do not rerun all boards by habit — document the delta instead).
const only = process.argv[3] || "";
if (!process.argv[2]) {
	console.error("usage: bun scripts/render-quality-boards.mjs <outDir> [only-substring]");
	process.exit(2);
}

const manifest = [];
const files = []; // { path, sha256, bytes }

function sha256(buf) {
	return createHash("sha256").update(buf).digest("hex");
}
function record(absPath) {
	const buf = readFileSync(absPath);
	files.push({
		rel: absPath.slice(outDir.length + 1).replaceAll("\\", "/"),
		sha256: sha256(buf),
		bytes: buf.length,
	});
}
function savePng(rel, rgba) {
	const abs = join(outDir, rel);
	mkdirSync(join(abs, ".."), { recursive: true });
	writeFileSync(abs, encodePNG(rgba, W, H));
	record(abs);
	return abs;
}
function checker(rgba) {
	const out = new Uint8ClampedArray(rgba.length);
	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const i = (y * W + x) * 4;
			const on =
				(Math.floor(x / CHECKER_SIZE) + Math.floor(y / CHECKER_SIZE)) %
					2 ===
				0;
			const bg = on ? CHECKER_A : CHECKER_B;
			const a = rgba[i + 3] / 255;
			out[i] = Math.round(rgba[i] * a + bg[0] * (1 - a));
			out[i + 1] = Math.round(rgba[i + 1] * a + bg[1] * (1 - a));
			out[i + 2] = Math.round(rgba[i + 2] * a + bg[2] * (1 - a));
			out[i + 3] = 255;
		}
	}
	return out;
}
const pad2 = (n) => String(n).padStart(2, "0");
const pad3 = (n) => String(n).padStart(3, "0");

// ---- fixtures (plan §2.2): board-only effect definitions, real primitives ----
const FIXTURES = [
	{
		id: "fixture_translucent_quads",
		frameCount: 12,
		layers: [
			{ id: "qA", kind: "quad", t0: 0, t1: 1, cx: 26, cy: 30, w: 30, h: 22, rot: 0.3, feather: 1.5, color: [0.9, 0.2, 0.2], alpha: 0.6, fade: [0.05, 0.05] },
			{ id: "qB", kind: "quad", t0: 0, t1: 1, cx: 40, cy: 38, w: 30, h: 22, rot: -0.25, feather: 1.5, color: [0.2, 0.4, 0.9], alpha: 0.6, fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_emissive_quads",
		frameCount: 12,
		layers: [
			{ id: "eA", kind: "quad", t0: 0, t1: 1, cx: 27, cy: 32, w: 26, h: 26, feather: 1.5, color: [0, 0, 0], alpha: 1, material: "emission", emission: [1, 0.7, 0.3], emissionStrength: 1.2, fade: [0.05, 0.05] },
			{ id: "eB", kind: "quad", t0: 0, t1: 1, cx: 38, cy: 32, w: 26, h: 26, feather: 1.5, color: [0, 0, 0], alpha: 1, material: "emission", emission: [1, 0.7, 0.3], emissionStrength: 1.2, fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_streak_velocity",
		frameCount: 12,
		layers: [
			// known velocity: 36 px/s design = 3 px per frame at fps 12
			{ id: "s", kind: "streak", t0: 0, t1: 1, x0: 6, y0: 32, vx: 36, vy: 0, width: 6, length: 14, stretch: 0.2, feather: 0.8, color: [1, 1, 0.8], alpha: 1, fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_arc_ring",
		frameCount: 12,
		layers: [
			{ id: "ring", kind: "arc", t0: 0, t1: 1, cx: 32, cy: 32, radius: 20, ang0: -3.1415927, ang1: 3.1415927, thick0: 5, thick1: 5, feather: 1, color: [0.6, 0.9, 1], alpha: 1, fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_gradient",
		frameCount: 12,
		layers: [
			// the renderer has no gradient primitive; a large-feather quad edge
			// is the actual smooth-ramp mechanism (documented, not invented)
			{ id: "ramp", kind: "quad", t0: 0, t1: 1, cx: 46, cy: 32, w: 48, h: 40, feather: 16, color: [1, 1, 1], alpha: 1, fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_subpixel_translation",
		frameCount: 12,
		layers: [
			// 1.2 px/s = 0.1 px/frame at fps 12: subpixel edge steps
			{ id: "drift", kind: "streak", t0: 0, t1: 1, x0: 10, y0: 32, vx: 1.2, vy: 0, width: 14, length: 14, stretch: 0, feather: 1.2, color: [1, 0.8, 0.3], alpha: 1, fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_timed_layers",
		frameCount: 12,
		layers: [
			// the renderer's real timing mechanism is sequential layer windows
			{ id: "e1", kind: "radial", t0: 0, t1: 0.25, cx: 14, cy: 32, r0: 0, r1: 7, feather: 1.2, color: [1, 0.5, 0.4], alpha: 1, fade: [0.1, 0.6] },
			{ id: "e2", kind: "radial", t0: 0.25, t1: 0.5, cx: 26, cy: 32, r0: 0, r1: 7, feather: 1.2, color: [1, 0.7, 0.3], alpha: 1, fade: [0.1, 0.6] },
			{ id: "e3", kind: "radial", t0: 0.5, t1: 0.75, cx: 38, cy: 32, r0: 0, r1: 7, feather: 1.2, color: [0.6, 0.9, 0.4], alpha: 1, fade: [0.1, 0.6] },
			{ id: "e4", kind: "radial", t0: 0.75, t1: 1, cx: 50, cy: 32, r0: 0, r1: 7, feather: 1.2, color: [0.5, 0.7, 1], alpha: 1, fade: [0.1, 0.6] },
		],
	},
];

// ---- targeted repair evidence fixtures (board-only; Astra verdict step 5) ----
FIXTURES.push(
	{
		id: "fixture_zero_emission",
		frameCount: 12,
		layers: [
			{ id: "z", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 40, h: 40, feather: 1, color: [0, 0, 0], alpha: 1, material: "emission", emission: [0, 0, 0], emissionStrength: 0, fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_weak_emission",
		frameCount: 12,
		layers: [
			{ id: "w", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 40, h: 40, feather: 1, color: [0, 0, 0], alpha: 1, material: "emission", emission: [0.1, 0.1, 0.1], emissionStrength: 1, fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_mixed_coverage",
		frameCount: 12,
		layers: [
			{ id: "n", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 10, h: 10, feather: 0.001, color: [0.5, 0, 0], alpha: 0.5, fade: [0.05, 0.05] },
			{ id: "e", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 10, h: 10, feather: 0.001, color: [0, 0, 0], alpha: 1, material: "emission", emission: [0, 0.25, 0], emissionStrength: 1, fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_texture_mask",
		frameCount: 12,
		layers: [
			{ id: "t", kind: "texture", t0: 0, t1: 1, cx: 32, cy: 32, w: 64, h: 64, feather: 0.5, color: [1, 1, 1], alpha: 1, colorSpace: "srgb", texW: 3, texH: 1, tex: [255, 255, 255, 255, 128, 128, 128, 255, 0, 0, 0, 0], fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_area_fractional",
		frameCount: 12,
		layers: [
			{ id: "half", kind: "quad", t0: 0, t1: 1, cx: 16.5, cy: 32, w: 32, h: 40, feather: 0.001, color: [0, 0, 0], alpha: 1, material: "emission", emission: [1, 0, 0], emissionStrength: 1, fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_growth_puff",
		frameCount: 12,
		layers: [
			{ id: "p", kind: "puff", t0: 0, t1: 1, cx: 32, cy: 32, r: 10, lobes: 3, amp: 0, phase: 0, feather: 0.5, color: [1, 0, 0], alpha: 1, grow: [1, 3], fade: [0.001, 0.001] },
		],
	},
	{
		id: "fixture_growth_radial",
		frameCount: 12,
		layers: [
			{ id: "g", kind: "radial", t0: 0, t1: 1, cx: 32, cy: 32, r0: 0, r1: 10, feather: 0.5, color: [1, 0, 0], alpha: 1, grow: [1, 3], fade: [0.001, 0.001] },
		],
	},
	// ---- Astra rereview R1/R3 evidence fixtures (board-only) ----
	{
		id: "fixture_texture_channel",
		frameCount: 12,
		layers: [
			{ id: "c", kind: "texture", t0: 0, t1: 1, cx: 32, cy: 32, w: 64, h: 64, feather: 0.5, color: [1, 1, 1], alpha: 1, colorSpace: "srgb", maskChannel: "r", texW: 1, texH: 1, tex: [128, 0, 0, 255], fade: [0.05, 0.05] },
		],
	},
	{
		id: "fixture_texture_streak",
		frameCount: 12,
		layers: [
			{ id: "s", kind: "texture", t0: 0, t1: 1, x0: 16, y0: 32, vx: 32, vy: 0, length: 16, width: 12, stretch: 0.5, feather: 0.5, color: [1, 1, 1], alpha: 1, colorSpace: "srgb", texW: 2, texH: 1, tex: [255, 0, 0, 255, 0, 0, 255, 255], fade: [0.05, 0.05] },
		],
	},
);

// default camera (zoom 1, no pan) taken from the real sanitizer defaults
const baseParams = sanitizeParams({
	effectId: QUALITY_PRESETS[0].id,
	seed: SEED,
	width: W,
	height: H,
	fps: FPS,
	pixelScale: 1,
	paletteSize: 16,
	dither: "none",
	recolor: "none",
	outline: false,
}).params;
const camera = baseParams.camera;

function boardsFor(tag, fx, params) {
	const st = renderQualityStages(fx, params, { keepStages: true });
	const n = st.final.length;
	const firstActive = st.unthresholded.findIndex((f) => {
		for (let i = 3; i < f.length; i += 4) if (f[i] > 0) return true;
		return false;
	});
	const mid = Math.floor((n - 1) / 2);
	const picked = [...new Set([firstActive < 0 ? 0 : firstActive, mid, n - 1])].sort(
		(a, b) => a - b,
	);
	manifest.push(
		`effect=${tag} geometryVariant=${st.geometryVariant} frameCount=${n} firstActive=${firstActive} picked=${picked.join(",")} seed=${params.seed} fps=${params.fps} width=${params.width} height=${params.height} alphaThreshold=${params.alphaThreshold} recolor=${params.recolor} paletteSize=${params.paletteSize} dither=${params.dither} outline=${params.outline}`,
	);
	const dir = join(outDir, tag);
	const boardCells = [];
	for (const i of picked) {
		const u = st.unthresholded[i];
		const p = st.policyApplied[i];
		const fin = st.final[i];
		const n3 = pad3(i);
		savePng(join(tag, `frame-${n3}-s1-unthresholded-softalpha.png`), u);
		savePng(join(tag, `frame-${n3}-s1-unthresholded-softalpha-on-black.png`), compositeOnBackground(u, BG_BLACK));
		savePng(join(tag, `frame-${n3}-s1-unthresholded-softalpha-on-gray.png`), compositeOnBackground(u, BG_GRAY));
		savePng(join(tag, `frame-${n3}-s1-unthresholded-softalpha-on-light.png`), compositeOnBackground(u, BG_LIGHT));
		savePng(join(tag, `frame-${n3}-s2-policy-threshold-recolor.png`), p);
		savePng(join(tag, `frame-${n3}-s2-policy-threshold-recolor-on-black.png`), compositeOnBackground(p, BG_BLACK));
		savePng(join(tag, `frame-${n3}-s3-final-indexed.png`), fin);
		savePng(join(tag, `frame-${n3}-s3-final-indexed-on-black.png`), compositeOnBackground(fin, BG_BLACK));
		savePng(join(tag, `frame-${n3}-s3-final-indexed-on-gray.png`), compositeOnBackground(fin, BG_GRAY));
		savePng(join(tag, `frame-${n3}-s3-final-indexed-on-light.png`), compositeOnBackground(fin, BG_LIGHT));
		savePng(join(tag, `frame-${n3}-s3-final-indexed-on-checker.png`), checker(fin));
		// board cell order (frame-major): s1 on black/gray/light (multi-
		// background diagnostic), s2 on black, s3 on black/gray/light/checker
		boardCells.push(
			compositeOnBackground(u, BG_BLACK),
			compositeOnBackground(u, BG_GRAY),
			compositeOnBackground(u, BG_LIGHT),
			compositeOnBackground(p, BG_BLACK),
			compositeOnBackground(fin, BG_BLACK),
			compositeOnBackground(fin, BG_GRAY),
			compositeOnBackground(fin, BG_LIGHT),
			checker(fin),
		);
	}
	const board = buildSheet(boardCells, CELL, CELL);
	const babs = join(dir, "board.png");
	writeFileSync(babs, encodePNG(board.rgba, board.width, board.height));
	record(babs);
	manifest.push(
		`board=${tag}/board.png cells=${boardCells.length} layout=${board.layout.cols}x${board.layout.rows} cellOrder=frame-major[s1-on-black,s1-on-gray,s1-on-light,s2-on-black,s3-on-black,s3-on-gray,s3-on-light,s3-on-checker]`,
	);
}

// ---- presets (preliminary definitions; NOT an M3 visual pass) ----
for (const preset of QUALITY_PRESETS) {
	if (only && !`preset-${preset.id}`.includes(only)) continue;
	const { params, messages } = sanitizeParams({
		effectId: preset.id,
		seed: SEED,
		width: W,
		height: H,
		fps: FPS,
		pixelScale: 1,
		paletteSize: 16,
		dither: "none",
		recolor: "none",
		outline: false,
	});
	manifest.push(`sanitize_messages=${preset.id} [${messages.join("; ")}]`);
	boardsFor(`preset-${preset.id}`, params.effect, params);
}
// ---- fixtures (board-only; plan §2.2) ----
for (const fx of FIXTURES) {
	if (only && !fx.id.includes(only)) continue;
	const params = {
		...baseParams,
		frameCount: fx.frameCount,
		effect: { id: fx.id, kind: "quality", duration: fx.frameCount / FPS, layers: fx.layers },
	};
	boardsFor(fx.id, params.effect, params);
}

// ---- small intermediate oracles: actual linear/coverage data vs
// ---- independent literal expectations (Astra verdict step 5) ----
const ORACLES = [
	{ tag: "fixture_zero_emission", frame: 6, px: 32, py: 32, bg: [0, 0, 0], expected: { ebar: [0, 0, 0], abar: 0, ae: 0, as: 0, sprite: [0, 0, 0, 0], baked: [0, 0, 0, 255] } },
	{ tag: "fixture_weak_emission", frame: 6, px: 32, py: 32, bg: [0, 0, 0], expected: { ebar: [0.1, 0.1, 0.1], abar: 0, ae: 0.125839678, as: 0.125839678, sprite: [255, 255, 255, 32], baked: [99, 99, 99, 255] } },
	{ tag: "fixture_mixed_coverage", frame: 6, px: 32, py: 32, bg: [128, 128, 128], expected: { cbar: [0.25, 0, 0], ebar: [0, 0.25, 0], abar: 0.5, ae: 0.374110953, as: 0.5, sprite: [224, 224, 0, 128], baked: [188, 188, 105, 255] } },
	{ tag: "fixture_texture_mask", frame: 6, px: 32, py: 32, bg: [0, 0, 0], expected: { cbar: [0.21080127, 0.21080127, 0.21080127], abar: 0.9765625, as: 0.9765625, sprite: [154, 154, 154, 249], baked: [153, 153, 153, 255] } },
	// R1 channel mask: linear scalar 128/255, color decoded independently:
	// cbar = D(128/255)*128/255 = .108353506, abar = as = .501960784,
	// sprite [144,0,0,128], baked-black S(T(.108353506)) = 105.
	{ tag: "fixture_texture_channel", frame: 6, px: 32, py: 32, bg: [0, 0, 0], expected: { cbar: [0.108353506, 0, 0], abar: 0.501960784, as: 0.501960784, sprite: [144, 0, 0, 128], baked: [105, 0, 0, 255] } },
	{ tag: "fixture_area_fractional", frame: 6, px: 32, py: 32, bg: [0, 0, 0], expected: { ebar: [0.5, 0, 0], abar: 0, ae: 0.616306954, as: 0.616306954, sprite: [255, 0, 0, 157], baked: [206, 0, 0, 255] } },
	{ tag: "fixture_growth_puff", frame: 6, px: 50, py: 32, bg: [0, 0, 0], expected: { cbar: [1, 0, 0], abar: 1, as: 1, sprite: [232, 0, 0, 255], baked: [232, 0, 0, 255] } },
	{ tag: "fixture_growth_radial", frame: 6, px: 50, py: 32, bg: [0, 0, 0], expected: { cbar: [1, 0, 0], abar: 1, as: 1, sprite: [232, 0, 0, 255], baked: [232, 0, 0, 255] } },
];
let oracleFail = false;
// Analytic oracle geometry is FIXED at 64x64 and deliberately independent of
// BOARD_SIZE: visual boards may render at 16 for the LOD packet, while every
// expectation below (pixel coordinates + literals) is baked on the 64 grid and
// is never re-derived or weakened for any board size.
const ORACLE_W = 64;
const ORACLE_H = 64;
const pxAtFixed = (buf, x, y) => {
	const i = (y * ORACLE_W + x) * 4;
	return [buf[i], buf[i + 1], buf[i + 2], buf[i + 3]];
};
const near = (a, b) => Math.abs(a - b) <= 1e-6;
const pxAt = (buf, x, y) => {
	const i = (y * W + x) * 4;
	return [buf[i], buf[i + 1], buf[i + 2], buf[i + 3]];
};
for (const o of ORACLES) {
	const def = FIXTURES.find((f) => f.id === o.tag);
	if (!def) {
		manifest.push(`oracle=${o.tag} status=MISSING_FIXTURE`);
		oracleFail = true;
		continue;
	}
	const fx = { id: def.id, kind: "quality", duration: def.frameCount / FPS, layers: def.layers };
	const res = renderQualityFrame(fx, o.frame / FPS, SEED, camera, ORACLE_W, ORACLE_H, {
		stages: true,
		samplePixel: { x: o.px, y: o.py },
		bakedBackground: o.bg,
	});
	const smp = res.stages?.sampled;
	const sprite = pxAtFixed(res.rgba, o.px, o.py);
	const baked = pxAtFixed(res.baked, o.px, o.py);
	let ok = typeof smp === "object";
	const checks = [];
	const chk = (name, cond) => {
		checks.push(`${name}=${cond ? "ok" : "BAD"}`);
		if (!cond) ok = false;
	};
	const eqArr = (a, b) => Array.isArray(a) && a.length === b.length && a.every((v, i) => near(v, b[i]));
	if (o.expected.ebar) chk("ebar", eqArr(smp?.ebar, o.expected.ebar));
	if (o.expected.cbar) chk("cbar", eqArr(smp?.cbar, o.expected.cbar));
	if (o.expected.abar !== undefined) chk("abar", !!smp && near(smp.abar, o.expected.abar));
	if (o.expected.ae !== undefined) chk("ae", !!smp && near(smp.ae, o.expected.ae));
	if (o.expected.as !== undefined) chk("as", !!smp && near(smp.as, o.expected.as));
	chk("sprite", sprite.every((v, i) => v === o.expected.sprite[i]));
	chk("baked", baked.every((v, i) => v === o.expected.baked[i]));
	manifest.push(
		`oracle=${o.tag} frame=${o.frame} px=${o.px},${o.py} bg=${o.bg} expected=${JSON.stringify(o.expected)} actual=${JSON.stringify({ cbar: smp?.cbar, ebar: smp?.ebar, abar: smp?.abar, ae: smp?.ae, as: smp?.as, sprite, baked })} checks=${checks.join(",")} status=${ok ? "PASS" : "FAIL"}`,
	);
	if (!ok) oracleFail = true;
}

manifest.push(
	`oracle_geometry=64x64-fixed independent_of_BOARD_SIZE=true visual_board=${W}x${H} oracle_count=${ORACLES.length}`,
);

// ---- manifest ----
const inputs = [
	"src/pipeline.js",
	"src/quality-render.js",
	"src/quality-effects.js",
	"scripts/render-quality-boards.mjs",
];
manifest.unshift(
	`generated_utc=${new Date().toISOString()}`,
	`host=${process.platform}-${process.arch} bun=${Bun.version}`,
	`command=bun scripts/render-quality-boards.mjs ${process.argv[2]}${process.argv[3] ? ` ${process.argv[3]}` : ""}`,
	"stage_definitions=01 unthresholded(renderQualityFrame, soft alpha) | 02 policy(alphaThreshold+recolor) | 03 final(sequence palette quantize, byte-identical to export)",
	"composites=presentation only over #000000,#808080,#f0f0f0,checker(8px #ffffff/#c0c0c0); compositing is not a pipeline stage",
	"preset_status=five preset definitions are preliminary; boards are NOT an M3 visual pass",
	"fixtures=board renderings of plan §2.2 analytic fixtures; not registered presets",
	`camera=zoom:${camera?.zoom} panX:${camera?.panX} panY:${camera?.panY}`,
);
for (const rel of inputs) {
	const abs = join(ROOT, rel);
	manifest.push(`input=${rel} sha256=${sha256(readFileSync(abs))}`);
}
manifest.push(`file_count=${files.length}`);
for (const f of files.sort((a, b) => a.rel.localeCompare(b.rel))) {
	manifest.push(`file=${f.rel} bytes=${f.bytes} sha256=${f.sha256}`);
}
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "manifest.txt"), manifest.join("\n") + "\n");
console.log(`OK files=${files.length} out=${outDir}`);
console.log(`oracles=${ORACLES.length} ${oracleFail ? "FAIL" : "PASS"}`);
if (oracleFail) process.exit(1);
