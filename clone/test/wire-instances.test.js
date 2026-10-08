import { expect, test } from 'bun:test';
import { Object3D, Matrix4 } from 'three';
import { writeInstances } from '../src/wire-instances.js';

const particle = () => ({ pos: [1, 2, 3], vel: [4, 5, 6], age: 0, life: 1,
  sz: [2, 3, 4], rot: [0, 0, 0.25], col: [1, 1, 1, 0.5], r: Array(8).fill(0), rowR: 0, flip: [1, 0] });
function part(particles, mode = 0) {
  const sizes = { iPos: 3, iVel: 3, iSize: 3, iRot: 4, iColor: 4, iUV: 4, iCustom: 4, iFlip: 2 };
  return { sim: { d: {}, p: particles, world: false, wmInv: null }, mesh: new Object3D(),
    mat: { uniforms: { uScale: { value: 0 } } }, geo: { instanceCount: -1 }, mode, sort: false,
    A: Object.fromEntries(Object.entries(sizes).map(([name, size]) => [name, { array: new Float32Array(4 * size), needsUpdate: false }])) };
}

test('instance writes flip handedness and preserve mapped attributes', () => {
  for (const mode of [0, 1]) {
    const p = particle(), P = part([p], mode);
    p.tv = [7, 8, 9];
    P.mesh.scale.set(2, 3, 4);
    writeInstances(P);
    expect(Array.from(P.A.iPos.array.slice(0, 3))).toEqual([1, 2, -3]);
    expect(Array.from(P.A.iVel.array.slice(0, 3))).toEqual([7, 8, -9]);
    expect(Array.from(P.A.iSize.array.slice(0, 3))).toEqual([2, 3, 4]);
    expect(Array.from(P.A.iRot.array.slice(0, 4))).toEqual([0, 0, -0.25, 0]);
    expect(Array.from(P.A.iColor.array.slice(0, 4))).toEqual([1, 1, 1, 0.5]);
    expect(Array.from(P.A.iUV.array.slice(0, 4))).toEqual([0, 0, 1, 1]);
    expect(Array.from(P.A.iFlip.array.slice(0, 2))).toEqual([1, 0]);
    expect(P.mat.uniforms.uScale.value).toBe(2);
    expect(P.geo.instanceCount).toBe(1);
    expect(Object.values(P.A).every(a => a.needsUpdate)).toBe(true);
  }
});

test('inverse world transform affects points and directions differently', () => {
  const P = part([particle()]);
  P.sim.world = true;
  P.sim.wmInv = [0, 0, 2, 10, 0, 1, 0, 20, -1, 0, 0, 30];
  writeInstances(P);
  expect(Array.from(P.A.iPos.array.slice(0, 3))).toEqual([16, 22, -29]);
  expect(Array.from(P.A.iVel.array.slice(0, 3))).toEqual([12, 5, 4]);
});

test('depth sorting changes buffer order without changing simulation order', () => {
  const a = particle(), b = particle();
  a.pos = [0, 0, 1]; b.pos = [0, 0, 3];
  const P = part([a, b]);
  P.sort = true;
  writeInstances(P, { matrixWorldInverse: new Matrix4() });
  expect(Array.from(P.A.iPos.array.slice(0, 6))).toEqual([0, 0, -3, 0, 0, -1]);
  expect(P.sim.p[0]).toBe(a);
  expect(P.sim.p[1]).toBe(b);
});

test('mode four converts signed YXZ Euler angles to quaternion', () => {
  const p = particle(), P = part([p], 4);
  p.rot = [Math.PI / 2, Math.PI / 2, Math.PI / 2];
  writeInstances(P);
  const q = Array.from(P.A.iRot.array.slice(0, 4));
  [-Math.SQRT1_2, 0, 0, Math.SQRT1_2].forEach((v, i) => expect(q[i]).toBeCloseTo(v, 6));
});

test('sort depth includes mesh and camera transforms but can be disabled', () => {
  const a = particle(), b = particle();
  a.pos = [1, 0, 0]; b.pos = [3, 0, 0];
  const P = part([a, b]);
  P.mesh.rotation.y = Math.PI / 2;
  P.sort = true;
  const camera = { matrixWorldInverse: new Matrix4() };
  writeInstances(P, camera);
  expect(P.A.iPos.array[0]).toBe(3);
  camera.matrixWorldInverse.makeRotationY(Math.PI);
  writeInstances(P, camera);
  expect(P.A.iPos.array[0]).toBe(1);
  P.sort = false;
  camera.matrixWorldInverse.identity();
  writeInstances(P, camera);
  expect(P.A.iPos.array[0]).toBe(1);
  expect(P.sim.p).toEqual([a, b]);
});

test('empty writes clear instance count and mark attributes dirty', () => {
  const P = part([]);
  P.geo.instanceCount = 3;
  writeInstances(P);
  expect(P.geo.instanceCount).toBe(0);
  expect(Object.values(P.A).every(a => a.needsUpdate)).toBe(true);
});

test('camera inverse multiplies mesh world in noncommuting order', () => {
  const a = particle(), b = particle();
  a.pos = [1, 0, 0]; b.pos = [0, 1, 0];
  const P = part([a, b]);
  P.mesh.rotation.y = Math.PI / 2;
  P.sort = true;
  writeInstances(P, { matrixWorldInverse: new Matrix4().makeRotationX(-Math.PI / 2) });
  expect(Array.from(P.A.iPos.array.slice(0, 6))).toEqual([0, 1, -0, 1, 0, -0]);
  expect(P.sim.p[0]).toBe(a);
  expect(P.sim.p[1]).toBe(b);
});

test('active mapped modules overwrite sentinel instance attributes', () => {
  const P = part([particle()]);
  const c = v => ({ t: 'c', v });
  P.sim.d = { sizeOL: { x: c(2) }, colorOL: { t: 'col', v: [0, 1, 0, 0.5] },
    uv: { tx: 2, ty: 2, fot: c(0.5), start: c(0), cycles: 1 },
    custom: [c(1), c(2), c(3), c(4)] };
  for (const a of Object.values(P.A)) a.array.fill(99);
  writeInstances(P);
  expect(Array.from(P.A.iSize.array.slice(0, 3))).toEqual([4, 6, 8]);
  expect(Array.from(P.A.iColor.array.slice(0, 4))).toEqual([0, 1, 0, 0.25]);
  expect(Array.from(P.A.iUV.array.slice(0, 4))).toEqual([0, 0, 0.5, 0.5]);
  expect(Array.from(P.A.iCustom.array.slice(0, 4))).toEqual([1, 2, 3, 4]);
});
