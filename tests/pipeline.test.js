import { expect, test } from "bun:test";
import { parseGIF } from "../src/gifenc.js";
import {
	buildSequence,
	exportAtlas,
	exportFrame,
	exportGif,
	exportSheet,
	goldenHashes,
	sanitizeParams,
} from "../src/pipeline.js";
import { parsePNG } from "../src/pngenc.js";

const BASE = {
	effectId: "ember_burst",
	seed: "777",
	width: 64,
	height: 64,
	fps: 12,
	pixelScale: 1,
	paletteSize: 16,
	dither: "bayer4",
	outline: false,
	recolor: "none",
	from: 0,
	to: 9999,
	alphaThreshold: 0.28,
	camera: { zoom: 1, panX: 0, panY: 0 },
	holds: null,
};

function bytesOf(frames) {
	let total = 0;
	for (const f of frames) total += f.length;
	const out = new Uint8Array(total);
	let o = 0;
	for (const f of frames) {
		out.set(f, o);
		o += f.length;
	}
	return out;
}

test("buildSequence is byte-deterministic across runs", () => {
	const a = buildSequence(BASE);
	const b = buildSequence(BASE);
	expect(a.frameCount).toBe(b.frameCount);
	expect(Array.from(a.palette)).toEqual(Array.from(b.palette));
	expect(Array.from(bytesOf(a.frames))).toEqual(Array.from(bytesOf(b.frames)));
});

test("different seed changes output", () => {
	const a = buildSequence(BASE);
	const b = buildSequence({ ...BASE, seed: "778" });
	expect(Array.from(a.frames[0])).not.toEqual(Array.from(b.frames[0]));
});

test("fps changes frame count (duration x fps)", () => {
	const a = buildSequence(BASE);
	expect(a.frameCount).toBe(Math.max(2, Math.ceil(1.0 * 12)));
	const b = buildSequence({ ...BASE, fps: 6 });
	expect(b.frameCount).toBe(Math.max(2, Math.ceil(1.0 * 6)));
});

test("resolution changes frame dimensions", () => {
	const a = buildSequence({ ...BASE, width: 48, height: 32 });
	expect(a.frames[0].length).toBe(48 * 32 * 4);
});

test("exportSheet dims follow grid and frame range", () => {
	const r = exportSheet({ ...BASE, from: 0, to: 4 });
	expect(r.cellCount).toBe(5);
	const cols = Math.ceil(Math.sqrt(5));
	expect(r.width).toBe(cols * 64);
	const png = parsePNG(r.bytes);
	expect(png.ok).toBe(true);
	expect(png.width).toBe(r.width);
	expect(png.height).toBe(r.height);
});

test("exportSheet honors holds expansion", () => {
	const seq = buildSequence(BASE);
	const holds = seq.params.holds.slice();
	holds[0] = 3;
	holds[1] = 0;
	const r = exportSheet({ ...BASE, holds, from: 0, to: 2 });
	expect(r.cellCount).toBe(4);
	expect(r.sourceFrames).toEqual([0, 0, 0, 2]);
});

test("exportGIF structure: frames, delays, transparency, loop", () => {
	const r = exportGif({ ...BASE, from: 0, to: 5 });
	const parsed = parseGIF(r.bytes);
	expect(parsed.ok).toBe(true);
	expect(parsed.width).toBe(64);
	expect(parsed.height).toBe(64);
	expect(parsed.imageCount).toBe(r.cellCount);
	expect(parsed.cellCount).toBeUndefined();
	expect(parsed.delays.every((d) => d === r.delayCs)).toBe(true);
	expect(r.delayCs).toBe(Math.max(2, Math.round(100 / 12)));
	expect(parsed.totalDelay).toBe((r.cellCount * r.delayCs * 10) / 10);
	expect(parsed.loop).toBe(0);
	expect(parsed.transparents[0]).not.toBeNull();
});

test("exportGIF duration scales with fps", () => {
	const r12 = exportGif({ ...BASE, fps: 12 });
	const r10 = exportGif({ ...BASE, fps: 10 });
	expect(r12.delayCs).toBe(8);
	expect(r10.delayCs).toBe(10);
	expect(r10.cellCount).toBeLessThan(r12.cellCount);
});

test("repeated export of same seed is byte-identical", () => {
	const a = exportGIFSafe();
	const b = exportGIFSafe();
	expect(Array.from(a)).toEqual(Array.from(b));
});

function exportGIFSafe() {
	return exportGif(BASE).bytes;
}

test("exportFrame returns single frame PNG", () => {
	const r = exportFrame(BASE, 3);
	expect(r.width).toBe(64);
	expect(r.height).toBe(64);
	expect(r.frameIndex).toBe(3);
	const png = parsePNG(r.bytes);
	expect(png.ok).toBe(true);
	expect(png.width).toBe(64);
});

test("exportAtlas is valid JSON with all frames", () => {
	const r = exportAtlas({ ...BASE, from: 0, to: 4 });
	const doc = JSON.parse(new TextDecoder().decode(r.bytes));
	expect(Object.keys(doc.frames).length).toBe(5);
	expect(doc.meta.effect).toBe("ember_burst");
	expect(doc.meta.seed).toBe("777");
	expect(doc.meta.sheet.width).toBe(r.doc.meta.sheet.width);
});

test("edge: fps 0 and 1000 are clamped with message", () => {
	const a = sanitizeParams({ ...BASE, fps: 0 });
	expect(a.params.fps).toBe(1);
	expect(a.messages.some((m) => m.includes("fps"))).toBe(true);
	const b = sanitizeParams({ ...BASE, fps: 1000 });
	expect(b.params.fps).toBe(60);
	expect(b.messages.some((m) => m.includes("fps"))).toBe(true);
});

test("edge: malformed numeric strings fall back with message", () => {
	const a = sanitizeParams({ ...BASE, width: "abc" });
	expect(a.params.width).toBe(128);
	expect(a.messages.some((m) => m.includes("width"))).toBe(true);
});

test("edge: tiny and huge resolutions clamp to 8..512", () => {
	expect(sanitizeParams({ ...BASE, width: 1, height: 1 }).params.width).toBe(8);
	expect(sanitizeParams({ ...BASE, height: 1 }).params.height).toBe(8);
	const big = sanitizeParams({ ...BASE, width: 99999, height: -40 });
	expect(big.params.width).toBe(512);
	expect(big.params.height).toBe(8);
	expect(big.messages.length).toBeGreaterThanOrEqual(2);
});

test("edge: palette size bounds 2..256", () => {
	expect(sanitizeParams({ ...BASE, paletteSize: 0 }).params.paletteSize).toBe(
		2,
	);
	expect(sanitizeParams({ ...BASE, paletteSize: 999 }).params.paletteSize).toBe(
		256,
	);
	expect(sanitizeParams({ ...BASE, paletteSize: 256 }).params.paletteSize).toBe(
		256,
	);
});

test("edge: reversed frame range is repaired", () => {
	const r = sanitizeParams({ ...BASE, from: 10, to: 2 });
	expect(r.params.from).toBe(2);
	expect(r.params.to).toBe(10);
	expect(r.messages.some((m) => m.includes("range"))).toBe(true);
});

test("edge: unknown effect, empty seed, junk dither/color all repaired", () => {
	const r = sanitizeParams({
		...BASE,
		effectId: "nope",
		seed: "",
		dither: "foo",
		outlineColor: "zz",
	});
	expect(r.params.effectId).toBe("ember_burst");
	expect(r.params.seed).toBe("42");
	expect(r.params.dither).toBe("bayer4");
	expect(r.params.outlineColor).toBe("#000000");
	expect(r.messages.length).toBeGreaterThanOrEqual(4);
});

test("edge: camera and alpha values clamp", () => {
	const r = sanitizeParams({
		...BASE,
		alphaThreshold: 5,
		camera: { zoom: -3, panX: 9, panY: NaN },
	});
	expect(r.params.alphaThreshold).toBe(0.98);
	expect(r.params.camera.zoom).toBe(0.25);
	expect(r.params.camera.panX).toBe(0.5);
	expect(r.params.camera.panY).toBe(0);
	expect(r.messages.length).toBeGreaterThanOrEqual(3);
});

test("edge: pixelScale capped by internal render limit", () => {
	const r = sanitizeParams({ ...BASE, width: 512, pixelScale: 8 });
	expect(r.params.pixelScale).toBe(4);
	expect(r.messages.some((m) => m.includes("pixelScale"))).toBe(true);
});

test("edge: all holds zero still exports without crash", () => {
	const seq = buildSequence(BASE);
	const holds = seq.params.holds.map(() => 0);
	const sheet = exportSheet({ ...BASE, holds, from: 0, to: 3 });
	expect(sheet.cellCount).toBe(0);
	expect(parsePNG(sheet.bytes).ok).toBe(true);
	const gif = exportGif({ ...BASE, holds, from: 0, to: 3 });
	expect(parseGIF(gif.bytes).ok).toBe(true);
	expect(parseGIF(gif.bytes).imageCount).toBe(0);
});

test("non-ASCII seed stays deterministic", () => {
	const a = buildSequence({ ...BASE, seed: "새싹-42" });
	const b = buildSequence({ ...BASE, seed: "새싹-42" });
	expect(Array.from(bytesOf(a.frames))).toEqual(Array.from(bytesOf(b.frames)));
	const c = buildSequence({ ...BASE, seed: "새싹-43" });
	expect(Array.from(a.frames[0])).not.toEqual(Array.from(c.frames[0]));
});

test("goldenHashes shape is stable", () => {
	const h = goldenHashes();
	expect(h.frameCount).toBe(12);
	expect(h.frame0).toMatch(/^[0-9a-f]{8}$/);
	expect(h.allFrames).toMatch(/^[0-9a-f]{8}$/);
	expect(h.sheet).toMatch(/^[0-9a-f]{8}$/);
	expect(h.gif).toMatch(/^[0-9a-f]{8}$/);
});
