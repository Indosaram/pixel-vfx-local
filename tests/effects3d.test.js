import { expect, test } from "bun:test";
import { ALL_PRESETS, PRESETS } from "../src/effects.js";
import { PRESETS3D } from "../src/effects3d.js";

test("exactly six original 3D presets with unique ids", () => {
	expect(PRESETS3D.length).toBe(6);
	const ids = PRESETS3D.map((p) => p.id);
	expect(new Set(ids).size).toBe(ids.length);
	for (const p of PRESETS3D) {
		expect(p.kind).toBe("3d");
		expect(p.duration).toBeGreaterThan(0);
		expect(typeof p.loop).toBe("boolean");
		expect(typeof p.scene).toBe("function");
		expect(typeof p.name).toBe("string");
	}
});

test("3D presets merge into ALL_PRESETS behind the 2D ones", () => {
	expect(ALL_PRESETS.length).toBe(PRESETS.length + PRESETS3D.length);
	expect(ALL_PRESETS[PRESETS.length].id).toBe(PRESETS3D[0].id);
	const two = new Set(PRESETS.map((p) => p.id));
	for (const p of PRESETS3D) expect(two.has(p.id)).toBe(false);
});

function walkFinite(value, path = "$") {
	if (typeof value === "number") {
		if (!Number.isFinite(value)) throw new Error(`non-finite at ${path}`);
		return;
	}
	if (Array.isArray(value)) {
		value.forEach((v, i) => {
			walkFinite(v, `${path}[${i}]`);
		});
		return;
	}
	if (value && typeof value === "object") {
		for (const [k, v] of Object.entries(value)) walkFinite(v, `${path}.${k}`);
	}
}

test("scene() is pure, finite and in-range across the duration", () => {
	for (const p of PRESETS3D) {
		const a = p.scene(0.3, "7");
		const b = p.scene(0.3, "7");
		expect(a).toEqual(b);
		for (const t of [0, p.duration / 3, p.duration]) {
			const s = p.scene(t, "7");
			walkFinite(s, `${p.id}@${t}`);
			expect(s.particles.length).toBeGreaterThanOrEqual(0);
			for (const m of s.meshes) {
				expect(typeof m.geo).toBe("string");
				expect(m.color.length).toBe(3);
				expect(m.pos.every(Number.isFinite)).toBe(true);
				expect(m.scale.every((v) => v > 0)).toBe(true);
			}
			for (const q of s.particles) {
				expect(q.alpha).toBeGreaterThanOrEqual(0);
				expect(q.alpha).toBeLessThanOrEqual(1.001);
				expect(q.size).toBeGreaterThan(0);
			}
		}
	}
});

test("different seeds produce different scenes", () => {
	for (const p of PRESETS3D) {
		const a = JSON.stringify(p.scene(0.2, "7"));
		const b = JSON.stringify(p.scene(0.2, "8"));
		expect(a).not.toBe(b);
	}
});

test("mesh and particle field names match the renderer contract", () => {
	for (const p of PRESETS3D) {
		const s = p.scene(0.2, "7");
		for (const m of s.meshes) {
			for (const k of ["geo", "pos", "rot", "scale", "color"])
				expect(k in m).toBe(true);
		}
		for (const q of s.particles) {
			for (const k of ["x", "y", "z", "size", "color", "alpha", "glow"])
				expect(k in q).toBe(true);
		}
	}
});
