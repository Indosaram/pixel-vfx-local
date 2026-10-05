import { expect, test } from "bun:test";
import { getPreset, PRESETS } from "../src/effects.js";
import { rasterFrame } from "../src/raster.js";
import { Sim } from "../src/sim.js";

function snapshot(sim) {
	return JSON.stringify(
		sim.particles.map((p) => [
			p.x,
			p.y,
			p.vx,
			p.vy,
			p.age,
			p.life,
			p.spawnTime,
			p.dead,
		]),
	);
}

test("same seed and steps produce identical state", () => {
	const fx = getPreset("ember_burst");
	const a = new Sim(fx, "777");
	const b = new Sim(fx, "777");
	for (let i = 0; i < 150; i++) {
		a.step();
		b.step();
	}
	expect(snapshot(a)).toBe(snapshot(b));
});

test("different seeds diverge", () => {
	const fx = getPreset("ember_burst");
	const a = new Sim(fx, "777");
	const b = new Sim(fx, "778");
	for (let i = 0; i < 60; i++) {
		a.step();
		b.step();
	}
	expect(snapshot(a)).not.toBe(snapshot(b));
});

test("frame() seek equals sequential stepping", () => {
	const fx = getPreset("magic_sparkle");
	const a = new Sim(fx, "seek");
	const b = new Sim(fx, "seek");
	a.frame(9, 30);
	for (let i = 0; i < (9 / 30) * 120; i++) b.step();
	expect(snapshot(a)).toBe(snapshot(b));
});

test("backward seek resets and reproduces forward result", () => {
	const fx = getPreset("rain_loop");
	const a = new Sim(fx, "scrub");
	a.frame(24, 12);
	const atEnd = snapshot(a);
	a.frame(4, 12);
	a.frame(24, 12);
	expect(snapshot(a)).toBe(atEnd);
});

test("loop presets keep particle count via respawn", () => {
	const fx = getPreset("snow_loop");
	const a = new Sim(fx, "snow");
	for (let i = 0; i < 600; i++) a.step();
	expect(a.particles.length).toBe(fx.spawn.count);
	expect(a.particles.filter((p) => !p.dead).length).toBeGreaterThan(0);
});

test("every preset rasterizes every frame without crash, early frames visible", () => {
	for (const fx of PRESETS) {
		const sim = new Sim(fx, "smoke");
		const fc = Math.max(2, Math.ceil(fx.duration * 12));
		let peak = 0;
		for (let f = 0; f < fc; f++) {
			sim.frame(f, 12);
			const buf = rasterFrame(sim, fx, 96, 96, { zoom: 1, panX: 0, panY: 0 });
			let visible = 0;
			for (let i = 3; i < buf.length; i += 4) if (buf[i] > 0) visible++;
			if (f === 1) expect(visible).toBeGreaterThan(0);
			peak = Math.max(peak, visible);
		}
		expect(peak).toBeGreaterThan(10);
	}
});

test("rasterization is deterministic", () => {
	const fx = getPreset("explosion_ring");
	const a = new Sim(fx, "det");
	const b = new Sim(fx, "det");
	a.frame(5, 12);
	b.frame(5, 12);
	const cam = { zoom: 2, panX: 0.1, panY: -0.1 };
	const ra = rasterFrame(a, fx, 64, 64, cam);
	const rb = rasterFrame(b, fx, 64, 64, cam);
	expect(Array.from(ra)).toEqual(Array.from(rb));
});

test("camera zoom changes raster output", () => {
	const fx = getPreset("magic_sparkle");
	const a = new Sim(fx, "cam");
	const b = new Sim(fx, "cam");
	a.frame(8, 12);
	b.frame(8, 12);
	const ra = rasterFrame(a, fx, 64, 64, { zoom: 1, panX: 0, panY: 0 });
	const rb = rasterFrame(b, fx, 64, 64, { zoom: 4, panX: 0.2, panY: 0.2 });
	expect(Array.from(ra)).not.toEqual(Array.from(rb));
});
