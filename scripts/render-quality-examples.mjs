#!/usr/bin/env bun
// M3 quality-example renders — one effect per invocation, sizes default to
// 64,32,16. Frames/clip come from buildSequence/exportGif (the same code the
// editor exports use); sheet uses the same buildSheet helper exportSheet uses.
// Writes examples/quality/out/<effectId>/<size>/ plus the cumulative
// examples/quality/manifest.json with per-size receipts (frame rule, palette,
// active interval, peak bbox diagnostic, file hashes).
//
// Usage: bun scripts/render-quality-examples.mjs <effectId> [sizes=64,32,16]
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
	sanitizeParams,
	buildSequence,
	exportGif,
} from "../src/pipeline.js";
import { compositeOnBackground } from "../src/quality-render.js";
import { encodePNG } from "../src/pngenc.js";
import { buildSheet } from "../src/sheet.js";
import { QUALITY_PRESETS } from "../src/quality-effects.js";
import {
	impactEarlyLumaOk,
	slashRevealCheck,
	durationLabels,
	transparentFinalRequired,
	loopSeamEvidence,
} from "./evidence-gates.mjs";
import { parseGif } from "./gif-blocks.mjs";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const effectId = process.argv[2];
const sizeArg = process.argv[3] || "64,32,16";
// optional output subdir (revision packets render beside, never over, the
// initial packet): bun scripts/render-quality-examples.mjs <id> [sizes] [outName]
const outName = process.argv[4] || effectId;
const sizes = sizeArg.split(",").map((s) => Number(s.trim()));
if (!effectId || sizes.some((s) => !Number.isInteger(s) || s <= 0)) {
	console.error(
		"usage: bun scripts/render-quality-examples.mjs <effectId> [sizes=64,32,16]",
	);
	process.exit(2);
}
const preset = QUALITY_PRESETS.find((p) => p.id === effectId);
if (!preset) {
	console.error(
		`error: unknown quality effect '${effectId}' (known: ${QUALITY_PRESETS.map((p) => p.id).join(", ")})`,
	);
	process.exit(2);
}
const SEED = "42";
const FPS = 12;
const durLabels = durationLabels(preset, FPS);
const BGS = {
	black: [0, 0, 0],
	gray: [128, 128, 128],
	light: [240, 240, 240],
};
const pad2 = (n) => String(n).padStart(2, "0");
const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const rel = (abs) => abs.slice(ROOT.length + 1).replaceAll("\\", "/");

function upscaleNN(rgba, w, h, k) {
	const out = new Uint8ClampedArray(w * k * h * k * 4);
	for (let y = 0; y < h * k; y++) {
		const sy = Math.floor(y / k);
		for (let x = 0; x < w * k; x++) {
			const sx = Math.floor(x / k);
			const si = (sy * w + sx) * 4;
			const di = (y * w * k + x) * 4;
			out[di] = rgba[si];
			out[di + 1] = rgba[si + 1];
			out[di + 2] = rgba[si + 2];
			out[di + 3] = rgba[si + 3];
		}
	}
	return { rgba: out, width: w * k, height: h * k };
}

function frameStats(rgba, w, h) {
	let count = 0;
	let x0 = w,
		y0 = h,
		x1 = -1,
		y1 = -1;
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			if (rgba[(y * w + x) * 4 + 3] > 0) {
				count++;
				if (x < x0) x0 = x;
				if (y < y0) y0 = y;
				if (x > x1) x1 = x;
				if (y > y1) y1 = y;
			}
		}
	}
	return {
		nonZero: count,
		bbox: x1 < 0 ? null : { x0, y0, x1, y1 },
	};
}

// Sum of straight-alpha bytes = coverage energy (expansion diagnostic).
function alphaSum(rgba) {
	let s = 0;
	for (let i = 3; i < rgba.length; i += 4) s += rgba[i];
	return s;
}
// Brief peak = brightest moment: alpha-weighted Rec.709 luminance of the
// straight RGBA frame (what a viewer sees as the flash).
function lumaEnergy(rgba) {
	let s = 0;
	for (let i = 0; i < rgba.length; i += 4) {
		const a = rgba[i + 3];
		if (!a) continue;
		s += (0.2126 * rgba[i] + 0.7152 * rgba[i + 1] + 0.0722 * rgba[i + 2]) * a;
	}
	return s;
}
// Brief color budgets: 64/32 native <=16 used colors; 16px authored LOD 6-10.
const colorsBudgetOk = (size, used) =>
	size === 16 ? used >= 6 && used <= 10 : used <= 16;

const expectedFrames = Math.ceil(preset.duration * FPS);
const outRoot = join(ROOT, "examples", "quality", "out", outName);
const sizeReports = [];
const peakBySize = {};
let failed = false;

for (const S of sizes) {
	const { params, messages } = sanitizeParams({
		effectId,
		seed: SEED,
		width: S,
		height: S,
		fps: FPS,
		pixelScale: 1,
		paletteSize: S === 16 ? 8 : 16, // authored LOD16: smaller palette (budget 6-10 used colors)
		dither: "none",
		recolor: "none",
		outline: false,
	});
	const seq = buildSequence(params);
	console.log(
		`RECEIPT full ${effectId} ${S}px geometryVariant=${seq.geometryVariant} dims=${params.width}x${params.height} seed=${params.seed} source=${sha(readFileSync(join(ROOT, "src/quality-effects.js")))}`,
	);
	const dir = join(outRoot, String(S));
	mkdirSync(dir, { recursive: true });
	const files = [];
	const save = (name, buf) => {
		writeFileSync(join(dir, name), buf);
		files.push({ rel: rel(join(dir, name)), sha256: sha(buf), bytes: buf.length });
		return buf;
	};

	if (seq.frameCount !== expectedFrames) {
		console.error(
			`error: ${S}px frameCount=${seq.frameCount}, expected ${expectedFrames} (ceil(${preset.duration}*${FPS}))`,
		);
		failed = true;
	}

	const stats = [];
	const alphaSums = [];
	const lumaSums = [];
	const usedColors = new Set();
	for (let i = 0; i < seq.frameCount; i++) {
		const f = seq.frames[i];
		stats.push(frameStats(f, S, S));
		alphaSums.push(alphaSum(f));
		lumaSums.push(lumaEnergy(f));
		for (let p = 0; p < f.length; p += 4) {
			if (f[p + 3] > 0) usedColors.add(`${f[p]},${f[p + 1]},${f[p + 2]}`);
		}
		save(`frame-${pad2(i)}.png`, encodePNG(f, S, S));
		for (const [bgName, bg] of Object.entries(BGS)) {
			const comp = compositeOnBackground(f, bg);
			save(`frame-${pad2(i)}-on-${bgName}.png`, encodePNG(comp, S, S));
			// packet: native AND 8x on every background, all ordered frames
			const up = upscaleNN(comp, S, S, 8);
			save(`frame-${pad2(i)}-8x-on-${bgName}.png`, encodePNG(up.rgba, up.width, up.height));
		}
	}
	const active = stats.map((s, i) => (s.nonZero > 0 ? i : -1)).filter((i) => i >= 0);
	const firstActive = active.length ? active[0] : -1;
	const lastActive = active.length ? active[active.length - 1] : -1;
	let peakFrame = 0;
	for (let i = 1; i < stats.length; i++) {
		if (stats[i].nonZero > stats[peakFrame].nonZero) peakFrame = i;
	}
	if (!active.length) {
		console.error(`error: ${S}px produced no active frames`);
		failed = true;
	}
	const peak = stats[peakFrame];
	const peakBboxPct = peak.bbox
		? (Math.max(peak.bbox.x1 - peak.bbox.x0 + 1, peak.bbox.y1 - peak.bbox.y0 + 1) / S) * 100
		: 0;

	// Brief peak = brightest moment = alpha-weighted luminance, required
	// within frames 0-2 (first 0.17s at 12fps). Total-alpha (coverage) and
	// extent (non-zero pixels) peaks are reported as expansion diagnostics —
	// an expanding ring inherently maxes coverage/extent later while the
	// flash has already decayed; the brief's peak is brightness.
	let lumaPeakFrame = 0;
	for (let i = 1; i < lumaSums.length; i++) {
		if (lumaSums[i] > lumaSums[lumaPeakFrame]) lumaPeakFrame = i;
	}
	let energyPeakFrame = 0;
	for (let i = 1; i < alphaSums.length; i++) {
		if (alphaSums[i] > alphaSums[energyPeakFrame]) energyPeakFrame = i;
	}
	// Astra slash R1: the early-luma gate belongs to quality_impact's brief
	// ONLY; for other effects the luminance peak is a diagnostic. Slash
	// reveal is checked from source layer times once, after all sizes.
	if (effectId === "quality_impact" && !impactEarlyLumaOk(lumaPeakFrame)) {
		console.error(
			`error: ${S}px luminance peak at frame ${lumaPeakFrame} (${lumaPeakFrame / FPS}s) outside the impact brief's first-0.17s window`,
		);
		failed = true;
	}
	const lastIdx = seq.frameCount - 1;
	// Final-frame transparency is ONE-SHOT acceptance only; loop effects keep
	// an opaque last frame by design (shared rule from evidence-gates).
	if (transparentFinalRequired(preset) && stats[lastIdx].nonZero > 0) {
		console.error(
			`error: ${S}px still visible on the last sample t=${lastIdx / FPS}s (fade must reach transparent there)`,
		);
		failed = true;
	}
	// Loop seam evidence (flame): seam vs the ACTUAL regular consecutive
	// transitions — never first==last, never a seam-zero acceptance; the
	// bodyStatic flag is disclosed for the visual reviewer (no threshold).
	let loopSeam = null;
	if (preset.loop) {
		loopSeam = loopSeamEvidence(seq.frames);
		if (!loopSeam.seamWithinRegularRange) {
			console.error(
				`error: ${S}px loop seam delta ${loopSeam.seamDelta.toFixed(4)} exceeds regular transition max ${loopSeam.regularMax.toFixed(4)}`,
			);
			failed = true;
		} else {
			console.log(
				`OK ${S}px loop seam ${loopSeam.seamDelta.toFixed(4)} within regular range max=${loopSeam.regularMax.toFixed(4)} bodyStatic=${loopSeam.bodyStatic} (disclosure, not approval)`,
			);
		}
	}
	const budget = {
		required: S === 16 ? "6-10 used colors (authored LOD16)" : "<=16 used colors",
		usedColors: usedColors.size,
		paletteColors: seq.palette.length / 3,
		ok: colorsBudgetOk(S, usedColors.size),
	};
	if (!budget.ok) {
		console.error(`error: ${S}px used colors ${usedColors.size} violates budget ${budget.required}`);
		failed = true;
	}

	// 1:1 contact sheet of the sequence (same builder exportSheet uses)
	const sheet = buildSheet(seq.frames, S, S);
	save("sheet.png", encodePNG(sheet.rgba, sheet.width, sheet.height));
	const sheet8 = upscaleNN(sheet.rgba, sheet.width, sheet.height, 8);
	save("sheet-8x.png", encodePNG(sheet8.rgba, sheet8.width, sheet8.height));

	// full-speed clip through the real export GIF path
	const gif = exportGif(params);
	save("clip.gif", gif.bytes);
	// Independent block-aware decode of the bytes just written: declared
	// boundary schedule must equal the ENCODED delays, images, loop, total.
	const parsed = parseGif(Buffer.from(gif.bytes), "clip.gif");
	const declaredDelaysCs = Array.from({ length: seq.frameCount }, (_, i) =>
		Math.round(((i + 1) * 100) / FPS) - Math.round((i * 100) / FPS),
	);
	const declaredTotalCs = declaredDelaysCs.reduce((a, b) => a + b, 0);
	const declaredTotalMs = declaredTotalCs * 10;
	const schedule = {
		rule: "boundary-rounded: delays[i]=round((i+1)*100/fps)-round(i*100/fps)",
		fps: FPS,
		declaredDelaysCs,
		declaredTotalCs,
		declaredTotalMs,
		nominalMs: Math.round((seq.frameCount / FPS) * 1000),
		gifImages: parsed.images,
		gifDelaysCs: parsed.delays,
		gifTotalMs: parsed.delays.reduce((a, b) => a + b, 0) * 10,
		gifLoop: parsed.loop,
		gifLoopLabel: durLabels.gifLoopLabel,
	};
	schedule.verified =
		JSON.stringify(parsed.delays) === JSON.stringify(declaredDelaysCs) &&
		parsed.images === seq.frameCount &&
		parsed.loop === 0 &&
		declaredTotalMs === Math.round((seq.frameCount / FPS) * 1000);
	if (!schedule.verified) {
		console.error(
			`error: ${S}px encoded schedule mismatch declared=${JSON.stringify(declaredDelaysCs)} gif=${JSON.stringify(parsed.delays)} images=${parsed.images} loop=${parsed.loop}`,
		);
		failed = true;
	}

	// Primary-only pass (brief: primary readable with accents off): drop
	// layers tagged role="accent"; same buildSequence/export code path.
	let primary = null;
	if (preset.roles?.accents?.length) {
		const primaryFx = { ...preset, layers: preset.layers.filter((l) => l.role !== "accent") };
		const pSeq = buildSequence({ ...params, effect: primaryFx });
		console.log(
			`RECEIPT primary ${effectId} ${S}px geometryVariant=${pSeq.geometryVariant} dims=${params.width}x${params.height} seed=${params.seed} source=${sha(readFileSync(join(ROOT, "src/quality-effects.js")))}`,
		);
		const pStats = [];
		let pFiles = 0;
		for (let i = 0; i < pSeq.frameCount; i++) {
			const f = pSeq.frames[i];
			pStats.push(frameStats(f, S, S));
			save(`primary-frame-${pad2(i)}.png`, encodePNG(f, S, S));
			pFiles++;
			for (const [bgName, bg] of Object.entries(BGS)) {
				save(`primary-frame-${pad2(i)}-on-${bgName}.png`, encodePNG(compositeOnBackground(f, bg), S, S));
				pFiles++;
			}
		}
		let pPeak = 0;
		for (let i = 1; i < pStats.length; i++) {
			if (pStats[i].nonZero > pStats[pPeak].nonZero) pPeak = i;
		}
		const pSheet = buildSheet(pSeq.frames, S, S);
		save("primary-sheet.png", encodePNG(pSheet.rgba, pSheet.width, pSheet.height));
		pFiles++;
		const pActive = pStats.filter((s) => s.nonZero > 0).length;
		if (pActive === 0) {
			console.error(`error: ${S}px primary-only (accents off) produced no pixels`);
			failed = true;
		}
		primary = {
			layers: primaryFx.layers.map((l) => l.id),
			geometryVariant: pSeq.geometryVariant,
			activeFrames: pActive,
			peakFrame: pPeak,
			peakNonZeroPixels: pStats[pPeak].nonZero,
			peakBbox: pStats[pPeak].bbox,
			files: pFiles,
			readable: pActive > 0,
		};
	}

	peakBySize[S] = {
		occupied: {
			rgba: compositeOnBackground(seq.frames[peakFrame], BGS.black),
			frame: peakFrame,
		},
		brightness: {
			rgba: compositeOnBackground(seq.frames[lumaPeakFrame], BGS.black),
			frame: lumaPeakFrame,
		},
	};
	sizeReports.push({
		size: S,
		frameCount: seq.frameCount,
		geometryVariant: seq.geometryVariant,
		expectedFrameCount: expectedFrames,
		paletteColors: seq.palette.length / 3,
		firstActiveFrame: firstActive,
		lastActiveFrame: lastActive,
		activeIntervalSeconds:
			firstActive >= 0
				? [firstActive / FPS, lastActive / FPS]
				: null,
		peakFrame,
		peakNonZeroPixels: peak.nonZero,
		peakBbox: peak.bbox,
		peakBboxPctOfCell: Math.round(peakBboxPct * 10) / 10,
		peakDefinition:
			effectId === "quality_impact"
				? "impact brief peak = alpha-weighted luminance peak (brightness), enforced within frames 0-2 via impactEarlyLuma; energyPeakFrame (total alpha) and peakFrame (occupied max nonzero) reported as diagnostics"
				: "no early-luminance gate for this effect: luminance/energy/occupied peak fields are diagnostics only; acceptance timing comes from source-time gates (slashReveal for quality_slash), never from brightness",
		energyPeakFrame,
		energyPeakSeconds: energyPeakFrame / FPS,
		luminancePeakFrame: lumaPeakFrame,
		luminancePeakSeconds: lumaPeakFrame / FPS,
		impactEarlyLuma:
			effectId === "quality_impact"
				? { applies: true, peakFrame: lumaPeakFrame, ok: impactEarlyLumaOk(lumaPeakFrame) }
				: { applies: false, peakFrame: lumaPeakFrame, ok: null },
		transparentAtLastSample: stats[lastIdx].nonZero === 0,
		transparentFinalRequired: transparentFinalRequired(preset),
		lastSampleSeconds: lastIdx / FPS,
		loopSeam,
		pivot: {
			x: S / 2,
			y: S / 2,
			declaration: "effect anchor = canvas center (50% of cell); used for stage placement",
		},
		colorBudget: budget,
		frames: stats.map((s, i) => ({
			index: i,
			seconds: i / FPS,
			nonZero: s.nonZero,
			bbox: s.bbox,
			alphaSum: alphaSums[i],
			luminanceSum: lumaSums[i],
		})),
		schedule,
		primary,
		sanitizeMessages: messages,
		files,
	});
	console.log(
		`OK ${effectId} ${S}px frames=${seq.frameCount} colors=${seq.palette.length / 3} active=[${firstActive},${lastActive}] peak=f${peakFrame} bbox%=${Math.round(peakBboxPct * 10) / 10} files=${files.length} variant=${seq.geometryVariant}`,
	);
}

// Dual labelled comparison boards (Astra R1; R2 label correction): brightness
// peak and OCCUPIED-PIXEL peak (max nonzero count — not bbox dimensions)
// shown side by side per size, with frame indices DERIVED from this run —
// never hardcoded. Legacy board name kept for continuity.
const boardOf = (pick) => {
	const cells = sizes.map((S) => {
		const p = peakBySize[S];
		const rgba = pick(p);
		if (S === 64) return rgba;
		return upscaleNN(rgba, S, S, 64 / S).rgba;
	});
	return buildSheet(cells, 64, 64);
};
let compareBoards = null;
if (sizes.length > 1 && Object.keys(peakBySize).length === sizes.length) {
	const labelSize = sizes.includes(64) ? 64 : Math.max(...sizes);
	const brightF = peakBySize[labelSize].brightness.frame;
	const occF = peakBySize[labelSize].occupied.frame;
	const brightName = `compare-brightness-peak-f${String(brightF).padStart(2, "0")}-at-64.png`;
	const occName = `compare-occupied-peak-f${String(occF).padStart(2, "0")}-at-64.png`;
	const brightBoard = boardOf((p) => p.brightness.rgba);
	const occBoard = boardOf((p) => p.occupied.rgba);
	writeFileSync(join(outRoot, brightName), encodePNG(brightBoard.rgba, brightBoard.width, brightBoard.height));
	writeFileSync(join(outRoot, occName), encodePNG(occBoard.rgba, occBoard.width, occBoard.height));
	// legacy name = occupied-peak board (same bytes) so existing references resolve
	writeFileSync(join(outRoot, "compare-peak-at-64.png"), encodePNG(occBoard.rgba, occBoard.width, occBoard.height));
	compareBoards = {
		brightness: brightName,
		occupied: occName,
		legacy: "compare-peak-at-64.png (= occupied-pixel peak board)",
		labelSize,
		brightnessPeakFrame: brightF,
		occupiedPeakFrame: occF,
		labels:
			"brightness = alpha-weighted luminance peak; occupied = maximum nonzero-pixel count (occupied-pixel peak, NOT bbox dimensions) — indices derived per run, bbox% reported separately",
	};
	console.log(`OK compare boards ${brightName} ${occName}`);
}

// Slash R1 reveal gate: SOURCE times of primary (non-accent) layers only —
// latest activation + fade-in completion must fall within the 0.17s brief
// deadline (image refs via primarySupportFrame). Negative controls live in
// scripts/evidence-gate-selftest.mjs.
let slashReveal = null;
if (effectId === "quality_slash") {
	slashReveal = slashRevealCheck(
		preset.layers.filter((l) => l.role !== "accent"),
		FPS,
	);
	if (!slashReveal.completeByDeadline) {
		console.error(
			`error: slash primary support at ${slashReveal.latestPrimarySupportSeconds.toFixed(3)}s (frame ${slashReveal.primarySupportFrame}) beyond reveal deadline ${slashReveal.deadlineSeconds}s`,
		);
		failed = true;
	} else {
		console.log(
			`OK slash reveal check latestPrimarySupport=${slashReveal.latestPrimarySupportSeconds.toFixed(3)}s supportFrame=${slashReveal.primarySupportFrame} <= deadline ${slashReveal.deadlineSeconds}s`,
		);
	}
}

// cumulative manifest: replace this effect's entry, keep other effects intact
const manifestPath = join(ROOT, "examples", "quality", "manifest.json");
let manifest = {};
if (existsSync(manifestPath)) {
	try {
		manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
	} catch {
		console.error(`error: existing manifest is not valid JSON: ${manifestPath}`);
		process.exit(1);
	}
}
const inputs = [
	"src/quality-effects.js",
	"src/quality-render.js",
	"src/pipeline.js",
	"src/gifenc.js",
	"src/pngenc.js",
	"src/sheet.js",
	"scripts/render-quality-examples.mjs",
	"scripts/evidence-gates.mjs",
	"scripts/gif-blocks.mjs",
];
manifest[effectId] = {
	seed: SEED,
	fps: FPS,
	durationSeconds: preset.duration,
	loop: preset.loop,
	sampleRule: preset.loop
		? `loop: ${expectedFrames} samples at t=i/${FPS} cover ${(expectedFrames / FPS).toFixed(3)}s of the ${preset.duration.toFixed(2)}s period (endpoint t=${preset.duration} NOT sampled: no duplicate final frame; last-frame transparency not required); GIF loop=0 = exact periodic replay`
		: `one-shot: ceil(duration*fps)=${expectedFrames} samples at i/${FPS}; encoded duration count/${FPS}`,
	roles: preset.roles ?? null,
	delaySchedule: preset.delaySchedule ?? "scalar (legacy export default)",
	declaredEncodedTotalMs: Math.round((expectedFrames / FPS) * 1000),
	peakWindow:
		effectId === "quality_impact"
			? "impact gate: alpha-weighted luminance peak must fall in frames 0-2 (<=0.1667s at 12fps), enforced (exit 1 on violation); occupied-pixel peaks recorded as expansion diagnostics"
			: "luminance peak is diagnostic only for this effect (its brief has no early-peak gate); slash reveal is gated from source layer times (see slashReveal)",
	slashReveal,
	fadeRule: preset.loop
		? `loop: ${expectedFrames} samples t=0..${(expectedFrames - 1) / FPS}s; final frame stays opaque by design (loop semantics), seam last→first judged as a regular transition via loopSeam — endpoint transparency NOT required`
		: `fade must be transparent at the last sample t=${(expectedFrames - 1) / FPS}s`,
	lod: "native 64/32/16; 16px authored LOD renders at paletteSize=8 (budget 6-10 used colors), 32/64 at paletteSize=16 (<=16 used colors; actual counts in per-size colorBudget)",
	compareBoards,
	previewReplayLabel: durLabels.previewReplayLabel,
	inputs: Object.fromEntries(
		inputs.map((r) => [r, sha(readFileSync(join(ROOT, r)))]),
	),
	generatedUtc: new Date().toISOString(),
	sizes: sizeReports,
};
mkdirSync(join(ROOT, "examples", "quality"), { recursive: true });
writeFileSync(manifestPath, JSON.stringify(manifest, null, "\t") + "\n");
console.log(`OK manifest ${rel(manifestPath)}`);
process.exit(failed ? 1 : 0);
