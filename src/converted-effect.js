// Quality-v1 converted-source helpers (plan M2: one pure helper module).
//
// Every input is either a RAW SERIALIZED record field (examples/*.json,
// examples/prefabs/*.json) or an explicitly declared value. No exported
// GIF/PNG-derived quantity enters any function here, so simulation timing
// stays independent of GIF delay rounding.

function finite(name, v) {
	const n = Number(v);
	if (!Number.isFinite(n)) throw new Error(`${name}: expected a finite number, got ${v}`);
	return n;
}

// Source loop duration from system.lengthInSec (record path: system.lengthInSec).
export function sourceLoopSeconds(system) {
	const s = finite("system.lengthInSec", system?.lengthInSec);
	if (s <= 0) throw new Error(`system.lengthInSec must be > 0, got ${s}`);
	return s;
}

// Exact sample time for a frame index — deliberately NOT the legacy
// f * round(100/fps) / 100 GIF-delay form.
export function sampleTimeSeconds(frameIndex, fps) {
	const f = finite("frameIndex", frameIndex);
	const r = finite("fps", fps);
	if (f < 0) throw new Error(`frameIndex must be >= 0, got ${f}`);
	if (r <= 0) throw new Error(`fps must be > 0, got ${r}`);
	return f / r;
}

// startColor min->max linear mix over ALL FOUR components including alpha
// (record path: initial.startColor.min/max.{r,g,b,a}).
export function startColorRgba(min, max, mix) {
	const m = finite("mix", mix);
	const l = (a, b) => finite("component", a) + (finite("component", b) - finite("component", a)) * m;
	return [l(min.r, max.r), l(min.g, max.g), l(min.b, max.b), l(min.a, max.a)];
}

function rampRgb(keys, u) {
	if (!Array.isArray(keys) || keys.length === 0) return null;
	if (u <= keys[0].t) return keys[0].rgb;
	const last = keys[keys.length - 1];
	if (u >= last.t) return last.rgb;
	for (let i = 0; i < keys.length - 1; i++) {
		const a = keys[i];
		const b = keys[i + 1];
		if (u >= a.t && u <= b.t) {
			const s = b.t === a.t ? 0 : (u - a.t) / (b.t - a.t);
			return [
				a.rgb[0] + (b.rgb[0] - a.rgb[0]) * s,
				a.rgb[1] + (b.rgb[1] - a.rgb[1]) * s,
				a.rgb[2] + (b.rgb[2] - a.rgb[2]) * s,
			];
		}
	}
	return last.rgb;
}

function rampAlpha(keys, u) {
	if (!Array.isArray(keys) || keys.length === 0) return null;
	if (u <= keys[0].t) return keys[0].a;
	const last = keys[keys.length - 1];
	if (u >= last.t) return last.a;
	for (let i = 0; i < keys.length - 1; i++) {
		const a = keys[i];
		const b = keys[i + 1];
		if (u >= a.t && u <= b.t) {
			const s = b.t === a.t ? 0 : (u - a.t) / (b.t - a.t);
			return a.a + (b.a - a.a) * s;
		}
	}
	return last.a;
}

// colorOverLifetime (record path: colorOverLifetime.{enabled,mode,colorKeys,alphaKeys}).
// Gated by the enabled flag; only Blend mode 0 is supported — any other
// active mode is an ERROR, never a guess.
export function colorOverLifetimeRgba(mod, u, startRgba) {
	const [sr, sg, sb, sa] = startRgba;
	if (!mod || mod.enabled !== true) return [sr, sg, sb, sa];
	const mode = Number(mod.mode ?? 0);
	if (mode !== 0) {
		throw new Error(
			`colorOverLifetime.mode=${mod.mode} is active but only Blend (0) is supported in quality-v1; refusing to guess source behavior`,
		);
	}
	const c = rampRgb(mod.colorKeys, u) ?? [1, 1, 1];
	const a = rampAlpha(mod.alphaKeys, u) ?? 1;
	return [sr * c[0], sg * c[1], sb * c[2], sa * a];
}

// Sprite orientation along the WORLD velocity: the sprite's +u (texture
// right) maps to screen (cos, -sin), and screen velocity is (vx, -vy), so
// the angle that aligns +u with velocity is atan2(vy, vx).
export function velocityAngleRad(worldVel) {
	const vx = finite("velocity.x", worldVel?.[0]);
	const vy = finite("velocity.y", worldVel?.[1]);
	return Math.atan2(vy, vx);
}

// Pivot offset in pixels: Unity pivot is particle-local with +y UP while the
// screen y axis points down; scale convention = particle sprite size, i.e. a
// projection of renderer.pivot rather than a verified editor value.
export function pivotOffsetPx(pivot, rotRad, sizePx) {
	const x = finite("pivot.x", pivot?.x ?? 0);
	const y = finite("pivot.y", pivot?.y ?? 0);
	const s = finite("sizePx", sizePx);
	const c = Math.cos(rotRad);
	const sn = Math.sin(rotRad);
	// +u on screen = (cos, -sin); local +y-up = -(sin, cos) [v-down axis]
	// (+0 normalizes -0 so zero pivots are exact zeroes, not negative zero)
	return [s * (x * c - y * sn) + 0, s * (-x * sn - y * c) + 0];
}
