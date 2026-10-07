import { describe, expect, test } from "bun:test";
import {
	acesFitted,
	compositeOnBackground,
	compositeOver,
	linearToSrgb,
	periodicTongueInverse,
	periodicTongueState,
	renderQualityFrame,
	straighten,
} from "../src/quality-render.js";

const view = { zoom: 1, panX: 0, panY: 0 };

function quadEffect(layer = {}) {
	return {
		id: "fixture_quad",
		kind: "quality",
		duration: 1,
		loop: false,
		layers: [
			{
				id: "q",
				kind: "quad",
				t0: 0,
				t1: 1,
				cx: 32,
				cy: 32,
				w: 16,
				h: 16,
				rot: 0,
				feather: 0.5,
				color: [1, 0, 0],
				alpha: 1,
				...layer,
			},
		],
	};
}

function streakEffect(vx, vy) {
	return {
		id: "fixture_streak",
		kind: "quality",
		duration: 1,
		loop: false,
		layers: [
			{
				id: "s",
				kind: "streak",
				t0: 0,
				t1: 1,
				x0: 10,
				y0: 32,
				vx,
				vy,
				width: 3,
				length: 10,
				stretch: 0.1,
				dotDiameter: 6,
				feather: 0.5,
				color: [1, 1, 1],
				alpha: 1,
				fade: [0.05, 0.05],
			},
		],
	};
}

function px(rgba, W, x, y) {
	const o = (y * W + x) * 4;
	return [rgba[o], rgba[o + 1], rgba[o + 2], rgba[o + 3]];
}

function bbox(rgba, W, H) {
	let x0 = Infinity;
	let y0 = Infinity;
	let x1 = -1;
	let y1 = -1;
	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			if (rgba[(y * W + x) * 4 + 3] > 10) {
				if (x < x0) x0 = x;
				if (y < y0) y0 = y;
				if (x > x1) x1 = x;
				if (y > y1) y1 = y;
			}
		}
	}
	return { w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

describe("spec transfer functions vs hand-computed literals", () => {
	test("linear to sRGB", () => {
		expect(linearToSrgb(0)).toBe(0);
		expect(linearToSrgb(0.003)).toBeCloseTo(0.03876, 5);
		expect(linearToSrgb(0.5)).toBeCloseTo(0.735357, 6);
		expect(linearToSrgb(1)).toBeCloseTo(1, 12);
	});
	test("ACES approximation", () => {
		expect(acesFitted(0)).toBe(0);
		expect(acesFitted(1)).toBeCloseTo(0.803797, 6);
		expect(acesFitted(50)).toBe(1);
		expect(acesFitted(-1)).toBe(0);
	});
	test("premultiplied source-over identity", () => {
		const out = compositeOver(
			{ rgb: [0, 0, 0.5], a: 0.5 },
			{ rgb: [0.5, 0, 0], a: 0.5 },
		);
		expect(out[0]).toBe(0.5);
		expect(out[1]).toBe(0);
		expect(out[2]).toBe(0.25);
		expect(out[3]).toBe(0.75);
	});
	test("straighten divides premult then encodes", () => {
		const st = straighten([0.5, 0, 0.25], 0.75);
		expect(st[0]).toBeCloseTo(0.83601, 5);
		expect(st[1]).toBe(0);
		expect(st[2]).toBeCloseTo(0.6125, 5);
		expect(st[3]).toBe(0.75);
		const empty = straighten([1, 1, 1], 0);
		expect(empty).toEqual([0, 0, 0, 0]);
	});
});

describe("analytic fixtures", () => {
	test("opaque interior matches hand-computed transfer chain", () => {
		const f = renderQualityFrame(quadEffect(), 0.5, "s1", view, 64, 64);
		const c = px(f, 64, 32, 32);
		expect(Math.abs(c[0] - 232)).toBeLessThanOrEqual(1);
		expect(c[1]).toBe(0);
		expect(c[2]).toBe(0);
		expect(c[3]).toBe(255);
		expect(px(f, 64, 5, 5)).toEqual([0, 0, 0, 0]);
	});
	test("zero-alpha colored layer contributes nothing", () => {
		const base = renderQualityFrame(quadEffect(), 0.5, "s1", view, 64, 64);
		const ghost = quadEffect();
		ghost.layers.push({
			id: "ghost",
			kind: "quad",
			t0: 0,
			t1: 1,
			cx: 32,
			cy: 32,
			w: 60,
			h: 60,
			feather: 0.5,
			color: [1, 1, 1],
			alpha: 0,
		});
		const withGhost = renderQualityFrame(ghost, 0.5, "s1", view, 64, 64);
		expect(Array.from(withGhost)).toEqual(Array.from(base));
	});
	test("area conservation: soft alpha survives 4x reduction", () => {
		const f = renderQualityFrame(
			quadEffect({ alpha: 0.4 }),
			0.5,
			"s1",
			view,
			64,
			64,
		);
		const c = px(f, 64, 32, 32);
		expect(Math.abs(c[3] - 102)).toBeLessThanOrEqual(1);
	});
	test("emissive overlap stays unclipped at the intermediate stage", () => {
		const fx = {
			id: "fixture_emit",
			kind: "quality",
			duration: 1,
			loop: false,
			layers: [
				{
					id: "a",
					kind: "radial",
					t0: 0,
					t1: 1,
					cx: 32,
					cy: 32,
					r1: 12,
					feather: 0.5,
					color: [0, 0, 0],
					alpha: 1,
					material: "emission",
					emission: [1, 0.5, 0.25],
					emissionStrength: 0.8,
				},
				{
					id: "b",
					kind: "radial",
					t0: 0,
					t1: 1,
					cx: 32,
					cy: 32,
					r1: 12,
					feather: 0.5,
					color: [0, 0, 0],
					alpha: 1,
					material: "emission",
					emission: [1, 0.5, 0.25],
					emissionStrength: 0.8,
				},
			],
		};
		const { stages } = renderQualityFrame(
			fx,
			0.5,
			"s1",
			view,
			64,
			64,
			{ stages: true },
		);
		expect(stages.emissionPeak).toBeCloseTo(1.6, 1);
		expect(stages.subsampleGrid).toBe(4);
	});
	test("streak axes 0, 45, 90 degrees stay finite and oriented", () => {
		const h = bbox(renderQualityFrame(streakEffect(40, 0), 0.5, "s1", view, 64, 64), 64, 64);
		expect(h.w).toBeGreaterThan(h.h * 2);
		const v = bbox(renderQualityFrame(streakEffect(0, 40), 0.5, "s1", view, 64, 64), 64, 64);
		expect(v.h).toBeGreaterThan(v.w * 2);
		const d = bbox(renderQualityFrame(streakEffect(30, 30), 0.5, "s1", view, 64, 64), 64, 64);
		const ratio = d.w / d.h;
		expect(ratio).toBeGreaterThan(0.7);
		expect(ratio).toBeLessThan(1.43);
	});
	test("zero velocity falls back to a finite round dot", () => {
		const f = renderQualityFrame(streakEffect(0, 0), 0.5, "s1", view, 64, 64);
		const b = bbox(f, 64, 64);
		expect(b.w).toBeGreaterThan(0);
		const ratio = b.w / b.h;
		expect(ratio).toBeGreaterThan(0.7);
		expect(ratio).toBeLessThan(1.43);
		for (let i = 0; i < f.length; i++) expect(Number.isFinite(f[i])).toBe(true);
	});
	test("render is byte-deterministic and seed-sensitive", () => {
		const seeded = quadEffect({ seeded: true, jitter: 2 });
		const a = renderQualityFrame(seeded, 0.5, "alpha", view, 64, 64);
		const b = renderQualityFrame(seeded, 0.5, "alpha", view, 64, 64);
		const c = renderQualityFrame(seeded, 0.5, "beta", view, 64, 64);
		expect(Array.from(a)).toEqual(Array.from(b));
		expect(Array.from(a)).not.toEqual(Array.from(c));
	});
	test("camera zoom magnifies coverage", () => {
		const plain = renderQualityFrame(quadEffect(), 0.5, "s1", view, 64, 64);
		const zoomed = renderQualityFrame(
			quadEffect(),
			0.5,
			"s1",
			{ zoom: 2, panX: 0, panY: 0 },
			64,
			64,
		);
		const count = (f) => {
			let n = 0;
			for (let i = 3; i < f.length; i += 4) if (f[i] > 0) n++;
			return n;
		};
		expect(count(zoomed)).toBeGreaterThan(count(plain) * 2);
	});
	test("dark, gray, and light composites remain clean", () => {
		const f = renderQualityFrame(quadEffect(), 0.5, "s1", view, 64, 64);
		const center = px(f, 64, 32, 32);
		for (const bg of [
			[0, 0, 0],
			[128, 128, 128],
			[240, 240, 240],
		]) {
			const comp = compositeOnBackground(f, bg);
			expect(px(comp, 64, 32, 32)).toEqual([
				center[0],
				center[1],
				center[2],
				255,
			]);
			expect(px(comp, 64, 5, 5)).toEqual([bg[0], bg[1], bg[2], 255]);
			const edge = px(comp, 64, 24, 32);
			for (let ch = 0; ch < 3; ch++) {
				expect(edge[ch]).toBeGreaterThanOrEqual(
					Math.min(bg[ch], center[ch]),
				);
				expect(edge[ch]).toBeLessThanOrEqual(
					Math.max(bg[ch], center[ch]),
				);
			}
		}
	});
	test("compositeOnBackground matches hand-computed alpha blend", () => {
		const two = new Uint8ClampedArray([200, 100, 50, 128, 0, 0, 0, 0]);
		const light = compositeOnBackground(two, [240, 240, 240]);
		expect([light[0], light[1], light[2]]).toEqual([220, 170, 145]);
		const mid = compositeOnBackground(two, [128, 128, 128]);
		expect([mid[4], mid[5], mid[6]]).toEqual([128, 128, 128]);
	});
});

// Astra M1 verdict defect 1: these exercise the PRODUCTION render loop
// (renderQualityFrame), not the compositeOver helper. Expected bytes are
// independent literal chains: premultiplied source-over in linear light,
// then the module's specified aces -> straighten(/a) -> sRGB encoding.
describe("production source-over RGB occlusion (Astra defect 1)", () => {
	const overlapFixture = {
		id: "fixture_translucent_quads",
		kind: "quality",
		duration: 1,
		loop: false,
		layers: [
			{ id: "qA", kind: "quad", t0: 0, t1: 1, cx: 26, cy: 30, w: 30, h: 22, rot: 0.3, feather: 1.5, color: [0.9, 0.2, 0.2], alpha: 0.6, fade: [0.05, 0.05] },
			{ id: "qB", kind: "quad", t0: 0, t1: 1, cx: 40, cy: 38, w: 30, h: 22, rot: -0.25, feather: 1.5, color: [0.2, 0.4, 0.9], alpha: 0.6, fade: [0.05, 0.05] },
		],
	};
	test("full-render overlap matches independent literal source-over chain", () => {
		const f = renderQualityFrame(overlapFixture, 0.5, "s1", view, 64, 64);
		// bottom red .6 over top blue .6: premult [.336,.288,.588], a=.84
		// aces(premult) -> /a -> sRGB = [199,188,230]; a*255 = 214
		const c = px(f, 64, 32, 32);
		expect(Math.abs(c[0] - 199)).toBeLessThanOrEqual(1);
		expect(Math.abs(c[1] - 188)).toBeLessThanOrEqual(1);
		expect(Math.abs(c[2] - 230)).toBeLessThanOrEqual(1);
		expect(c[3]).toBe(214);
	});
	test("reversed layer order changes overlapped RGB (literal reversed chain)", () => {
		const rev = { ...overlapFixture, layers: [...overlapFixture.layers].reverse() };
		const f = renderQualityFrame(rev, 0.5, "s1", view, 64, 64);
		// top red .6 over bottom blue .6: premult [.588,.216,.336], a=.84
		// -> [230,167,199]; a*255 = 214
		const c = px(f, 64, 32, 32);
		expect(Math.abs(c[0] - 230)).toBeLessThanOrEqual(1);
		expect(Math.abs(c[1] - 167)).toBeLessThanOrEqual(1);
		expect(Math.abs(c[2] - 199)).toBeLessThanOrEqual(1);
		expect(c[3]).toBe(214);
		const fwd = px(renderQualityFrame(overlapFixture, 0.5, "s1", view, 64, 64), 64, 32, 32);
		expect(c.slice(0, 3)).not.toEqual(fwd.slice(0, 3));
	});
	test("opaque front quad fully occludes background color", () => {
		const fx = {
			id: "fixture_occlude",
			kind: "quality",
			duration: 1,
			loop: false,
			layers: [
				{ id: "back", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 40, h: 40, rot: 0, feather: 0.5, color: [0, 1, 0], alpha: 1, fade: [0.05, 0.05] },
				{ id: "front", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 16, h: 16, rot: 0, feather: 0.5, color: [1, 0, 0], alpha: 1, fade: [0.05, 0.05] },
			],
		};
		const c = px(renderQualityFrame(fx, 0.5, "s1", view, 64, 64), 64, 32, 32);
		// opaque red over opaque green: premult [1,0,0], a=1
		// aces(1)=0.803797 -> sRGB -> 232; additive would wrongly give [232,232,0]
		expect(c).toEqual([232, 0, 0, 255]);
	});
});

// Astra M1 verdict defect 2: explicit material kind; emission must NOT
// manufacture normal coverage; export coverage = max(normal, max(ACES(E))).
describe("emission coverage separation (Astra defect 2)", () => {
	const emissiveFixture = {
		id: "fixture_emissive_quads",
		kind: "quality",
		duration: 1,
		loop: false,
		layers: [
			{ id: "eA", kind: "quad", t0: 0, t1: 1, cx: 27, cy: 32, w: 26, h: 26, feather: 1.5, color: [0, 0, 0], alpha: 1, material: "emission", emission: [1, 0.7, 0.3], emissionStrength: 1.2, fade: [0.05, 0.05] },
			{ id: "eB", kind: "quad", t0: 0, t1: 1, cx: 38, cy: 32, w: 26, h: 26, feather: 1.5, color: [0, 0, 0], alpha: 1, material: "emission", emission: [1, 0.7, 0.3], emissionStrength: 1.2, fade: [0.05, 0.05] },
		],
	};
	test("emission-only overlap: alpha is max(ACES(E)), not layer opacity", () => {
		const f = renderQualityFrame(emissiveFixture, 0.5, "s1", view, 64, 64);
		// E = 2 * [1,.7,.3] * 1.2 = [2.4,1.68,.72] linear, unclipped
		// ACES(E) = [.93421,.89298,.72500] -> a = .93421 -> 238
		// straight m/a = [1, .95586, .77606] -> sRGB = [255,250,228]
		const c = px(f, 64, 32, 32);
		expect(Math.abs(c[0] - 255)).toBeLessThanOrEqual(1);
		expect(Math.abs(c[1] - 250)).toBeLessThanOrEqual(1);
		expect(Math.abs(c[2] - 228)).toBeLessThanOrEqual(1);
		expect(c[3]).toBe(238);
	});
	test("zero-energy emission layer creates no coverage", () => {
		const fx = {
			id: "fixture_emit_zero",
			kind: "quality",
			duration: 1,
			loop: false,
			layers: [
				{ id: "z", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 30, h: 30, feather: 0.5, color: [0, 0, 0], alpha: 1, material: "emission", emission: [0, 0, 0], emissionStrength: 0, fade: [0.05, 0.05] },
			],
		};
		const f = renderQualityFrame(fx, 0.5, "s1", view, 64, 64);
		expect(px(f, 64, 32, 32)).toEqual([0, 0, 0, 0]);
		let lit = 0;
		for (let i = 3; i < f.length; i += 4) if (f[i] > 0) lit++;
		expect(lit).toBe(0);
	});
	test("weak vs strong energy at identical geometry orders coverage", () => {
		const mk = (emission, strength) => ({
			id: "fixture_emit_level",
			kind: "quality",
			duration: 1,
			loop: false,
			layers: [
				{ id: "q", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 24, h: 24, feather: 1, color: [0, 0, 0], alpha: 1, material: "emission", emission, emissionStrength: strength, fade: [0.05, 0.05] },
			],
		});
		const weak = px(renderQualityFrame(mk([0.1, 0.1, 0.1], 1), 0.5, "s1", view, 64, 64), 64, 32, 32);
		const strong = px(renderQualityFrame(mk([1, 1, 1], 1), 0.5, "s1", view, 64, 64), 64, 32, 32);
		// ACES(.1) = .12584 -> 32 ; ACES(1) = .803797 -> 205
		expect(weak[3]).toBe(32);
		expect(strong[3]).toBe(205);
		expect(strong[3]).toBeGreaterThan(weak[3]);
	});
	test("mixed normal + emission pixel combines coverage with max", () => {
		const fx = {
			id: "fixture_mixed",
			kind: "quality",
			duration: 1,
			loop: false,
			layers: [
				{ id: "n", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 32, h: 32, feather: 1, color: [1, 0, 0], alpha: 0.5, fade: [0.05, 0.05] },
				{ id: "e", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 32, h: 32, feather: 1, color: [0, 0, 0], alpha: 1, material: "emission", emission: [2, 2, 2], emissionStrength: 1, fade: [0.05, 0.05] },
			],
		};
		const c = px(renderQualityFrame(fx, 0.5, "s1", view, 64, 64), 64, 32, 32);
		// linear c+e = [2.5,2,2] -> ACES = [.93810,.91486,.91486]
		// a = max(.5, ACES(2)=.91486) = .91486 -> 233 ; m/a -> sRGB [255,255,255]
		expect(c[0]).toBe(255);
		expect(c[1]).toBe(255);
		expect(c[2]).toBe(255);
		expect(c[3]).toBe(233);
	});
});

// Astra M1 compositing contract (sprite-m1-compositing-contract.md):
// linear C/A/E area reduction before ACES, exact baked branch, literal
// examples1-3 as production-path fixtures, plus named negative controls.
describe("compositing contract examples (Astra #2/#3)", () => {
	const EMPTY = { id: "fixture_empty", kind: "quality", duration: 1, loop: false, layers: [] };
	test("example 1: empty scene #808080 baked is 154, not 128 (neg: display-space bg)", () => {
		const { rgba, baked } = renderQualityFrame(EMPTY, 0.5, "s1", view, 64, 64, {
			stages: true,
			bakedBackground: [128, 128, 128],
		});
		// sprite layer is empty; scene background only exists in the exact
		// declared-background branch and IS tonemapped: S(T(D(128/255))) = 154.
		expect(px(rgba, 64, 32, 32)).toEqual([0, 0, 0, 0]);
		expect(px(baked, 64, 32, 32)).toEqual([154, 154, 154, 255]);
	});
	test("example 2: fractional E reduces linearly (neg: mean-of-mapped .401898734)", () => {
		const fx = {
			id: "fixture_frac_red",
			kind: "quality",
			duration: 1,
			loop: false,
			layers: [
				// right edge exactly at pixel 32's midpoint x=32.5: exactly 8 of
				// the 16 4x4 subsamples carry E=(1,0,0), 8 carry 0.
				{ id: "half", kind: "quad", t0: 0, t1: 1, cx: 16.5, cy: 32, w: 32, h: 40, feather: 0.001, color: [0, 0, 0], alpha: 1, material: "emission", emission: [1, 0, 0], emissionStrength: 1, fade: [0.05, 0.05] },
			],
		};
		const { rgba, baked, stages } = renderQualityFrame(fx, 0.5, "s1", view, 64, 64, {
			stages: true,
			bakedBackground: [0, 0, 0],
			samplePixel: { x: 32, y: 32 },
		});
		// Ebar = (0.5,0,0): T(0.5) = 0.616306954 -> As = 0.616306954 -> 157;
		// Rs = (1,0,0) -> sprite (255,0,0,157). Mean-of-mapped would give
		// ACES(1)/2 = 0.401898734 -> 211 — this assertion detects it.
		expect(px(rgba, 64, 32, 32)).toEqual([255, 0, 0, 157]);
		// exact baked over black scene background: S(T(0.5)) = 206.
		expect(px(baked, 64, 32, 32)).toEqual([206, 0, 0, 255]);
		// exact diagnostics: linear peaks before the transfer.
		expect(stages.emissionPeak).toBeCloseTo(1, 6);
		expect(stages.premultPeak).toBeCloseTo(1, 6);
		// frame-wide peak coverage: fully covered pixels reach E=1,
		// so peak As = aces(1) = 0.803797468 (not this pixel's 0.616306954).
		expect(stages.coveragePeak).toBeCloseTo(0.803797468, 6);
		// exact per-pixel intermediate diagnostics (sampled hook):
		// independent literals from the contract, not helper echoes.
		expect(stages.sampled.cbar[0]).toBeCloseTo(0, 9);
		expect(stages.sampled.ebar[0]).toBeCloseTo(0.5, 9);
		expect(stages.sampled.ebar[1]).toBeCloseTo(0, 9);
		expect(stages.sampled.abar).toBeCloseTo(0, 9);
		expect(stages.sampled.ae).toBeCloseTo(0.616306954, 6);
		expect(stages.sampled.as).toBeCloseTo(0.616306954, 6);
	});
	test("example 3: unsaturated mixed normal+emission, sprite and exact baked", () => {
		const fx = {
			id: "fixture_mixed_bg",
			kind: "quality",
			duration: 1,
			loop: false,
			layers: [
				{ id: "n", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 10, h: 10, feather: 0.001, color: [0.5, 0, 0], alpha: 0.5, fade: [0.05, 0.05] },
				{ id: "e", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 10, h: 10, feather: 0.001, color: [0, 0, 0], alpha: 1, material: "emission", emission: [0, 0.25, 0], emissionStrength: 1, fade: [0.05, 0.05] },
			],
		};
		const { rgba, baked } = renderQualityFrame(fx, 0.5, "s1", view, 64, 64, {
			stages: true,
			bakedBackground: [128, 128, 128],
		});
		// Cbar=(.25,0,0), Abar=.5, Ebar=(0,.25,0):
		// M=T(.25,.25,0), Ae=.374110953, As=.5 -> Rs=.748221906
		// -> sprite (224,224,0,128); baked (188,188,105,255).
		expect(px(rgba, 64, 32, 32)).toEqual([224, 224, 0, 128]);
		expect(px(baked, 64, 32, 32)).toEqual([188, 188, 105, 255]);
	});
	test("normal front occludes earlier emission; reverse adds light only", () => {
		const emBack = { id: "em", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 16, h: 16, feather: 0.001, color: [0, 0, 0], alpha: 1, material: "emission", emission: [1, 0, 0], emissionStrength: 1, fade: [0.05, 0.05] };
		const nFront = { id: "np", kind: "quad", t0: 0, t1: 1, cx: 32, cy: 32, w: 16, h: 16, feather: 0.001, color: [0, 1, 0], alpha: 1, fade: [0.05, 0.05] };
		const mk = (layers) => ({ id: "fixture_occl_e", kind: "quality", duration: 1, loop: false, layers });
		// forward: emission behind, opaque normal front occludes E entirely
		const fwd = renderQualityFrame(mk([emBack, nFront]), 0.5, "s1", view, 64, 64, {
			stages: true,
			bakedBackground: [0, 0, 0],
		});
		expect(px(fwd.rgba, 64, 32, 32)).toEqual([0, 232, 0, 255]);
		expect(px(fwd.baked, 64, 32, 32)).toEqual([0, 232, 0, 255]);
		// reverse: normal behind, additive light in front: C untouched,
		// E adds without coverage -> (232,232,0,255)
		const rev = renderQualityFrame(mk([nFront, emBack]), 0.5, "s1", view, 64, 64, {
			stages: true,
			bakedBackground: [0, 0, 0],
		});
		expect(px(rev.rgba, 64, 32, 32)).toEqual([232, 232, 0, 255]);
		expect(px(rev.baked, 64, 32, 32)).toEqual([232, 232, 0, 255]);
		// order must matter (buggy E accumulation made both equal)
		expect(px(fwd.rgba, 64, 32, 32).slice(0, 3)).not.toEqual(px(rev.rgba, 64, 32, 32).slice(0, 3));
	});
});

// Astra M1 verdict defect 5: layer.grow must scale puff and radial geometry
// (only quad honored it). Deterministic early/mid/late ring assertions at
// fixed opacity — no art/threshold tuning.
describe("puff/radial grow (Astra defect 5)", () => {
	const t = (kind, extra) => ({
		id: `fixture_grow_${kind}`,
		kind: "quality",
		duration: 1,
		loop: false,
		layers: [
			{
				id: "g",
				kind,
				t0: 0,
				t1: 1,
				cx: 32,
				cy: 32,
				feather: 0.5,
				color: [1, 0, 0],
				alpha: 1,
				grow: [1, 3],
				fade: [0.001, 0.001],
				...extra,
			},
		],
	});
	// grow(0.06)=1.12 -> r=11.2 ; grow(0.5)=2 -> r=20 ; grow(0.9)=2.8 -> r=28
	const lit = (fx, time, dx) => {
		const f = renderQualityFrame(fx, time, "s1", view, 64, 64);
		return f[(32 * 64 + (32 + dx)) * 4 + 3] > 0;
	};
	test("puff radius follows grow: early/mid/late rings", () => {
		const fx = t("puff", { r: 10, lobes: 3, amp: 0, phase: 0 });
		// early: r=11.2 — center lit, dist13 ring outside (anchor, same before/after)
		expect(lit(fx, 0.06, 5)).toBe(true);
		expect(lit(fx, 0.06, 13)).toBe(false);
		// mid: r=20 — dist18 inside only when grow is honored (fails before fix)
		expect(lit(fx, 0.5, 18)).toBe(true);
		expect(lit(fx, 0.5, 22)).toBe(false);
		// late: r=28 — dist24 inside only when grow is honored (fails before fix)
		expect(lit(fx, 0.9, 24)).toBe(true);
	});
	test("radial radius follows grow: early/mid/late rings", () => {
		const fx = t("radial", { r0: 0, r1: 10 });
		expect(lit(fx, 0.06, 5)).toBe(true);
		expect(lit(fx, 0.06, 13)).toBe(false);
		expect(lit(fx, 0.5, 18)).toBe(true);
		expect(lit(fx, 0.5, 22)).toBe(false);
		expect(lit(fx, 0.9, 24)).toBe(true);
	});
});

// Astra M1 verdict defect 4: bounded texture/mask sampling — explicit sRGB
// decode (colorSpace), linear scalar masks, mask channel selection (alpha by
// default), premultiplied-interpolated edges.
describe("texture/mask support (Astra defect 4)", () => {
	const texFx = (tex, extra) => ({
		id: "fixture_tex",
		kind: "quality",
		duration: 1,
		loop: false,
		layers: [
			{
				id: "t",
				kind: "texture",
				t0: 0,
				t1: 1,
				cx: 32,
				cy: 32,
				w: 64,
				h: 64,
				feather: 0.5,
				alpha: 1,
				colorSpace: "srgb",
				tex,
				...extra,
			},
		],
	});
	test("0.5 sRGB texel is decoded, not treated as 0.5 linear", () => {
		const fx = texFx([128, 128, 128, 255], { texW: 1, texH: 1 });
		const f = renderQualityFrame(fx, 0.5, "s1", view, 64, 64);
		// D(128/255)=0.21586 -> T -> S = 154 ; linear-treated 0.50196 would
		// tonemap to 206. Alpha 255 (mask channel = alpha).
		expect(px(f, 64, 32, 32)).toEqual([154, 154, 154, 255]);
	});
	test("transparent colored texel cannot darken edges (premultiplied interp)", () => {
		// 2x1: white-opaque | black-transparent. Quad cx32.5 w32 puts pixel
		// (32,32) exactly between texel centers (t = 0.5).
		const fx = texFx([255, 255, 255, 255, 0, 0, 0, 0], {
			texW: 2,
			texH: 1,
			cx: 32.5,
			w: 32,
			h: 64,
		});
		const f = renderQualityFrame(fx, 0.5, "s1", view, 64, 64);
		// premultiplied linear interp: premult (0.5,0.5,0.5) alpha 0.5
		// -> straight 1 -> [255,255,255,128]. Straight-interpolation bug
		// would give color 0.5 premult 0.25 -> [224,224,224,128].
		expect(px(f, 64, 32, 32)).toEqual([255, 255, 255, 128]);
	});
	test("zero-mask texel RGB cannot contaminate the edge (R2)", () => {
		// 2x1, maskChannel r: texel0 mask=1 with red RGB; texel1 mask=0 with
		// CONTRASTING hidden non-mask RGB. Quad cx32.5 w32 puts pixel (32,32)
		// exactly between texel centers (t = .5).
		const mk = (hidden) =>
			texFx([255, 0, 0, 255, 0, hidden, hidden, 255], {
				texW: 2,
				texH: 1,
				cx: 32.5,
				w: 32,
				h: 64,
				maskChannel: "r",
			});
		const a = renderQualityFrame(mk(255), 0.5, "s1", view, 64, 64);
		const b = renderQualityFrame(mk(0), 0.5, "s1", view, 64, 64);
		// Contract: each corner's decoded color is premultiplied by THAT
		// corner's mask before bilinear interpolation; mask interpolated
		// separately; color reconstructed at m>0:
		//   m = .5*1 + .5*0 = .5 ; premult = (.5,0,0) -> color = (1,0,0)
		//   C = color*cov = (.5,0,0) ; Abar = .5
		//   M = T(.5) = .616307 ; As = .5 ; Rs = 1.2326 -> clamp 1 -> 255
		//   -> [255,0,0,128] for BOTH hidden values.
		// Straight-interp bug gives [224,224,224,128] (hidden 255) or
		// [224,0,0,128] (hidden 0) — hidden RGB leaked into the edge.
		expect(px(a, 64, 32, 32)).toEqual([255, 0, 0, 128]);
		expect(px(b, 64, 32, 32)).toEqual([255, 0, 0, 128]);
	});
	test("mask channel = alpha; black color never decides coverage", () => {
		const opaqueBlack = renderQualityFrame(texFx([0, 0, 0, 255], { texW: 1, texH: 1 }), 0.5, "s1", view, 64, 64);
		expect(px(opaqueBlack, 64, 32, 32)).toEqual([0, 0, 0, 255]);
		const transparentBlack = renderQualityFrame(texFx([0, 0, 0, 0], { texW: 1, texH: 1 }), 0.5, "s1", view, 64, 64);
		expect(px(transparentBlack, 64, 32, 32)).toEqual([0, 0, 0, 0]);
		const transparentWhite = renderQualityFrame(texFx([255, 255, 255, 0], { texW: 1, texH: 1 }), 0.5, "s1", view, 64, 64);
		expect(px(transparentWhite, 64, 32, 32)).toEqual([0, 0, 0, 0]);
	});
	test("explicit mask channel selection: maskChannel r is a LINEAR scalar", () => {
		const fx = texFx([128, 0, 0, 255], { texW: 1, texH: 1, maskChannel: "r" });
		const f = renderQualityFrame(fx, 0.5, "s1", view, 64, 64);
		// Contract (Astra rereview R1): selected mask byte is linear scalar,
		// independent of the COLOR texture's sRGB decode:
		//   mask   = 128/255          = .501960784 -> alpha 128
		//   color  = D(128/255)       = .215860500 (color decode kept)
		//   premult= mask * color     = .108353506
		//   M = T(.108353506) = .140754 ; As = max(Abar,0) = .501960784
		//   Rs = M/As = .280406 -> S -> 144
		// Derived literal, not a renderer run. Gamma-decoded-mask (wrong)
		// output would be alpha 55 / red 119.
		expect(px(f, 64, 32, 32)).toEqual([144, 0, 0, 128]);
	});
});

// Astra rereview R3: the texture sampling must share the EVALUATED streak
// geometry (travel position, velocity orientation, stretch length, finite
// zero-velocity dot) — proven through the production renderer with an
// asymmetric texture on 0/45/90-degree motion.
describe("textured velocity-stretched quad (Astra R3)", () => {
	// Asymmetric 2x1 texture: trailing texel RED, leading texel BLUE.
	// Velocity direction maps to the rect's local +x axis.
	const TRAIL = [255, 0, 0, 255, 0, 0, 255, 255];
	const velFx = (extra) => ({
		id: "fixture_vtex",
		kind: "quality",
		duration: 1,
		loop: false,
		layers: [
			{
				id: "s",
				kind: "texture",
				t0: 0,
				t1: 1,
				feather: 0.5,
				alpha: 1,
				colorSpace: "srgb",
				maskChannel: "a",
				texW: 2,
				texH: 1,
				tex: TRAIL,
				...extra,
			},
		],
	});
	test("0 degrees: travel position, leading/trailing texels, stretch", () => {
		const fx = velFx({
			x0: 16,
			y0: 32,
			vx: 32,
			vy: 0,
			length: 16,
			width: 12,
			stretch: 0,
		});
		const f = renderQualityFrame(fx, 0.5, "s1", view, 64, 64);
		// center traveled to (32,32): leading (+x) side = texel1 blue,
		// trailing side = texel0 red.
		expect(px(f, 64, 37, 32)).toEqual([0, 0, 232, 255]);
		expect(px(f, 64, 27, 32)).toEqual([232, 0, 0, 255]);
		// time-dependent position: the t=0 origin pixel is now empty
		expect(px(f, 64, 17, 32)).toEqual([0, 0, 0, 0]);
		// stretch: len = 16 + speed*0.5 = 32 reaches x=48 — lit ONLY
		// when velocity stretch is applied.
		const st = renderQualityFrame(
			velFx({ x0: 16, y0: 32, vx: 32, vy: 0, length: 16, width: 12, stretch: 0.5 }),
			0.5,
			"s1",
			view,
			64,
			64,
		);
		expect(px(f, 64, 45, 32)).toEqual([0, 0, 0, 0]);
		expect(px(st, 64, 45, 32)).toEqual([0, 0, 232, 255]);
	});
	test("45 degrees: orientation follows velocity vector", () => {
		const fx = velFx({
			x0: 16,
			y0: 16,
			vx: 20,
			vy: 20,
			length: 16,
			width: 12,
			stretch: 0,
		});
		const f = renderQualityFrame(fx, 0.5, "s1", view, 64, 64);
		// center = (26,26); along +45deg: ahead blue, behind red
		expect(px(f, 64, 29, 29)).toEqual([0, 0, 232, 255]);
		expect(px(f, 64, 22, 22)).toEqual([232, 0, 0, 255]);
		// cross-axis (outside width) stays empty — an unrotated 16x12
		// axis-aligned rect would wrongly light this pixel
		expect(px(f, 64, 20, 31)).toEqual([0, 0, 0, 0]);
	});
	test("90 degrees: downward motion maps texture to local +y", () => {
		const fx = velFx({
			x0: 32,
			y0: 12,
			vx: 0,
			vy: 32,
			length: 16,
			width: 12,
			stretch: 0,
		});
		const f = renderQualityFrame(fx, 0.5, "s1", view, 64, 64);
		// center = (32,28); leading side (below) blue, trailing (above) red
		expect(px(f, 64, 32, 33)).toEqual([0, 0, 232, 255]);
		expect(px(f, 64, 32, 23)).toEqual([232, 0, 0, 255]);
		// cross-axis outside width stays empty (1.5px beyond the
		// feather band — the boundary pixel itself is transition-zone)
		expect(px(f, 64, 24, 28)).toEqual([0, 0, 0, 0]);
		// t=0 origin pixel is behind the traveled dot
		expect(px(f, 64, 32, 12)).toEqual([0, 0, 0, 0]);
	});
	test("finite zero velocity: static dot, no NaN, no motion", () => {
		const fx = velFx({
			x0: 24,
			y0: 32,
			vx: 0,
			vy: 0,
			width: 16,
		});
		const f = renderQualityFrame(fx, 0.5, "s1", view, 64, 64);
		// speed 0 -> rot 0, len = wid = width (finite dot at x0/y0).
		// At (24.5,32.5) u = .5625 blends red/blue straight colors:
		// C = (.4375,0,.5625), A = 1 -> M/As -> S ≈ [199,0,211].
		const c = px(f, 64, 24, 32);
		expect(c[3]).toBe(255);
		expect(Math.abs(c[0] - 199)).toBeLessThanOrEqual(2);
		expect(Math.abs(c[2] - 211)).toBeLessThanOrEqual(2);
		// outside the 16x16 dot: empty
		expect(px(f, 64, 24, 44)).toEqual([0, 0, 0, 0]);
		expect(px(f, 64, 36, 32)).toEqual([0, 0, 0, 0]);
	});
});

// ---------------------------------------------------------------------------
// Flame R1 (sprite-flame-periodic-contract.md): opt-in periodic tongue.
// Contract tests 1, 2, 3, 5 below. Test 4 (absent-field compatibility) is
// scripts/flame-r1-compat.mjs baseline/check; test 6 is the R1 packet.
// ---------------------------------------------------------------------------

function ptTongue(over = {}) {
	return {
		id: "t1",
		kind: "arc",
		t0: 0,
		t1: 2,
		cx: 32,
		cy: 36,
		radius: 14,
		ang0: Math.PI / 6,
		ang1: -Math.PI / 3,
		thick0: 7,
		thick1: 1.5,
		rot: 0,
		feather: 0.5,
		color: [1, 0.5, 0.08],
		alpha: 1,
		periodicTongue: {
			periodSeconds: 2,
			phaseRadians: 0,
			swayPixels: 2,
			widthFraction: 0.15,
			heightFraction: 0.2,
		},
		...over,
	};
}

// Contract test 2 fixture: ONLY opted-in tongue layers (accents absent),
// nonzero ordinary phase (pi/3) and a seeded variation layer.
function ptEffect() {
	return {
		id: "fixture_periodic_tongues",
		kind: "quality",
		duration: 2,
		loop: true,
		layers: [
			ptTongue(),
			ptTongue({
				id: "t2",
				cx: 30,
				cy: 40,
				radius: 11,
				ang0: Math.PI / 5,
				ang1: -Math.PI / 4,
				thick0: 5,
				thick1: 1,
				color: [1, 0.35, 0.05],
				seeded: true,
				jitter: 1,
				periodicTongue: {
					periodSeconds: 2,
					phaseRadians: Math.PI / 3,
					swayPixels: -1.5,
					widthFraction: -0.1,
					heightFraction: 0.15,
				},
			}),
		],
	};
}

describe("flame R1: independent geometry oracle (contract test 1)", () => {
	// Contract literal fixture: C=(20,40), R=10, ang0=0, rot=0 -> B=(30,40),
	// P=2, phase=0, sway=2, widthFraction=0.2, heightFraction=0.25.
	const arc = {
		id: "pt_oracle",
		kind: "arc",
		t0: 0,
		t1: 2,
		cx: 20,
		cy: 40,
		radius: 10,
		ang0: 0,
		ang1: Math.PI / 3,
		thick0: 4,
		thick1: 1,
		rot: 0,
		feather: 0.5,
		color: [1, 0.5, 0.1],
		alpha: 1,
		periodicTongue: {
			periodSeconds: 2,
			phaseRadians: 0,
			swayPixels: 2,
			widthFraction: 0.2,
			heightFraction: 0.25,
		},
	};
	// Forward map typed from the contract text — NOT imported from the module.
	const forward = (st, qx, qy) => [
		st.Bx + st.Sx * (qx - st.Bx) + (st.D * (st.By - qy)) / st.R,
		st.By + st.Sy * (qy - st.By),
	];
	const near = (a, b) => Math.abs(a - b) < 1e-12;
	test("t=0.5: Sx=1, Sy=1.25, D=2, Q(30,30)->(32,27.5), inverse recovers Q", () => {
		const st = periodicTongueState(arc, 0.5);
		expect(near(st.Bx, 30)).toBe(true);
		expect(near(st.By, 40)).toBe(true);
		expect(near(st.Sx, 1)).toBe(true);
		expect(near(st.Sy, 1.25)).toBe(true);
		expect(near(st.D, 2)).toBe(true);
		const [x, y] = forward(st, 30, 30);
		expect(near(x, 32)).toBe(true);
		expect(near(y, 27.5)).toBe(true);
		const [qx, qy] = periodicTongueInverse(st, x, y);
		expect(near(qx, 30)).toBe(true);
		expect(near(qy, 30)).toBe(true);
	});
	test("t=0: Sx=1.2, Sy=1, D=0 (contract literals)", () => {
		const st = periodicTongueState(arc, 0);
		expect(near(st.Sx, 1.2)).toBe(true);
		expect(near(st.Sy, 1)).toBe(true);
		expect(near(st.D, 0)).toBe(true);
	});
	test("anchor invariance: forward(B) == B; positive scales at extrema", () => {
		for (let i = 0; i <= 48; i++) {
			const st = periodicTongueState(arc, (i * 2) / 48);
			const [ax, ay] = forward(st, st.Bx, st.By);
			expect(near(ax, st.Bx)).toBe(true);
			expect(near(ay, st.By)).toBe(true);
			expect(st.Sx).toBeGreaterThan(0);
			expect(st.Sy).toBeGreaterThan(0);
			expect(Number.isFinite(st.Bx) && Number.isFinite(st.By)).toBe(true);
		}
	});
});

describe("flame R1: periodicity and random access (contract test 2)", () => {
	// 32x32 for the heavy byte-equality loops: same design space (fit =
	// size/64), same bytes rule — keeps each test inside the suite's normal
	// per-test budget without touching any timeout.
	test("byte-equal RGBA at every t=i/12 and t+2 (i=0..11)", () => {
		const fx = ptEffect();
		for (let i = 0; i < 12; i++) {
			const a = renderQualityFrame(fx, i / 12, "s1", view, 32, 32);
			const b = renderQualityFrame(fx, i / 12 + 2, "s1", view, 32, 32);
			expect(Array.from(b)).toEqual(Array.from(a));
		}
	});
	test("byte-equal RGBA at every t=i/12 and t+2 (i=12..23)", () => {
		const fx = ptEffect();
		for (let i = 12; i < 24; i++) {
			const a = renderQualityFrame(fx, i / 12, "s1", view, 32, 32);
			const b = renderQualityFrame(fx, i / 12 + 2, "s1", view, 32, 32);
			expect(Array.from(b)).toEqual(Array.from(a));
		}
	});
	test("representative negative times equal their wrapped positives", () => {
		const fx = ptEffect();
		const pairs = [
			[-0.5, 1.5],
			[-2, 0],
			[-4.25, 1.75],
			[-0.75, 1.25],
			[-1, 1],
			[-1.5, 0.5],
		];
		for (const [neg, pos] of pairs) {
			const a = renderQualityFrame(fx, neg, "s1", view, 32, 32);
			const b = renderQualityFrame(fx, pos, "s1", view, 32, 32);
			expect(Array.from(b)).toEqual(Array.from(a));
		}
	});
	// Astra R1 verdict closure (directed): the previously excluded dyadic
	// boundary pair -1/12 vs 23/12 on the seeded two-tongue fixture. Exact
	// RGBA equality plus the 1e-12 scalar tolerance; any mismatch is printed
	// verbatim (pixel coordinates + channel + both values) and preserved —
	// no phase rounding, no weakened assertion.
	test("boundary pair t=-1/12 equals t=23/12 exact RGBA and scalar", () => {
		const fx = ptEffect();
		const neg = -1 / 12;
		const pos = 23 / 12;
		const scalarMiss = [];
		for (const l of fx.layers) {
			const a = periodicTongueState(l, neg);
			const b = periodicTongueState(l, pos);
			for (const k of ["u", "Sx", "Sy", "D", "Bx", "By"]) {
				const d = Math.abs(a[k] - b[k]);
				if (!(d <= 1e-12)) scalarMiss.push(`${l.id}.${k} diff=${d}`);
			}
		}
		if (scalarMiss.length)
			console.log("BOUNDARY_PAIR_SCALAR_MISS", JSON.stringify(scalarMiss));
		expect(scalarMiss).toEqual([]);
		const fa = renderQualityFrame(fx, neg, "s1", view, 32, 32);
		const fb = renderQualityFrame(fx, pos, "s1", view, 32, 32);
		const miss = [];
		for (let i = 0; i < fa.length; i++) {
			if (fa[i] !== fb[i]) {
				const p = i >> 2;
				miss.push({
					x: p % 32,
					y: Math.floor(p / 32),
					ch: "rgba"[i % 4],
					neg: fa[i],
					pos: fb[i],
				});
			}
		}
		if (miss.length)
			console.log(
				"BOUNDARY_PAIR_RGBA_MISS",
				JSON.stringify(miss.slice(0, 40)),
				"total",
				miss.length,
			);
		expect(miss).toEqual([]);
	});
	test("geometry scalars equal at t and t+2 within 1e-12", () => {
		const fx = ptEffect();
		for (const l of fx.layers) {
			for (let i = 0; i < 24; i++) {
				const a = periodicTongueState(l, i / 12);
				const b = periodicTongueState(l, i / 12 + 2);
				for (const k of ["u", "Sx", "Sy", "D", "Bx", "By"]) {
					expect(Math.abs(a[k] - b[k])).toBeLessThanOrEqual(1e-12);
				}
			}
		}
	});
	test("shuffled render order matches chronological run", () => {
		const fx = ptEffect();
		const chrono = [];
		for (let i = 0; i < 24; i++) {
			chrono.push(renderQualityFrame(fx, i / 12, "s2", view, 32, 32));
		}
		const shuffled = [
			7, 0, 19, 3, 12, 23, 1, 15, 9, 4, 21, 11, 6, 18, 2, 14, 10, 22, 8,
			13, 5, 17, 16, 20,
		];
		for (const i of shuffled) {
			const f = renderQualityFrame(fx, i / 12, "s2", view, 32, 32);
			expect(Array.from(f)).toEqual(Array.from(chrono[i]));
		}
	});
	test("second seed also byte-equal at t and t+2 (fixed anchor per seed)", () => {
		const fx = ptEffect();
		for (const i of [0, 6, 12, 18]) {
			const a = renderQualityFrame(fx, i / 12, "s2", view, 32, 32);
			const b = renderQualityFrame(fx, i / 12 + 2, "s2", view, 32, 32);
			expect(Array.from(b)).toEqual(Array.from(a));
		}
	});
});

describe("flame R1: motion is primary geometry (contract test 3)", () => {
	test("nonzero amplitudes change primary coverage across phases", () => {
		const fx = ptEffect();
		const f0 = renderQualityFrame(fx, 0, "s1", view, 64, 64);
		const f2 = renderQualityFrame(fx, 0.5, "s1", view, 64, 64);
		expect(Array.from(f0)).not.toEqual(Array.from(f2));
		let alphaChanged = 0;
		for (let i = 3; i < f0.length; i += 4) {
			if (f0[i] !== f2[i]) alphaChanged++;
		}
		expect(alphaChanged).toBeGreaterThan(0);
	});
	test("zero-amplitude periodic fixture is a static control", () => {
		const fx = ptEffect();
		for (const l of fx.layers) {
			Object.assign(l.periodicTongue, {
				swayPixels: 0,
				widthFraction: 0,
				heightFraction: 0,
			});
		}
		const f0 = renderQualityFrame(fx, 0, "s1", view, 64, 64);
		const f2 = renderQualityFrame(fx, 0.5, "s1", view, 64, 64);
		expect(Array.from(f2)).toEqual(Array.from(f0));
	});
});

describe("flame R1: boundary rejects (contract test 5)", () => {
	const rejects = {
		"missing periodSeconds": (fx) => {
			delete fx.layers[0].periodicTongue.periodSeconds;
		},
		"zero periodSeconds": (fx) => {
			fx.layers[0].periodicTongue.periodSeconds = 0;
		},
		"infinite periodSeconds": (fx) => {
			fx.layers[0].periodicTongue.periodSeconds = Infinity;
		},
		"NaN periodSeconds": (fx) => {
			fx.layers[0].periodicTongue.periodSeconds = NaN;
		},
		"non-loop effect": (fx) => {
			fx.loop = false;
		},
		"period/duration mismatch": (fx) => {
			fx.duration = 3;
		},
		"wrong interval t0": (fx) => {
			fx.layers[0].t0 = 0.1;
		},
		"wrong interval t1": (fx) => {
			fx.layers[0].t1 = 1;
		},
		"unsupported kind": (fx) => {
			fx.layers[0].kind = "puff";
		},
		"fade present": (fx) => {
			fx.layers[0].fade = [0.1, 0.1];
		},
		"grow present": (fx) => {
			fx.layers[0].grow = [1, 2];
		},
		"zero radius": (fx) => {
			fx.layers[0].radius = 0;
		},
		"negative radius": (fx) => {
			fx.layers[0].radius = -5;
		},
		"NaN radius": (fx) => {
			fx.layers[0].radius = NaN;
		},
		"zero thick1": (fx) => {
			fx.layers[0].thick1 = 0;
		},
		"inverted thickness": (fx) => {
			fx.layers[0].thick0 = 1;
			fx.layers[0].thick1 = 2;
		},
		"widthFraction >= 1": (fx) => {
			fx.layers[0].periodicTongue.widthFraction = 1;
		},
		"widthFraction < -1": (fx) => {
			fx.layers[0].periodicTongue.widthFraction = -1.2;
		},
		"heightFraction >= 1": (fx) => {
			fx.layers[0].periodicTongue.heightFraction = 1.5;
		},
		"swayPixels beyond radius/2": (fx) => {
			fx.layers[0].periodicTongue.swayPixels = 7.1;
		},
		"NaN phaseRadians": (fx) => {
			fx.layers[0].periodicTongue.phaseRadians = NaN;
		},
		"NaN cx": (fx) => {
			fx.layers[0].cx = NaN;
		},
	};
	for (const [name, mutate] of Object.entries(rejects)) {
		test(`reject: ${name}`, () => {
			const fx = ptEffect();
			mutate(fx);
			let caught = null;
			try {
				renderQualityFrame(fx, 0.5, "s1", view, 64, 64);
			} catch (e) {
				caught = e;
			}
			if (!caught) {
				throw new Error(`expected rejection for "${name}" but render succeeded`);
			}
			if (!String(caught.message).includes("periodicTongue")) {
				throw new Error(
					`expected periodicTongue rejection for "${name}", got: ${caught.message}`,
				);
			}
		});
	}
	test("anchor fixed across phases; scales positive at extrema", () => {
		const l = ptEffect().layers[0];
		const s0 = periodicTongueState(l, 0);
		for (let i = 0; i <= 24; i++) {
			const s = periodicTongueState(l, (i * 2) / 24);
			expect(s.Bx).toBe(s0.Bx);
			expect(s.By).toBe(s0.By);
			expect(s.Sx).toBeGreaterThan(0);
			expect(s.Sy).toBeGreaterThan(0);
		}
	});
	test("t=2 wraps before activation; no-option layer still expires", () => {
		const tongues = ptEffect();
		const withQuad = ptEffect();
		withQuad.layers.push({
			id: "plain",
			kind: "quad",
			t0: 0,
			t1: 1,
			cx: 14,
			cy: 14,
			w: 12,
			h: 12,
			rot: 0,
			feather: 0.5,
			color: [0, 1, 0],
			alpha: 1,
		});
		// no-option quad present at t=0.5
		expect(
			Array.from(renderQualityFrame(withQuad, 0.5, "s1", view, 64, 64)),
		).not.toEqual(
			Array.from(renderQualityFrame(tongues, 0.5, "s1", view, 64, 64)),
		);
		// but expires past its own lifetime on raw t (no global wrap)
		expect(
			Array.from(renderQualityFrame(withQuad, 1.5, "s1", view, 64, 64)),
		).toEqual(
			Array.from(renderQualityFrame(tongues, 1.5, "s1", view, 64, 64)),
		);
		// opted tongue at t=2 wraps to u=0: present and byte-equal to t=0
		expect(
			Array.from(renderQualityFrame(tongues, 2, "s1", view, 64, 64)),
		).toEqual(
			Array.from(renderQualityFrame(tongues, 0, "s1", view, 64, 64)),
		);
		expect(
			Array.from(renderQualityFrame(withQuad, 2, "s1", view, 64, 64)),
		).toEqual(
			Array.from(renderQualityFrame(tongues, 2, "s1", view, 64, 64)),
		);
	});
});
