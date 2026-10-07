import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { encodeGIF } from "../src/gifenc.js";
import { alphaThreshold, medianCutPalette, quantizeFrame } from "../src/pixel.js";
import { decodePNG, encodePNG } from "../src/pngenc.js";
import { makeRng } from "../src/rng.js";
import { buildSheet } from "../src/sheet.js";
import {
	colorOverLifetimeRgba,
	pivotOffsetPx,
	sampleTimeSeconds,
	sourceLoopSeconds,
	startColorRgba,
	velocityAngleRad,
} from "../src/converted-effect.js";
import {
	QUALITY_ALPHA_THRESHOLD,
	linearToSrgb,
	renderQualityFrame,
	srgbToLinear,
} from "../src/quality-render.js";

function parseArgs(argv) {
	const out = {};
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (!a.startsWith("--")) throw new Error(`unexpected argument: ${a}`);
		const key = a.slice(2);
		const next = argv[i + 1];
		if (next === undefined || next.startsWith("--")) throw new Error(`missing value for --${key}`);
		out[key] = next;
		i++;
	}
	return out;
}

function num(v, d) {
	if (v === undefined || v === null || v === "") return d;
	const n = Number(v);
	if (!Number.isFinite(n)) throw new Error(`not a number: ${v}`);
	return n;
}

function sha256(buf) {
	return createHash("sha256").update(buf).digest("hex");
}

function range(mm) {
	if (!mm) return [0, 0];
	const min = Number(mm.min ?? 0);
	const max = Number(mm.max ?? 0);
	return mm.state === 3 ? [min, max] : [max, max];
}

function hermite(keys, u) {
	if (!keys || !keys.length) return 1;
	if (u <= keys[0].t) return keys[0].v;
	const last = keys[keys.length - 1];
	if (u >= last.t) return last.v;
	for (let i = 0; i < keys.length - 1; i++) {
		const a = keys[i];
		const b = keys[i + 1];
		if (u >= a.t && u <= b.t) {
			const h = b.t - a.t;
			if (h <= 0) return b.v;
			const s = (u - a.t) / h;
			const s2 = s * s;
			const s3 = s2 * s;
			const h00 = 2 * s3 - 3 * s2 + 1;
			const h10 = s3 - 2 * s2 + s;
			const h01 = -2 * s3 + 3 * s2;
			const h11 = s3 - s2;
			return h00 * a.v + h10 * h * (a.outSlope ?? 0) + h01 * b.v + h11 * h * (b.inSlope ?? 0);
		}
	}
	return last.v;
}

function ramp(keys, u, field, fallback) {
	if (!keys || keys.length === 0) return fallback;
	if (u <= keys[0].t) return keys[0][field];
	const last = keys[keys.length - 1];
	if (u >= last.t) return last[field];
	for (let i = 0; i < keys.length - 1; i++) {
		const a = keys[i];
		const b = keys[i + 1];
		if (u >= a.t && u <= b.t) {
			const s = b.t === a.t ? 0 : (u - a.t) / (b.t - a.t);
			return a[field] + (b[field] - a[field]) * s;
		}
	}
	return last[field];
}

function hash2(ix, iy, seed) {
	let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(seed, 1274126177);
	h = Math.imul(h ^ (h >>> 13), 1274126177);
	return (((h ^ (h >>> 16)) >>> 0) / 4294967295) * 2 - 1;
}

function valueNoise(x, y, seed) {
	const x0 = Math.floor(x);
	const y0 = Math.floor(y);
	const fx = x - x0;
	const fy = y - y0;
	const sx = fx * fx * (3 - 2 * fx);
	const sy = fy * fy * (3 - 2 * fy);
	const a = hash2(x0, y0, seed);
	const b = hash2(x0 + 1, y0, seed);
	const c = hash2(x0, y0 + 1, seed);
	const d = hash2(x0 + 1, y0 + 1, seed);
	const ab = a + (b - a) * sx;
	const cd = c + (d - c) * sx;
	return ab + (cd - ab) * sy;
}

function quatRotate(q, v) {
	const [x, y, z] = v;
	const [qx, qy, qz, qw] = q;
	const ix = qw * x + qy * z - qz * y;
	const iy = qw * y + qz * x - qx * z;
	const iz = qw * z + qx * y - qy * x;
	const iw = -qx * x - qy * y - qz * z;
	return [
		ix * qw + iw * -qx + iy * -qz - iz * -qy,
		iy * qw + iw * -qy + iz * -qx - ix * -qz,
		iz * qw + iw * -qz + ix * -qy - iy * -qx,
	];
}

function sampleShape(shape, rng) {
	const type = Number(shape.type);
	const radius = Number(shape.radius ?? 0);
	if (type === 0 || type === 1) {
		// Sphere (volume) and SphereShell (surface): sampled procedurally from
		// shape.radius, emitted radially outward from the emitter center.
		// Approximation of Unity's Sphere emitter - see LIMITS.
		const r = type === 1 ? radius : radius * Math.cbrt(rng());
		const cz = 1 - 2 * rng();
		const st = Math.sqrt(Math.max(0, 1 - cz * cz));
		const phi = rng() * Math.PI * 2;
		const pos = [r * st * Math.cos(phi), r * st * Math.sin(phi), r * cz];
		const len = Math.hypot(pos[0], pos[1], pos[2]);
		const dir = len > 1e-9 ? [pos[0] / len, pos[1] / len, pos[2] / len] : [0, 0, 1];
		return { pos, dir };
	}
	if (type !== 4) {
		throw new Error(
			`shape type ${type} (${shape.typeMeaning}) is not implemented; this build converts the Cone, Sphere, and SphereShell shapes used by the Kenney sample prefabs`,
		);
	}
	const r = radius * Math.sqrt(rng());
	const a = rng() * Math.PI * 2;
	const half = (Number(shape.angle ?? 0) * Math.PI) / 180;
	const cosT = 1 - rng() * (1 - Math.cos(half));
	const sinT = Math.sqrt(Math.max(0, 1 - cosT * cosT));
	const phi = rng() * Math.PI * 2;
	return {
		pos: [r * Math.cos(a), r * Math.sin(a), 0],
		dir: [sinT * Math.cos(phi), sinT * Math.sin(phi), cosT],
	};
}

function buildParticles(cfg, rng) {
	const [lifeMin, lifeMax] = range(cfg.initial.startLifetime);
	const [speedMin, speedMax] = range(cfg.initial.startSpeed);
	const [sizeMin, sizeMax] = range(cfg.initial.startSize);
	const [rotMin, rotMax] = range(cfg.initial.startRotation);
	const rot = cfg.quat;
	const particles = [];
	for (let i = 0; i < cfg.count; i++) {
		const phase = ((((i + (rng() - 0.5)) / cfg.rate) / cfg.simulationSpeed) % cfg.cycle + cfg.cycle) % cfg.cycle;
		const life = Math.min(
			lifeMin + rng() * (lifeMax - lifeMin),
			cfg.lifeCap,
		);
		const speed = speedMin + rng() * (speedMax - speedMin);
		const size = sizeMin + rng() * (sizeMax - sizeMin);
		const rrot = rotMin + rng() * (rotMax - rotMin);
		const mix = rng();
		const c0 = cfg.initial.startColor.min;
		const c1 = cfg.initial.startColor.max;
		const color = cfg.q1
			? startColorRgba(c0, c1, mix)
			: [
					Number(c0.r) + (Number(c1.r) - Number(c0.r)) * mix,
					Number(c0.g) + (Number(c1.g) - Number(c0.g)) * mix,
					Number(c0.b) + (Number(c1.b) - Number(c0.b)) * mix,
				];
		const shape = sampleShape(cfg.shape, rng);
		const p = quatRotate(rot, shape.pos);
		const v = quatRotate(rot, shape.dir.map((d) => d * speed));
		particles.push({
			phase,
			life,
			size,
			rot: rrot,
			color,
			gravity: cfg.gravity * cfg.simulationSpeed * cfg.simulationSpeed,
			// Prefab root translation is sample-scene placement; framing is the
			// per-example origin view parameter, so particles emit at world origin.
			pos: [p[0], p[1], p[2]],
			vel: v,
		});
	}
	return particles;
}

function trajectory(p, cfg, dt) {
	const steps = Math.ceil(p.life / dt) + 1;
	const xs = new Float32Array(steps);
	const ys = new Float32Array(steps);
	const zs = new Float32Array(steps);
	let px = p.pos[0];
	let py = p.pos[1];
	let pz = p.pos[2];
	let vx = p.vel[0];
	let vy = p.vel[1];
	let vz = p.vel[2];
	xs[0] = px;
	ys[0] = py;
	zs[0] = pz;
	const noise = cfg.noise;
	for (let s = 1; s < steps; s++) {
		const age = s * dt;
		const damp = noise.enabled ? 1 - Math.min(1, age / p.life) : 0;
		if (damp > 0) {
			const nx = valueNoise(px * noise.frequency, py * noise.frequency, cfg.noiseSeed);
			const ny = valueNoise(
				px * noise.frequency + 37.13,
				py * noise.frequency + 11.71,
				cfg.noiseSeed + 1,
			);
			vx += noise.strength * nx * damp * dt;
			vy += noise.strength * ny * damp * dt;
		}
		vy -= p.gravity * dt;
		px += vx * dt;
		py += vy * dt;
		pz += vz * dt;
		xs[s] = px;
		ys[s] = py;
		zs[s] = pz;
	}
	return { xs, ys, zs, dt };
}

function sampleTrajectory(tr, age) {
	const f = Math.min(Math.max(age / tr.dt, 0), tr.xs.length - 1);
	const i0 = Math.floor(f);
	const i1 = Math.min(i0 + 1, tr.xs.length - 1);
	const s = f - i0;
	return [
		tr.xs[i0] + (tr.xs[i1] - tr.xs[i0]) * s,
		tr.ys[i0] + (tr.ys[i1] - tr.ys[i0]) * s,
		tr.zs[i0] + (tr.zs[i1] - tr.zs[i0]) * s,
	];
}

function drawSprite(dst, W, H, tex, tw, th, cx, cy, sizePx, angle, cr, cg, cb, alpha) {
	const half = sizePx / 2;
	const cosT = Math.cos(angle);
	const sinT = Math.sin(angle);
	const rad = Math.ceil(half * 1.5) + 1;
	const x0 = Math.max(0, Math.floor(cx - rad));
	const x1 = Math.min(W - 1, Math.ceil(cx + rad));
	const y0 = Math.max(0, Math.floor(cy - rad));
	const y1 = Math.min(H - 1, Math.ceil(cy + rad));
	for (let y = y0; y <= y1; y++) {
		for (let x = x0; x <= x1; x++) {
			const dx = x + 0.5 - cx;
			const dy = y + 0.5 - cy;
			const lx = dx * cosT - dy * sinT;
			const ly = -dx * sinT - dy * cosT;
			const u = 0.5 + lx / sizePx;
			const v = 0.5 - ly / sizePx;
			if (u < 0 || u > 1 || v < 0 || v > 1) continue;
			const fx = Math.min(tw - 1, Math.max(0, u * tw - 0.5));
			const fy = Math.min(th - 1, Math.max(0, v * th - 0.5));
			const ax0 = Math.floor(fx);
			const ay0 = Math.floor(fy);
			const ax1 = Math.min(tw - 1, ax0 + 1);
			const ay1 = Math.min(th - 1, ay0 + 1);
			const sx = fx - ax0;
			const sy = fy - ay0;
			const i00 = (ay0 * tw + ax0) * 4;
			const i10 = (ay0 * tw + ax1) * 4;
			const i01 = (ay1 * tw + ax0) * 4;
			const i11 = (ay1 * tw + ax1) * 4;
			const a00 = tex[i00 + 3] / 255;
			const a10 = tex[i10 + 3] / 255;
			const a01 = tex[i01 + 3] / 255;
			const a11 = tex[i11 + 3] / 255;
			const ta = (a00 * (1 - sx) + a10 * sx) * (1 - sy) + (a01 * (1 - sx) + a11 * sx) * sy;
			const srcA = ta * alpha;
			if (srcA <= 0.0015) continue;
			const sri = (tex[i00] * (1 - sx) + tex[i10] * sx) * (1 - sy) + (tex[i01] * (1 - sx) + tex[i11] * sx) * sy;
			const sgi = (tex[i00 + 1] * (1 - sx) + tex[i10 + 1] * sx) * (1 - sy) + (tex[i01 + 1] * (1 - sx) + tex[i11 + 1] * sx) * sy;
			const sbi = (tex[i00 + 2] * (1 - sx) + tex[i10 + 2] * sx) * (1 - sy) + (tex[i01 + 2] * (1 - sx) + tex[i11 + 2] * sx) * sy;
			const sr = (sri / 255) * cr;
			const sg = (sgi / 255) * cg;
			const sb = (sbi / 255) * cb;
			const di = (y * W + x) * 4;
			const da = dst[di + 3] / 255;
			const lum = (0.299 * sri + 0.587 * sgi + 0.114 * sbi) / 255;
			const cover = lum * srcA;
			const outA = cover + da * (1 - cover);
			if (outA <= 0) continue;
			dst[di] = Math.min(255, dst[di] + Math.round(sr * srcA * 255));
			dst[di + 1] = Math.min(255, dst[di + 1] + Math.round(sg * srcA * 255));
			dst[di + 2] = Math.min(255, dst[di + 2] + Math.round(sb * srcA * 255));
			dst[di + 3] = Math.round(outA * 255);
		}
	}
}

// Candidate GIF delays from rounded cumulative centisecond frame boundaries.
// The encoder floor is 2cs (src/gifenc.js writes Math.max(2, round(dc)) on
// both the scalar and delay-list paths), so any schedule entry below 2cs
// would NOT be the encoded schedule: those fps are rejected instead of
// reporting a loopMs the encoder silently enlarges. Legacy (non-quality-v1)
// encoding is untouched.
function gifDelaySchedule(fps, frameCount) {
	const out = [];
	let prev = 0;
	for (let i = 0; i < frameCount; i++) {
		const boundary = Math.round(((i + 1) * 100) / fps);
		out.push(boundary - prev);
		prev = boundary;
	}
	const bad = out.findIndex((d) => d < 2);
	if (bad !== -1) {
		throw new Error(
			`gif delay schedule: fps=${fps} frame=${bad} delay=${out[bad]}cs; delays below the encoder 2cs floor (Math.max(2,round(dc)) in src/gifenc.js) are unsupported at this candidate fps`,
		);
	}
	return out;
}

// ---- quality-v1 adapter: converted particle state -> accepted M1 raster ----
// Legacy drawSprite above stays the reproduction path; quality-v1 frames are
// rendered by src/quality-render.js (4x supersample, linear-float source-over,
// texture-mask semantics, M1 policy-before-palette ordering in main()).

function q1ShapeMask(tex) {
	// Shipped Kenney textures are fully opaque with the shape carried in RGB on
	// black; the M1 texture layer takes a LINEAR scalar mask, so bake one from
	// linear luminance once per texture.
	const n = tex.width * tex.height;
	const mask = new Uint8ClampedArray(n);
	for (let k = 0, j = 0; k < n; k++, j += 4) {
		const l =
			0.299 * srgbToLinear(tex.rgba[j] / 255) +
			0.587 * srgbToLinear(tex.rgba[j + 1] / 255) +
			0.114 * srgbToLinear(tex.rgba[j + 2] / 255);
		mask[k] = Math.round(Math.min(1, l) * 255);
	}
	return mask;
}

function q1Frame(states, tex, mask, W, H) {
	const fit = Math.min(W, H) / 64;
	const tw = tex.width;
	const th = tex.height;
	const layers = states.map((s, i) => {
		// Tint is baked linearly into the tile (M1 texture layers carry no
		// per-layer tint); masked texels stay zero so no transcoding is spent.
		const baked = new Uint8ClampedArray(tw * th * 4);
		for (let k = 0, j = 0; k < tw * th; k++, j += 4) {
			if (mask[k] === 0) continue;
			baked[j] = Math.round(
				255 * linearToSrgb(srgbToLinear(tex.rgba[j] / 255) * s.cr),
			);
			baked[j + 1] = Math.round(
				255 * linearToSrgb(srgbToLinear(tex.rgba[j + 1] / 255) * s.cg),
			);
			baked[j + 2] = Math.round(
				255 * linearToSrgb(srgbToLinear(tex.rgba[j + 2] / 255) * s.cb),
			);
			baked[j + 3] = mask[k];
		}
		return {
			id: `p${i}`,
			kind: "texture",
			t0: 0,
			t1: 1,
			cx: (s.cx - W / 2) / fit + 32,
			cy: (s.cy - H / 2) / fit + 32,
			w: s.sizePx / fit,
			h: s.sizePx / fit,
			rot: -s.angle,
			tex: baked,
			texW: tw,
			texH: th,
			maskChannel: "a",
			alpha: s.alpha,
		};
	});
	return renderQualityFrame(
		{ id: "quality-v1-frame", kind: "quality", duration: 1, layers },
		0,
		"quality-v1",
		undefined,
		W,
		H,
	);
}

// The per-particle conversion step shared by the batch CLI and the R2
// production fixtures: one time -> drawable sprite states (culling applied).
function particleStatesAt(cfg, particles, trajectories, t, o) {
	const states = [];
	for (let i = 0; i < particles.length; i++) {
		const p = particles[i];
		const cycle = o.cycle;
		const u0 = (t - p.phase) % cycle;
		let age = u0 < 0 ? u0 + cycle : u0;
		// quality-v1 runs the simulation clock tau = t*simulationSpeed:
		// lifetime, trajectory sampling and u all advance in tau; legacy
		// (q1 false) keeps the source-time behavior unchanged.
		if (o.q1) age *= o.simSpeed;
		if (age >= p.life) continue;
		const u = age / p.life;
		let alpha = ramp(o.alphaKeys, u, "a", 1);
		let cr = p.color[0];
		let cg = p.color[1];
		let cb = p.color[2];
		let angle = p.rot;
		if (o.q1) {
			const life = colorOverLifetimeRgba(
				cfg.colorOverLifetime,
				u,
				[p.color[0], p.color[1], p.color[2], p.color[3] ?? 1],
			);
			cr = life[0];
			cg = life[1];
			cb = life[2];
			alpha = life[3];
			if (Number(cfg.renderer.renderMode) === 1) {
				const lo = Math.max(0, age - 0.01);
				const hi = Math.min(p.life, age + 0.01);
				const v0 = sampleTrajectory(trajectories[i], lo);
				const v1 = sampleTrajectory(trajectories[i], hi);
				const dt = Math.max(1e-9, hi - lo);
				angle = velocityAngleRad([(v1[0] - v0[0]) / dt, (v1[1] - v0[1]) / dt]);
			}
		}
		if (alpha <= 0.004) continue;
		const sizeW = p.size * hermite(o.sizeKeys, u);
		if (sizeW <= 0) continue;
		const world = sampleTrajectory(trajectories[i], age);
		const cx = o.originX + world[0] * o.scale;
		const cy = o.originY - world[1] * o.scale;
		const sizePx = Math.min(sizeW * o.scale, o.maxParticleSize * o.W);
		if (cx < -sizePx || cx > o.W + sizePx || cy < -sizePx || cy > o.H + sizePx) continue;
		const pivotOff = o.q1
			? pivotOffsetPx(cfg.renderer.pivot, angle, sizePx)
			: [0, 0];
		states.push({
			cx: cx + pivotOff[0],
			cy: cy + pivotOff[1],
			sizePx,
			angle,
			cr,
			cg,
			cb,
			alpha,
		});
	}
	return states;
}

function nearestInPalette(palette, r, g, b) {
	let best = 0;
	let bestD = Infinity;
	for (let i = 0; i < palette.length; i += 3) {
		const dr = palette[i] - r;
		const dg = palette[i + 1] - g;
		const db = palette[i + 2] - b;
		const d = dr * dr + dg * dg + db * db;
		if (d < bestD) {
			bestD = d;
			best = i / 3;
		}
	}
	return best;
}

// quality-v1 replaces the legacy additive/exact-loop claims with the M1
// contract and honest excerpt declarations; legacy LIMITS stay byte-exact.
function q1LimitText(line) {
	if (line.startsWith("renderer renderMode=1")) {
		return "quality-v1: mode 1 sprites are ORIENTED along simulated velocity only; m_VelocityScale/m_LengthScale absent from records (raw unverified); no stretch or Unity parity claimed";
	}
	if (line.startsWith("loop is made exact")) {
		return "quality-v1: output is a non-seamless excerpt of the source period (see conversion.sampleWindowMs/loopDeclaration); simulation time is f/fps and independent of GIF delay rounding";
	}
	if (line.startsWith("builtin particle shader")) {
		return "quality-v1: rendered by the accepted M1 quality-render contract — normal source-over in linear float, 4x supersample, linear-luminance texture mask, tint baked linearly, alpha policy before the sequence palette; export approximation, not Unity parity";
	}
	return line;
}

const LIMITS = [
	"no Unity Editor on this machine, so the prefab is drawn by scripts/render-unity-asset.mjs instead of the Unity particle renderer; output is an approximation, NOT pixel parity with Unity",
	"shape emitters are re-sampled procedurally (Cone, Sphere, SphereShell); Unity's exact shape randomisation is not reproduced, and the Sphere/SphereShell direction here is radial-outward",
	"renderer renderMode=1 (stretched billboard, used by the Sparks and Electricity sample prefabs) is drawn as a plain billboard: particles are not stretched or oriented along velocity",
	"builtin particle shader (unity_builtin_extra object 200) cannot be named without the editor, but the material's _TintColor (0.5,0.5,0.5,0.5)/_InvFade and the shipped texture (fully opaque, black background, shape carried in RGB) only render correctly with the legacy additive particle blend, so sprites are composited additively: RGB accumulates (texRGB * startColor * lifetime alpha, clamped) and the export alpha is the luminance-weighted coverage that additive blending on a transparent target does not provide by itself",
	"NoiseModule is approximated with a local value-noise field; Unity's exact noise is not reproducible outside the engine",
	"loop is made exact by emitting one full cycle of particles periodically, while Unity emits stochastically (autoRandomSeed=true)",
	"orthographic front view, pixel scale and emitter origin are view parameters chosen for a 128px cell; the prefab ships no camera",
	"renderer sortMode=None, so particles are drawn in spawn order with no depth sort",
];

// Shared preparation/frame entry used by the CLI and tests. Particle set,
// phase/lifetime/color construction and state options come from record fields
// only — no GIF delay or export length enters here.
function prepareParticles(cfg, cycle, q1, view) {
	const rate = Number(cfg.emission.rateOverTime.max);
	const simSpeed = Number(cfg.system.simulationSpeed);
	const gravity = Number((cfg.initial.gravityModifier && cfg.initial.gravityModifier.max) || 0);
	if (q1 && gravity !== 0 && simSpeed !== 1) {
		throw new Error(
			`quality-v1: gravityModifier=${gravity} with simulationSpeed=${simSpeed}; gravity/speed scaling for this combination is unverified and rejected instead of claiming fidelity`,
		);
	}
	const count = Math.max(1, Math.round(rate * cycle * simSpeed));
	const rng = makeRng(`${cfg.system.randomSeed}`).next;
	const quat = [
		Number(cfg.transform.rotation.x),
		Number(cfg.transform.rotation.y),
		Number(cfg.transform.rotation.z),
		Number(cfg.transform.rotation.w),
	];
	const particleCfg = {
		initial: cfg.initial,
		shape: cfg.shape,
		transform: cfg.transform,
		quat,
		count,
		cycle,
		rate,
		simulationSpeed: simSpeed,
		lifeCap: cycle,
		q1,
		gravity,
		noise: {
			enabled: Boolean(cfg.noise.enabled),
			strength: Number(cfg.noise.strength || 0),
			frequency: Number(cfg.noise.frequency || 1),
		},
		noiseSeed: Number(cfg.system.randomSeed) >>> 0,
	};
	const particles = buildParticles(particleCfg, rng);
	const trajectories = particles.map((p) => trajectory(p, particleCfg, 0.01));
	const sizeKeys = q1 && cfg.sizeOverLifetime.enabled !== true ? [] : cfg.sizeOverLifetime.curve;
	const stateOpts = {
		q1,
		cycle,
		simSpeed,
		originX: view.originX,
		originY: view.originY,
		scale: view.scale,
		W: view.W,
		H: view.H,
		sizeKeys,
		alphaKeys: cfg.colorOverLifetime.alphaKeys,
		maxParticleSize: Number(cfg.renderer.maxParticleSize ?? 1),
	};
	return { particles, trajectories, stateOpts, count, rate, simSpeed, cycle, gravity };
}

// Frame entry: simulation time is frameIndex/fps (sample clock), so frame
// dispatch never reads the GIF delay schedule or export length.
function frameStates(prep, cfg, frameIndex, fps) {
	return particleStatesAt(cfg, prep.particles, prep.trajectories, sampleTimeSeconds(frameIndex, fps), prep.stateOpts);
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	const extractPath = resolve(args.extract);
	const texturePath = resolve(args.texture);
	const outDir = resolve(args["out-dir"]);
	const W = num(args.width, 128);
	const H = num(args.height, 128);
	const frameCount = num(args.frames, 25);
	const fps = num(args.fps, 12);
	const paletteSize = num(args.palette, 16);
	const alphaT = num(args["alpha-threshold"], 0.28);
	const scale = num(args.scale, 10);
	const originX = num(args["origin-x"], W / 2);
	const originY = num(args["origin-y"], H - 8);
	const dither = args.dither || "bayer4";

	const cfg = JSON.parse(readFileSync(extractPath, "utf8"));
	const sourceStartSize = cfg.initial.startSize;
	let startSizeOverride = null;
	if (args["start-size"]) {
		startSizeOverride = JSON.parse(args["start-size"]);
		cfg.initial.startSize = {
			state: Number(startSizeOverride.state),
			min: Number(startSizeOverride.min),
			max: Number(startSizeOverride.max),
		};
	}
	const rootTranslationIgnored = [
		Number(cfg.transform.position.x),
		Number(cfg.transform.position.y),
		Number(cfg.transform.position.z),
	];
	const name = args.name || `${String(cfg.gameObject).toLowerCase()}_seed-${cfg.system.randomSeed}`;
	const texFile = readFileSync(texturePath);
	const tex = decodePNG(texFile);
	const texHash = sha256(tex.rgba);
	if (cfg.texture.sha256Rgba && texHash !== cfg.texture.sha256Rgba) {
		throw new Error(`texture RGBA mismatch: ${texHash} != ${cfg.texture.sha256Rgba}`);
	}

	const delayCs = Math.max(2, Math.round(100 / fps));
	const profile = args.profile ?? "";
	if (profile !== "" && profile !== "quality-v1") {
		throw new Error(`unknown --profile "${profile}"; supported: quality-v1`);
	}
	const q1 = profile === "quality-v1";
	const q1warnings = [];
	const exportCycle = (frameCount * delayCs) / 100;
	const cycle = q1 ? sourceLoopSeconds(cfg.system) : exportCycle;
	// Candidate GIF timing: simulation time is f/fps and never derived from
	// delays; per-frame delays are differences of rounded cumulative
	// centisecond boundaries, so the encoded total equals
	// round(frameCount*100/fps) at any representable fps.
	const q1DelayList = q1 ? gifDelaySchedule(fps, frameCount) : null;
	if (q1) {
		if (cfg.emission?.enabled !== true) {
			throw new Error(
				`quality-v1: emission.enabled=${cfg.emission?.enabled}; disabled-emission source records are unsupported and rejected instead of claiming fidelity`,
			);
		}
		if (Number(cfg.renderer.renderMode) === 1) {
			q1warnings.push(
				"renderer.renderMode=1: m_VelocityScale/m_LengthScale are absent from the shipped normalized record (raw asset value not verified); sprites are ORIENTED along simulated velocity, no stretch length or Unity parity claimed",
			);
		}
		if (cfg.rotationOverLifetime?.enabled) {
			q1warnings.push(
				`rotationOverLifetime.enabled=true not simulated in quality-v1; record angularVelocityX=${JSON.stringify(cfg.rotationOverLifetime.angularVelocityX)} angularVelocityY=${JSON.stringify(cfg.rotationOverLifetime.angularVelocityY)}`,
			);
		}
		if (cfg.sizeOverLifetime?.enabled !== true && (cfg.sizeOverLifetime?.curve?.length ?? 0) > 0) {
			q1warnings.push("sizeOverLifetime.enabled=false: record curve keys are NOT applied (legacy profile applied them unconditionally)");
		}
		for (const w of q1warnings) console.error(`WARN quality-v1: ${w}`);
	}
	const prep = prepareParticles(cfg, cycle, q1, { originX, originY, scale, W, H });
	const { particles, trajectories, stateOpts, count, simSpeed } = prep;
	const q1Mask = q1 ? q1ShapeMask(tex) : null;
	const frames = [];
	let aliveMin = Infinity;
	let aliveMax = 0;
	for (let f = 0; f < frameCount; f++) {
		const states = q1
			? frameStates(prep, cfg, f, fps)
			: particleStatesAt(cfg, particles, trajectories, (f * delayCs) / 100, stateOpts);
		const alive = states.length;
		let dst;
		if (q1) {
			dst = q1Frame(states, tex, q1Mask, W, H);
		} else {
			dst = new Uint8Array(W * H * 4);
			for (const s of states) {
				drawSprite(dst, W, H, tex.rgba, tex.width, tex.height, s.cx, s.cy, s.sizePx, s.angle, s.cr, s.cg, s.cb, s.alpha);
			}
		}
		aliveMin = Math.min(aliveMin, alive);
		aliveMax = Math.max(aliveMax, alive);
		frames.push(dst);
	}

	// M1 contract: alpha policy runs BEFORE palette creation for quality-v1;
	// the legacy reproduction order below is intentionally untouched.
	if (q1) for (const f of frames) alphaThreshold(f, QUALITY_ALPHA_THRESHOLD);
	const seqPalette = medianCutPalette(frames, paletteSize);
	const actualColors = seqPalette.length / 3;
	const gifColors = Math.min(255, actualColors);
	const paddedEntries = 1 << Math.ceil(Math.log2(gifColors + 1));
	const gifPalette = new Uint8Array(paddedEntries * 3);
	gifPalette.set(seqPalette.subarray(0, gifColors * 3));
	const transIdx = paddedEntries - 1;
	const pmap = new Map();
	for (let i = 0; i < gifColors; i++) {
		pmap.set((seqPalette[i * 3] << 16) | (seqPalette[i * 3 + 1] << 8) | seqPalette[i * 3 + 2], i);
	}
	const indices = [];
	for (const f of frames) {
		if (!q1) alphaThreshold(f, alphaT);
		quantizeFrame(f, seqPalette, dither, W);
		const idxBuf = new Uint8Array(W * H);
		for (let i = 0, j = 0; i < f.length; i += 4, j++) {
			if (f[i + 3] === 0) {
				idxBuf[j] = transIdx;
			} else {
				const key = (f[i] << 16) | (f[i + 1] << 8) | f[i + 2];
				idxBuf[j] = pmap.has(key)
					? pmap.get(key)
					: nearestInPalette(seqPalette, f[i], f[i + 1], f[i + 2]);
			}
		}
		indices.push(idxBuf);
	}
	const outFrames = frames;

	mkdirSync(outDir, { recursive: true });
	const sheet = buildSheet(outFrames, W, H);
	const pngPath = resolve(outDir, `${name}_sheet.png`);
	const gifPath = resolve(outDir, `${name}_preview.gif`);
	const pngBytes = encodePNG(sheet.rgba, sheet.width, sheet.height);
	const gifBytes = encodeGIF({
		width: W,
		height: H,
		frames: indices,
		palette: gifPalette,
		transparentIndex: transIdx,
		delayCs,
		delayCsList: q1 ? q1DelayList : undefined,
		loop: 0,
	});
	writeFileSync(pngPath, pngBytes);
	writeFileSync(gifPath, gifBytes);

	const report = {
		name,
		source: cfg.source,
		prefab: {
			path: cfg.source.prefab,
			gameObject: cfg.gameObject,
			seed: cfg.system.randomSeed,
			shape: cfg.shape,
			initial: cfg.initial,
			emission: cfg.emission,
		},
		texture: {
			original: cfg.texture.path,
			originalSha256: cfg.texture.sha256,
			convertedPath: cfg.texture.convertedPath,
			sha256Rgba: texHash,
			verifiedAgainstExtractor: true,
			dimensions: [tex.width, tex.height],
		},
		conversion: {
			renderer: "scripts/render-unity-asset.mjs",
			width: W,
			height: H,
			frames: frameCount,
			fps,
			delayCs,
			loopMs: q1 ? q1DelayList.reduce((a, b) => a + b, 0) * 10 : cycle * 1000,
			...(q1
				? {
					sourcePeriodMs: cycle * 1000,
					sampleWindowMs: [0, ((frameCount - 1) / fps) * 1000],
					sampling: "simulation time t=f/fps; independent of GIF delay rounding",
					loopDeclaration: "non-seamless excerpt: frameCount samples of the source period; encoded loop is the delay-schedule total, not the source period",
					encodedDelaySchedule: `boundary-rounded ${fps}fps schedule: delays[i]=round((i+1)*100/fps)-round(i*100/fps); total ${q1DelayList.reduce((a, b) => a + b, 0)}cs`,
					sourcePeriodSimulationSec: cycle,
					sourcePeriodWallSec: cycle / simSpeed,
					manufacturedWallRepeatSec: cycle,
					durationUnits: `source period ${cycle}s is simulation time; at simulationSpeed ${simSpeed} it spans ${cycle / simSpeed}s wall; this excerpt repeats the manufactured emit window of ${cycle}s wall and is not a native Unity wall-clock cycle`,
				}
				: {}),
			particlesPerLoop: count,
			alivePerFrame: [aliveMin, aliveMax],
			pxPerUnit: scale,
			emitterOriginPx: [originX, originY],
			paletteSize,
			dither,
			alphaThreshold: q1 ? QUALITY_ALPHA_THRESHOLD : alphaT,
			compositing: q1
				? "quality-v1: accepted M1 quality-render normal source-over in linear float (4x supersample); texture mask = linear luminance baked from the opaque RGB shape, tint baked linearly; alpha policy before the sequence palette; export approximation, not Unity parity"
				: "additive (SrcAlpha One) with luminance-weighted coverage alpha",
			seed: `${cfg.system.randomSeed}`,
		},
		outputs: {
			sheet: { path: pngPath, sha256: sha256(pngBytes), bytes: pngBytes.length, size: [sheet.width, sheet.height] },
			gif: { path: gifPath, sha256: sha256(gifBytes), bytes: gifBytes.length, size: [W, H] },
		},
		presentation: {
			rootTranslationIgnored,
			startSizeOverride: startSizeOverride
				? { source: sourceStartSize, applied: cfg.initial.startSize }
				: null,
		},
			limitations: (q1 ? LIMITS.map(q1LimitText) : LIMITS).concat([
			"prefab root translation is treated as sample-scene placement and ignored; the per-example origin view parameter carries framing",
		]).concat(
			startSizeOverride
				? [
					`startSize presentation override applied for gallery legibility; source serialized ${JSON.stringify(sourceStartSize)}`,
				]
				: [],
		),
	};
	const reportPath = resolve(outDir, `${name}_render.json`);
	if (q1) {
		report.qualityV1 = {
			profile: "quality-v1",
			provenance: {
				loopCycleSeconds: { path: "system.lengthInSec", value: cycle, legacyExportCycleSeconds: exportCycle },
				sampleTimeSeconds: { formula: "frameIndex / fps", gifDelayCsUsedForEncodingOnly: delayCs },
				lifeCapSeconds: { path: "system.lengthInSec", value: cycle },
				startColor: { path: "initial.startColor.min/max", min: cfg.initial.startColor.min, max: cfg.initial.startColor.max },
				colorOverLifetime: {
					path: "colorOverLifetime",
					enabled: cfg.colorOverLifetime.enabled,
					mode: cfg.colorOverLifetime.mode ?? 0,
					colorKeys: cfg.colorOverLifetime.colorKeys?.length ?? 0,
					alphaKeys: cfg.colorOverLifetime.alphaKeys?.length ?? 0,
				},
				flags: {
					emission: cfg.emission.enabled,
					sizeOverLifetime: cfg.sizeOverLifetime.enabled,
					rotationOverLifetime: cfg.rotationOverLifetime.enabled,
					noise: cfg.noise.enabled,
					disabledModules: cfg.disabledModules,
				},
				pivot: { path: "renderer.pivot", value: cfg.renderer.pivot },
				velocity: {
					path: "renderer.renderMode",
					value: cfg.renderer.renderMode,
					stretchScalar: "absent from shipped normalized record; raw asset value not verified — orientation only",
				},
			},
			warnings: q1warnings,
		};
	}
	writeFileSync(reportPath, JSON.stringify(report, null, 1) + "\n");
	console.log(
		JSON.stringify(
			{
				name,
				png: pngPath,
				gif: gifPath,
				report: reportPath,
				frames: frameCount,
				delayCs,
				cycleMs: cycle * 1000,
				particles: count,
				alive: [aliveMin, aliveMax],
				colors: actualColors,
				textureVerified: true,
			},
			null,
			1,
		),
	);
}

export {
	buildParticles,
	trajectory,
	sampleTrajectory,
	particleStatesAt,
	q1ShapeMask,
	q1Frame,
	gifDelaySchedule,
	prepareParticles,
	frameStates,
};
if (import.meta.main) main();
