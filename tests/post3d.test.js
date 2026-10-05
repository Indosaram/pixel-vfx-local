import { expect, test } from "bun:test";
import { hdrBloom, tonemapMatte3Pass } from "../src/post3d.js";
import { makeHdr } from "../src/render3d.js";

const W = 16;
const H = 16;

function hdrWith(rgb, alpha) {
	const hdr = makeHdr(W, H);
	for (let i = 0; i < W * H; i++) {
		hdr.data[i * 4] = rgb[0];
		hdr.data[i * 4 + 1] = rgb[1];
		hdr.data[i * 4 + 2] = rgb[2];
		hdr.data[i * 4 + 3] = alpha;
	}
	return hdr;
}

function snapshot(hdr) {
	return Array.from(hdr.data);
}

test("dark input below the bright-pass threshold leaves the buffer untouched", () => {
	const hdr = hdrWith([0.3, 0.2, 0.1], 1);
	const before = snapshot(hdr);
	hdrBloom(hdr, W, H, { threshold: 0.85, intensity: 0.6 });
	expect(snapshot(hdr)).toEqual(before);
});

test("bright input above the threshold spreads bloom energy", () => {
	const hdr = makeHdr(W, H);
	hdr.data[0] = 6;
	hdr.data[1] = 5;
	hdr.data[2] = 4;
	hdr.data[3] = 1;
	const before = snapshot(hdr);
	hdrBloom(hdr, W, H, { threshold: 0.85, intensity: 0.6 });
	const after = snapshot(hdr);
	expect(after).not.toEqual(before);
	let spread = 0;
	for (let i = 0; i < W * H; i++) {
		const o = i * 4;
		if (i !== 0 && after[o] > 0) spread++;
	}
	expect(spread).toBeGreaterThan(0);
	for (const v of after) {
		expect(Number.isNaN(v)).toBe(false);
		expect(Number.isFinite(v)).toBe(true);
	}
});

test("3-pass tonemap/matte is deterministic and alpha stays in range", () => {
	const hdr = hdrWith([2.4, 0.6, 0.2], 1);
	const out1 = tonemapMatte3Pass(hdr, W, H);
	const out2 = tonemapMatte3Pass(hdr, W, H);
	expect(out1.length).toBe(W * H * 4);
	expect(Array.from(out1)).toEqual(Array.from(out2));
	for (let i = 0; i < out1.length; i += 4) {
		expect(out1[i + 3]).toBeGreaterThanOrEqual(0);
		expect(out1[i + 3]).toBeLessThanOrEqual(255);
		expect(out1[i]).not.toBeNaN();
	}
});

test("dilation pass grows coverage of an isolated covered pixel", () => {
	const hdr = makeHdr(W, H);
	const ci = (8 * W + 8) * 4;
	hdr.data[ci] = 2;
	hdr.data[ci + 1] = 2;
	hdr.data[ci + 2] = 2;
	hdr.data[ci + 3] = 1;
	const out = tonemapMatte3Pass(hdr, W, H);
	let covered = 0;
	for (let i = 3; i < out.length; i += 4) if (out[i] > 0) covered++;
	expect(covered).toBeGreaterThan(1);
});
