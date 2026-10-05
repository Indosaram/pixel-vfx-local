import { expect, test } from "bun:test";
import { encodePNG, parsePNG } from "../src/pngenc.js";

function inflateStored(z) {
	expect(z[0]).toBe(0x78);
	expect(((z[0] << 8) | z[1]) % 31).toBe(0);
	let o = 2;
	const out = [];
	for (;;) {
		const b = z[o];
		const final = b & 1;
		const type = (b >> 1) & 3;
		expect(type).toBe(0);
		const len = z[o + 1] | (z[o + 2] << 8);
		const nlen = z[o + 3] | (z[o + 4] << 8);
		expect((len ^ nlen) & 0xffff).toBe(0xffff);
		o += 5;
		for (let i = 0; i < len; i++) out.push(z[o + i]);
		o += len;
		if (final) break;
	}
	let a = 1;
	let b = 0;
	for (const byte of out) {
		a = (a + byte) % 65521;
		b = (b + a) % 65521;
	}
	const adler = ((b << 16) | a) >>> 0;
	const stored =
		((z[o] << 24) | (z[o + 1] << 16) | (z[o + 2] << 8) | z[o + 3]) >>> 0;
	expect(adler).toBe(stored);
	return Uint8Array.from(out);
}

function sampleImage(w, h) {
	const rgba = new Uint8ClampedArray(w * h * 4);
	for (let i = 0; i < w * h; i++) {
		rgba[i * 4] = (i * 17) % 256;
		rgba[i * 4 + 1] = (i * 31) % 256;
		rgba[i * 4 + 2] = (i * 53) % 256;
		rgba[i * 4 + 3] = i % 3 === 0 ? 0 : 255;
	}
	return rgba;
}

test("encodePNG produces parseable PNG with correct dims and CRCs", () => {
	const w = 13;
	const h = 7;
	const rgba = sampleImage(w, h);
	const png = encodePNG(rgba, w, h);
	const parsed = parsePNG(png);
	expect(parsed.ok).toBe(true);
	expect(parsed.width).toBe(w);
	expect(parsed.height).toBe(h);
	expect(parsed.chunks).toEqual(["IHDR", "IDAT", "IEND"]);
});

test("encodePNG bytes are deterministic", () => {
	const rgba = sampleImage(9, 5);
	expect(Array.from(encodePNG(rgba, 9, 5))).toEqual(
		Array.from(encodePNG(rgba, 9, 5)),
	);
});

test("stored-deflate payload roundtrips scanline data", () => {
	const w = 5;
	const h = 4;
	const rgba = sampleImage(w, h);
	const png = encodePNG(rgba, w, h);
	const parsed = parsePNG(png);
	const raw = inflateStored(parsed.zlib);
	expect(raw.length).toBe(h * (w * 4 + 1));
	for (let y = 0; y < h; y++) {
		expect(raw[y * (w * 4 + 1)]).toBe(0);
		for (let i = 0; i < w * 4; i++) {
			expect(raw[y * (w * 4 + 1) + 1 + i]).toBe(rgba[y * w * 4 + i]);
		}
	}
});

test("large image crosses stored-block boundary", () => {
	const w = 128;
	const h = 128;
	const rgba = sampleImage(w, h);
	const png = encodePNG(rgba, w, h);
	const parsed = parsePNG(png);
	const raw = inflateStored(parsed.zlib);
	expect(raw.length).toBe(h * (w * 4 + 1));
});

test("parsePNG rejects garbage", () => {
	expect(parsePNG(new Uint8Array(40)).ok).toBe(false);
});
