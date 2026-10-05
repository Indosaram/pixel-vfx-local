import { expect, test } from "bun:test";
import { getPreset } from "../src/effects.js";
import { exportMeta, exportSheet, exportTres } from "../src/pipeline.js";
import { sheetLayout } from "../src/sheet.js";

const P = {
	effectId: "ember_burst",
	seed: "777",
	width: 32,
	height: 32,
	fps: 12,
};

function decode(bytes) {
	return new TextDecoder().decode(bytes);
}

test("exportTres produces a Godot SpriteFrames resource", () => {
	const r = exportTres(P);
	const text = decode(r.bytes);
	const sheet = exportSheet(P);
	expect(text.startsWith('[gd_resource type="SpriteFrames"')).toBe(true);
	expect(text).toContain(`path="res://pixelvfx/${sheet.name}"`);
	const regions = [
		...text.matchAll(/"region": Rect2\( (\d+), (\d+), (\d+), (\d+) \)/g),
	];
	expect(regions.length).toBe(sheet.cellCount);
	const lay = sheetLayout(sheet.cellCount, 32, 32);
	expect(Number(regions[0][1])).toBe(0);
	expect(Number(regions[0][2])).toBe(0);
	expect(Number(regions[1][1])).toBe(32);
	expect(Number(regions[1][2])).toBe(0);
	for (const m of regions) {
		const x = Number(m[1]);
		const y = Number(m[2]);
		expect(x).toBeGreaterThanOrEqual(0);
		expect(x + 32).toBeLessThanOrEqual(lay.width);
		expect(y).toBeGreaterThanOrEqual(0);
		expect(y + 32).toBeLessThanOrEqual(lay.height);
	}
	const fx = getPreset(P.effectId);
	expect(text).toContain(`"loop": ${fx.loop ? "true" : "false"}`);
	expect(text).toContain('"speed": 12.0');
	expect(r.kind).toBe("tres");
	expect(r.name.endsWith("_spriteframes.tres")).toBe(true);
});

test("exportMeta produces deterministic Unity TextureImporter YAML", () => {
	const a = exportMeta(P);
	const b = exportMeta(P);
	const text = decode(a.bytes);
	expect(decode(b.bytes)).toBe(text);
	const guid = text.match(/^guid: ([0-9a-f]{32})$/m);
	expect(guid).toBeTruthy();
	expect(guid[1].length).toBe(32);
	const sheet = exportSheet(P);
	const sprites = text.match(/- serializedVersion: 2/g) || [];
	expect(sprites.length).toBe(sheet.cellCount);
	const rects = [
		...text.matchAll(
			/rect:\n\s+serializedVersion: 2\n\s+x: (\d+)\n\s+y: (\d+)\n\s+width: (\d+)\n\s+height: (\d+)/g,
		),
	];
	expect(rects.length).toBe(sheet.cellCount);
	expect(Number(rects[0][1])).toBe(0);
	expect(Number(rects[0][2])).toBe(sheet.height - 32);
	expect(Number(rects[1][1])).toBe(32);
	expect(Number(rects[1][2])).toBe(sheet.height - 32);
	for (const m of rects) {
		const x = Number(m[1]);
		const y = Number(m[2]);
		expect(x).toBeGreaterThanOrEqual(0);
		expect(x + 32).toBeLessThanOrEqual(sheet.width);
		expect(y).toBeGreaterThanOrEqual(0);
		expect(y + 32).toBeLessThanOrEqual(sheet.height);
	}
	expect(a.kind).toBe("meta");
	expect(a.name).toBe(`${sheet.name}.meta`);
});

test("tres and meta exports keep deterministic bytes for identical params", () => {
	const t1 = exportTres(P);
	const t2 = exportTres(P);
	expect(Array.from(t1.bytes)).toEqual(Array.from(t2.bytes));
});
