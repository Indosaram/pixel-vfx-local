import { expect, test } from "bun:test";
import {
	buildSequence,
	exportAtlas,
	exportGif,
	exportSheet,
	sanitizeParams,
} from "../src/pipeline.js";

const P3D = {
	effectId: "orbital_ring3d",
	seed: "7",
	width: 32,
	height: 32,
	fps: 10,
	pixelScale: 1,
	paletteSize: 8,
	outline: false,
	camera3d: { yaw: 0.7, pitch: 0.4, dist: 3.4, fov: 55 },
};

test("buildSequence renders a non-blank 3D sequence at requested dims", () => {
	const seq = buildSequence(P3D);
	expect(seq.frameCount).toBe(20);
	expect(seq.frames.length).toBe(20);
	expect(seq.frames[0].length).toBe(32 * 32 * 4);
	let lit = 0;
	for (const f of seq.frames)
		for (let i = 3; i < f.length; i += 4) if (f[i] > 0) lit++;
	expect(lit).toBeGreaterThan(100);
});

test("3D buildSequence is deterministic", () => {
	const a = buildSequence(P3D);
	const b = buildSequence(P3D);
	expect(Array.from(a.frames[0])).toEqual(Array.from(b.frames[0]));
	expect(Array.from(a.frames[10])).toEqual(Array.from(b.frames[10]));
});

test("camera yaw changes the rendered output", () => {
	const a = buildSequence(P3D);
	const b = buildSequence({
		...P3D,
		camera3d: { ...P3D.camera3d, yaw: 2.5 },
	});
	expect(Array.from(a.frames[5])).not.toEqual(Array.from(b.frames[5]));
});

test("3D frames are quantized to the requested palette size", () => {
	const seq = buildSequence({ ...P3D, paletteSize: 8 });
	const seen = new Set();
	for (const f of seq.frames)
		for (let i = 0; i < f.length; i += 4)
			if (f[i + 3] > 0) seen.add(`${f[i]},${f[i + 1]},${f[i + 2]}`);
	expect(seen.size).toBeLessThanOrEqual(8);
});

test("sanitizeParams clamps camera3d and reports messages", () => {
	const r = sanitizeParams({
		...P3D,
		camera3d: { yaw: 99, pitch: 3, dist: 0.5, fov: 5 },
	});
	expect(r.params.camera3d.yaw).toBe(12);
	expect(r.params.camera3d.pitch).toBeCloseTo(1.45, 6);
	expect(r.params.camera3d.dist).toBe(1.5);
	expect(r.params.camera3d.fov).toBe(30);
	const text = r.messages.join(" ");
	expect(text).toContain("yaw");
	expect(text).toContain("dist");
});

test("sanitizeParams sorts, caps and clips user markers", () => {
	const raw = [];
	for (let i = 0; i < 40; i++) {
		raw.push({ frame: 500 - i * 25, label: `m${i}${"x".repeat(80)}` });
	}
	const r = sanitizeParams({ ...P3D, userMarkers: raw });
	const um = r.params.userMarkers;
	expect(um.length).toBe(32);
	for (let i = 1; i < um.length; i++)
		expect(um[i].frame).toBeGreaterThanOrEqual(um[i - 1].frame);
	for (const m of um) {
		expect(m.frame).toBeGreaterThanOrEqual(0);
		expect(m.frame).toBeLessThanOrEqual(999);
		expect(m.label.length).toBeLessThanOrEqual(40);
	}
});

test("exportAtlas carries user markers alongside auto markers", () => {
	const atlas = exportAtlas({
		...P3D,
		userMarkers: [
			{ frame: 7, label: "hit" },
			{ frame: 2, label: "" },
		],
	});
	const doc = JSON.parse(new TextDecoder().decode(atlas.bytes));
	expect(doc.meta.userMarkers.length).toBe(2);
	expect(doc.meta.userMarkers[0].frame).toBe(2);
	expect(doc.meta.userMarkers[1].label).toBe("hit");
	expect(Array.isArray(doc.meta.markers)).toBe(true);
	expect(doc.meta.markers).toContain(0);
});

test("3D sheet and gif exports produce valid containers", () => {
	const sheet = exportSheet(P3D);
	expect(sheet.bytes[0]).toBe(0x89);
	expect(sheet.bytes[1]).toBe(0x50);
	expect(sheet.width % 32).toBe(0);
	expect(sheet.height % 32).toBe(0);
	expect(sheet.cellCount).toBe(20);
	const gif = exportGif(P3D);
	const head = new TextDecoder().decode(gif.bytes.subarray(0, 6));
	expect(head).toBe("GIF89a");
	expect(gif.cellCount).toBe(20);
});
