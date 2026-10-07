export const QUALITY_PRESETS = [
	{
		id: "quality_slash",
		name: "Slash Impact",
		kind: "quality",
		duration: 0.5, // 6 samples @ 12fps (frames 0..5); boundary GIF = 500ms
		loop: false,
		brief: "continuous tapered crescent — broad body, bright leading edge, dissolving trailing edge, restrained endpoint sparks; 0.50s one-shot, reveal complete by 0.17s, tail to 0.42s, transparent at last sample 5/12",
		delaySchedule: "boundary",
		roles: {
			primary: ["crescent", "edge"],
			accents: ["spark"],
		},
		// Authored as FOUR overlapping arc segments (shared M1 arc primitive —
		// no renderer change): sweep −165°→−15° about (32,44) at radius 24,
		// segment ends overlap 6° with seam-matched thickness so the body reads
		// as ONE continuous taper: 1.5px trailing tip → 8.5px broad mid → 0.8px
		// sharp leading tip (R1 cap). Reveal: segment t0 0 / 0.04 / 0.08 / 0.12
		// with fade-in 0 (frame 0 already carries the trailing tip) → latest
		// primary support 0.12s ≤ 0.17s, first supported sample f2 (sample gate
		// enforced in scripts/evidence-gates.mjs). All layers die at t1 = 5/12 so the last
		// sample is exactly transparent (alpha = (1−p)/fout = 0 at p=1).
		// Dissolve runs trailing→leading: fout 0.55/0.55/0.6/0.65 leaves a
		// shortened colored body (cyan/blue + subordinate highlight) through
		// frame 4 while violet recedes (tail ≈0.42s).
		// Palette: violet trailing → blue body → cyan-blue → pale-cyan bright
		// leading (emission) — brief's pale cyan/blue/violet family.
		layers: [
			{
				id: "crescent_0", // trailing tip (violet), dissolves first
				kind: "arc",
				t0: 0,
				t1: 5 / 12,
				cx: 32,
				cy: 44,
				radius: 24,
				ang0: -2.87979, // −165°
				ang1: -2.11185, // −121°
				thick0: 1.5,
				thick1: 5,
				feather: 0.9,
				color: [0.45, 0.18, 0.95],
				alpha: 0.75,
				fade: [0, 0.55],
				role: "primary",
			},
			{
				id: "crescent_1", // blue body
				kind: "arc",
				t0: 0.04,
				t1: 5 / 12,
				cx: 32,
				cy: 44,
				radius: 24,
				ang0: -2.21656, // −127° (6° overlap)
				ang1: -1.44862, // −83°
				thick0: 5,
				thick1: 7.5,
				feather: 0.9,
				color: [0.14, 0.38, 0.98],
				alpha: 0.9,
				fade: [0, 0.55],
				role: "primary",
			},
			{
				id: "crescent_2", // cyan-blue broad body
				kind: "arc",
				t0: 0.08,
				t1: 5 / 12,
				cx: 32,
				cy: 44,
				radius: 24,
				ang0: -1.55334, // −89°
				ang1: -0.785398, // −45°
				thick0: 7.5,
				thick1: 8.5,
				feather: 0.9,
				color: [0.2, 0.7, 1],
				alpha: 0.95,
				fade: [0, 0.6],
				role: "primary",
			},
			{
				// R1 (Astra slash direction): taper continuously from the seam to a
				// SHARP cyan endpoint — thick0 stays seam-matched at 8.5 to
				// crescent_2's end; thick1 6→0.8 so the tip reads as a point at
				// 64/32/16 instead of a blunt slab. Cyan (not white): color
				// [0.2,0.85,1] with weak emission keeps the cap visibly cyan
				// beneath the pale highlight.
				id: "crescent_3", // leading body (cyan, tapered sharp)
				kind: "arc",
				t0: 0.12,
				t1: 5 / 12,
				cx: 32,
				cy: 44,
				radius: 24,
				ang0: -0.890118, // −51° (seam)
				ang1: -0.261799, // −15°
				thick0: 8.5,
				thick1: 0.8, // sharp endpoint (was 6 — white slab defect)
				feather: 0.9,
				color: [0.2, 0.85, 1],
				emission: [0.1, 0.5, 0.8],
				emissionStrength: 0.35,
				alpha: 1,
				fade: [0, 0.65],
				role: "primary",
			},
			{
				// R1: narrow pale highlight hugging the cap's INNER edge
				// (radius offset −1.6 from the 24px centerline, sweep stops at
				// −20° before the tip) with reduced width/alpha — an edge accent
				// of the cap, not a second bright center stripe.
				id: "edge", // bright leading-edge rim (thin, locks in at reveal)
				kind: "arc",
				t0: 0.1,
				t1: 5 / 12,
				cx: 32,
				cy: 44,
				radius: 22.4,
				ang0: -0.610865, // −35°
				ang1: -0.349066, // −20° (stops short of the sharp tip)
				thick0: 1.3,
				thick1: 0.6,
				feather: 0.6,
				color: [0.8, 1, 1],
				emission: [0.7, 1, 1],
				emissionStrength: 0.9,
				alpha: 0.75,
				fade: [0, 0.6],
				role: "primary",
			},
			{
				// restrained endpoint sparks (accent): 2 leading + 1 trailing,
				// visible only frames 02-03, gone before the tail ends
				id: "spark_lead_0",
				kind: "streak",
				t0: 0.15,
				t1: 0.34,
				x0: 55.2,
				y0: 37.8,
				vx: 23.2,
				vy: -6.2,
				length: 4,
				width: 1.8,
				feather: 0.5,
				color: [0.8, 1, 1],
				alpha: 0.7,
				fade: [0.1, 0.5],
				role: "accent",
				seeded: true,
				spread: 0.15,
				jitter: 0.6,
			},
			{
				id: "spark_lead_1",
				kind: "streak",
				t0: 0.17,
				t1: 0.34,
				x0: 55.2,
				y0: 37.8,
				vx: 18,
				vy: -8.8,
				length: 3,
				width: 1.4,
				feather: 0.5,
				color: [0.7, 0.9, 1],
				alpha: 0.6,
				fade: [0.1, 0.5],
				role: "accent",
				seeded: true,
				spread: 0.2,
				jitter: 0.6,
			},
			{
				id: "spark_trail",
				kind: "streak",
				t0: 0.15,
				t1: 0.32,
				x0: 8.8,
				y0: 37.8,
				vx: -17.4,
				vy: -4.7,
				length: 3,
				width: 1.4,
				feather: 0.5,
				color: [0.6, 0.5, 1],
				alpha: 0.55,
				fade: [0.1, 0.5],
				role: "accent",
				seeded: true,
				spread: 0.2,
				jitter: 0.6,
			},
		],
	},
	{
		id: "quality_flame",
		name: "Flame Jet",
		kind: "quality",
		duration: 2,
		loop: true,
		brief:
			"looping connected flame: bright yellow lower core, orange 2-3 tongue body, darker red perimeter, few rising embers (yellow/orange/red)",
		// R2: two unequal tapered tongues with aligned opaque dark contours.
		// Optional periodicTongue deforms each pair about a fixed root.
		// One shared geometry at 64/32/16; 24 samples i/12, no endpoint duplicate.
		delaySchedule: "boundary", // cumulative encoded delays → exactly 2000ms
		roles: { primary: ["base", "tongue", "core"], accents: ["ember"] },
		flame16Geometry: {
			revision: "flame16-v1",
			overrides: {
				perimeter: {
					cx: 30,
					cy: 47,
					r: 12,
					lobes: 4,
					amp: 0.04,
					phase: 0,
					feather: 0.4,
				},
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
				base: {
					cx: 30,
					cy: 46,
					r: 11,
					lobes: 4,
					amp: 0.04,
					phase: 0,
					feather: 0.4,
				},
				core: {
					cx: 30,
					cy: 46,
					r0: 0,
					r1: 3.5,
					feather: 0.4,
				},
			},
		},
		layers: [
			// Compact dark lower support; never supplies the upper silhouette.
			{
				id: "perimeter",
				kind: "puff",
				t0: 0,
				t1: 2,
				cx: 32,
				cy: 46,
				r: 10,
				lobes: 4,
				amp: 0.14,
				phase: 0.5,
				feather: 0.6,
				color: [0.12, 0.012, 0.003],
				alpha: 1,
				role: "primary",
				seeded: false,
			},
			// Outer contours first; each shares exact geometry/phase with its inner.
			{
				id: "tongue_tall_outer",
				kind: "arc",
				t0: 0,
				t1: 2,
				cx: 14,
				cy: 33,
				radius: 17,
				ang0: 0.7853981633974483,
				ang1: -1.0471975511965976,
				thick0: 12,
				thick1: 4.8,
				rot: 0,
				feather: 0.6,
				color: [0.12, 0.012, 0.003],
				alpha: 1,
				role: "primary",
				seeded: false,
				periodicTongue: {
					periodSeconds: 2,
					phaseRadians: 0,
					swayPixels: -1.2,
					widthFraction: 0.06,
					heightFraction: 0.12,
				},
			},
			{
				id: "tongue_short_outer",
				kind: "arc",
				t0: 0,
				t1: 2,
				cx: 29,
				cy: 36,
				radius: 12,
				ang0: 0.7853981633974483,
				ang1: -1.0471975511965976,
				thick0: 11,
				thick1: 4.8,
				rot: 0,
				feather: 0.6,
				color: [0.12, 0.012, 0.003],
				alpha: 1,
				role: "primary",
				seeded: false,
				periodicTongue: {
					periodSeconds: 2,
					phaseRadians: 2.0943951023931953,
					swayPixels: 1,
					widthFraction: 0.06,
					heightFraction: 0.1,
				},
			},
			{
				id: "tongue_tall_inner",
				kind: "arc",
				t0: 0,
				t1: 2,
				cx: 14,
				cy: 33,
				radius: 17,
				ang0: 0.7853981633974483,
				ang1: -1.0471975511965976,
				thick0: 7.2,
				thick1: 2.2,
				rot: 0,
				feather: 0.6,
				color: [1, 0.34, 0.025],
				alpha: 1,
				role: "primary",
				seeded: false,
				periodicTongue: {
					periodSeconds: 2,
					phaseRadians: 0,
					swayPixels: -1.2,
					widthFraction: 0.06,
					heightFraction: 0.12,
				},
			},
			{
				id: "tongue_short_inner",
				kind: "arc",
				t0: 0,
				t1: 2,
				cx: 29,
				cy: 36,
				radius: 12,
				ang0: 0.7853981633974483,
				ang1: -1.0471975511965976,
				thick0: 6.4,
				thick1: 2.2,
				rot: 0,
				feather: 0.6,
				color: [1, 0.46, 0.04],
				alpha: 1,
				role: "primary",
				seeded: false,
				periodicTongue: {
					periodSeconds: 2,
					phaseRadians: 2.0943951023931953,
					swayPixels: 1,
					widthFraction: 0.06,
					heightFraction: 0.1,
				},
			},
			// Base overlays the broad ribbon roots and joins them below the valley.
			{
				id: "base",
				kind: "puff",
				t0: 0,
				t1: 2,
				cx: 32,
				cy: 45,
				r: 8,
				lobes: 4,
				amp: 0.14,
				phase: 0.2,
				feather: 0.8,
				color: [0.85, 0.22, 0.02],
				alpha: 1,
				role: "primary",
				seeded: false,
			},
			// Compact steady hot root, below the two independently moving tips.
			{
				id: "core",
				kind: "radial",
				t0: 0,
				t1: 2,
				cx: 32,
				cy: 45,
				r0: 0,
				r1: 3.5,
				feather: 0.8,
				color: [1, 0.9, 0.4],
				emission: [1, 0.85, 0.35],
				emissionStrength: 0.55,
				alpha: 1,
				role: "primary",
				seeded: false,
			},
			// few embers (accent role ≤3): staggered short windows, all dark
			// before the seam (last ends 1.9s < sample 23 at 1.9167s)
			...Array.from({ length: 3 }, (_, k) => {
				const t0 = [0.15, 0.8, 1.45][k];
				return {
					id: `ember_${k}`,
					kind: "streak",
					t0,
					t1: t0 + 0.45,
					x0: [29, 35, 32][k],
					y0: 34 - k,
					vx: [2.5, -2, 1.5][k],
					vy: [-26, -24, -22][k],
					width: 1.6,
					length: 4,
					stretch: 0.1,
					feather: 0.5,
					color: [1, 0.72, 0.18],
					alpha: [0.75, 0.7, 0.65][k],
					fade: [0.15, 0.35],
					role: "accent",
					seeded: true,
					jitter: 1.5,
					spread: 0.2,
				};
			}),
		],
	},
	{
		id: "quality_impact",
		name: "Impact Burst",
		kind: "quality",
		duration: 0.75,
		loop: false,
		brief: "bright compact pale-warm core, expanding orange ring, 8 directional shards, short dark-red puff tail",
		// Astra directed revision R1 (2026-10-06, sprite-astra-m3-impact-direction.md):
		// re-author as an OPEN RADIAL BURST — the M2 packet read as wheel/spokes →
		// brown coin → red stamp. One silhouette/hierarchy change only:
		//   - compact pale core (flash dies after frame 2, stays a small disc);
		//   - thin orange annulus (r1-r0 ≈ 3 canvas px at grow 1, feather 0.8 →
		//     ~2-3 target px at 64, 1-2 at 32; honest saturated orange, NOT the
		//     previous metric-chased dark brown);
		//   - 8 shards START beyond the ring's outer edge with transparent angular
		//     gaps (radial spokes were drawn from center = dark wheel);
		//   - tail enters late (0.28s), shrinks and dims frame 05→07, exact zero
		//     at frame 8. Same 750ms boundary schedule, same primary/accent roles.
		//   - M1 renderer, alpha policy and pipeline are untouched; no peak/extent
		//     metric chasing — brightness vs extent peaks are labeled diagnostics.
		delaySchedule: "boundary",
		roles: { primary: ["core", "ring"], accents: ["shard", "tail"] },
		layers: [
			{
				id: "tail",
				kind: "puff",
				t0: 0.28, // enters frame 04: burst first, subordinate puff after
				t1: 8 / 12, // one-shot last sample; fade reaches exact zero there
				cx: 32,
				cy: 32,
				r: 6,
				lobes: 6,
				amp: 0.3, // deeper lobing = visible break-up, not a solid stamp
				grow: [0.85, 0.3], // SHRINKS: footprint reduces 05→07 (dissipating)
				// linear dark red (renders near sRGB #61 21 17 — brief's dark tail)
				color: [0.12, 0.015, 0.008],
				alpha: 0.75,
				role: "accent",
				// fout 0.55: center alpha ≈0.30 at frame 7 (still clears the 0.28
				// policy so the puff persists) and exactly 0 at frame 8 (p=1).
				fade: [0.15, 0.55],
			},
			{
				id: "ring",
				kind: "radial",
				t0: 0,
				t1: 0.5, // alive through frame 05, gone frame 06 (p=1 at 0.5s)
				cx: 32,
				cy: 32,
				// Thin annulus: (r1-r0)=3 canvas px × grow → ~2-3 target px at 64px,
				// 1-2 at 32px (Astra R1), with an OPEN hole the core sits in — not the
				// previous thick near-solid disc (r0 5 → r1 20 across grow).
				r0: 9,
				r1: 12,
				feather: 0.8,
				// R2 color-only correction (Astra R1 verdict, 2nd directed revision):
				// R1's [1,0.5,0.08] rendered FINAL indexed bytes (255,224,70) — lemon,
				// not the brief's orange body. Linear G 0.5→0.18 and B 0.08→0.03 keep
				// the body orange after ACES + the sequence median-cut palette at
				// 64/32/16 on every background, clearly distinct from the pale core.
				// Geometry, timing, tail, renderer, policy: untouched. The rendered
				// indexed bytes (not this comment) are the judgment surface.
				color: [1, 0.18, 0.03],
				alpha: 1,
				role: "primary",
				// fade [0,0.5]: full through the attack (frame 0 carries it), decays
				// 04→05 handing hierarchy to the tail; alpha ≈0.33 at frame 5 still
				// clears the 0.28 policy.
				fade: [0, 0.5],
				grow: [0.5, 1.35], // outer radius ≈6→16.2: expansion stays open
			},
			{
				id: "core",
				kind: "radial",
				t0: 0,
				t1: 0.22,
				cx: 32,
				cy: 32,
				r0: 0,
				r1: 7, // compact: max radius ≈7×1.0=7 px (was 11×1.15 ≈12.6 disc)
				feather: 1.3,
				color: [1, 0.93, 0.7],
				emission: [1, 0.88, 0.62],
				emissionStrength: 0.9,
				alpha: 1,
				role: "primary",
				// fade-in 0: frame 0 (t=0) already carries the bright core — the
				// attack lands by frame 2 (≤0.17s). t1 0.22: the compact flash is
				// gone after frame 2 so 02→03 reads as ONE burst opening (ring+
				// shards), never pale wheel → brown coin.
				fade: [0, 0.45],
				grow: [0.55, 1],
			},
			...Array.from({ length: 8 }, (_, k) => {
				const ang = (k * Math.PI) / 4;
				// Start offset puts each streak's INNER end beyond the ring's outer
				// edge at spawn (Astra R1: shards travel outward through transparent
				// gaps — no radial spokes drawn across the core). 8 directions at
				// 45°, width 2.4 ≈ 11° angular footprint at r=12 → ~33° gaps between.
				const spawn = 12;
				return {
					id: `shard_${k}`,
					kind: "streak",
					t0: 0.05, // first visible ~frame 01 as the ring opens
					t1: 0.4,
					x0: 32 + Math.cos(ang) * spawn,
					y0: 32 + Math.sin(ang) * spawn,
					vx: Math.cos(ang) * 30,
					vy: Math.sin(ang) * 30,
					length: 7,
					width: 2.4,
					feather: 0.6,
					// R2: same orange hue family as the ring (was [1,0.62,0.12],
					// indexed lemon) — rays must read orange, not yellow, alongside
					// the pale core.
					color: [1, 0.22, 0.04],
					alpha: 0.9,
					role: "accent",
					fade: [0.06, 0.5],
					seeded: true,
					spread: 0.12,
					jitter: 0.8,
				};
			}),
		],
	},
	{
		id: "quality_smoke",
		name: "Smoke Wisp",
		kind: "quality",
		duration: 1.5,
		loop: false,
		brief: "one-shot drifting smoke with soft dissipation",
		layers: [
			{
				id: "wisp",
				kind: "puff",
				t0: 0,
				t1: 1.5,
				cx: 28,
				cy: 40,
				r: 16,
				lobes: 6,
				amp: 0.18,
				phase: 0.4,
				feather: 3,
				color: [0.6, 0.6, 0.65],
				alpha: 0.5,
				fade: [0.2, 0.5],
				grow: [0.7, 1.3],
				seeded: true,
				jitter: 2.5,
				alphaSpread: 0.15,
			},
			{
				id: "tail",
				kind: "streak",
				t0: 0.15,
				t1: 1.4,
				x0: 30,
				y0: 42,
				vx: 10,
				vy: -16,
				width: 9,
				length: 16,
				stretch: 0.05,
				feather: 2.4,
				color: [0.55, 0.55, 0.6],
				alpha: 0.35,
				fade: [0.2, 0.5],
				seeded: true,
				jitter: 3,
			},
		],
	},
	{
		id: "quality_magic_ring",
		name: "Magic Ring",
		kind: "quality",
		duration: 2,
		loop: true,
		brief: "looping annular glow with rotating spark",
		layers: [
			{
				id: "ring",
				kind: "arc",
				t0: 0,
				t1: 2,
				cx: 32,
				cy: 32,
				radius: 20,
				ang0: -3.1415927,
				ang1: 3.1415927,
				thick0: 3.5,
				thick1: 3.5,
				feather: 0.8,
				color: [0.55, 0.75, 1],
				alpha: 1,
				emission: [0.4, 0.6, 1],
				emissionStrength: 0.7,
				seeded: true,
				spread: 0.06,
			},
			{
				id: "spark",
				kind: "radial",
				t0: 0,
				t1: 2,
				cx: 52,
				cy: 32,
				r0: 0,
				r1: 4,
				feather: 1,
				color: [1, 1, 1],
				alpha: 1,
				fade: [0.02, 0.02],
				seeded: true,
				jitter: 1,
			},
		],
	},
];
