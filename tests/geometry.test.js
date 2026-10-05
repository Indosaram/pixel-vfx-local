import { expect, test } from "bun:test";
import {
	boxMesh,
	coneMesh,
	getGeometry,
	planeMesh,
	sphereMesh,
	torusMesh,
} from "../src/geometry.js";

function checkStructure(g) {
	expect(g.positions.length % 3).toBe(0);
	expect(g.indices.length % 3).toBe(0);
	for (const i of g.indices) {
		expect(i).toBeGreaterThanOrEqual(0);
		expect(i).toBeLessThan(g.positions.length / 3);
	}
	for (const v of g.positions) expect(Number.isFinite(v)).toBe(true);
}

test("box mesh spans exactly the requested extents", () => {
	const g = boxMesh(2, 4, 6);
	checkStructure(g);
	const bounds = [1, 2, 3];
	for (let i = 0; i < g.positions.length; i += 3) {
		for (let a = 0; a < 3; a++) {
			expect(Math.abs(g.positions[i + a])).toBeLessThanOrEqual(
				bounds[a] + 1e-9,
			);
		}
	}
	for (let a = 0; a < 3; a++) {
		let hit = 0;
		for (let i = a; i < g.positions.length; i += 3) {
			hit = Math.max(hit, Math.abs(g.positions[i]));
		}
		expect(hit).toBeCloseTo(bounds[a], 9);
	}
	const half = boxMesh();
	for (const v of half.positions) {
		expect(Math.abs(v)).toBeLessThanOrEqual(0.5 + 1e-9);
	}
});

test("sphere mesh stays inside its radius", () => {
	const g = sphereMesh(0.5, 8, 6);
	checkStructure(g);
	for (let i = 0; i < g.positions.length; i += 3) {
		const r = Math.hypot(
			g.positions[i],
			g.positions[i + 1],
			g.positions[i + 2],
		);
		expect(r).toBeLessThanOrEqual(0.5 + 1e-6);
	}
});

test("torus mesh stays within major+minor radius", () => {
	const R = 0.8;
	const r = 0.22;
	const g = torusMesh(R, r, 14, 8);
	checkStructure(g);
	for (let i = 0; i < g.positions.length; i += 3) {
		const ring = Math.hypot(g.positions[i], g.positions[i + 2]);
		expect(ring).toBeGreaterThanOrEqual(R - r - 1e-6);
		expect(ring).toBeLessThanOrEqual(R + r + 1e-6);
	}
});

test("cone and plane meshes are bounded", () => {
	const cone = coneMesh(0.5, 1, 8);
	checkStructure(cone);
	for (const v of cone.positions) {
		expect(Math.abs(v)).toBeLessThanOrEqual(1 + 1e-9);
	}
	const plane = planeMesh(2, 2);
	checkStructure(plane);
	for (const v of plane.positions) {
		expect(Math.abs(v)).toBeLessThanOrEqual(1 + 1e-9);
	}
});

test("getGeometry caches by name", () => {
	expect(getGeometry("box")).toBe(getGeometry("box"));
	expect(getGeometry("sphere")).not.toBe(getGeometry("box"));
});
