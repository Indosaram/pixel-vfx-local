import { expect, test } from "bun:test";
import { encodeGIF, parseGIF } from "../src/gifenc.js";

function lzwDecode(data, minCodeSize) {
	const clear = 1 << minCodeSize;
	const eoi = clear + 1;
	let codeSize = minCodeSize + 1;
	let next = eoi + 1;
	let dict = [];
	const reset = () => {
		dict = [];
		for (let i = 0; i < clear; i++) dict[i] = [i];
		codeSize = minCodeSize + 1;
		next = eoi + 1;
	};
	reset();
	let bitPos = 0;
	const readCode = () => {
		let v = 0;
		for (let i = 0; i < codeSize; i++) {
			const byte = data[bitPos >> 3];
			if (byte === undefined) return null;
			v |= ((byte >> (bitPos & 7)) & 1) << i;
			bitPos++;
		}
		return v;
	};
	const out = [];
	let prev = null;
	for (;;) {
		const code = readCode();
		if (code === null) break;
		if (code === clear) {
			reset();
			prev = null;
			continue;
		}
		if (code === eoi) break;
		let entry;
		if (code < next && dict[code]) entry = dict[code];
		else if (code === next && prev) entry = [...prev, prev[0]];
		else
			throw new Error(
				"invalid LZW code " +
					code +
					" (next=" +
					next +
					", cs=" +
					codeSize +
					")",
			);
		for (const v of entry) out.push(v);
		if (prev) {
			if (next < 4096) {
				dict[next] = [...prev, entry[0]];
				next++;
				if (next === 1 << codeSize && codeSize < 12) codeSize++;
			}
			prev = entry;
		} else {
			prev = entry;
		}
	}
	return out;
}

function extractImageData(bytes) {
	const parsed = parseGIF(bytes);
	expect(parsed.ok).toBe(true);
	const packed = bytes[10];
	let o = 13;
	if (packed & 0x80) o += 3 * (1 << ((packed & 7) + 1));
	const frames = [];
	while (o < bytes.length && bytes[o] !== 0x3b) {
		if (bytes[o] === 0x21) {
			o += 2;
			while (bytes[o] !== 0) o += 1 + bytes[o];
			o += 1;
		} else if (bytes[o] === 0x2c) {
			const ipacked = bytes[o + 9];
			o += 10;
			if (ipacked & 0x80) o += 3 * (1 << (ipacked & 7));
			const minCodeSize = bytes[o];
			o += 1;
			const chunks = [];
			while (bytes[o] !== 0) {
				const n = bytes[o];
				for (let i = 0; i < n; i++) chunks.push(bytes[o + 1 + i]);
				o += 1 + n;
			}
			o += 1;
			frames.push(lzwDecode(Uint8Array.from(chunks), minCodeSize));
		} else {
			throw new Error(`unknown block at ${o}`);
		}
	}
	return { parsed, frames };
}

function extractDisposals(bytes) {
	const packed = bytes[10];
	let o = 13;
	if (packed & 0x80) o += 3 * (1 << ((packed & 7) + 1));
	const out = [];
	while (o < bytes.length && bytes[o] !== 0x3b) {
		if (bytes[o] === 0x21) {
			const isGce = bytes[o + 1] === 0xf9;
			const gcePacked = bytes[o + 3];
			o += 2;
			while (bytes[o] !== 0) o += 1 + bytes[o];
			o += 1;
			if (isGce) out.push((gcePacked >> 2) & 7);
		} else if (bytes[o] === 0x2c) {
			const ipacked = bytes[o + 9];
			o += 10;
			if (ipacked & 0x80) o += 3 * (1 << (ipacked & 7));
			o += 1;
			while (bytes[o] !== 0) o += 1 + bytes[o];
			o += 1;
		} else {
			throw new Error(`unknown block at ${o}`);
		}
	}
	return out;
}

function lcg(seed) {
	let s = seed >>> 0;
	return () => {
		s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
		return s;
	};
}

test("encodeGIF parses with dims, frame count, delays, loop, transparency", () => {
	const w = 8;
	const h = 8;
	const palette = new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0]);
	const frames = [];
	for (let f = 0; f < 5; f++) {
		const idx = new Uint8Array(w * h);
		for (let i = 0; i < idx.length; i++) idx[i] = i % f === 0 ? 3 : i % 3;
		frames.push(idx);
	}
	const gif = encodeGIF({
		width: w,
		height: h,
		frames,
		palette,
		transparentIndex: 3,
		delayCs: 8,
		loop: 0,
	});
	const { parsed } = extractImageData(gif);
	expect(parsed.width).toBe(w);
	expect(parsed.height).toBe(h);
	expect(parsed.imageCount).toBe(5);
	expect(parsed.delays).toEqual([8, 8, 8, 8, 8]);
	expect(parsed.transparents).toEqual([3, 3, 3, 3, 3]);
	expect(parsed.loop).toBe(0);
	expect(parsed.totalDelay).toBe(40);
});

test("LZW roundtrip across code-size boundaries (256-color noise)", () => {
	const w = 160;
	const h = 120;
	const rnd = lcg(1234);
	const idx = new Uint8Array(w * h);
	for (let i = 0; i < idx.length; i++) idx[i] = rnd() & 0xff;
	const palette = new Uint8Array(256 * 3);
	for (let i = 0; i < 256; i++) {
		palette[i * 3] = i;
		palette[i * 3 + 1] = 255 - i;
		palette[i * 3 + 2] = (i * 7) & 255;
	}
	const gif = encodeGIF({
		width: w,
		height: h,
		frames: [idx],
		palette,
		transparentIndex: null,
		delayCs: 10,
		loop: 0,
	});
	const { frames } = extractImageData(gif);
	expect(frames[0].length).toBe(w * h);
	expect(Array.from(frames[0])).toEqual(Array.from(idx));
});

test("LZW roundtrip with long repeat chains (fast dict growth past 4096)", () => {
	const w = 128;
	const h = 128;
	const rnd = lcg(99);
	const idx = new Uint8Array(w * h);
	let i = 0;
	while (i < idx.length) {
		const run = 1 + (rnd() % 40);
		const val = rnd() % 4;
		for (let k = 0; k < run && i < idx.length; k++, i++) idx[i] = val;
		const copy = rnd() % 12;
		for (let k = 0; k < copy && i < idx.length; k++, i++)
			idx[i] = idx[i - run] === undefined ? 0 : idx[i - run];
	}
	const palette = new Uint8Array([
		0, 0, 0, 255, 255, 255, 255, 0, 0, 0, 255, 0,
	]);
	const gif = encodeGIF({
		width: w,
		height: h,
		frames: [idx],
		palette,
		transparentIndex: 3,
		delayCs: 4,
		loop: 0,
	});
	const { frames } = extractImageData(gif);
	expect(Array.from(frames[0])).toEqual(Array.from(idx));
});

test("encodeGIF bytes are deterministic", () => {
	const palette = new Uint8Array([1, 2, 3, 4, 5, 6]);
	const idx = Uint8Array.from([0, 1, 1, 0]);
	const a = encodeGIF({
		width: 2,
		height: 2,
		frames: [idx],
		palette,
		transparentIndex: 1,
		delayCs: 10,
		loop: 0,
	});
	const b = encodeGIF({
		width: 2,
		height: 2,
		frames: [idx],
		palette,
		transparentIndex: 1,
		delayCs: 10,
		loop: 0,
	});
	expect(Array.from(a)).toEqual(Array.from(b));
});

test("parseGIF rejects garbage", () => {
	expect(parseGIF(new Uint8Array(64)).ok).toBe(false);
});

test("transparent full frames declare disposal 2 and replay without ghosting", () => {
	const w = 6;
	const h = 6;
	const palette = new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255]);
	const src = [];
	for (let f = 0; f < 3; f++) {
		const idx = new Uint8Array(w * h);
		idx.fill(3);
		for (let i = 0; i < idx.length; i++) if (i % 3 === f % 3) idx[i] = 1 + (f % 2);
		src.push(idx);
	}
	const gif = encodeGIF({
		width: w,
		height: h,
		frames: src,
		palette,
		transparentIndex: 3,
		delayCs: 8,
		loop: 0,
	});
	const disposals = extractDisposals(gif);
	expect(disposals).toEqual([2, 2, 2]);
	const { frames } = extractImageData(gif);
	expect(frames.length).toBe(3);
	let canvas = new Uint8Array(w * h).fill(3);
	for (let f = 0; f < frames.length; f++) {
		if (f === 0 || disposals[f - 1] === 2) canvas = new Uint8Array(w * h).fill(3);
		const line = frames[f];
		for (let i = 0; i < canvas.length; i++) if (line[i] !== 3) canvas[i] = line[i];
		expect(Array.from(canvas)).toEqual(Array.from(src[f]));
	}
});
