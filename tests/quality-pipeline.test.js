import { describe, expect, test } from "bun:test";
import { ALL_PRESETS } from "../src/effects.js";
import { QUALITY_PRESETS } from "../src/quality-effects.js";
import { buildSequence, renderQualityStages } from "../src/pipeline.js";

const IDS = [
	"quality_slash",
	"quality_flame",
	"quality_impact",
	"quality_smoke",
	"quality_magic_ring",
];

function qparams(over = {}) {
	return {
		effectId: "quality_impact",
		seed: "7",
		width: 64,
		height: 64,
		fps: 12,
		pixelScale: 1,
		paletteSize: 16,
		dither: "none",
		outline: false,
		recolor: "none",
		...over,
	};
}

function palKeys(pal) {
	const s = new Set();
	for (let i = 0; i + 2 < pal.length; i += 3) {
		s.add(`${pal[i]},${pal[i + 1]},${pal[i + 2]}`);
	}
	return s;
}

describe("quality path registration", () => {
	test("all five quality presets are registered with kind quality", () => {
		for (const id of IDS) {
			const p = ALL_PRESETS.find((x) => x.id === id);
			expect(p).toBeDefined();
			expect(p.kind).toBe("quality");
			expect(p.layers.length).toBeGreaterThan(0);
		}
	});
	test("unknown effect fallback still resolves to a legacy preset", () => {
		const seq = buildSequence(qparams({ effectId: "does_not_exist" }));
		expect(seq.params.effectId).toBe("ember_burst");
		expect(seq.params.effect.kind).toBeUndefined();
	});
});

describe("buildSequence quality branch", () => {
	test("returns the legacy contract shape with target-size frames", () => {
		const seq = buildSequence(qparams());
		expect(seq.frames.length).toBe(seq.frameCount);
		expect(seq.frameCount).toBeGreaterThan(1);
		expect(seq.frames[0].length).toBe(64 * 64 * 4);
		expect(Array.isArray(seq.palette)).toBe(false);
		expect(seq.palette.length).toBeGreaterThan(0);
		expect(Array.isArray(seq.messages)).toBe(true);
		expect(seq.params.effectId).toBe("quality_impact");
	});
	test("alpha is binary at the shared threshold after sampling", () => {
		const seq = buildSequence(qparams());
		let lit = 0;
		for (const f of seq.frames) {
			for (let i = 3; i < f.length; i += 4) {
				expect(f[i] === 0 || f[i] === 255).toBe(true);
				if (f[i] === 255) lit++;
			}
		}
		expect(lit).toBeGreaterThan(0);
	});
	test("byte-deterministic; seed changes seeded layers", () => {
		const a = buildSequence(qparams());
		const b = buildSequence(qparams());
		const c = buildSequence(qparams({ seed: "8" }));
		const mid = Math.floor(a.frames.length / 2);
		expect(Array.from(a.frames[mid])).toEqual(Array.from(b.frames[mid]));
		expect(Array.from(a.frames[1])).toEqual(Array.from(b.frames[1]));
		expect(Array.from(a.frames[1])).not.toEqual(
			Array.from(c.frames[1]),
		);
	});
	test("pixelScale does not resize quality frames", () => {
		const small = buildSequence(qparams({ pixelScale: 1 }));
		const big = buildSequence(qparams({ pixelScale: 4 }));
		expect(big.frames[0].length).toBe(64 * 64 * 4);
		expect(Array.from(big.frames[0])).toEqual(
			Array.from(small.frames[0]),
		);
	});
	test("every visible pixel belongs to the single sequence palette", () => {
		const seq = buildSequence(qparams());
		const keys = palKeys(seq.palette);
		for (const f of seq.frames) {
			for (let i = 0; i < f.length; i += 4) {
				if (f[i + 3] === 0) continue;
				expect(keys.has(`${f[i]},${f[i + 1]},${f[i + 2]}`)).toBe(
					true,
				);
			}
		}
	});
	test("recolor survives quantization", () => {
		const plain = buildSequence(qparams());
		const recolored = buildSequence(qparams({ recolor: "frost" }));
		const mid = Math.floor(plain.frames.length / 2);
		const key = (s) =>
			s.frames[mid].filter((_, i) => i % 4 !== 3).join(",");
		expect(key(recolored)).not.toEqual(key(plain));
		const keys = palKeys(recolored.palette);
		for (let i = 0; i < recolored.frames[mid].length; i += 4) {
			if (recolored.frames[mid][i + 3] === 0) continue;
			expect(
				keys.has(
					`${recolored.frames[mid][i]},${recolored.frames[mid][i + 1]},${recolored.frames[mid][i + 2]}`,
				),
			).toBe(true);
		}
	});
	test("each of the five presets renders through the branch", () => {
		// fps=3 is the smallest fps whose mid-frame sample (floor(ceil(d*fps)/2)/fps
		// at d = 0.5/2/0.75/1.5/2 → 0.333/1.0/0.333/0.667/1.0s) stays strictly
		// inside every preset's active window — the same asserted branch behavior
		// as the 12fps default, with 22 rendered frames instead of 81 (the old
		// wall-clock-sensitive fixture was a load-dependent 5000ms timeout).
		for (const id of IDS) {
			const seq = buildSequence(qparams({ effectId: id, fps: 3 }));
			expect(seq.params.effect.kind).toBe("quality");
			expect(seq.frames[0].length).toBe(64 * 64 * 4);
			const mid = Math.floor(seq.frames.length / 2);
			let lit = 0;
			for (let i = 3; i < seq.frames[mid].length; i += 4) {
				if (seq.frames[mid][i] === 255) lit++;
			}
			expect(lit).toBeGreaterThan(0);
		}
	});
	test("legacy path still renders unchanged shape", () => {
		const seq = buildSequence(
			qparams({ effectId: "ember_burst", pixelScale: 2 }),
		);
		expect(seq.params.effect.kind).toBeUndefined();
		expect(seq.frames[0].length).toBe(64 * 64 * 4);
	});
	test("stages.final matches buildSequence bytes; unthresholded keeps soft alpha", () => {
		const seq = buildSequence(qparams());
		const st = renderQualityStages(seq.params.effect, seq.params, {
			keepStages: true,
		});
		expect(st.final.length).toBe(seq.frames.length);
		for (let i = 0; i < st.final.length; i++) {
			expect(Array.from(st.final[i])).toEqual(Array.from(seq.frames[i]));
		}
		let soft = 0;
		for (const f of st.unthresholded) {
			for (let i = 3; i < f.length; i += 4) {
				if (f[i] > 0 && f[i] < 255) soft++;
			}
		}
		expect(soft).toBeGreaterThan(0);
		for (const f of st.policyApplied) {
			for (let i = 3; i < f.length; i += 4) {
				expect(f[i] === 0 || f[i] === 255).toBe(true);
			}
		}
		for (const f of st.final) {
			for (let i = 3; i < f.length; i += 4) {
				expect(f[i] === 0 || f[i] === 255).toBe(true);
			}
		}
	});
});

describe("flame16-v1 shared selector (lead-approved LOD)", () => {
	const flameFx = () => QUALITY_PRESETS.find((x) => x.id === "quality_flame");
	// Contract reference: property removed, overrides merged explicitly — used
	// only inside this test to prove the selector equals explicit geometry.
	const explicitMerged = (filterAccent = false) => {
		const fx = flameFx();
		const g = fx.flame16Geometry;
		const e = { ...fx };
		delete e.flame16Geometry;
		e.layers = fx.layers
			.filter((l) => (filterAccent ? l.role !== "accent" : true))
			.map((l) => {
				const ov = g.overrides[l.id];
				if (!ov) return l;
				const m = { ...l, ...ov };
				if (ov.periodicTongue) m.periodicTongue = { ...ov.periodicTongue };
				return m;
			});
		return e;
	};
	const propRemoved = () => {
		const e = { ...flameFx() };
		delete e.flame16Geometry;
		return e;
	};
	const equalFrames = (a, b) => {
		expect(a.frames.length).toBe(b.frames.length);
		for (let i = 0; i < a.frames.length; i++) {
			expect(Buffer.from(a.frames[i]).equals(Buffer.from(b.frames[i]))).toBe(
				true,
			);
		}
		expect(Buffer.from(a.palette).equals(Buffer.from(b.palette))).toBe(true);
	};

	test("boundary matrix: exact 16x16 only (64, 32, 16, 48x16, 16x32, 32x16, 17x17, 48x48)", () => {
		const cases = [
			{ w: 64, h: 64, want: "quality_flame:r2" },
			{ w: 32, h: 32, want: "quality_flame:r2" },
			{ w: 16, h: 16, want: "quality_flame:flame16-v1" },
			{ w: 48, h: 16, want: "quality_flame:r2" },
			{ w: 16, h: 32, want: "quality_flame:r2" },
			{ w: 32, h: 16, want: "quality_flame:r2" },
			{ w: 17, h: 17, want: "quality_flame:r2" },
			{ w: 48, h: 48, want: "quality_flame:r2" },
		];
		for (const c of cases) {
			const seq = buildSequence(
				qparams({ effectId: "quality_flame", width: c.w, height: c.h }),
			);
			expect(seq.geometryVariant).toBe(c.want);
			expect(seq.frames.length).toBe(seq.frameCount);
			expect(seq.frames[0].length).toBe(c.w * c.h * 4);
			expect(seq.params.effect.kind).toBe("quality");
		}
	}, { timeout: 60000 });

	test("scale 8 at width16 stays quality path and still selects flame16-v1", () => {
		const seq = buildSequence(
			qparams({
				effectId: "quality_flame",
				width: 16,
				height: 16,
				pixelScale: 8,
			}),
		);
		expect(seq.geometryVariant).toBe("quality_flame:flame16-v1");
		expect(seq.frames[0].length).toBe(16 * 16 * 4);
		expect(seq.params.effect.kind).toBe("quality");
	}, { timeout: 60000 });

	test("selected 16x16 is byte-equal to explicit merged geometry; explicit not marked", () => {
		const sel = buildSequence(
			qparams({ effectId: "quality_flame", width: 16, height: 16 }),
		);
		expect(sel.geometryVariant).toBe("quality_flame:flame16-v1");
		const expl = buildSequence({
			...qparams({ effectId: "quality_flame", width: 16, height: 16 }),
			effect: explicitMerged(),
		});
		expect(expl.geometryVariant).toBe("quality_flame:r2");
		equalFrames(sel, expl);
	}, { timeout: 60000 });

	test("property removed behaves exactly as R2 at 64, 32 and 48x16", () => {
		for (const [w, h] of [
			[64, 64],
			[32, 32],
			[48, 16],
		]) {
			const withProp = buildSequence(
				qparams({ effectId: "quality_flame", width: w, height: h }),
			);
			const noProp = buildSequence({
				...qparams({ effectId: "quality_flame", width: w, height: h }),
				effect: propRemoved(),
			});
			expect(noProp.geometryVariant).toBe("quality_flame:r2");
			equalFrames(withProp, noProp);
		}
	}, { timeout: 60000 });

	test("primary (accent-filtered) passes the variant through at 64 and 16", () => {
		const primary64 = buildSequence({
			...qparams({ effectId: "quality_flame", width: 64, height: 64 }),
			effect: {
				...flameFx(),
				layers: flameFx().layers.filter((l) => l.role !== "accent"),
			},
		});
		expect(primary64.geometryVariant).toBe("quality_flame:r2");
		const primary16 = buildSequence({
			...qparams({ effectId: "quality_flame", width: 16, height: 16 }),
			effect: {
				...flameFx(),
				layers: flameFx().layers.filter((l) => l.role !== "accent"),
			},
		});
		expect(primary16.geometryVariant).toBe("quality_flame:flame16-v1");
		const expl16 = buildSequence({
			...qparams({ effectId: "quality_flame", width: 16, height: 16 }),
			effect: explicitMerged(true),
		});
		equalFrames(primary16, expl16);
	}, { timeout: 60000 });

	test("stage-board parity: direct renderQualityStages returns same variant and bytes", () => {
		const seq = buildSequence(
			qparams({ effectId: "quality_flame", width: 16, height: 16 }),
		);
		const st = renderQualityStages(seq.params.effect, seq.params, {
			keepStages: true,
		});
		expect(st.geometryVariant).toBe("quality_flame:flame16-v1");
		expect(st.geometryVariant).toBe(seq.geometryVariant);
		expect(st.final.length).toBe(seq.frames.length);
		for (let i = 0; i < st.final.length; i++) {
			expect(Buffer.from(st.final[i]).equals(Buffer.from(seq.frames[i]))).toBe(
				true,
			);
		}
		const seq64 = buildSequence(
			qparams({ effectId: "quality_flame", width: 64, height: 64 }),
		);
		const st64 = renderQualityStages(seq64.params.effect, seq64.params, {
			keepStages: true,
		});
		expect(st64.geometryVariant).toBe("quality_flame:r2");
		const primary16Fx = {
			...flameFx(),
			layers: flameFx().layers.filter((l) => l.role !== "accent"),
		};
		const stP16 = renderQualityStages(primary16Fx, seq.params, {
			keepStages: true,
		});
		expect(stP16.geometryVariant).toBe("quality_flame:flame16-v1");
	}, { timeout: 60000 });

	test("non-flame quality effects and legacy path never receive flame16-v1", () => {
		for (const id of ["quality_impact", "quality_slash"]) {
			const seq = buildSequence(
				qparams({ effectId: id, width: 16, height: 16 }),
			);
			expect(seq.geometryVariant).toBeNull();
			expect(seq.geometryVariant).not.toBe("quality_flame:flame16-v1");
		}
		const legacy = buildSequence(
			qparams({ effectId: "ember_burst", pixelScale: 2 }),
		);
		expect(legacy.geometryVariant).not.toBe("quality_flame:flame16-v1");
		expect(legacy.geometryVariant).toBeUndefined();
	}, { timeout: 60000 });

	test("immutability: preset, layers and property never mutated; 7 primary + 3 accent", () => {
		const before = JSON.stringify(QUALITY_PRESETS);
		const propBefore = JSON.stringify(flameFx().flame16Geometry);
		const runs = [
			qparams({ effectId: "quality_flame", width: 16, height: 16 }),
			qparams({ effectId: "quality_flame", width: 64, height: 64 }),
			{
				...qparams({ effectId: "quality_flame", width: 16, height: 16 }),
				effect: explicitMerged(),
			},
			{
				...qparams({ effectId: "quality_flame", width: 16, height: 16 }),
				effect: {
					...flameFx(),
					layers: flameFx().layers.filter((l) => l.role !== "accent"),
				},
			},
		];
		for (const p of runs) buildSequence(p);
		expect(JSON.stringify(QUALITY_PRESETS)).toBe(before);
		expect(JSON.stringify(flameFx().flame16Geometry)).toBe(propBefore);
		const g = flameFx().flame16Geometry;
		for (const id of Object.keys(g.overrides)) {
			expect(flameFx().layers.some((l) => l.id === id)).toBe(true);
		}
		expect(flameFx().layers.length).toBe(10); // 7 primary + 3 accent
	}, { timeout: 60000 });
});
