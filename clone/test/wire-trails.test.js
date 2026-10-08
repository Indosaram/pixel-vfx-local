import { expect, test } from 'bun:test';
import { writeTrails } from '../src/wire-trails.js';

const c = v => ({ t: 'c', v });
const particle = () => ({ pos: [0, 0, 0], trail: [[0, 0, 4, 0], [0, 0, 1, 1]],
  age: 1, life: 4, sz: [2, 3, 4], rot: [0, 0, 0], col: [1, 1, 1, 0.5], r: [0, 0, 0.25, 0, 0.75, 0, 0, 0] });
function part(particles, d = {}) {
  const sizes = { iPos: 3, iVel: 3, iSize: 3, iRot: 4, iColor: 4, iUV: 4, iCustom: 4, iFlip: 2 };
  return { sim: { d: {}, p: particles, wmInv: null, _trailPos: p => p.pos },
    mat: { uniforms: { uScale: { value: 3 } } }, trail: { d: { width: c(1), ...d },
      mat: { uniforms: { uScale: { value: 0 } } }, geo: { instanceCount: -1 },
      A: Object.fromEntries(Object.entries(sizes).map(([key, size]) => [key,
        { array: new Float32Array(1024 * size), needsUpdate: false }])) } };
}

test('trail writes newest-first segments with distance UV and averaged width', () => {
  const P = part([particle()], { sizeW: true,
    width: { t: 'k', s: 1, k: [[0, 0, 1, 1], [1, 1, 1, 1]] } });
  writeTrails(P);
  const { A } = P.trail;
  expect(P.trail.geo.instanceCount).toBe(2);
  expect(Array.from(A.iPos.array.slice(0, 6))).toEqual([0, 0, -0.5, 0, 0, -2.5]);
  expect(Array.from(A.iVel.array.slice(0, 6))).toEqual([0, 0, -1, 0, 0, -3]);
  expect(Array.from(A.iSize.array.slice(0, 6))).toEqual([0.25, 1, 1, 1.25, 3, 1]);
  expect(Array.from(A.iUV.array.slice(0, 8))).toEqual([0.25, 0, -0.25, 1, 1, 0, -0.75, 1]);
  expect(P.trail.mat.uniforms.uScale.value).toBe(3);
  expect(Object.values(A).every(a => a.needsUpdate)).toBe(true);
});

test('world trail converts points before measuring segment lengths', () => {
  const P = part([particle()], { world: 1 });
  P.sim.wmInv = [0, 0, 2, 10, 0, 1, 0, 20, -1, 0, 0, 30];
  writeTrails(P);
  expect(Array.from(P.trail.A.iPos.array.slice(0, 3))).toEqual([11, 20, -30]);
  expect(Array.from(P.trail.A.iVel.array.slice(0, 3))).toEqual([2, 0, -0]);
  expect(P.trail.A.iSize.array[1]).toBe(2);
});

test('segment capacity is shared across particles and empty writes reset counts', () => {
  const particles = Array.from({ length: 600 }, particle);
  const P = part(particles);
  writeTrails(P);
  expect(P.trail.geo.instanceCount).toBe(1024);
  P.sim.p = [];
  writeTrails(P);
  expect(P.trail.geo.instanceCount).toBe(0);
});

test('trail and lifetime color multiply before linearization and inheritance after it', () => {
  const p = particle();
  p.col = [0.5, 0.5, 0.5, 0.5];
  const P = part([p], { inherit: true,
    colTrail: { t: 'col', v: [0.5, 0.5, 0.5, 0.5] },
    colLife: { t: 'col', v: [0.5, 0.5, 0.5, 0.5] } });
  writeTrails(P);
  expect(P.trail.A.iColor.array[0]).toBeCloseTo(0.21404114048223255 * 0.05087608817155679, 8);
  expect(P.trail.A.iColor.array[3]).toBe(0.125);
});

test('short skipped segments still contribute to normalized distance', () => {
  const p = particle();
  p.trail = [[0, 0, 0.00002, 0], [0, 0, 0.0000005, 1]];
  const P = part([p]);
  writeTrails(P);
  expect(P.trail.geo.instanceCount).toBe(1);
  expect(P.trail.A.iUV.array[0]).toBe(1);
  expect(P.trail.A.iUV.array[2]).toBeCloseTo(-0.975, 6);
  expect(P.trail.A.iSize.array[1]).toBeCloseTo(0.0000195, 10);
  p.trail = [[0, 0, 0.000009, 0]];
  writeTrails(P);
  expect(P.trail.geo.instanceCount).toBe(0);
});

test('trail width and color reuse distinct stored fractions', () => {
  const P = part([particle()], { width: { t: 'r', a: 0, b: 4 },
    colTrail: { t: 'rcol', a: [1, 1, 1, 0], b: [1, 1, 1, 1] },
    colLife: { t: 'rcol', a: [1, 1, 1, 0], b: [1, 1, 1, 1] } });
  writeTrails(P);
  expect(P.trail.A.iSize.array[0]).toBe(3);
  expect(P.trail.A.iColor.array[3]).toBe(0.0625);
});

test('trail gradients sample distance midpoint separately from normalized lifetime', () => {
  const gradient = { t: 'grad', g: { c: [[0, 1, 1, 1]], a: [[0, 0], [1, 1]], m: 0 } };
  const P = part([particle()], { colTrail: gradient, colLife: gradient });
  writeTrails(P);
  expect(P.trail.A.iColor.array[3]).toBe(0.03125);
  expect(P.trail.A.iColor.array[7]).toBe(0.15625);
});

test('nonlinear width averages endpoints rather than sampling the midpoint', () => {
  const P = part([particle()], { sizeW: true,
    width: { t: 'k', s: 1, k: [[0, 0, 0, 0], [1, 1, 0, 0]] } });
  writeTrails(P);
  expect(P.trail.A.iSize.array[0]).toBe(0.15625);
  expect(P.trail.A.iSize.array[3]).toBe(1.15625);
});
