import { describe, expect, test } from "bun:test";
import {
	particleStatesAt,
	q1Frame,
	q1ShapeMask,
	trajectory,
	buildParticles,
} from "../scripts/render-unity-asset.mjs";

// Literals below are derived independently from the M1 contract:
// straighten(premult/A, A) with M = acesFitted(Cbar) per channel,
// linearToSrgb(c) = 1.055*c^(1/2.4)-0.055, mask = round(linearLum*255).
// White texel (1,0,0) linear after red tint, full coverage:
//   acesFitted(1) = 2.54/3.16 -> srgb -> round(255*x) = 232, alpha 255.
const WHITE_TINTED_RED = [232, 0, 0, 255];
const NO_HIT = [0, 0, 0, 0];

function mkCfg(overrides = {}) {
	return {
		system: { simulationSpeed: 3, lengthInSec: 5, ...overrides.system },
		renderer: {
			renderMode: 1,
			pivot: { x: 0, y: 1, z: 0 },
			maxParticleSize: 0.1,
			minParticleSize: 0,
			sortMode: 0,
			...overrides.renderer,
		},
		colorOverLifetime: overrides.colorOverLifetime ?? {
			enabled: true,
			mode: 0,
			colorKeys: [
				{ t: 0, rgb: [0, 0, 1] },
				{ t: 1, rgb: [0, 0, 1] },
			],
			alphaKeys: [
				{ t: 0, a: 0.25 },
				{ t: 1, a: 0.75 },
			],
		},
		gravity: [0, 0, 0],
		noise: { enabled: false, frequency: 0.5, strength: 0 },
	};
}

function mkParticle() {
	return {
		phase: 0,
		life: 2,
		size: 0.5,
		rot: 0.7,
		color: [0.2, 0.4, 0.6, 0.8],
		pos: [1, 2, 0],
		vel: [2, -1, 0],
		gravity: 0,
		damp: 0,
		turbulence: 0,
	};
}

function mkOpts(extra = {}) {
	return {
		q1: true,
		cycle: 5,
		simSpeed: 3,
		originX: 32,
		originY: 32,
		scale: 8,
		W: 64,
		H: 64,
		sizeKeys: [
			{ t: 0, v: 1 },
			{ t: 1, v: 1 },
		],
		alphaKeys: [
			{ t: 0, a: 1 },
			{ t: 1, a: 1 },
		],
		maxParticleSize: 0.1,
		...extra,
	};
}

function stateAt(cfg, p, t, opts) {
	const tr = trajectory(p, cfg, 0.01);
	return particleStatesAt(cfg, [p], [tr], t, opts);
}

describe("quality-v1 production state adapter (R2)", () => {
	test("nonidentity color, alpha, orientation, pivot, speed-3 clock", () => {
		const cfg = mkCfg();
		const p = mkParticle();
		const [s] = stateAt(cfg, p, 0.5, mkOpts());
		// speed-3: source age 0.5 -> simulation clock 1.5, u = 1.5/2 = 0.75
		// alpha = start 0.8 * lerp(0.25,0.75,0.75) = 0.5
		expect(s.alpha).toBeCloseTo(0.5, 12);
		// color = start * blue ramp = [0,0,0.6]
		expect(s.cr).toBeCloseTo(0, 12);
		expect(s.cg).toBeCloseTo(0, 12);
		expect(s.cb).toBeCloseTo(0.6, 12);
		// world at clock 1.5: x=1+2*1.5=4, y=2-1.5=0.5 -> screen (64,28)
		expect(s.sizePx).toBeCloseTo(4, 12);
		// pivot (0,1,0) at angle atan2(-1,2): off = [4/sqrt5, -8/sqrt5]
		const ang = Math.atan2(-1, 2);
		expect(s.angle).toBeCloseTo(ang, 12);
		expect(s.cx).toBeCloseTo(64 + 4 / Math.sqrt(5), 9);
		expect(s.cy).toBeCloseTo(28 - 8 / Math.sqrt(5), 9);
	});

	test("source period wraps state identically at t and t+cycle", () => {
		const cfg = mkCfg();
		const p = mkParticle();
		const a = stateAt(cfg, p, 0.5, mkOpts())[0];
		const b = stateAt(cfg, p, 5.5, mkOpts())[0];
		expect(b.alpha).toBeCloseTo(a.alpha, 12);
		expect(b.cx).toBeCloseTo(a.cx, 9);
		expect(b.cy).toBeCloseTo(a.cy, 9);
	});

	test("lifetime death gate: age past life emits nothing", () => {
		const cfg = mkCfg();
		const p = mkParticle();
		// source age 1.0 -> clock 3.0 >= life 2 -> dead
		expect(stateAt(cfg, p, 1.0, mkOpts())).toEqual([]);
	});

	test("flags: disabled colorOverLifetime is identity even with keys", () => {
		const cfg = mkCfg({
			colorOverLifetime: {
				enabled: false,
				mode: 0,
				colorKeys: [{ t: 0, rgb: [0, 0, 1] }],
				alphaKeys: [{ t: 0, a: 0.25 }],
			},
		});
		const p = mkParticle();
		const [s] = stateAt(cfg, p, 0.5, mkOpts());
		expect(s.cr).toBeCloseTo(0.2, 12);
		expect(s.cg).toBeCloseTo(0.4, 12);
		expect(s.cb).toBeCloseTo(0.6, 12);
		expect(s.alpha).toBeCloseTo(0.8, 12);
	});

	test("profile dispatch: legacy state keeps rotation and ignores pivot", () => {
		const cfg = mkCfg();
		const p = mkParticle();
		const [s] = stateAt(cfg, p, 0.5, mkOpts({ q1: false, simSpeed: 1 }));
		expect(s.angle).toBe(0.7);
		expect(s.cx).toBeCloseTo(48, 9);
		expect(s.cy).toBeCloseTo(20, 9);
	});
});

// 8x8 texture: left half white, right half black, fully opaque.
function mkTex() {
	const t = new Uint8ClampedArray(8 * 8 * 4);
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			const v = x < 4 ? 255 : 0;
			const i = (y * 8 + x) * 4;
			t[i] = v;
			t[i + 1] = v;
			t[i + 2] = v;
			t[i + 3] = 255;
		}
	}
	return { rgba: t, width: 8, height: 8 };
}

function pixel(rgba, x, y) {
	const i = (y * 64 + x) * 4;
	return [rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]];
}

describe("quality-v1 production pixel adapter (R2)", () => {
	const tex = mkTex();
	const mask = q1ShapeMask(tex);
	test("shape mask is linear luminance: white 255, black 0", () => {
		expect(mask[0]).toBe(255);
		expect(mask[4]).toBe(0);
	});

	test("asymmetric texture at 0/45/90 deg, finite zero velocity", () => {
		const probes = [
			{ x: 26, y: 29, at0: WHITE_TINTED_RED, at45: WHITE_TINTED_RED, at90: NO_HIT },
			{ x: 29, y: 26, at0: WHITE_TINTED_RED, at45: NO_HIT, at90: NO_HIT },
			{ x: 34, y: 37, at0: NO_HIT, at45: WHITE_TINTED_RED, at90: WHITE_TINTED_RED },
		];
		const angles = [0, Math.PI / 4, Math.PI / 2];
		for (let ai = 0; ai < angles.length; ai++) {
			const frame = q1Frame(
				[
					{
						cx: 32,
						cy: 32,
						sizePx: 16,
						angle: angles[ai],
						cr: 1,
						cg: 0,
						cb: 0,
						alpha: 1,
					},
				],
				tex,
				mask,
				64,
				64,
			);
			const keys = ["at0", "at45", "at90"];
			for (const pr of probes) {
				expect(pixel(frame, pr.x, pr.y)).toEqual(pr[keys[ai]]);
			}
		}
	});

	test("connected world velocity (0,1): +u leading half renders above center", () => {
		const cfg = mkCfg({
			colorOverLifetime: {
				enabled: false,
				mode: 0,
				colorKeys: [{ t: 0, rgb: [0, 0, 1] }],
				alphaKeys: [{ t: 0, a: 0.25 }],
			},
		});
		const p = mkParticle();
		p.pos = [0, 0, 0];
		p.vel = [0, 1, 0];
		p.color = [1, 0, 0, 1];
		const [s] = stateAt(cfg, p, 0, mkOpts());
		// world angle convention: +u -> screen (cos, -sin); world (0,1) = up
		expect(s.angle).toBeCloseTo(Math.PI / 2, 12);
		// pivot (0,1,0), sizePx 4: off = [-4*sin, -4*cos] = [-4, 0]
		expect(s.cx).toBeCloseTo(28, 9);
		expect(s.cy).toBeCloseTo(32, 9);
		// asymmetric texture: left half black (trailing), right half white (leading)
		const rgba = new Uint8ClampedArray(8 * 8 * 4);
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				const v = x < 4 ? 0 : 255;
				const i = (y * 8 + x) * 4;
				rgba[i] = v;
				rgba[i + 1] = v;
				rgba[i + 2] = v;
				rgba[i + 3] = 255;
			}
		}
		const vt = { rgba, width: 8, height: 8 };
		const vm = q1ShapeMask(vt);
		const frame = q1Frame([s], vt, vm, 64, 64);
		const cx = Math.round(s.cx);
		const cy = Math.round(s.cy);
		// velocity leads up on screen: leading half above center, trailing below.
		// Exact soft literal derived independently in
		// sprite-astra-rotation-fixture-check.md: 4x4 subsample masks
		// 1,1,1,.75 -> Abar=15/16; M=ACES(Abar)=.7897789254201244;
		// M/A=.842430853781466 -> R=round(255*(1.055*(M/A)^(1/2.4)-.055))=236;
		// alpha=round(255*15/16)=239. Old rot sign independently gives
		// [255,0,0,16]; trailing black half stays exactly zero.
		expect(pixel(frame, cx, cy - 1)).toEqual([236, 0, 0, 239]);
		expect(pixel(frame, cx, cy + 1)).toEqual(NO_HIT);
	});

	test("connected world velocities (1,0) and (1,1): Astra safe probes at 0 and 45", () => {
		const cfg = mkCfg({
			colorOverLifetime: {
				enabled: false,
				mode: 0,
				colorKeys: [{ t: 0, rgb: [0, 0, 1] }],
				alphaKeys: [{ t: 0, a: 0.25 }],
			},
		});
		// explicit final center: pivot (0,0,0) -> offset [0,0] at every angle;
		// sizePx = 2 * 8 = 16 capped by 0.25 * 64 = 16 (matches Astra's
		// documented 16px geometry at center 32,32).
		cfg.renderer = { ...cfg.renderer, pivot: { x: 0, y: 0, z: 0 }, maxParticleSize: 0.25 };
		const tex = mkTex();
		const mask = q1ShapeMask(tex);
		const cases = [
			{ vel: [1, 0, 0], angle: 0, probes: [[26, 29, "hit"], [29, 26, "hit"], [34, 37, "zero"]] },
			{ vel: [1, 1, 0], angle: Math.PI / 4, probes: [[26, 29, "hit"], [29, 26, "zero"], [34, 37, "hit"]] },
		];
		for (const c of cases) {
			const p = mkParticle();
			p.pos = [0, 0, 0];
			p.vel = c.vel;
			p.size = 2;
			p.color = [1, 0, 0, 1];
			const [s] = stateAt(cfg, p, 0, mkOpts({ maxParticleSize: 0.25 }));
			// angle flows from the trajectory velocity, not a hand-set value
			expect(Number.isFinite(s.angle)).toBe(true);
			expect(s.angle).toBeCloseTo(c.angle, 12);
			expect(s.cx).toBeCloseTo(32, 9);
			expect(s.cy).toBeCloseTo(32, 9);
			expect(s.sizePx).toBeCloseTo(16, 9);
			const frame = q1Frame([s], tex, mask, 64, 64);
			for (const [x, y, want] of c.probes) {
				expect(pixel(frame, x, y)).toEqual(want === "hit" ? WHITE_TINTED_RED : NO_HIT);
			}
		}
	});

	test("midgray mask and fractional tint use linear light", () => {
		const rgba = new Uint8ClampedArray(8 * 8 * 4);
		for (let i = 0; i < rgba.length; i += 4) {
			rgba[i] = 128;
			rgba[i + 1] = 128;
			rgba[i + 2] = 128;
			rgba[i + 3] = 255;
		}
		const tex = { rgba, width: 8, height: 8 };
		const mask = q1ShapeMask(tex);
		expect(Array.from(mask)).toEqual(Array(64).fill(55));
		const frame = q1Frame(
			[{ cx: 32, cy: 32, sizePx: 16, angle: 0,
				cr: 0.5, cg: 0, cb: 0, alpha: 1 }],
			tex, mask, 64, 64,
		);
		expect(pixel(frame, 32, 32)).toEqual([70, 0, 0, 55]);
	});
});
