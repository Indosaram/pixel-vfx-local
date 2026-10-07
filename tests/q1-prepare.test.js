import { describe, expect, test } from "bun:test";
import { prepareParticles, frameStates, q1Frame, q1ShapeMask } from "../scripts/render-unity-asset.mjs";

// Record-like synthetic source with constant ranges so every expectation is
// derived by hand from the record fields (rate 10, cycle 5s, speed 3,
// lifetime 2, size 0.5, start RGBA 0.2/0.4/0.6/0.8, zero-radius sphere shell).
function mkRecord(initialOver = {}, sizeOver = {}) {
	const cfg = {
		system: { randomSeed: "q1prepare", simulationSpeed: 3, lengthInSec: 5 },
		emission: { rateOverTime: { max: 10 } },
		initial: {
			startLifetime: { min: 2, max: 2 },
			startSpeed: { min: 1, max: 1 },
			startSize: { min: 0.5, max: 0.5 },
			startRotation: { min: 0, max: 0 },
			startColor: {
				min: { r: 0.2, g: 0.4, b: 0.6, a: 0.8 },
				max: { r: 0.2, g: 0.4, b: 0.6, a: 0.8 },
			},
			gravityModifier: { max: 0 },
		},
		shape: { type: 1, radius: 0 },
		transform: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0, w: 1 } },
		renderer: { renderMode: 1, pivot: { x: 0, y: 0, z: 0 }, maxParticleSize: 0.1, minParticleSize: 0, sortMode: 0 },
		sizeOverLifetime: { enabled: false, curve: [{ t: 0, v: 1.5 }, { t: 1, v: 1.5 }] },
		colorOverLifetime: {
			enabled: false,
			colorKeys: [{ t: 0, rgb: [1, 1, 1] }, { t: 1, rgb: [1, 1, 1] }],
			alphaKeys: [{ t: 0, a: 1 }, { t: 1, a: 1 }],
		},
		noise: { enabled: false, frequency: 0.5, strength: 0 },
		gravity: 0,
	};
	Object.assign(cfg.initial, initialOver);
	Object.assign(cfg.sizeOverLifetime, sizeOver);
	return cfg;
}

const VIEW = { originX: 32, originY: 32, scale: 8, W: 64, H: 64 };

describe("shared production preparation entry", () => {
	test("buildParticles consumes record start RGBA, lifetime, count and nonzero speed-3 phase", () => {
		const cfg = mkRecord();
		const prep = prepareParticles(cfg, 5, true, VIEW);
		// count = rate*cycle*speed = 10*5*3 = 150
		expect(prep.count).toBe(150);
		expect(prep.particles.length).toBe(150);
		const p0 = prep.particles[0];
		expect(p0.color).toEqual([0.2, 0.4, 0.6, 0.8]);
		expect(p0.life).toBe(2);
		// zero-radius sphere shell at identity rotation: origin position, +z at speed 1
		expect(p0.pos).toEqual([0, 0, 0]);
		expect(p0.vel).toEqual([0, 0, 1]);
		// phase wall seconds: (i+jitter)/(rate*speed), jitter in (-.5,.5)
		const ph1 = prep.particles[1].phase;
		expect(ph1).toBeGreaterThan(0.5 / 30);
		expect(ph1).toBeLessThan(1.5 / 30);
	});

	test("frame entry: frameIndex/fps dispatch equals same-t states, independent of GIF/export length", () => {
		const cfg = mkRecord();
		const prep = prepareParticles(cfg, 5, true, VIEW);
		// 2/24 and 1/12 are the same simulation time; the entry takes no
		// frameCount or delay argument, so results must match exactly.
		const a = frameStates(prep, cfg, 2, 24);
		const b = frameStates(prep, cfg, 1, 12);
		expect(a.length).toBeGreaterThan(0);
		expect(a).toEqual(b);
		// hand-derived state at t=1/12: start RGBA identity, constant size
		for (const s of a) {
			expect(s.cr).toBeCloseTo(0.2, 12);
			expect(s.cg).toBeCloseTo(0.4, 12);
			expect(s.cb).toBeCloseTo(0.6, 12);
			expect(s.alpha).toBeCloseTo(0.8, 12);
			expect(s.sizePx).toBeCloseTo(4, 12);
		}
	});

	test("size gate: disabled ignores record curve, enabled applies it", () => {
		const cfgOff = mkRecord();
		const off = frameStates(prepareParticles(cfgOff, 5, true, VIEW), cfgOff, 1, 12);
		expect(off.length).toBeGreaterThan(0);
		for (const s of off) expect(s.sizePx).toBeCloseTo(4, 12);
		const cfgOn = mkRecord({}, { enabled: true });
		const on = frameStates(prepareParticles(cfgOn, 5, true, VIEW), cfgOn, 1, 12);
		expect(on.length).toBeGreaterThan(0);
		// size 0.5 * curve 1.5 * scale 8 = 6px (under the 6.4px max)
		for (const s of on) expect(s.sizePx).toBeCloseTo(6, 12);
	});

	test("boundary: q1 rejects nonzero gravity with nonunit speed", () => {
		const cfg = mkRecord({ gravityModifier: { max: 5 } });
		expect(() => prepareParticles(cfg, 5, true, VIEW)).toThrow();
		const cfgUnit = mkRecord({ gravityModifier: { max: 5 } });
		cfgUnit.system.simulationSpeed = 1;
		expect(() => prepareParticles(cfgUnit, 5, true, VIEW)).not.toThrow();
		expect(() => prepareParticles(cfg, 5, false, VIEW)).not.toThrow();
	});

	test("zero velocity end-to-end: prepare -> frameStates -> q1Frame, fallback angle 0", () => {
		// startSpeed 0 + zero-radius emitter at origin + no noise/gravity:
		// velocity is exactly [0,0,0], so velocityAngleRad fallback is 0 and
		// placement is the view origin (32,32) — known by construction.
		const cfg = mkRecord({
			startSpeed: { min: 0, max: 0 },
			startSize: { min: 1, max: 1 },
			startColor: {
				min: { r: 1, g: 0, b: 0, a: 1 },
				max: { r: 1, g: 0, b: 0, a: 1 },
			},
		});
		cfg.renderer.maxParticleSize = 0.15; // cap 9.6px so sizePx = 1*8 = 8 exactly
		const prep = prepareParticles(cfg, 5, true, VIEW);
		// t=1s (frame 12 @12fps): particle i=15 has phase in [14.5/30,15.5/30]
		// -> age=(1-phase)*3 in [1.45,1.55] < life 2, so states are nonempty.
		const states = frameStates(prep, cfg, 12, 12);
		expect(states.length).toBeGreaterThan(0);
		const s = states[0];
		for (const k of ["cx", "cy", "angle", "sizePx", "alpha", "cr", "cg", "cb"]) {
			expect(Number.isFinite(s[k])).toBe(true);
		}
		expect(s.cx).toBeCloseTo(32, 9);
		expect(s.cy).toBeCloseTo(32, 9);
		expect(s.angle).toBeCloseTo(0, 12);
		expect(s.sizePx).toBeCloseTo(8, 9);
		expect(s.alpha).toBeCloseTo(1, 12);
		expect(s.cr).toBeCloseTo(1, 12);
		// 8px sprite: full-coverage band |lx| <= 4-0.25 = 3.75; white(left
		// texels 0-3)/black(right texels 4-7) seam ramp spans lx in [-.5,+.5]
		// (8-texel texture: half a texel each side of the seam at lx=0).
		// Probe (29,32): lx in [-2.875,-2.125] — 1.625px clear of the ramp,
		// 0.875px clear of the feather bound -> full white mask.
		// Probe (34,32): lx in [2.125,2.875] — same margins -> zero mask.
		const rgba = new Uint8ClampedArray(8 * 8 * 4);
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				const v = x < 4 ? 255 : 0;
				const i = (y * 8 + x) * 4;
				rgba[i] = v;
				rgba[i + 1] = v;
				rgba[i + 2] = v;
				rgba[i + 3] = 255;
			}
		}
		const tex = { rgba, width: 8, height: 8 };
		const frame = q1Frame([s], tex, q1ShapeMask(tex), 64, 64);
		const at = (x, y) => Array.from(frame.slice((y * 64 + x) * 4, (y * 64 + x) * 4 + 4));
		// angle 0: +u points screen right, so right (+u) = leading (black
		// half), left (-u) = trailing (white half tinted by start color).
		expect(at(29, 32)).toEqual([232, 0, 0, 255]);
		expect(at(34, 32)).toEqual([0, 0, 0, 0]);
	});
});
