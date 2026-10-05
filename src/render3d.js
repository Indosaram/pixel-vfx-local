// Software z-buffer renderer into an HDR (Float32) buffer: flat-shaded
// triangles + camera-facing billboards. Pixel sizes derive from the
// projection matrix so meshes and billboards stay consistent under any FOV.

import { composeTRS, projectPoint, screenFromNdc } from "./camera3d.js";
import { getGeometry } from "./geometry.js";

export function makeHdr(W, H) {
	const depth = new Float32Array(W * H);
	// far sentinel: raster and billboard z-tests accept only z < depth
	depth.fill(1e30);
	return {
		data: new Float32Array(W * H * 4),
		depth,
	};
}

const LIGHT = (() => {
	const v = [-0.35, -0.72, -0.55];
	const l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	return [v[0] / l, v[1] / l, v[2] / l];
})();

function writeFrag(hdr, idx, r, g, b, a) {
	const o = idx * 4;
	hdr.data[o] = r;
	hdr.data[o + 1] = g;
	hdr.data[o + 2] = b;
	hdr.data[o + 3] = a;
}

function rasterTri(hdr, W, H, v0, v1, v2, cr, cg, cb, emissive) {
	const [x0, y0, z0] = v0;
	const [x1, y1, z1] = v1;
	const [x2, y2, z2] = v2;
	const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
	if (area === 0) return;
	const minX = Math.max(0, Math.floor(Math.min(x0, x1, x2)));
	const maxX = Math.min(W - 1, Math.ceil(Math.max(x0, x1, x2)));
	const minY = Math.max(0, Math.floor(Math.min(y0, y1, y2)));
	const maxY = Math.min(H - 1, Math.ceil(Math.max(y0, y1, y2)));
	if (minX > maxX || minY > maxY) return;

	const ax = x1 - x0;
	const ay = y1 - y0;
	const az = z1 - z0;
	const bx = x2 - x0;
	const by = y2 - y0;
	const bz = z2 - z0;
	let nx = ay * bz - az * by;
	let ny = az * bx - ax * bz;
	let nz = ax * by - ay * bx;
	const nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
	nx /= nl;
	ny /= nl;
	nz /= nl;
	const lam = Math.abs(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
	const shade = 0.38 + 0.78 * lam;
	const fr = cr * shade + cr * emissive * 1.6;
	const fg = cg * shade + cg * emissive * 1.6;
	const fb = cb * shade + cb * emissive * 1.6;

	for (let y = minY; y <= maxY; y++) {
		const py = y + 0.5;
		for (let x = minX; x <= maxX; x++) {
			const px = x + 0.5;
			const w0 = (x1 - px) * (y2 - py) - (x2 - px) * (y1 - py);
			const w1 = (x2 - px) * (y0 - py) - (x0 - px) * (y2 - py);
			const w2 = (x0 - px) * (y1 - py) - (x1 - px) * (y0 - py);
			if ((w0 < 0 && w1 < 0 && w2 < 0) || (w0 > 0 && w1 > 0 && w2 > 0)) {
				const inv = 1 / area;
				const z = (w0 * z0 + w1 * z1 + w2 * z2) * inv;
				const idx = y * W + x;
				if (z >= hdr.depth[idx]) continue;
				hdr.depth[idx] = z;
				writeFrag(hdr, idx, fr, fg, fb, 1);
			}
		}
	}
}

export function renderMeshes(hdr, W, H, view, proj, meshes) {
	for (const m of meshes) {
		const geo = getGeometry(m.geo);
		const model = composeTRS(m.pos, m.rot, m.scale);
		const n = geo.positions.length / 3;
		const sx = new Float64Array(n);
		const sy = new Float64Array(n);
		const sz = new Float64Array(n);
		const ok = new Uint8Array(n);
		for (let i = 0; i < n; i++) {
			const px = geo.positions[i * 3];
			const py = geo.positions[i * 3 + 1];
			const pz = geo.positions[i * 3 + 2];
			const wx = model[0] * px + model[4] * py + model[8] * pz + model[12];
			const wy = model[1] * px + model[5] * py + model[9] * pz + model[13];
			const wz = model[2] * px + model[6] * py + model[10] * pz + model[14];
			const p = projectPoint(view, proj, wx, wy, wz);
			if (!p) {
				ok[i] = 0;
				continue;
			}
			const [cx, cy] = screenFromNdc(p.x, p.y, W, H);
			sx[i] = cx;
			sy[i] = cy;
			sz[i] = -p.viewZ;
			ok[i] = 1;
		}
		const [cr, cg, cb] = m.color;
		const em = m.emissive || 0;
		for (let t = 0; t < geo.indices.length; t += 3) {
			const i0 = geo.indices[t];
			const i1 = geo.indices[t + 1];
			const i2 = geo.indices[t + 2];
			if (!ok[i0] || !ok[i1] || !ok[i2]) continue;
			rasterTri(
				hdr,
				W,
				H,
				[sx[i0], sy[i0], sz[i0]],
				[sx[i1], sy[i1], sz[i1]],
				[sx[i2], sy[i2], sz[i2]],
				cr,
				cg,
				cb,
				em,
			);
		}
	}
}

export function renderBillboards(hdr, W, H, view, proj, particles) {
	const f = proj[5];
	for (const p of particles) {
		const pr = projectPoint(view, proj, p.x, p.y, p.z);
		if (!pr) continue;
		const [cx, cy] = screenFromNdc(pr.x, pr.y, W, H);
		const depth = -pr.viewZ;
		if (depth <= 0) continue;
		const radPx = Math.max(0.75, (p.size * f * (H / 2)) / pr.w);
		const a = p.alpha === undefined ? 1 : p.alpha;
		if (a <= 0) continue;
		const r = p.color[0] * (1 + (p.glow || 0));
		const g = p.color[1] * (1 + (p.glow || 0));
		const b = p.color[2] * (1 + (p.glow || 0));
		const x0 = Math.max(0, Math.floor(cx - radPx));
		const x1 = Math.min(W - 1, Math.ceil(cx + radPx));
		const y0 = Math.max(0, Math.floor(cy - radPx));
		const y1 = Math.min(H - 1, Math.ceil(cy + radPx));
		const r2 = Math.max(0.5625, radPx * radPx);
		for (let y = y0; y <= y1; y++) {
			const py = y + 0.5 - cy;
			for (let x = x0; x <= x1; x++) {
				const px = x + 0.5 - cx;
				const d2 = px * px + py * py;
				if (d2 > r2) continue;
				const idx = y * W + x;
				if (depth >= hdr.depth[idx]) continue;
				const falloff = 1 - Math.sqrt(d2) / Math.max(0.75, radPx);
				const cov = Math.min(1, 0.35 + falloff);
				const o = idx * 4;
				const boost = 1 + (p.glow || 0) * 0.8;
				hdr.data[o] += r * a * cov * boost;
				hdr.data[o + 1] += g * a * cov * boost;
				hdr.data[o + 2] += b * a * cov * boost;
				if (a * cov > hdr.data[o + 3]) hdr.data[o + 3] = a * cov;
			}
		}
	}
}
