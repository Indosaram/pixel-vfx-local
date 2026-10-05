import { expect, test } from "bun:test";
import { buildSheet, sheetLayout } from "../src/sheet.js";

test("sheetLayout is near-square and covers all frames", () => {
	const l = sheetLayout(9, 16, 16);
	expect(l.cols).toBe(3);
	expect(l.rows).toBe(3);
	expect(l.width).toBe(48);
	expect(l.height).toBe(48);
	const l2 = sheetLayout(10, 16, 16);
	expect(l2.cols).toBe(4);
	expect(l2.rows).toBe(3);
	expect(l2.cols * l2.rows).toBeGreaterThanOrEqual(10);
});

test("sheetLayout guards degenerate input", () => {
	const l = sheetLayout(0, 0, -8);
	expect(l.width).toBeGreaterThanOrEqual(1);
	expect(l.height).toBeGreaterThanOrEqual(1);
});

test("buildSheet places frames and leaves spare cells transparent", () => {
	const w = 4;
	const h = 4;
	const f0 = new Uint8ClampedArray(w * h * 4).fill(255);
	const f1 = new Uint8ClampedArray(w * h * 4);
	for (let i = 0; i < f1.length; i += 4) f1[i + 3] = 128;
	const f2 = new Uint8ClampedArray(w * h * 4);
	const sheet = buildSheet([f0, f1, f2], w, h);
	expect(sheet.layout.cols).toBe(2);
	expect(sheet.layout.rows).toBe(2);
	expect(sheet.width).toBe(8);
	expect(sheet.height).toBe(8);
	expect(sheet.rgba[0]).toBe(255);
	expect(sheet.rgba[3]).toBe(255);
	const cell1Off = (0 * 8 + 4) * 4;
	expect(sheet.rgba[cell1Off + 3]).toBe(128);
	const cell2Off = (4 * 8 + 0) * 4;
	expect(sheet.rgba[cell2Off + 3]).toBe(0);
	const cell3Off = (4 * 8 + 4) * 4;
	expect(sheet.rgba[cell3Off + 3]).toBe(0);
});
