import { Euler, Quaternion, Vector3, Matrix4 } from 'three';
import { particleRenderState } from './wire-state.js';

const _s = new Vector3(), _v = new Vector3();
const _m = new Matrix4(), _e = new Euler(), _q = new Quaternion();
const _st = { size: [0, 0, 0], rot: [0, 0, 0], color: [0, 0, 0, 0],
  uv: [0, 0, 0, 0], custom: [0, 0, 0, 0] };

const xfPoint = (m, v) => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3],
  m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7],
  m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11],
];
const xfDir = (m, v) => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[4] * v[0] + m[5] * v[1] + m[6] * v[2],
  m[8] * v[0] + m[9] * v[1] + m[10] * v[2],
];

export function writeInstances(part, camera = null) {
  const P = part;
  P.mesh.getWorldScale(_s);
  P.mat.uniforms.uScale.value = _s.x;
  let ps = P.sim.p;
  const A = P.A, n = ps.length;
  if (camera && P.sort && n > 1) {
    P.mesh.updateMatrixWorld();
    _m.multiplyMatrices(camera.matrixWorldInverse, P.mesh.matrixWorld);
    ps = ps.map((p) => [p, _v.set(p.pos[0], p.pos[1], -p.pos[2]).applyMatrix4(_m).z])
      .sort((a, b) => a[1] - b[1]).map((x) => x[0]);
  }
  const W = P.sim.world && P.sim.wmInv ? P.sim.wmInv : null;
  for (let i = 0; i < n; i++) {
    const p = ps[i];
    particleRenderState(P.sim.d, p, _st);
    const pp = W ? xfPoint(W, p.pos) : p.pos;
    A.iPos.array.set([pp[0], pp[1], -pp[2]], i * 3);
    { let v = p.tv || p.vel; if (W) v = xfDir(W, v);
      A.iVel.array.set([v[0], v[1], -v[2]], i * 3); }
    A.iSize.array.set(_st.size, i * 3);
    if (P.mode === 4) {
      _e.set(-_st.rot[0], -_st.rot[1], _st.rot[2], 'YXZ');
      _q.setFromEuler(_e);
      A.iRot.array.set([_q.x, _q.y, _q.z, _q.w], i * 4);
    } else { A.iRot.array.set([0, 0, -_st.rot[2], 0], i * 4); }
    A.iColor.array.set(_st.color, i * 4);
    A.iUV.array.set(_st.uv, i * 4);
    A.iCustom.array.set(_st.custom, i * 4);
    A.iFlip.array.set(p.flip, i * 2);
  }
  for (const k in A) A[k].needsUpdate = true;
  P.geo.instanceCount = n;
}
