// Independent fixtures for the quality-v1 conversion helpers.
// All expectations are literals derived from raw serialized record fields or
// from first principles — never echoes of a renderer run.
import { describe, expect, test } from "bun:test";
import {
	colorOverLifetimeRgba,
	pivotOffsetPx,
	sampleTimeSeconds,
	sourceLoopSeconds,
	startColorRgba,
	velocityAngleRad,
} from "../src/converted-effect.js";

describe("quality-v1 source timing is independent of GIF rounding (M2)", () => {
	test("loop duration comes from system.lengthInSec", () => {
		// record: system.lengthInSec = 5.0 in all six active motion records
		expect(sourceLoopSeconds({ lengthInSec: 5 })).toBe(5);
		expect(sourceLoopSeconds({ lengthInSec: 0.25 })).toBe(0.25);
	});

	test("non-positive or missing source length is an error, not a guess", () => {
		expect(() => sourceLoopSeconds({ lengthInSec: 0 })).toThrow();
		expect(() => sourceLoopSeconds({ lengthInSec: -1 })).toThrow();
		expect(() => sourceLoopSeconds({})).toThrow();
	});

	test("sample time is exact frame/fps, not delayCs arithmetic", () => {
		expect(sampleTimeSeconds(3, 12)).toBe(0.25);
		expect(sampleTimeSeconds(0, 12)).toBe(0);
		expect(sampleTimeSeconds(24, 12)).toBe(2);
		// named negative: the legacy/export form rounds 100/12 to 8cs
		expect(Math.round(100 / 12)).toBe(8);
		expect((3 * Math.round(100 / 12)) / 100).toBe(0.24);
		expect(sampleTimeSeconds(3, 12)).not.toBe(0.24);
	});

	test("export cycle (25 frames @12fps) is 2.0s — source loop is 5s", () => {
		const exportCycle = (25 * Math.round(100 / 12)) / 100;
		expect(exportCycle).toBe(2);
		const source = sourceLoopSeconds({ lengthInSec: 5 });
		expect(source).toBe(5);
		expect(source).not.toBe(exportCycle);
		// source value does not depend on fps/frame arguments at all
		expect(sourceLoopSeconds({ lengthInSec: 5 })).toBe(sourceLoopSeconds({ lengthInSec: 5 }));
	});
});

describe("start color alpha is consumed with the same min->max mix (M2)", () => {
	const min = { r: 1, g: 0.25, b: 0, a: 0.4 };
	const max = { r: 1, g: 0.75, b: 0, a: 0.8 };
	test("midpoint mix lerps all four components", () => {
		const got = startColorRgba(min, max, 0.5);
		expect(got[0]).toBeCloseTo(1, 12);
		expect(got[1]).toBeCloseTo(0.5, 12);
		expect(got[2]).toBeCloseTo(0, 12);
		expect(got[3]).toBeCloseTo(0.6, 12);
	});
	test("endpoint mixes are the record endpoints", () => {
		expect(startColorRgba(min, max, 0)).toEqual([1, 0.25, 0, 0.4]);
		expect(startColorRgba(min, max, 1)).toEqual([1, 0.75, 0, 0.8]);
	});
});

describe("lifetime color/alpha gates on the enabled flag (M2)", () => {
	const mod = {
		enabled: true,
		mode: 0,
		colorKeys: [
			{ t: 0, rgb: [1, 0, 0] },
			{ t: 1, rgb: [1, 1, 0] },
		],
		alphaKeys: [
			{ t: 0, a: 1 },
			{ t: 1, a: 0 },
		],
	};
	const start = [1, 0.8, 0.6, 1];

	test("disabled module is identity even with keys present", () => {
		const off = { ...mod, enabled: false };
		expect(colorOverLifetimeRgba(off, 0.5, start)).toEqual(start);
	});

	test("blend midpoint multiplies start by color and alpha ramps", () => {
		// color ramp at u=.5 = [1,.5,0]; alpha ramp = .5
		expect(colorOverLifetimeRgba(mod, 0.5, start)).toEqual([1, 0.4, 0, 0.5]);
	});

	test("u=0 uses the first keys exactly", () => {
		expect(colorOverLifetimeRgba(mod, 0, start)).toEqual([1, 0, 0, 1]);
	});

	test("missing keys are identity, not zeroes", () => {
		expect(colorOverLifetimeRgba({ enabled: true, mode: 0 }, 0.5, start)).toEqual(start);
	});

	test("active non-Blend mode is an honest error", () => {
		expect(() => colorOverLifetimeRgba({ ...mod, mode: 1 }, 0.5, start)).toThrow();
	});
});

describe("mode-1 orientation comes from raw velocity fields (M2)", () => {
	test("sprite +u aligns with world velocity via atan2(vy,vx)", () => {
		expect(velocityAngleRad([4, 0])).toBe(0);
		expect(velocityAngleRad([0, 4])).toBeCloseTo(Math.PI / 2, 12);
		expect(velocityAngleRad([-4, 0])).toBeCloseTo(Math.PI, 12);
		expect(velocityAngleRad([4, 4])).toBeCloseTo(Math.PI / 4, 12);
	});

	test("aligned +u equals the screen-projected velocity direction", () => {
		const v = [3, 4];
		const th = velocityAngleRad(v);
		const speed = Math.hypot(v[0], v[1]);
		// sprite +u on screen = (cos, -sin) must equal normalize(vx, -vy)
		expect(Math.cos(th)).toBeCloseTo(v[0] / speed, 12);
		expect(-Math.sin(th)).toBeCloseTo(-v[1] / speed, 12);
	});
});

describe("pivot offsets use the record pivot against sprite size (M2)", () => {
	test("record Sparks pivot (0,1,0): offset is one sprite-size up at rot 0", () => {
		expect(pivotOffsetPx({ x: 0, y: 1, z: 0 }, 0, 10)).toEqual([0, -10]);
	});
	test("x pivot shifts along the sprite +u axis", () => {
		expect(pivotOffsetPx({ x: 1, y: 0, z: 0 }, 0, 10)).toEqual([10, 0]);
	});
	test("pivot rotates with the sprite angle", () => {
		const off = pivotOffsetPx({ x: 1, y: 0, z: 0 }, Math.PI / 2, 10);
		expect(off[0]).toBeCloseTo(0, 9);
		expect(off[1]).toBeCloseTo(-10, 9);
	});
	test("zero pivot (five of six records) is a no-op", () => {
		expect(pivotOffsetPx({ x: 0, y: 0, z: 0 }, 1.234, 10)).toEqual([0, 0]);
	});
});
