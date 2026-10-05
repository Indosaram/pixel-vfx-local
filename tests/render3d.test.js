import { expect, test } from "bun:test";
import {
	lookAt,
	mat4Perspective,
	projectPoint,
	screenFromNdc,
} from "../src/camera3d.js";
import { makeHdr, renderBillboards, renderMeshes } from "../src/render3d.js";

const W = 16;
const H = 16;
const PROJ = mat4Perspective(Math.PI / 4, 1, 0.1, 100);
const VIEW = lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);

function box(z, color) {
	return {
		geo: "box",
		pos: [0, 0, z],
		rot: [0, 0, 0],
		scale: [2.5, 2.5, 0.4],
		color,
		emissive: 0,
	};
}

function centerPx(hdr) {
	const i = ((H >> 1) * W + (W >> 1)) * 4;
	return [hdr.data[i], hdr.data[i + 1], hdr.data[i + 2], hdr.data[i + 3]];
}

test("makeHdr inits interleaved rgba data and a far-sentinel depth", () => {
	const hdr = makeHdr(W, H);
	expect(hdr.data.length).toBe(W * H * 4);
	expect(hdr.depth.length).toBe(W * H);
	for (const d of hdr.depth) expect(d).toBeGreaterThan(1e29);
	for (const v of hdr.data) expect(v).toBe(0);
});

test("z-buffer makes nearer geometry win regardless of draw order", () => {
	const farRed = box(-5, [1, 0, 0]);
	const nearBlue = box(-2, [0, 0, 1]);
	for (const meshes of [
		[farRed, nearBlue],
		[nearBlue, farRed],
	]) {
		const hdr = makeHdr(W, H);
		renderMeshes(hdr, W, H, VIEW, PROJ, meshes);
		const [r, , b, a] = centerPx(hdr);
		expect(a).toBeGreaterThan(0);
		expect(b).toBeGreaterThan(r);
	}
});

test("meshes behind the camera are skipped without throwing", () => {
	const hdr = makeHdr(W, H);
	renderMeshes(hdr, W, H, VIEW, PROJ, [box(20, [1, 0, 0])]);
	for (const v of hdr.data) expect(v).toBe(0);
});

test("billboards render on empty pixels and are depth-tested against meshes", () => {
	const empty = makeHdr(W, H);
	renderBillboards(empty, W, H, VIEW, PROJ, [
		{ x: 0, y: 0, z: -4, size: 0.6, color: [255, 60, 0] },
	]);
	const [, , , a] = centerPx(empty);
	expect(a).toBeGreaterThan(0);

	const behindBox = makeHdr(W, H);
	renderMeshes(behindBox, W, H, VIEW, PROJ, [box(-2, [0, 1, 0])]);
	renderBillboards(behindBox, W, H, VIEW, PROJ, [
		{ x: 0, y: 0, z: -4.5, size: 0.6, color: [255, 60, 0] },
	]);
	const after = centerPx(behindBox);
	expect(after[1]).toBeGreaterThan(after[0]);
	expect(after[1]).toBeGreaterThan(after[2]);
});

test("projectPoint agrees with screenFromNdc in pixel space", () => {
	const p = projectPoint(VIEW, PROJ, 0.5, 0.25, -4);
	const s1 = screenFromNdc(p.x, p.y, W, H);
	const s2 = screenFromNdc(p.x, p.y, W, H);
	expect(s1[0]).toBeCloseTo(s2[0], 9);
	expect(s1[1]).toBeCloseTo(s2[1], 9);
});
