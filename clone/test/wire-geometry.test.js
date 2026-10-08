import { expect, test } from 'bun:test';
import { BoxGeometry, PlaneGeometry, Group, ShaderMaterial, Vector3, DynamicDrawUsage } from 'three';
import { createRenderParts } from '../src/wire-geometry.js';

const emitter = render => ({ name: 'original', max: 3, render,
  pos: { x: 1, y: 2, z: 3 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 2, y: 3, z: 4 } });
function setup() {
  const calls = [], refs = [];
  const quad = new PlaneGeometry(), geometry = new BoxGeometry(2, 4, 6);
  const resources = { quad, geometry: ref => { refs.push(ref); return geometry; }, timeU: { value: 0 } };
  const uniforms = { gradeU: { value: 1 }, intU: { value: 2 } };
  const makeMaterial = (...args) => {
    calls.push(args);
    return new ShaderMaterial({ uniforms: { uLen: { value: 0 }, uVelScale: { value: 0 }, uPivot: { value: new Vector3() } } });
  };
  return { calls, refs, quad, geometry, resources, uniforms, makeMaterial, parent: new Group() };
}

test('mode selection and holder rotation retain source distinctions', () => {
  for (const [mode, expected] of [[1, 1], [0, 0], [9, 0]]) {
    const s = setup(), d = emitter({ mat: 'quad', mode, align: 0, pivot: { x: 1, y: 2, z: 3 } });
    d.rot = { x: 0.5, y: 0.5, z: 0.5, w: 0.5 };
    const [p] = createRenderParts({ emitters: [d] }, [{}], s.resources, s.uniforms, s.makeMaterial, s.parent);
    expect(p.mode).toBe(expected);
    expect(s.calls[0][1]).toBe(expected);
    expect(p.holder.quaternion.toArray()).toEqual([-0.5, -0.5, 0.5, 0.5]);
    expect(p.mat.uniforms.uPivot.value.toArray()).toEqual([1, 2, 3]);
  }
});

test('skipped materials preserve original indices and oriented quads share base attributes', () => {
  const s = setup(), sims = [{}, {}];
  const def = { emitters: [emitter({ mat: null }), emitter({ mat: 'quad', mode: 0, align: 1, len: 2, fudge: 0.25, sort: 4 })], roles: ['skip', 'body'] };
  const [p] = createRenderParts(def, sims, s.resources, s.uniforms, s.makeMaterial, s.parent);
  expect(p.idx).toBe(1);
  expect(p.sim).toBe(sims[1]);
  expect(p.role).toBe('body');
  expect(p.mode).toBe(4);
  expect(p.sort).toBe(true);
  expect(s.refs).toEqual([]);
  expect(p.geo.index).toBe(s.quad.index);
  expect(p.geo.attributes.position).toBe(s.quad.attributes.position);
  expect(p.A.iPos.array.length).toBe(9);
  expect(p.A.iRot.itemSize).toBe(4);
  expect(p.A.iPos.usage).toBe(DynamicDrawUsage);
  expect(p.geo.instanceCount).toBe(0);
  expect(p.mesh.renderOrder).toBe(-1.5);
  expect(p.mesh.frustumCulled).toBe(false);
  expect(p.holder.position.toArray()).toEqual([1, 2, -3]);
  expect(p.holder.scale.toArray()).toEqual([2, 3, 4]);
  expect(p.holder.parent).toBe(s.parent);
  expect(s.calls[0][2].viewAlign).toBe(false);
  expect(s.calls[0][2].gradeU).toBe(s.uniforms.gradeU);
  expect(s.calls[0][2].intU).toBe(s.uniforms.intU);
  expect(s.calls[0][2].timeU).toBe(s.resources.timeU);
});

test('mesh pivots use bounds and trail geometry has independent capacity and ordering', () => {
  const s = setup(), d = emitter({ mat: 'mesh', mode: 4, align: 0, mesh: 'mesh-ref', len: 5, vel: 2,
    pivot: { x: 0.5, y: 0.25, z: 0.5 } });
  d.max = 500;
  d.trail = { mat: 'trail' };
  const [p] = createRenderParts({ emitters: [d] }, [{}], s.resources, s.uniforms, s.makeMaterial, s.parent);
  expect(s.refs).toEqual(['mesh-ref']);
  expect(p.mat.uniforms.uPivot.value.toArray()).toEqual([1, 1, -3]);
  expect(p.mat.uniforms.uLen.value).toBe(5);
  expect(p.mat.uniforms.uVelScale.value).toBe(2);
  expect(p.A.iPos.array.length).toBe(256 * 3);
  expect(p.trail.A.iPos.array.length).toBe(1024 * 3);
  expect(p.trail.A.iPos).not.toBe(p.A.iPos);
  expect(p.trail.geo.index).toBe(s.quad.index);
  expect(p.trail.mesh.parent).toBe(p.holder);
  expect(p.trail.mesh.renderOrder).toBe(p.mesh.renderOrder - 0.5);
  expect(p.trail.geo.instanceCount).toBe(0);
  expect(p.trail.mat.uniforms.uLen.value).toBe(1);
  expect(p.trail.mat.uniforms.uVelScale.value).toBe(0);
  expect(s.calls[0][2].viewAlign).toBe(true);
  expect(s.calls[1][1]).toBe(1);
});
