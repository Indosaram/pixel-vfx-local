import { clamp, fcos, fsin, tri } from "./mathx.js";

const TAU = Math.PI * 2;

function gradient(colors, u) {
	if (colors.length === 1) return colors[0];
	const t = clamp(u, 0, 0.999999) * (colors.length - 1);
	const i = Math.floor(t);
	const f = t - i;
	const a = colors[i];
	const b = colors[i + 1];
	return [
		a[0] + (b[0] - a[0]) * f,
		a[1] + (b[1] - a[1]) * f,
		a[2] + (b[2] - a[2]) * f,
	];
}

function alphaAt(fx, u) {
	let a = 1;
	if (fx.fadeIn > 0 && u < fx.fadeIn) a = u / fx.fadeIn;
	if (fx.fadeOut > 0 && u > 1 - fx.fadeOut)
		a = Math.min(a, (1 - u) / fx.fadeOut);
	return clamp(a, 0, 1);
}

function blend(buf, i, r, g, b, a, mode) {
	if (a <= 0) return;
	const o = i * 4;
	if (mode === "add") {
		buf[o] += r * a;
		buf[o + 1] += g * a;
		buf[o + 2] += b * a;
		buf[o + 3] = Math.min(1, buf[o + 3] + a);
	} else {
		const ia = 1 - a;
		buf[o] = r * a + buf[o] * ia;
		buf[o + 1] = g * a + buf[o + 1] * ia;
		buf[o + 2] = b * a + buf[o + 2] * ia;
		buf[o + 3] = a + buf[o + 3] * ia;
	}
}

function drawDot(buf, W, H, cx, cy, radius, r, g, b, a, mode, soft) {
	if (radius <= 0 || a <= 0) return;
	const R = Math.max(0.75, radius);
	const x0 = Math.max(0, Math.floor(cx - R));
	const x1 = Math.min(W - 1, Math.ceil(cx + R));
	const y0 = Math.max(0, Math.floor(cy - R));
	const y1 = Math.min(H - 1, Math.ceil(cy + R));
	const r2 = R * R;
	for (let y = y0; y <= y1; y++) {
		for (let x = x0; x <= x1; x++) {
			const dx = x + 0.5 - cx;
			const dy = y + 0.5 - cy;
			const d2 = dx * dx + dy * dy;
			if (d2 > r2) continue;
			const t = 1 - Math.sqrt(d2) / R;
			const pa = soft ? a * t : a * Math.min(1, t * 3);
			blend(buf, y * W + x, r, g, b, pa, mode);
		}
	}
}

function drawStreak(buf, W, H, tx, ty, hx, hy, width, r, g, b, a, mode) {
	const dx = hx - tx;
	const dy = hy - ty;
	const len = Math.sqrt(dx * dx + dy * dy);
	const steps = Math.max(1, Math.ceil(len));
	for (let s = 0; s <= steps; s++) {
		const t = s / steps;
		const pa = a * (0.2 + 0.8 * t);
		drawDot(
			buf,
			W,
			H,
			tx + dx * t,
			ty + dy * t,
			width,
			r,
			g,
			b,
			pa,
			mode,
			false,
		);
	}
}

function drawRing(buf, W, H, cx, cy, R, width, r, g, b, a, mode) {
	const pad = R + width + 2;
	const x0 = Math.max(0, Math.floor(cx - pad));
	const x1 = Math.min(W - 1, Math.ceil(cx + pad));
	const y0 = Math.max(0, Math.floor(cy - pad));
	const y1 = Math.min(H - 1, Math.ceil(cy + pad));
	const half = width / 2;
	for (let y = y0; y <= y1; y++) {
		for (let x = x0; x <= x1; x++) {
			const dx = x + 0.5 - cx;
			const dy = y + 0.5 - cy;
			const d = Math.sqrt(dx * dx + dy * dy);
			const e = Math.abs(d - R);
			if (e > half + 0.5) continue;
			const pa = a * clamp(half - e + 1, 0, 1);
			blend(buf, y * W + x, r, g, b, pa, mode);
		}
	}
}

function drawArc(
	buf,
	W,
	H,
	cx,
	cy,
	radius,
	a0,
	a1,
	width,
	r,
	g,
	b,
	a,
	mode,
	progress,
) {
	const span = a1 - a0;
	const end = a0 + span * progress;
	const steps = Math.max(8, Math.ceil((Math.abs(end - a0) * radius) / 3));
	for (let s = 0; s <= steps; s++) {
		const ang = a0 + (end - a0) * (s / steps);
		const u = span !== 0 ? (ang - a0) / span : 1;
		const taper = fsin(Math.PI * u);
		const px = cx + fcos(ang) * radius;
		const py = cy + fsin(ang) * radius;
		drawDot(
			buf,
			W,
			H,
			px,
			py,
			Math.max(0.6, width * (0.3 + 0.7 * taper)),
			r,
			g,
			b,
			a * (0.5 + 0.5 * taper),
			mode,
			false,
		);
	}
}

function drawPolyline(buf, W, H, pts, width, r, g, b, a, mode) {
	for (let i = 0; i + 1 < pts.length; i++) {
		const fade = 1 - i / pts.length;
		drawStreak(
			buf,
			W,
			H,
			pts[i][0],
			pts[i][1],
			pts[i + 1][0],
			pts[i + 1][1],
			width,
			r,
			g,
			b,
			a * (0.4 + 0.6 * fade),
			mode,
		);
	}
}

export function rasterFrame(sim, effect, W, H, camera) {
	const buf = new Float32Array(W * H * 4);
	const scale = W / 128;
	const zoom = camera.zoom > 0 ? camera.zoom : 1;
	const cx = W / 2 + (camera.panX || 0) * W;
	const cy = H / 2 + (camera.panY || 0) * H;
	const map = (nx, ny) => [
		(nx * W - cx) * zoom + cx,
		(ny * H - cy) * zoom + cy,
	];
	const mode = effect.blend === "add" ? "add" : "normal";
	const t = sim.time;

	for (const p of sim.particles) {
		if (p.dead || t < p.spawnTime) continue;
		const u = p.age / p.life;
		if (u <= 0 || u >= 1) continue;
		let a =
			alphaAt(effect, u) *
			(effect.alphaMax === undefined ? 1 : effect.alphaMax);
		if (effect.twinkle)
			a *= 0.4 + 0.6 * tri(p.age * effect.twinkle + p.phase / TAU);
		if (a <= 0.004) continue;
		const col = gradient(effect.colors, u);
		const size = (p.size0 + (effect.sizeEnd - p.size0) * u) * scale * zoom;
		if (size <= 0) continue;
		const [sx, sy] = map(p.x, p.y);
		if (effect.shape === "streak") {
			const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
			const L = sp * (effect.streakLen || 0.045) * scale * zoom;
			const hw = Math.max(0.6, size / 2);
			if (sp > 0.001) {
				drawStreak(
					buf,
					W,
					H,
					sx - (p.vx / sp) * L,
					sy - (p.vy / sp) * L,
					sx,
					sy,
					hw,
					col[0],
					col[1],
					col[2],
					a,
					mode,
				);
			} else {
				drawDot(buf, W, H, sx, sy, hw, col[0], col[1], col[2], a, mode, false);
			}
		} else if (effect.shape === "blob") {
			drawDot(buf, W, H, sx, sy, size, col[0], col[1], col[2], a, mode, true);
		} else {
			drawDot(
				buf,
				W,
				H,
				sx,
				sy,
				Math.max(0.5, size / 2),
				col[0],
				col[1],
				col[2],
				a,
				mode,
				false,
			);
		}
	}

	for (const ring of effect.rings || []) {
		const u = (t - ring.at) / ring.life;
		if (u < 0 || u > 1) continue;
		const [ox, oy] = map(effect.spawn.origin[0], effect.spawn.origin[1]);
		const R = (ring.r0 + (ring.r1 - ring.r0) * u) * W * zoom;
		drawRing(
			buf,
			W,
			H,
			ox,
			oy,
			R,
			Math.max(1, W * 0.02 * (1 - u * 0.5)),
			ring.color[0],
			ring.color[1],
			ring.color[2],
			(1 - u) * 0.9,
			mode,
		);
	}

	for (const arc of effect.arcs || []) {
		const u = (t - arc.at) / arc.life;
		if (u < 0 || u > 1) continue;
		const [ox, oy] = map(effect.spawn.origin[0], effect.spawn.origin[1]);
		const a0 = (arc.sweep[0] * Math.PI) / 180;
		const a1 = (arc.sweep[1] * Math.PI) / 180;
		const progress = Math.min(1, u * 1.6);
		drawArc(
			buf,
			W,
			H,
			ox,
			oy,
			arc.radius * W * zoom,
			a0,
			a1,
			arc.width * W * zoom,
			arc.color[0],
			arc.color[1],
			arc.color[2],
			(1 - u * u) * 0.95,
			mode,
			progress,
		);
	}

	for (const bolt of sim.bolts) {
		const u = (t - bolt.at) / bolt.life;
		if (u < 0 || u > 1) continue;
		const pts = bolt.segs.map((s) => map(s[0], s[1]));
		const a = u < 0.25 ? 1 : 1 - (u - 0.25) / 0.75;
		drawPolyline(
			buf,
			W,
			H,
			pts,
			Math.max(1, W * 0.012),
			235,
			245,
			255,
			a,
			"add",
		);
		drawPolyline(
			buf,
			W,
			H,
			pts,
			Math.max(0.6, W * 0.005),
			255,
			255,
			255,
			a,
			"add",
		);
	}

	const out = new Uint8ClampedArray(W * H * 4);
	for (let i = 0; i < out.length; i += 4) {
		out[i] = buf[i];
		out[i + 1] = buf[i + 1];
		out[i + 2] = buf[i + 2];
		out[i + 3] = buf[i + 3] * 255;
	}
	return out;
}
