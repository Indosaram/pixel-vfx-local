import { expect, test } from "bun:test";
import {
	alphaThreshold,
	buildLut,
	LUTS,
	medianCutPalette,
	nearestIndex,
	outlineFrame,
	quantizeFrame,
	recolor,
} from "../src/pixel.js";

function solidImage(w, h, rgb, a = 255) {
	const buf = new Uint8ClampedArray(w * h * 4);
	for (let i = 0; i < buf.length; i += 4) {
		buf[i] = rgb[0];
		buf[i + 1] = rgb[1];
		buf[i + 2] = rgb[2];
		buf[i + 3] = a;
	}
	return buf;
}

test("alphaThreshold snaps alpha to 0 or 255", () => {
	const img = solidImage(4, 4, [10, 20, 30]);
	img[3] = 20;
	img[7] = 200;
	alphaThreshold(img, 0.28);
	expect(img[3]).toBe(0);
	expect(img[7]).toBe(255);
});

test("alphaThreshold clamps insane thresholds", () => {
	const img = solidImage(2, 2, [1, 2, 3], 100);
	alphaThreshold(img, 5);
	expect(img[3]).toBe(0);
	const img2 = solidImage(2, 2, [1, 2, 3], 100);
	alphaThreshold(img2, -3);
	expect(img2[3]).toBe(255);
});

test("medianCutPalette finds exact colors when count allows", () => {
	const w = 4;
	const h = 4;
	const img = new Uint8ClampedArray(w * h * 4);
	const colors = [
		[255, 0, 0],
		[0, 255, 0],
		[0, 0, 255],
		[255, 255, 0],
	];
	for (let i = 0; i < w * h; i++) {
		const c = colors[i % 4];
		img.set([...c, 255], i * 4);
	}
	const pal = medianCutPalette([img], 4);
	expect(pal.length / 3).toBeLessThanOrEqual(4);
	const set = new Set();
	for (let i = 0; i < pal.length; i += 3)
		set.add((pal[i] << 16) | (pal[i + 1] << 8) | pal[i + 2]);
	for (const c of colors)
		set.has((c[0] << 16) | (c[1] << 8) | c[2]) || expect.fail(`missing ${c}`);
});

test("medianCutPalette returns black on empty input", () => {
	const pal = medianCutPalette([new Uint8ClampedArray(16)], 8);
	expect(Array.from(pal)).toEqual([0, 0, 0]);
});

test("quantizeFrame reduces unique colors to palette size", () => {
	const w = 8;
	const h = 8;
	const img = new Uint8ClampedArray(w * h * 4);
	for (let i = 0; i < w * h; i++) {
		img[i * 4] = (i * 7) % 256;
		img[i * 4 + 1] = (i * 13) % 256;
		img[i * 4 + 2] = (i * 29) % 256;
		img[i * 4 + 3] = 255;
	}
	const pal = medianCutPalette([img], 6);
	quantizeFrame(img, pal, "none", w);
	const set = new Set();
	for (let i = 0; i < img.length; i += 4)
		set.add((img[i] << 16) | (img[i + 1] << 8) | img[i + 2]);
	expect(set.size).toBeLessThanOrEqual(pal.length / 3);
});

test("dither changes output versus none", () => {
	const w = 8;
	const h = 8;
	const mk = () => {
		const img = new Uint8ClampedArray(w * h * 4);
		for (let i = 0; i < w * h; i++) {
			img[i * 4] = 195 + (i % 40);
			img[i * 4 + 1] = 90;
			img[i * 4 + 2] = 80;
			img[i * 4 + 3] = 255;
		}
		return img;
	};
	const pal = [0, 0, 0, 255, 255, 255];
	const plain = mk();
	quantizeFrame(plain, pal, "none", w);
	const dithered = mk();
	quantizeFrame(dithered, pal, "bayer4", w);
	expect(Array.from(dithered)).not.toEqual(Array.from(plain));
	const d2 = mk();
	quantizeFrame(d2, pal, "bayer4", w);
	expect(Array.from(d2)).toEqual(Array.from(dithered));
});

test("outlineFrame adds a ring without touching original pixels", () => {
	const w = 6;
	const h = 6;
	const img = new Uint8ClampedArray(w * h * 4);
	const idx = (x, y) => (y * w + x) * 4;
	img.set([200, 50, 50, 255], idx(2, 2));
	img.set([200, 50, 50, 255], idx(3, 2));
	outlineFrame(img, w, h, [9, 9, 9, 255]);
	expect(img[idx(2, 2)]).toBe(200);
	expect(img[idx(1, 2)]).toBe(9);
	expect(img[idx(2, 1)]).toBe(9);
	expect(img[idx(4, 2)]).toBe(9);
	expect(img[idx(3, 3)]).toBe(9);
	expect(img[idx(0, 0)]).toBe(0);
});

test("recolor maps luminance through LUT and keeps alpha", () => {
	const img = new Uint8ClampedArray(2 * 4);
	img.set([255, 255, 255, 200], 0);
	img.set([0, 0, 0, 0], 4);
	const lut = buildLut(LUTS.ember);
	recolor(img, lut);
	expect(img[0]).toBe(lut[255 * 3]);
	expect(img[3]).toBe(200);
	expect(img[7]).toBe(0);
});

test("buildLut covers full range deterministically", () => {
	const a = buildLut(LUTS.frost);
	const b = buildLut(LUTS.frost);
	expect(Array.from(a)).toEqual(Array.from(b));
	expect(a.length).toBe(768);
});

test("nearestIndex is deterministic with ties", () => {
	const pal = new Uint8Array([10, 10, 10, 20, 20, 20]);
	expect(nearestIndex(pal, 15, 15, 15)).toBe(0);
	expect(nearestIndex(pal, 255, 255, 255)).toBe(1);
});
