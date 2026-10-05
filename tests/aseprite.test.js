import { expect, test } from "bun:test";
import { inflateSync } from "node:zlib";
import {
	exportAseprite,
	parseAseprite,
	writeAseprite,
} from "../src/pipeline.js";
import { zlibStored } from "../src/pngenc.js";

function synthFrames(count, W, H) {
	const frames = [];
	for (let f = 0; f < count; f++) {
		const rgba = new Uint8ClampedArray(W * H * 4);
		for (let i = 0; i < W * H; i++) {
			rgba[i * 4] = (i * 7 + f * 31) & 255;
			rgba[i * 4 + 1] = (i * 13 + f * 17) & 255;
			rgba[i * 4 + 2] = (i * 3 + f * 53) & 255;
			rgba[i * 4 + 3] = 255;
		}
		frames.push(rgba);
	}
	return frames;
}

test("writeAseprite -> parseAseprite round-trips pixels exactly", () => {
	const W = 4;
	const H = 4;
	const frames = synthFrames(3, W, H);
	const bytes = writeAseprite(frames, W, H, 12);
	const parsed = parseAseprite(bytes);
	expect(parsed.frameCount).toBe(3);
	expect(parsed.width).toBe(W);
	expect(parsed.height).toBe(H);
	expect(parsed.depth).toBe(32);
	expect(parsed.cels.length).toBe(3);
	for (let f = 0; f < 3; f++) {
		const cel = parsed.cels[f];
		expect(cel.frame).toBe(f);
		expect(cel.w).toBe(W);
		expect(cel.h).toBe(H);
		expect(Array.from(cel.rgba)).toEqual(Array.from(frames[f]));
	}
});

test("aseprite file declares the documented magic numbers", () => {
	const frames = synthFrames(2, 2, 2);
	const bytes = writeAseprite(frames, 2, 2, 10);
	expect(bytes[4]).toBe(0xe0); // file magic 0xA5E0 little-endian
	expect(bytes[5]).toBe(0xa5);
	expect(bytes[132]).toBe(0xfa); // frame magic 0xF1FA little-endian
	expect(bytes[133]).toBe(0xf1);
	const declared = new DataView(
		bytes.buffer,
		bytes.byteOffset,
		bytes.byteLength,
	).getUint32(0, true);
	expect(declared).toBe(bytes.length);
});

test("zlibStored streams are readable by node:zlib (independent decoder)", () => {
	const raw = new Uint8Array(512);
	for (let i = 0; i < raw.length; i++) raw[i] = (i * 41 + 7) & 255;
	const decoded = inflateSync(Buffer.from(zlibStored(raw)));
	expect(decoded.length).toBe(raw.length);
	expect(Array.from(decoded)).toEqual(Array.from(raw));
});

test("exportAseprite returns a valid export record", () => {
	const r = exportAseprite({
		effectId: "ember_burst",
		seed: "777",
		width: 64,
		height: 64,
	});
	expect(r.kind).toBe("aseprite");
	expect(r.name.endsWith(".aseprite")).toBe(true);
	expect(r.bytes[4]).toBe(0xe0);
	expect(r.cellCount).toBeGreaterThan(1);
	expect(r.width).toBe(64);
	expect(r.height).toBe(64);
	expect(r.delayCs).toBe(8);
	const parsed = parseAseprite(r.bytes);
	expect(parsed.frameCount).toBe(r.cellCount);
	expect(parsed.width).toBe(64);
});
