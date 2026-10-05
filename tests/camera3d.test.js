import { expect, test } from "bun:test";
import {
	clampPitch,
	composeTRS,
	lookAt,
	mat4Identity,
	mat4Mul,
	mat4Perspective,
	orbitView,
	projectPoint,
	screenFromNdc,
} from "../src/camera3d.js";

const PROJ = mat4Perspective(Math.PI / 4, 1, 0.1, 100);
const VIEW = lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);

test("identity is a neutral element of mat4Mul", () => {
	const id = mat4Identity();
	for (const m of [mat4Mul(id, PROJ), mat4Mul(PROJ, id)]) {
		for (let i = 0; i < 16; i++) expect(m[i]).toBeCloseTo(PROJ[i], 9);
	}
});

test("perspective has positive focal terms and the -1 w row", () => {
	expect(PROJ[0]).toBeGreaterThan(0);
	expect(PROJ[5]).toBeGreaterThan(0);
	expect(PROJ[11]).toBe(-1);
});

test("projectPoint transforms world points in front of the camera", () => {
	const p = projectPoint(VIEW, PROJ, 0, 0, 0);
	expect(p).not.toBeNull();
	expect(p.w).toBeGreaterThan(0);
	expect(p.viewZ).toBeLessThan(0);
	expect(p.x).toBeCloseTo(0, 6);
	expect(p.y).toBeCloseTo(0, 6);
	const behind = projectPoint(VIEW, PROJ, 0, 0, 10);
	expect(behind).toBeNull();
});

test("screenFromNdc maps the ndc square onto W x H", () => {
	expect(screenFromNdc(-1, 1, 32, 32)).toEqual([0, 0]);
	const [x1, y1] = screenFromNdc(1, -1, 32, 32);
	expect(x1).toBeCloseTo(32, 6);
	expect(y1).toBeCloseTo(32, 6);
});

test("projectPoint ndc agrees with screenFromNdc", () => {
	const p = projectPoint(VIEW, PROJ, 0.5, 0.25, -4);
	const [sx, sy] = screenFromNdc(p.x, p.y, 64, 64);
	const [sx2, sy2] = screenFromNdc(p.x, p.y, 64, 64);
	expect(sx).toBeCloseTo(sx2, 9);
	expect(sy).toBeCloseTo(sy2, 9);
});

test("orbitView yaw rotates the eye around the target at fixed distance", () => {
	const a = orbitView(0, 0.4, 3.4, [0, 0, 0]);
	const b = orbitView(Math.PI / 2, 0.4, 3.4, [0, 0, 0]);
	expect(a.view).not.toEqual(b.view);
	expect(a.eye[0]).toBeCloseTo(0, 9);
	expect(a.eye[2]).toBeCloseTo(3.4 * Math.cos(0.4), 4);
	expect(b.eye[0]).toBeCloseTo(3.4 * Math.cos(0.4), 4);
	expect(b.eye[2]).toBeCloseTo(0, 9);
	const dA = Math.hypot(a.eye[0], a.eye[1], a.eye[2]);
	expect(dA).toBeCloseTo(3.4, 4);
});

test("clampPitch limits pitch to the horizon margin", () => {
	expect(clampPitch(-9)).toBeCloseTo(-1.45, 9);
	expect(clampPitch(9)).toBeCloseTo(1.45, 9);
	expect(clampPitch(0.5)).toBeCloseTo(0.5, 9);
});

test("composeTRS with zero rotation is translation of a scaled box", () => {
	const m = composeTRS([1, 2, 3], [0, 0, 0], [2, 4, 1]);
	expect(m[0]).toBeCloseTo(2, 4);
	expect(m[5]).toBeCloseTo(4, 4);
	expect(m[10]).toBeCloseTo(1, 4);
	expect(m[12]).toBeCloseTo(1, 4);
	expect(m[13]).toBeCloseTo(2, 4);
	expect(m[14]).toBeCloseTo(3, 4);
});
