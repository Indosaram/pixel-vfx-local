import { InstancedBufferGeometry, InstancedBufferAttribute, Mesh, Group, Vector3, DynamicDrawUsage } from 'three';

const TRAIL_CAP = 1024;
const ATTRS = [['iPos', 3], ['iVel', 3], ['iSize', 3], ['iRot', 4],
  ['iColor', 4], ['iUV', 4], ['iCustom', 4], ['iFlip', 2]];

export function createRenderParts(effectDefinition, simulations, resources, uniforms, makeMaterial, parent) {
  const parts = [];
  effectDefinition.emitters.forEach((ed, idx) => {
    const r = ed.render;
    if (!r.mat) return;
    const localQuad = r.mode === 0 && (r.align === 1 || r.align === 2);
    const mode = (r.mode === 4 || localQuad) ? 4 : (r.mode === 1 ? 1 : 0);
    const base = r.mode === 4 && r.mesh ? resources.geometry(r.mesh) : resources.quad;
    const geo = new InstancedBufferGeometry();
    geo.index = base.index;
    for (const k in base.attributes) geo.setAttribute(k, base.attributes[k]);
    const cap = Math.min(ed.max || 1000, 256);
    const A = {};
    for (const [k, n] of ATTRS) {
      const a = new InstancedBufferAttribute(new Float32Array(cap * n), n);
      a.setUsage(DynamicDrawUsage);
      geo.setAttribute(k, a);
      A[k] = a;
    }
    geo.instanceCount = 0;
    const mat = makeMaterial(r.mat, mode,
      { viewAlign: r.mode === 4 && r.align === 0, gradeU: uniforms.gradeU, intU: uniforms.intU, timeU: resources.timeU },
      resources);
    mat.uniforms.uLen.value = r.len;
    mat.uniforms.uVelScale.value = r.vel || 0;
    const pv = r.pivot || { x: 0, y: 0, z: 0 };
    if (r.mode === 4 && r.mesh) {
      if (!base.boundingBox) base.computeBoundingBox();
      const bs = base.boundingBox.getSize(new Vector3());
      mat.uniforms.uPivot.value.set(pv.x * bs.x, pv.y * bs.y, -pv.z * bs.z);
    } else mat.uniforms.uPivot.value.set(pv.x, pv.y, pv.z);
    const mesh = new Mesh(geo, mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = idx + (-(r.fudge || 0)) * 10;
    mesh.name = ed.name;
    const holder = new Group();
    holder.position.set(ed.pos.x, ed.pos.y, -ed.pos.z);
    holder.quaternion.set(-ed.rot.x, -ed.rot.y, ed.rot.z, ed.rot.w);
    holder.scale.set(ed.scale.x, ed.scale.y, ed.scale.z);
    holder.add(mesh);
    parent.add(holder);
    const part = {
      sim: simulations[idx], mesh, geo, A, mode, mat, idx, holder,
      name: ed.name, role: (effectDefinition.roles || [])[idx] || null,
      sort: r.sort === 1 || r.sort === 4,
    };
    if (ed.trail && ed.trail.mat) {
      const tg = new InstancedBufferGeometry();
      tg.index = resources.quad.index;
      for (const k in resources.quad.attributes) tg.setAttribute(k, resources.quad.attributes[k]);
      const TA = {};
      for (const [k, n] of ATTRS) {
        const a = new InstancedBufferAttribute(new Float32Array(TRAIL_CAP * n), n);
        a.setUsage(DynamicDrawUsage);
        tg.setAttribute(k, a);
        TA[k] = a;
      }
      tg.instanceCount = 0;
      const tm = makeMaterial(ed.trail.mat, 1,
        { gradeU: uniforms.gradeU, intU: uniforms.intU, timeU: resources.timeU }, resources);
      tm.uniforms.uLen.value = 1;
      tm.uniforms.uVelScale.value = 0;
      const tmesh = new Mesh(tg, tm);
      tmesh.frustumCulled = false;
      tmesh.renderOrder = mesh.renderOrder - 0.5;
      tmesh.name = ed.name + ' (trail)';
      holder.add(tmesh);
      part.trail = { mesh: tmesh, geo: tg, A: TA, mat: tm, d: ed.trail };
    }
    parts.push(part);
  });
  return parts;
}
