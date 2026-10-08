import { scalarWire } from './wire-curves.js';
import { colorWire } from './wire-color.js';
import { particleRenderState } from './wire-state.js';

const TRAIL_CAP = 1024;
const lin = (x) => (x <= 0.04045 ? x / 12.92
  : x <= 1 ? Math.pow((x + 0.055) / 1.055, 2.4) : Math.pow(x, 2.2));

function xfPoint(m, v) {
  return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3],
          m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7],
          m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11]];
}

export function writeTrails(part) {
  const sim = part.sim, d = part.trail.d, A = part.trail.A;
  const toLocal = d.world === 1 ? sim.wmInv : null;
  part.trail.mat.uniforms.uScale.value = part.mat.uniforms.uScale.value;
  const st = { size: [0, 0, 0], rot: [0, 0, 0], color: [0, 0, 0, 0], uv: [0, 0, 0, 0], custom: [0, 0, 0, 0] };
  let k = 0;
  for (const p of sim.p) {
    if (!p.trail || !p.trail.length) continue;
    particleRenderState(sim.d, p, st);
    const age = p.age / p.life;
    const head = sim._trailPos(p);
    const pts = [head];
    for (let j = p.trail.length - 1; j >= 0; j--) pts.push(p.trail[j]);
    const loc = pts.map((q) => (toLocal ? xfPoint(toLocal, q) : q));
    let total = 0;
    const acc = [0];
    for (let j = 1; j < loc.length; j++) {
      total += Math.hypot(loc[j][0] - loc[j - 1][0], loc[j][1] - loc[j - 1][1], loc[j][2] - loc[j - 1][2]);
      acc.push(total);
    }
    if (total < 1e-5) continue;
    const base = d.inherit ? st.color : [1, 1, 1, 1];
    const cl = d.colLife ? colorWire(d.colLife, age, p.r[2], [1, 1, 1, 1]) : [1, 1, 1, 1];
    const w0 = d.sizeW ? st.size[0] : 1;
    for (let j = 0; j + 1 < loc.length && k < TRAIL_CAP; j++) {
      const a = loc[j], b = loc[j + 1], len = acc[j + 1] - acc[j];
      if (len < 1e-6) continue;
      const ua = acc[j] / total, ub = acc[j + 1] / total, um = (ua + ub) / 2;
      const ct = d.colTrail ? colorWire(d.colTrail, um, p.r[2], [1, 1, 1, 1]) : [1, 1, 1, 1];
      const wd = w0 * (scalarWire(d.width, ua, p.r[4]) + scalarWire(d.width, ub, p.r[4])) / 2;
      A.iPos.array.set([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, -(a[2] + b[2]) / 2], k * 3);
      A.iVel.array.set([b[0] - a[0], b[1] - a[1], -(b[2] - a[2])], k * 3);
      A.iSize.array.set([wd, len, 1], k * 3);
      A.iRot.array.set([0, 0, 0, 0], k * 4);
      A.iColor.array.set([base[0] * lin(ct[0] * cl[0]), base[1] * lin(ct[1] * cl[1]), base[2] * lin(ct[2] * cl[2]), base[3] * ct[3] * cl[3]], k * 4);
      A.iUV.array.set([ub, 0, ua - ub, 1], k * 4);
      A.iCustom.array.set([0, 0, 0, 0], k * 4);
      A.iFlip.array.set([0, 0], k * 2);
      k++;
    }
  }
  for (const key in A) A[key].needsUpdate = true;
  part.trail.geo.instanceCount = k;
}
