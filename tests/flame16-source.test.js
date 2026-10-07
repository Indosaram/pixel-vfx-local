import { describe, expect, test } from "bun:test";
import { QUALITY_PRESETS } from "../src/quality-effects.js";
import { renderQualityStages, validateFlame16Definition } from "../src/pipeline.js";

// Original expectations, typed from the approved candidate in
// sprite-flame-16lod-authoring.md — deliberately independent of the preset.
const SPEC_FLAME16 = {
	revision: "flame16-v1",
	overrides: {
		perimeter: { cx: 30, cy: 47, r: 12, lobes: 4, amp: 0.04, phase: 0, feather: 0.4 },
		tongue_tall_outer: {
			cx: 9,
			cy: 33,
			radius: 15,
			ang0: 0.7853981633974483,
			ang1: -0.7853981633974483,
			thick0: 10,
			thick1: 5,
			rot: 0,
			feather: 0.4,
			periodicTongue: {
				periodSeconds: 2,
				phaseRadians: 0,
				swayPixels: -0.4,
				widthFraction: 0.04,
				heightFraction: 0.04,
			},
		},
		tongue_short_outer: {
			cx: 31,
			cy: 36,
			radius: 11,
			ang0: 0.7853981633974483,
			ang1: -0.7853981633974483,
			thick0: 10,
			thick1: 5,
			rot: 0,
			feather: 0.4,
			periodicTongue: {
				periodSeconds: 2,
				phaseRadians: 2.0943951023931953,
				swayPixels: 0.4,
				widthFraction: 0.04,
				heightFraction: 0.04,
			},
		},
		tongue_tall_inner: {
			cx: 9,
			cy: 33,
			radius: 15,
			ang0: 0.7853981633974483,
			ang1: -0.7853981633974483,
			thick0: 6,
			thick1: 2.6,
			rot: 0,
			feather: 0.4,
			periodicTongue: {
				periodSeconds: 2,
				phaseRadians: 0,
				swayPixels: -0.4,
				widthFraction: 0.04,
				heightFraction: 0.04,
			},
		},
		tongue_short_inner: {
			cx: 31,
			cy: 36,
			radius: 11,
			ang0: 0.7853981633974483,
			ang1: -0.7853981633974483,
			thick0: 6,
			thick1: 2.6,
			rot: 0,
			feather: 0.4,
			periodicTongue: {
				periodSeconds: 2,
				phaseRadians: 2.0943951023931953,
				swayPixels: 0.4,
				widthFraction: 0.04,
				heightFraction: 0.04,
			},
		},
		base: { cx: 30, cy: 46, r: 11, lobes: 4, amp: 0.04, phase: 0, feather: 0.4 },
		core: { cx: 30, cy: 46, r0: 0, r1: 3.5, feather: 0.4 },
	},
};

function deepDiff(a, b, path, out) {
	if (a === undefined || b === undefined) {
		out.push(`${path}: presence differs`);
		return;
	}
	if (a && b && typeof a === "object" && typeof b === "object") {
		for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
			deepDiff(a[k], b[k], `${path}.${k}`, out);
		}
		return;
	}
	if (a !== b) out.push(`${path}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`);
}

function withEdit(mutate) {
	const def = structuredClone(SPEC_FLAME16);
	mutate(def);
	return def;
}

function asFx(def) {
	return { id: "quality_flame", flame16Geometry: def };
}

const STAGE_MIN_PARAMS = {
	keepStages: false,
	recolor: "none",
	outline: false,
	outlineColor: "#000000",
	frameCount: 0,
	fps: 12,
	seed: "42",
	width: 16,
	height: 16,
	paletteSize: 8,
	dither: "none",
};

function boundaryReject(def) {
	renderQualityStages(asFx(def), STAGE_MIN_PARAMS);
}

const STAGE_RENDER_PARAMS = {
	...STAGE_MIN_PARAMS,
	frameCount: 1,
	pixelScale: 1,
};

const flamePreset = QUALITY_PRESETS.find((p) => p.id === "quality_flame");

describe("flame16-v1 source equals approved literals", () => {
	test("preset property deep-equals the approved literal block", () => {
		const diffs = [];
		deepDiff(flamePreset.flame16Geometry, SPEC_FLAME16, "flame16Geometry", diffs);
		expect(diffs).toEqual([]);
	});
	test("no width/height members exist on the property", () => {
		expect("width" in flamePreset.flame16Geometry).toBe(false);
		expect("height" in flamePreset.flame16Geometry).toBe(false);
	});
	test("whitelist has exactly the seven approved override IDs", () => {
		expect(Object.keys(flamePreset.flame16Geometry.overrides).sort()).toEqual(
			[
				"base",
				"core",
				"perimeter",
				"tongue_short_inner",
				"tongue_short_outer",
				"tongue_tall_inner",
				"tongue_tall_outer",
			].sort(),
		);
	});
	test("approved literal block passes validation", () => {
		expect(() => validateFlame16Definition(asFx(SPEC_FLAME16))).not.toThrow();
	});
});

describe("flame16-v1 definition validation negative controls", () => {
	test("wrong revision string is rejected", () => {
		expect(() =>
			boundaryReject(withEdit((d) => (d.revision = "flame16-v2"))),
		).toThrow(/revision must be exactly 'flame16-v1'/);
	});
	test("unknown override ID is rejected", () => {
		expect(() =>
			boundaryReject(withEdit((d) => (d.overrides.tongue_extra = { cx: 1, cy: 1, radius: 2 }))),
		).toThrow(/unknown override ID 'tongue_extra'/);
	});
	test("role override is rejected", () => {
		expect(() =>
			boundaryReject(withEdit((d) => (d.overrides.perimeter.role = "primary"))),
		).toThrow(/override 'perimeter' has disallowed field 'role'/);
	});
	test("material (color) override is rejected", () => {
		expect(() =>
			boundaryReject(withEdit((d) => (d.overrides.perimeter.color = [1, 0, 0]))),
		).toThrow(/override 'perimeter' has disallowed field 'color'/);
	});
	test("top-level width member is rejected", () => {
		expect(() =>
			boundaryReject(withEdit((d) => (d.width = 16))),
		).toThrow(/unknown top-level field 'width'/);
	});
	test("non-finite geometry value is rejected", () => {
		expect(() =>
			boundaryReject(withEdit((d) => (d.overrides.perimeter.r = NaN))),
		).toThrow(/'perimeter.r' must be a finite number/);
	});
	test("incomplete periodicTongue object is rejected", () => {
		expect(() =>
			boundaryReject(withEdit((d) => delete d.overrides.tongue_tall_outer.periodicTongue.widthFraction)),
		).toThrow(/periodicTongue' missing 'widthFraction'/);
	});
	test("periodSeconds other than 2 is rejected", () => {
		expect(() =>
			boundaryReject(withEdit((d) => (d.overrides.tongue_short_outer.periodicTongue.periodSeconds = 3))),
		).toThrow(/periodSeconds' must be exactly 2/);
	});
	test("non-finite periodicTongue value is rejected", () => {
		expect(() =>
			boundaryReject(withEdit((d) => (d.overrides.tongue_tall_inner.periodicTongue.heightFraction = Infinity))),
		).toThrow(/periodicTongue.heightFraction' must be a finite number/);
	});
	test("unknown periodicTongue field is rejected", () => {
		expect(() =>
			boundaryReject(withEdit((d) => (d.overrides.tongue_short_inner.periodicTongue.skew = 1))),
		).toThrow(/periodicTongue' has unknown field 'skew'/);
	});
});

describe("flame16-v1 inherited override entries are ignored at the real boundary", () => {
	test("prototype-carried invalid override never reaches merge or validation", () => {
		const badPt = {
			periodSeconds: 99,
			phaseRadians: 0,
			swayPixels: 0,
			widthFraction: 0.01,
			heightFraction: 0.01,
		};
		const proto = {
			tongue_short_outer: {
				cx: 1,
				cy: 1,
				radius: 1,
				ang0: 0,
				ang1: 0,
				thick0: 1,
				thick1: 1,
				rot: 0,
				feather: 0,
				periodicTongue: badPt,
			},
		};
		const def = structuredClone(SPEC_FLAME16);
		delete def.overrides.tongue_short_outer;
		const inheritedOverrides = Object.assign(Object.create(proto), def.overrides);
		expect(Object.hasOwn(inheritedOverrides, "tongue_short_outer")).toBe(false);
		const fx = { ...flamePreset, flame16Geometry: { revision: def.revision, overrides: inheritedOverrides } };
		const st = renderQualityStages(fx, STAGE_RENDER_PARAMS);
		expect(st.geometryVariant).toBe("quality_flame:flame16-v1");
		expect(() =>
			renderQualityStages(
				{
					...flamePreset,
					flame16Geometry: {
						revision: def.revision,
						overrides: { ...def.overrides, tongue_short_outer: { ...proto.tongue_short_outer } },
					},
				},
				STAGE_RENDER_PARAMS,
			),
		).toThrow(/periodSeconds/);
	});
});
