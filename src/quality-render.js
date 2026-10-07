// Shared deterministic quality rendering path (M1).
//
// Stage/order contract (recorded in the M1 receipt):
//   1. Per subsample: layers evaluated painter-order in LINEAR light:
//      normal layers source-over C and A AND occlude earlier emission
//      (Enew = e + (1-a)*E); additive-only layers add E only.
//      C and E stay unclipped during accumulation.
//   2. Fixed 4x supersampling: independent 1/16 area averages give
//      Cbar, Abar, Ebar — no transfer before this reduction.
//   3. One target transfer (q=1): M = aces(Cbar + Ebar),
//      Ae = max_channel(aces(Ebar)), As = max(Abar, Ae);
//      sprite = S(clamp(M/As)) with soft alpha As (pre-policy).
//   4. Optional exact declared-background branch (bakedBackground):
//      Lbg = Cbar + Ebar + (1-Abar)*B, B = D(background bytes/255) —
//      background joins linear light BEFORE exposure/ACES and IS
//      tonemapped; baked alpha is 255. Scene-background input, not a
//      literal output swatch.
//   5. Zero sprite coverage = fully transparent. The final binary alpha
//      at 0.28, recolor and sequence palette happen afterward in the
//      shared pipeline; this module returns soft alpha (the
//      unthresholded diagnostic content).

import { makeRng } from "./rng.js";

export const QUALITY_SUPERSAMPLE = 4;
export const QUALITY_EXPOSURE = 1.0;
export const QUALITY_ALPHA_THRESHOLD = 0.28;

export function linearToSrgb(c) {
	const x = Math.min(1, Math.max(0, c));
	return x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
}

// sRGB decode (contract function D) — bytes normalized before use.
export function srgbToLinear(c) {
	const x = Math.min(1, Math.max(0, c));
	return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

export function acesFitted(x) {
	if (!(x > 0)) return 0;
	const v = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
	return Math.min(1, Math.max(0, v));
}

// Premultiplied source-over: out = src + dst * (1 - src.a).
export function compositeOver(dst, src) {
	const keep = 1 - src.a;
	return [
		src.rgb[0] + dst.rgb[0] * keep,
		src.rgb[1] + dst.rgb[1] * keep,
		src.rgb[2] + dst.rgb[2] * keep,
		src.a + dst.a * keep,
	];
}

// Straight output: rgb = m / a (clamped), then linear->sRGB encode.
export function straighten(m, a) {
	if (!(a > 0)) return [0, 0, 0, 0];
	const r = Math.min(1, Math.max(0, m[0] / a));
	const g = Math.min(1, Math.max(0, m[1] / a));
	const b = Math.min(1, Math.max(0, m[2] / a));
	return [linearToSrgb(r), linearToSrgb(g), linearToSrgb(b), a];
}

export function compositeOnBackground(rgba, bg) {
	const out = new Uint8ClampedArray(rgba.length);
	const [br, bgc, bb] = bg;
	for (let i = 0; i < rgba.length; i += 4) {
		const a = rgba[i + 3] / 255;
		out[i] = Math.round(rgba[i] * a + br * (1 - a));
		out[i + 1] = Math.round(rgba[i + 1] * a + bgc * (1 - a));
		out[i + 2] = Math.round(rgba[i + 2] * a + bb * (1 - a));
		out[i + 3] = 255;
	}
	return out;
}

function smoothstep(e, x) {
	if (e <= 0) return x >= 0 ? 1 : 0;
	const t = Math.min(1, Math.max(0, x / e + 0.5));
	return t * t * (3 - 2 * t);
}

function rectCoverage(px, py, cx, cy, w, h, rot, feather) {
	const dx = px - cx;
	const dy = py - cy;
	const c = Math.cos(rot);
	const s = Math.sin(rot);
	const lx = dx * c + dy * s;
	const ly = -dx * s + dy * c;
	const ex = Math.abs(lx) - w / 2;
	const ey = Math.abs(ly) - h / 2;
	return smoothstep(feather, -Math.max(ex, ey));
}

function lerp(a, b, t) {
	return a + (b - a) * t;
}

function layerAlphaOf(layer, p) {
	let a = layer.alpha ?? 1;
	if (layer.fade) {
		const [fin, fout] = layer.fade;
		if (fin > 0) a *= Math.min(1, p / fin);
		if (fout > 0) a *= Math.min(1, (1 - p) / fout);
	}
	return a;
}

function layerRng(effect, seed, layer) {
	if (!layer.seeded) return null;
	return makeRng(`${seed}|${effect.id}|${layer.id}`);
}

function layerVariation(effect, seed, layer) {
	const rng = layerRng(effect, seed, layer);
	if (!rng) return null;
	const j = layer.jitter ?? 0;
	return {
		jx: j > 0 ? (rng.next() * 2 - 1) * j : 0,
		jy: j > 0 ? (rng.next() * 2 - 1) * j : 0,
		js: layer.spread ? 1 + (rng.next() * 2 - 1) * layer.spread : 1,
		ja: layer.alphaSpread
			? 1 + (rng.next() * 2 - 1) * layer.alphaSpread
			: 1,
	};
}

// Shared evaluated streak geometry (Astra rereview R3): travel position,
// velocity orientation, stretch length and the finite zero-velocity dot.
// Used by kind:"streak" and by velocity-declared kind:"texture" layers so
// textured sampling shares this exact evaluated rect — no second rasterizer.
function evalStreakRect(layer, p, span, jx, jy) {
	const vx = layer.vx || 0;
	const vy = layer.vy || 0;
	const speed = Math.hypot(vx, vy);
	const moving = speed > 1e-6;
	const lt = p * span;
	const cx = (layer.x0 ?? 0) + vx * lt + jx;
	const cy = (layer.y0 ?? 0) + vy * lt + jy;
	const rot = moving ? Math.atan2(vy, vx) : 0;
	const len = moving
		? (layer.length ?? 8) + speed * (layer.stretch ?? 0.15)
		: layer.dotDiameter ?? layer.width;
	const wid = moving ? layer.width : layer.dotDiameter ?? layer.width;
	return { cx, cy, len, wid, rot, speed, moving };
}

// Flame R1 periodic tongue (sprite-flame-periodic-contract.md): opt-in,
// arc-only inverse coordinate deformation evaluated ONCE per frame per
// opted-in layer (cached alongside the variations map). Layers without
// periodicTongue never enter this code or any of its arithmetic.
export function periodicTongueState(layer, timeSeconds, jx = 0, jy = 0) {
	const pt = layer.periodicTongue;
	const P = pt.periodSeconds;
	const u = ((timeSeconds % P) + P) % P;
	const theta = (2 * Math.PI * u) / P + (pt.phaseRadians ?? 0);
	const Sx = 1 + (pt.widthFraction ?? 0) * Math.cos(theta);
	const Sy = 1 + (pt.heightFraction ?? 0) * Math.sin(theta);
	const D = (pt.swayPixels ?? 0) * Math.sin(theta);
	const rot = layer.rot || 0;
	const Cx = layer.cx + jx;
	const Cy = layer.cy + jy;
	return {
		u,
		Sx,
		Sy,
		D,
		R: layer.radius,
		Bx: Cx + layer.radius * Math.cos(layer.ang0 + rot),
		By: Cy + layer.radius * Math.sin(layer.ang0 + rot),
	};
}

// Inverse map of the contract's canonical forward deformation:
//   x = Bx + Sx*(qx-Bx) + D*(By-qy)/R ;  y = By + Sy*(qy-By)
export function periodicTongueInverse(state, sx, sy) {
	const qy = state.By + (sy - state.By) / state.Sy;
	const qx =
		state.Bx +
		((sx - state.Bx) - (state.D * (state.By - qy)) / state.R) /
			state.Sx;
	return [qx, qy];
}

// Validate opt-in input ONCE at the quality-render boundary (never per
// sample). Invalid input is rejected outright — no clipping or fallback.
// Existing non-opted-in configurations get none of these rules.
export function validatePeriodicTongue(effect, layer) {
	const pt = layer.periodicTongue;
	const fail = (msg) => {
		throw new Error(`periodicTongue (${effect.id}/${layer.id}): ${msg}`);
	};
	if (effect.loop !== true) fail("requires effect.loop === true");
	if (layer.kind !== "arc") fail('supported only on kind:"arc"');
	const P = pt.periodSeconds;
	if (!Number.isFinite(P) || P <= 0)
		fail("periodSeconds must be a finite number > 0");
	if (P !== effect.duration) fail("periodSeconds must equal effect.duration");
	if (layer.t0 !== 0 || layer.t1 !== P)
		fail("layer interval must be t0 === 0 and t1 === periodSeconds");
	if (layer.fade !== undefined)
		fail("fade is not allowed on opted-in tongue layers");
	if (layer.grow !== undefined)
		fail("grow is not allowed on opted-in tongue layers");
	for (const key of ["cx", "cy", "radius", "ang0", "ang1", "thick0", "thick1"]) {
		if (!Number.isFinite(layer[key])) fail(`${key} must be a finite number`);
	}
	if (layer.rot !== undefined && !Number.isFinite(layer.rot))
		fail("rot must be a finite number");
	if (layer.feather !== undefined && !Number.isFinite(layer.feather))
		fail("feather must be a finite number");
	if (!(layer.radius > 0)) fail("radius must be positive");
	if (!(layer.thick0 > layer.thick1)) fail("requires thick0 > thick1");
	if (!(layer.thick1 > 0)) fail("requires thick1 > 0");
	for (const key of ["phaseRadians", "swayPixels", "widthFraction", "heightFraction"]) {
		if (pt[key] !== undefined && !Number.isFinite(pt[key]))
			fail(`${key} must be a finite number when present`);
	}
	if (Math.abs(pt.swayPixels ?? 0) > layer.radius / 2)
		fail("swayPixels magnitude must be <= radius/2");
	if (Math.abs(pt.widthFraction ?? 0) >= 1)
		fail("widthFraction magnitude must be < 1");
	if (Math.abs(pt.heightFraction ?? 0) >= 1)
		fail("heightFraction magnitude must be < 1");
}

function evalLayer(effect, layer, timeSeconds, sx, sy, variation, periodic) {
	const span = layer.t1 - layer.t0;
	if (span <= 0) return null;
	// Opted-in tongue: activation uses the wrapped u so the continuously
	// present body never disappears at t+P. All other layers: raw t.
	const p = layer.periodicTongue
		? (periodic.get(layer.id).u - layer.t0) / span
		: (timeSeconds - layer.t0) / span;
	if (p < 0 || p > 1) return null;
	let a = layerAlphaOf(layer, p);
	if (a <= 0) return null;
	let jx = 0;
	let jy = 0;
	let js = 1;
	let ja = 1;
	if (variation) {
		jx = variation.jx;
		jy = variation.jy;
		js = variation.js;
		ja = variation.ja;
	}
	a = Math.min(1, Math.max(0, a * ja));
	if (a <= 0) return null;
	const feather = layer.feather ?? 0.5;
	let color = layer.color || [0, 0, 0];
	const emission = layer.emission || [0, 0, 0];
	const emStrength = layer.emissionStrength ?? 0;
	let cov = 0;
	// Layer size interpolation (Astra M1 defect 5): grow scales EVERY
	// sized geometry — quad, radial annulus and puff — not just quads.
	const grow = layer.grow ? lerp(layer.grow[0], layer.grow[1], p) : 1;

	if (layer.kind === "quad") {
		cov = rectCoverage(
			sx,
			sy,
			layer.cx + jx,
			layer.cy + jy,
			layer.w * grow * js,
			layer.h * grow * js,
			layer.rot || 0,
			feather,
		);
	} else if (layer.kind === "streak") {
		const sr = evalStreakRect(layer, p, span, jx, jy);
		cov = rectCoverage(
			sx,
			sy,
			sr.cx,
			sr.cy,
			sr.len * js,
			sr.wid * js,
			sr.rot,
			feather,
		);
	} else if (layer.kind === "arc") {
		let dx;
		let dy;
		if (layer.periodicTongue) {
			// Contract: inverse-map the sample into canonical space, then
			// run the existing arc math unchanged (js still multiplies only
			// thickness; radius and anchor are never scaled by js).
			const [qx, qy] = periodicTongueInverse(
				periodic.get(layer.id),
				sx,
				sy,
			);
			dx = qx - (layer.cx + jx);
			dy = qy - (layer.cy + jy);
		} else {
			dx = sx - (layer.cx + jx);
			dy = sy - (layer.cy + jy);
		}
		const rad = Math.hypot(dx, dy);
		let ang = Math.atan2(dy, dx) - (layer.rot || 0);
		ang = Math.atan2(Math.sin(ang), Math.cos(ang));
		const a0 = layer.ang0;
		const a1 = layer.ang1;
		const lo = Math.min(a0, a1);
		const hi = Math.max(a0, a1);
		if (ang < lo - feather || ang > hi + feather) return null;
		const t = a1 === a0 ? 0 : (ang - a0) / (a1 - a0);
		const thick =
			lerp(layer.thick0, layer.thick1, Math.min(1, Math.max(0, t))) * js;
		const dr = Math.abs(rad - layer.radius);
		const ring = smoothstep(feather, -(dr - thick / 2));
		const endT = Math.min(
			smoothstep(feather, (ang - lo) * layer.radius),
			smoothstep(feather, (hi - ang) * layer.radius),
		);
		cov = ring * endT;
	} else if (layer.kind === "radial") {
		const rad = Math.hypot(sx - (layer.cx + jx), sy - (layer.cy + jy));
		const r1 = (layer.r1 ?? layer.r0) * grow * js;
		const r0 = (layer.r0 ?? 0) * grow;
		if (r1 <= r0) {
			cov = 0;
		} else if (r0 <= 0) {
			cov = smoothstep(feather, r1 - rad);
		} else {
			cov = Math.min(
				smoothstep(feather, r1 - rad),
				smoothstep(feather, rad - r0),
			);
		}
	} else if (layer.kind === "puff") {
		const dx = sx - (layer.cx + jx);
		const dy = sy - (layer.cy + jy);
		const rad = Math.hypot(dx, dy);
		const th = Math.atan2(dy, dx);
		const lobes = layer.lobes ?? 5;
		const amp = layer.amp ?? 0.25;
		const phase = layer.phase ?? 0;
		const rEff = layer.r * grow * js * (1 + amp * Math.cos(lobes * th + phase));
		cov = smoothstep(feather, rEff - rad);
	} else if (layer.kind === "texture") {
		// Bounded textured-quad sampling (Astra M1 defect 4): straight RGBA
		// texels with an explicit color space (sRGB decode by default), an
		// explicit linear scalar mask channel (alpha by default), and
		// premultiplied interpolation for the alpha mask so transparent
		// colored texels cannot darken edges. No material/plugin system.
		const tex = layer.tex;
		const tw = layer.texW | 0;
		const th = layer.texH | 0;
		const decode = layer.colorSpace === "linear" ? (v) => v : srgbToLinear;
		const maskSel = layer.maskChannel || "a";
		// Astra rereview R3: a texture layer that declares velocity shares
		// the SAME evaluated streak geometry as kind:"streak" — travel
		// position, velocity orientation, stretch length, finite
		// zero-velocity dot. Velocity-free texture layers keep their fixed
		// cx/cy/w/h/rot rect byte-for-byte.
		const hasVel = layer.vx !== undefined || layer.vy !== undefined;
		const srect = hasVel
			? evalStreakRect(layer, p, span, jx, jy)
			: {
					cx: layer.cx + jx,
					cy: layer.cy + jy,
					rot: layer.rot || 0,
					len: layer.w * grow,
					wid: layer.h * grow,
				};
		const wpx = srect.len * js;
		const hpx = srect.wid * js;
		if (tex && tw > 0 && th > 0 && wpx > 0 && hpx > 0) {
			const tdx = sx - srect.cx;
			const tdy = sy - srect.cy;
			const ct = Math.cos(srect.rot);
			const st = Math.sin(srect.rot);
			const lx = tdx * ct + tdy * st;
			const ly = -tdx * st + tdy * ct;
			const inside = rectCoverage(
				sx,
				sy,
				srect.cx,
				srect.cy,
				wpx,
				hpx,
				srect.rot,
				feather,
			);
			if (inside > 0) {
				const uc = ((lx + wpx / 2) / wpx) * tw - 0.5;
				const vc = ((ly + hpx / 2) / hpx) * th - 0.5;
				const fx = Math.min(tw - 1, Math.max(0, uc));
				const fy = Math.min(th - 1, Math.max(0, vc));
				const x0 = Math.floor(fx);
				const y0 = Math.floor(fy);
				const x1 = Math.min(x0 + 1, tw - 1);
				const y1 = Math.min(y0 + 1, th - 1);
				const tx = fx - x0;
				const ty = fy - y0;
				const corners = [
					[x0, y0, (1 - tx) * (1 - ty)],
					[x1, y0, tx * (1 - ty)],
					[x0, y1, (1 - tx) * ty],
					[x1, y1, tx * ty],
				];
				if (maskSel === "a") {
					// Linear premultiplied interpolation: transparent texels
					// contribute neither color nor coverage.
					let pm0 = 0;
					let pm1 = 0;
					let pm2 = 0;
					let pa = 0;
					for (const [gx, gy, wt] of corners) {
						if (wt <= 0) continue;
						const i = (gy * tw + gx) * 4;
						const ta = tex[i + 3] / 255;
						pm0 += decode(tex[i] / 255) * ta * wt;
						pm1 += decode(tex[i + 1] / 255) * ta * wt;
						pm2 += decode(tex[i + 2] / 255) * ta * wt;
						pa += ta * wt;
					}
					if (pa <= 0) {
						cov = 0;
					} else {
						color = [pm0 / pa, pm1 / pa, pm2 / pa];
						cov = inside * pa;
					}
				} else {
					// Explicit color-channel mask: LINEAR scalar data,
					// normalized independently of the color texture's
					// sRGB decode; texel alpha is not consulted.
					const ch = maskSel === "g" ? 1 : maskSel === "b" ? 2 : 0;
					let s0 = 0;
					let s1 = 0;
					let s2 = 0;
					let m = 0;
					for (const [gx, gy, wt] of corners) {
						if (wt <= 0) continue;
						const i = (gy * tw + gx) * 4;
						// Premultiply each corner's decoded color by THAT
						// corner's scalar mask before interpolation, so a
						// zero-mask texel's hidden RGB contributes nothing.
						const ms = (tex[i + ch] / 255) * wt;
						s0 += decode(tex[i] / 255) * ms;
						s1 += decode(tex[i + 1] / 255) * ms;
						s2 += decode(tex[i + 2] / 255) * ms;
						m += ms;
					}
					if (m <= 0) {
						cov = 0;
					} else {
						// Reconstruct straight color only where mask is present.
						color = [s0 / m, s1 / m, s2 / m];
						cov = inside * m;
					}
				}
			}
		}
	} else {
		cov = 0;
	}

	if (cov <= 0) return null;
	// Explicit material kind (Astra M1 defect 2): "emission" layers are
	// additive light only — they never manufacture normal coverage and
	// never occlude destination color. Default material is "normal".
	// Material kind is NOT inferred from black RGB.
	const isEmission = layer.material === "emission";
	return {
		rgb: isEmission
			? [0, 0, 0]
			: [color[0] * cov * a, color[1] * cov * a, color[2] * cov * a],
		a: isEmission ? 0 : cov * a,
		em: [
			emission[0] * cov * a * emStrength,
			emission[1] * cov * a * emStrength,
			emission[2] * cov * a * emStrength,
		],
	};
}

export function renderQualityFrame(
	effect,
	timeSeconds,
	seed,
	view,
	width,
	height,
	qualityOptions = {},
) {
	const ss = Math.max(
		1,
		Math.round(qualityOptions.supersample ?? QUALITY_SUPERSAMPLE),
	);
	const exposure = qualityOptions.exposure ?? QUALITY_EXPOSURE;
	// Exact declared-background branch input (contract section 3):
	// background bytes decode to LINEAR B before exposure/ACES.
	const bakedBackground = qualityOptions.bakedBackground || null;
	const bgB = bakedBackground
		? [
				srgbToLinear(bakedBackground[0] / 255),
				srgbToLinear(bakedBackground[1] / 255),
				srgbToLinear(bakedBackground[2] / 255),
		  ]
		: null;
	const wantStages = !!qualityOptions.stages;
	const zoom = view && view.zoom > 0 ? view.zoom : 1;
	const panX = view && Number.isFinite(view.panX) ? view.panX : 0;
	const panY = view && Number.isFinite(view.panY) ? view.panY : 0;

	const rgba = new Uint8ClampedArray(width * height * 4);
	const baked = bakedBackground ? new Uint8ClampedArray(width * height * 4) : null;
	// Per-pixel intermediate diagnostics for small numeric oracles
	// (Astra verdict: actual linear/coverage data + independent expected).
	const samplePixel = qualityOptions.samplePixel || null;
	const stages = wantStages
		? { emissionPeak: 0, premultPeak: 0, coveragePeak: 0, subsampleGrid: ss }
		: null;

	const variations = new Map();
	if (effect.layers) {
		for (const layer of effect.layers) {
			variations.set(layer.id, layerVariation(effect, seed, layer));
		}
	}

	// Flame R1: validate opt-in input once at this boundary and cache the
	// per-frame periodic scalars alongside the variations map — no trig in
	// the subsample loop. No-option layers skip both.
	const periodics = new Map();
	if (effect.layers) {
		for (const layer of effect.layers) {
			if (!layer.periodicTongue) continue;
			validatePeriodicTongue(effect, layer);
			const v = variations.get(layer.id);
			periodics.set(
				layer.id,
				periodicTongueState(
					layer,
					timeSeconds,
					v ? v.jx : 0,
					v ? v.jy : 0,
				),
			);
		}
	}

	const inv = 1 / (ss * ss);
	const fit = Math.min(width, height) / 64;
	const cxT = width / 2;
	const cyT = height / 2;
	for (let py = 0; py < height; py++) {
		for (let px = 0; px < width; px++) {
			let L0 = 0;
			let L1 = 0;
			let L2 = 0;
			let aSum = 0;
			let E0 = 0;
			let E1 = 0;
			let E2 = 0;
			for (let sy = 0; sy < ss; sy++) {
				for (let sx = 0; sx < ss; sx++) {
					const tx = px + (sx + 0.5) / ss;
					const ty = py + (sy + 0.5) / ss;
					const scx = (tx - cxT) / zoom + cxT + panX * width;
					const scy = (ty - cyT) / zoom + cyT + panY * height;
					const dx = (scx - cxT) / fit + 32;
					const dy = (scy - cyT) / fit + 32;
					let A = 0;
					let c0 = 0;
					let c1 = 0;
					let c2 = 0;
					let e0 = 0;
					let e1 = 0;
					let e2 = 0;
					if (effect.layers) {
						for (const layer of effect.layers) {
							const hit = evalLayer(
								effect,
								layer,
								timeSeconds,
								dx,
								dy,
								variations.get(layer.id),
								periodics,
							);
							if (!hit) continue;
							// Premultiplied source-over in RGB as well as alpha:
							// out = src + dst * (1 - srcA)  (Astra M1 defect 1).
							const keep = 1 - hit.a;
							c0 = hit.rgb[0] + c0 * keep;
							c1 = hit.rgb[1] + c1 * keep;
							c2 = hit.rgb[2] + c2 * keep;
							A = hit.a + A * keep;
							// Emission is occluded by later normal foreground
							// (contract S1): attenuate destination E by keep,
							// then add this hit's emission. Additive hits have
							// hit.a = 0, so keep = 1 for them.
							e0 = hit.em[0] + e0 * keep;
							e1 = hit.em[1] + e1 * keep;
							e2 = hit.em[2] + e2 * keep;
						}
					}
					L0 += c0;
					L1 += c1;
					L2 += c2;
					aSum += A;
					E0 += e0;
					E1 += e1;
					E2 += e2;
					if (stages) {
						if (e0 > stages.emissionPeak) stages.emissionPeak = e0;
						if (e1 > stages.emissionPeak) stages.emissionPeak = e1;
						if (e2 > stages.emissionPeak) stages.emissionPeak = e2;
						const pk = Math.max(
							(c0 + e0) * exposure,
							(c1 + e1) * exposure,
							(c2 + e2) * exposure,
						);
						if (pk > stages.premultPeak) stages.premultPeak = pk;
					}
				}
			}
			// Contract sections 1-2: independent linear area averages,
			// then ONE target transfer. M = aces(q*(Cbar+Ebar));
			// Ae = max_channel(aces(q*Ebar)); As = max(Abar, Ae);
			// sprite S(clamp(M/As)) with soft alpha As.
			const cb0 = L0 * inv;
			const cb1 = L1 * inv;
			const cb2 = L2 * inv;
			const eb0 = E0 * inv;
			const eb1 = E1 * inv;
			const eb2 = E2 * inv;
			const Abar = aSum * inv;
			const eg0 = eb0 * exposure;
			const eg1 = eb1 * exposure;
			const eg2 = eb2 * exposure;
			const Ae = Math.max(
				acesFitted(eg0),
				acesFitted(eg1),
				acesFitted(eg2),
			);
			const alpha = Math.max(Abar, Ae);
			const M0 = acesFitted((cb0 + eb0) * exposure);
			const M1 = acesFitted((cb1 + eb1) * exposure);
			const M2 = acesFitted((cb2 + eb2) * exposure);
			if (stages && alpha > stages.coveragePeak) {
				stages.coveragePeak = alpha;
			}
			const st = straighten([M0, M1, M2], alpha);
			if (stages && samplePixel && samplePixel.x === px && samplePixel.y === py) {
				stages.sampled = {
					cbar: [cb0, cb1, cb2],
					ebar: [eb0, eb1, eb2],
					abar: Abar,
					ae: Ae,
					as: alpha,
					m: [M0, M1, M2],
				};
			}
			const o = (py * width + px) * 4;
			rgba[o] = Math.round(st[0] * 255);
			rgba[o + 1] = Math.round(st[1] * 255);
			rgba[o + 2] = Math.round(st[2] * 255);
			rgba[o + 3] = Math.round(st[3] * 255);
			if (baked) {
				// Contract section 3: Lbg = Cbar + Ebar + (1-Abar)*B,
				// background joins BEFORE exposure/ACES and is tonemapped.
				const keepB = 1 - Abar;
				const l0 = cb0 + eb0 + keepB * bgB[0];
				const l1 = cb1 + eb1 + keepB * bgB[1];
				const l2 = cb2 + eb2 + keepB * bgB[2];
				baked[o] = Math.round(
					255 * linearToSrgb(acesFitted(l0 * exposure)),
				);
				baked[o + 1] = Math.round(
					255 * linearToSrgb(acesFitted(l1 * exposure)),
				);
				baked[o + 2] = Math.round(
					255 * linearToSrgb(acesFitted(l2 * exposure)),
				);
				baked[o + 3] = 255;
			}
		}
	}
	return stages || baked ? { rgba, stages, baked } : rgba;
}
