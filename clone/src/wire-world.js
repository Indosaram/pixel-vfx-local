import * as THREE from 'three';

const _M3 = new THREE.Matrix4();
const _Mi = new THREE.Matrix4();

function unityAffine(m, out) {
  const e = m.elements;
  out = out || new Array(12);
  out[0] = e[0]; out[1] = e[4]; out[2] = -e[8]; out[3] = e[12];
  out[4] = e[1]; out[5] = e[5]; out[6] = -e[9]; out[7] = e[13];
  out[8] = -e[2]; out[9] = -e[6]; out[10] = e[10]; out[11] = -e[14];
  return out;
}

export function syncWorld(parent, parts) {
  let need = false;
  for (const P of parts) if (P.sim.world || P.trail) { need = true; break; }
  if (!need) return;
  parent.updateWorldMatrix(true, true);
  for (const P of parts) {
    if (!(P.sim.world || P.trail)) continue;
    _M3.copy(P.holder.matrixWorld);
    _Mi.copy(_M3).invert();
    P.sim.wm = unityAffine(_M3, P.sim.wm);
    P.sim.wmInv = unityAffine(_Mi, P.sim.wmInv);
  }
}
