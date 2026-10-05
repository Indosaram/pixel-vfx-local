#!/usr/bin/env bun
// Derive the 16x16 / 32x32 / 64x64 gallery cells from the verified native renders.
//
//   bun scripts/render-resolution-gifs.mjs              # all ten assets
//   bun scripts/render-resolution-gifs.mjs fire smoke   # subset
//
// Method: area/coverage-preserving box downsample of the native sheet cell, k = native
// cell / target cell (8/4/2 at 128, 12/6/3 at 192). Colour is averaged alpha-weighted so
// energy survives the reduction; GIF binary transparency marks a destination pixel
// visible when its contributing source block has ANY nonzero alpha (coverage rule), so a
// visible native pixel can never be dropped. Colour is quantised against a palette built
// from the native frames with the manifest's dither, and the result is re-encoded with the
// repo's own GIF/PNG encoders using the native GIF's delay and loop. Nothing is
// re-simulated: seeds, timing, framing and palette settings are inherited, so these cells
// are DERIVED, not re-renders; sparse particles read thicker at 16x16.
// Writes examples/out/<id>_<size>_{sheet.png,preview.gif,render.json}.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { encodeGIF, parseGIF } from "../src/gifenc.js";
import { medianCutPalette, nearestIndex, quantizeFrame } from "../src/pixel.js";
import { decodePNG, encodePNG } from "../src/pngenc.js";
import { buildSheet } from "../src/sheet.js";

const repoRoot = resolve(import.meta.dir, "..");
const manifest = JSON.parse(readFileSync(join(repoRoot, "examples", "manifest.json"), "utf8"));
const defaults = manifest.defaults ?? {
	width: 128,
	height: 128,
	frames: 25,
	fps: 12,
	palette: 16,
	dither: "bayer4",
	alphaThreshold: 0.28,
};
const SIZES = [16, 32, 64];
const outDir = join(repoRoot, "examples", "out");

const only = process.argv.slice(2);
const knownIds = manifest.examples.map((e) => e.id);
const unknownIds = only.filter((id) => !knownIds.includes(id));
if (unknownIds.length > 0) {
	console.error(`unknown example id(s): ${unknownIds.join(", ")}`);
	console.error(`valid ids: ${knownIds.join(", ")}`);
	process.exit(2);
}

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

function cellFrames(sheet, cellW, cellH, count) {
	const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
	const rows = Math.ceil(count / cols);
	if (sheet.width !== cols * cellW || sheet.height !== rows * cellH) {
		throw new Error(`native sheet is ${sheet.width}x${sheet.height}, expected ${cols * cellW}x${rows * cellH}`);
	}
	const frames = [];
	for (let i = 0; i < count; i++) {
		const cx = (i % cols) * cellW;
		const cy = Math.floor(i / cols) * cellH;
		const f = new Uint8ClampedArray(cellW * cellH * 4);
		for (let y = 0; y < cellH; y++) {
			const src = ((cy + y) * sheet.width + cx) * 4;
			f.set(sheet.rgba.subarray(src, src + cellW * 4), y * cellW * 4);
		}
		frames.push(f);
	}
	return { frames, cols, rows };
}

function downsample(src, srcW, k) {
	const dstW = srcW / k;
	const out = new Uint8ClampedArray(dstW * dstW * 4);
	for (let y = 0; y < dstW; y++) {
		for (let x = 0; x < dstW; x++) {
			let wr = 0, wg = 0, wb = 0, wa = 0, sa = 0;
			for (let j = 0; j < k; j++) {
				for (let i = 0; i < k; i++) {
					const si = (((y * k + j) * srcW) + (x * k + i)) * 4;
					const a = src[si + 3];
					sa += a;
					if (a > 0) {
						wr += src[si] * a;
						wg += src[si + 1] * a;
						wb += src[si + 2] * a;
						wa += a;
					}
				}
			}
			const di = (y * dstW + x) * 4;
			if (wa > 0) {
				out[di] = wr / wa;
				out[di + 1] = wg / wa;
				out[di + 2] = wb / wa;
			}
			// coverage rule: visible when any contributing source alpha is nonzero
			out[di + 3] = sa > 0 ? 255 : 0;
		}
	}
	return out;
}

let failed = 0;
let written = 0;

for (const ex of manifest.examples) {
	if (only.length > 0 && !only.includes(ex.id)) continue;
	const d = { ...defaults, ...(ex.render ?? {}) };
	const nativeW = d.width;
	const nativeH = d.height;
	if (nativeW !== nativeH) {
		console.error(`FAIL ${ex.id}: non-square native cell ${nativeW}x${nativeH}`);
		failed++;
		continue;
	}
	const sheetPath = join(outDir, `${ex.id}_sheet.png`);
	const gifPath = join(outDir, `${ex.id}_preview.gif`);
	try {
		const pngBytes = readFileSync(sheetPath);
		const gifBytes = readFileSync(gifPath);
		const sheet = decodePNG(pngBytes);
		const meta = parseGIF(gifBytes);
		if (!meta.ok) throw new Error(meta.error);
		if (meta.width !== nativeW || meta.height !== nativeH)
			throw new Error(`native gif is ${meta.width}x${meta.height}, manifest says ${nativeW}x${nativeH}`);
		if (meta.imageCount !== d.frames)
			throw new Error(`native gif has ${meta.imageCount} frames, manifest says ${d.frames}`);
		const delayCs = meta.delays[0];
		if (meta.delays.some((x) => x !== delayCs))
			throw new Error(`native gif has mixed frame delays: ${meta.delays.join(",")}`);

		const { frames: nativeFrames, cols, rows } = cellFrames(sheet, nativeW, nativeH, d.frames);
		const seqPalette = medianCutPalette(nativeFrames, d.palette);
		const actualColors = seqPalette.length / 3;
		const gifColors = Math.min(255, actualColors);
		const paddedEntries = 1 << Math.ceil(Math.log2(gifColors + 1));
		const gifPalette = new Uint8Array(paddedEntries * 3);
		gifPalette.set(seqPalette.subarray(0, gifColors * 3));
		const transIdx = paddedEntries - 1;
		const pmap = new Map();
		for (let i = 0; i < gifColors; i++) {
			pmap.set((seqPalette[i * 3] << 16) | (seqPalette[i * 3 + 1] << 8) | seqPalette[i * 3 + 2], i);
		}
		const cfg = JSON.parse(readFileSync(join(repoRoot, "examples", `${ex.id}.json`), "utf8"));

		for (const size of SIZES) {
			if (nativeW % size !== 0) throw new Error(`native ${nativeW} is not a multiple of ${size}`);
			const k = nativeW / size;
			const derived = nativeFrames.map((f) => downsample(f, nativeW, k));
			const indices = [];
			for (const f of derived) {
				quantizeFrame(f, seqPalette, d.dither, size);
				const idxBuf = new Uint8Array(size * size);
				for (let i = 0, j = 0; i < f.length; i += 4, j++) {
					if (f[i + 3] === 0) {
						idxBuf[j] = transIdx;
					} else {
						const key = (f[i] << 16) | (f[i + 1] << 8) | f[i + 2];
						idxBuf[j] = pmap.has(key)
							? pmap.get(key)
							: nearestIndex(seqPalette, f[i], f[i + 1], f[i + 2]);
					}
				}
				indices.push(idxBuf);
			}
			const name = `${ex.id}_${size}`;
			const sh = buildSheet(derived, size, size);
			writeFileSync(join(outDir, `${name}_sheet.png`), encodePNG(sh.rgba, sh.width, sh.height));
			writeFileSync(
				join(outDir, `${name}_preview.gif`),
				encodeGIF({
					width: size,
					height: size,
					frames: indices,
					palette: gifPalette,
					transparentIndex: transIdx,
					delayCs,
					loop: meta.loop ?? 0,
				}),
			);
			const receipt = {
				name,
				kind: ex.kind,
				motion: ex.motion,
				seed: cfg.system?.randomSeed ?? null,
				derivation: {
					method: "area/coverage-preserving box downsample of the native sheet cell",
					derived: true,
					factor: k,
					sourceSheet: `examples/out/${ex.id}_sheet.png`,
					sourceGif: `examples/out/${ex.id}_preview.gif`,
					sourceSheetSha256: sha256(pngBytes),
					sourceGifSha256: sha256(gifBytes),
					alphaWeightedColor: true,
					alphaThreshold: d.alphaThreshold,
					dither: d.dither,
					paletteColors: actualColors,
					nativeCell: { width: nativeW, height: nativeH },
					targetCell: { width: size, height: size },
					coverageRule:
						"destination pixel visible when its contributing source block has any nonzero alpha",
					cols,
					rows,
				},
				limitations: [
					"derived by area-preserving box downsample of the native render, not re-simulated",
					"binary GIF transparency plus alpha-weighted colour makes sparse particles read thicker at 16x16 than a native 16x16 render would",
				],
				timing: { frames: d.frames, delayCs, fps: d.fps },
				converted: true,
				unityPrefabs: false,
				rootTranslationIgnored: true,
			};
			writeFileSync(
				join(outDir, `${name}_render.json`),
				JSON.stringify(receipt, null, "\t") + "\n",
			);
			written++;
			console.log(`OK   ${name.padEnd(16)} ${size}x${size} from ${nativeW}px k=${k} frames=${d.frames} delay=${delayCs * 10}ms`);
		}
	} catch (err) {
		failed++;
		console.log(`FAIL ${ex.id} ${err.message}`);
	}
}

console.log(`\n${written}/30 derived cells written -> examples/out/`);
process.exit(failed === 0 && written === 30 ? 0 : 1);
