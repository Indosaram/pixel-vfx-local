import { scalarWire } from './wire-curves.js';
import { colorWire } from './wire-color.js';

const lin = (x) => (x <= 0.04045 ? x / 12.92
  : x <= 1 ? Math.pow((x + 0.055) / 1.055, 2.4) : Math.pow(x, 2.2));

export function particleRenderState(definition, particle, out) {
  const d = definition, p = particle, t = p.age / p.life;
  let sx = 1, sy = 1, sz = 1;
  if (d.sizeOL) {
    const o = d.sizeOL, r = p.r[0];
    if (o.sep) {
      sx = scalarWire(o.x, t, r); sy = scalarWire(o.y, t, r); sz = scalarWire(o.z, t, r);
    } else { sx = sy = sz = scalarWire(o.x, t, r); }
  }
  out.size[0] = p.sz[0] * sx; out.size[1] = p.sz[1] * sy; out.size[2] = p.sz[2] * sz;
  let rx = p.rot[0], ry = p.rot[1], rz = p.rot[2];
  if (d.rotOL) {
    const r = p.r[1];
    rz += scalarWire(d.rotOL.z, t, r) * p.age;
    if (d.rotOL.sep) {
      rx += scalarWire(d.rotOL.x, t, r) * p.age; ry += scalarWire(d.rotOL.y, t, r) * p.age;
    }
  }
  out.rot[0] = rx; out.rot[1] = ry; out.rot[2] = rz;
  const c = out.color;
  c[0] = p.col[0]; c[1] = p.col[1]; c[2] = p.col[2]; c[3] = p.col[3];
  if (d.colorOL) {
    const g = colorWire(d.colorOL, t, p.r[2], [1, 1, 1, 1]);
    c[0] *= g[0]; c[1] *= g[1]; c[2] *= g[2]; c[3] *= g[3];
  }
  c[0] = lin(c[0]); c[1] = lin(c[1]); c[2] = lin(c[2]);
  const u = out.uv;
  u[0] = 0; u[1] = 0; u[2] = 1; u[3] = 1;
  if (d.uv) {
    const tx = d.uv.tx, ty = d.uv.ty, single = d.uv.type === 1;
    const n = single ? tx : tx * ty;
    const ft = d.uv.fps ? ((p.age * d.uv.fps / n) % 1) : t;
    const fv = scalarWire(d.uv.fot, ft, p.r[7]) * (d.uv.fps ? 1 : d.uv.cycles)
      + scalarWire(d.uv.start, 0, p.r[7]) / n;
    let fi = Math.floor((((fv % 1) + 1) % 1) * n);
    if (fi >= n) fi = n - 1;
    let col, row;
    if (single) {
      row = d.uv.rowMode === 1 ? Math.min(ty - 1, Math.floor(p.rowR * ty))
        : Math.min(ty - 1, d.uv.row || 0);
      col = fi;
    } else { col = fi % tx; row = Math.floor(fi / tx); }
    u[0] = col / tx; u[1] = 1 - (row + 1) / ty; u[2] = 1 / tx; u[3] = 1 / ty;
  }
  const cd = out.custom;
  cd[0] = cd[1] = cd[2] = cd[3] = 0;
  if (d.custom) for (let i = 0; i < 4; i++) cd[i] = scalarWire(d.custom[i], t, p.r[3]);
  return out;
}
