import { expect, test } from 'bun:test';
import { particleRenderState } from '../src/wire-state.js';

const c = v => ({ t: 'c', v });
const particle = () => ({ age: 1, life: 4, sz: [2, 3, 4], rot: [0.1, 0.2, 0.3],
  col: [0, 0, 0, 0.5], r: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], rowR: 0.75 });
const output = () => ({ size: [], rot: [], color: [], uv: [9, 9, 9, 9], custom: [9, 9, 9, 9] });

test('UV timing distinguishes FPS from lifetime cycles and start offsets', () => {
  const p = { ...particle(), age: 2, life: 8 }, out = output();
  const uv = { tx: 4, ty: 2, fot: { t: 'k', s: 1, k: [[0, 0, 1, 1], [1, 1, 1, 1]] }, cycles: 3, start: c(1) };
  particleRenderState({ uv: { ...uv, fps: 2 } }, p, out);
  expect(out.uv).toEqual([0.25, 0, 0.25, 0.5]);
  particleRenderState({ uv }, p, out);
  expect(out.uv).toEqual([0.75, 0, 0.25, 0.5]);
  particleRenderState({ uv: { tx: 10, ty: 1, cycles: 1,
    fot: { t: 'r', a: 0, b: 0.5 }, start: { t: 'r', a: 0, b: 5 } } }, p, out);
  expect(out.uv).toEqual([0.8, 0, 0.1, 1]);
});

test('normalized curves and age-scaled rotation retain nonseparated size behavior', () => {
  const p = { ...particle(), age: 2, life: 8 }, out = output();
  const curve = { t: 'k', s: 8, k: [[0, 0, 0, 0], [1, 1, 0, 0]] };
  particleRenderState({ sizeOL: { x: curve }, rotOL: { z: curve }, custom: [curve, curve, curve, curve] }, p, out);
  expect(out.size).toEqual([2.5, 3.75, 5]);
  expect(out.rot).toEqual([0.1, 0.2, 2.8]);
  expect(out.custom).toEqual([1.25, 1.25, 1.25, 1.25]);
});

test('color slot two and nonzero low linearization branch are distinct', () => {
  const p = particle(), out = output();
  p.col = [1, 1, 1, 0.5];
  particleRenderState({ colorOL: { t: 'rcol', a: [0, 0, 0, 0], b: [1, 1, 1, 1] } }, p, out);
  expect(out.color[3]).toBe(0.15);
  p.col = [0.02, 0.02, 0.02, 0.5];
  particleRenderState({}, p, out);
  out.color.slice(0, 3).forEach(v => expect(v).toBeCloseTo(0.02 / 12.92, 12));
});

test('state reuses output arrays and resets UV and custom channels', () => {
  const p = particle(), out = output();
  const arrays = [out.size, out.rot, out.color, out.uv, out.custom];
  expect(particleRenderState({}, p, out)).toBe(out);
  expect(out.size).toEqual([2, 3, 4]);
  expect(out.rot).toEqual([0.1, 0.2, 0.3]);
  expect(out.color).toEqual([0, 0, 0, 0.5]);
  expect(out.uv).toEqual([0, 0, 1, 1]);
  expect(out.custom).toEqual([0, 0, 0, 0]);
  [out.size, out.rot, out.color, out.uv, out.custom].forEach((a, i) => expect(a).toBe(arrays[i]));
});

test('size rotation and custom modules use their assigned stored fractions', () => {
  const r = { t: 'r', a: 0, b: 10 }, out = output();
  particleRenderState({ sizeOL: { sep: true, x: r, y: c(2), z: c(3) },
    rotOL: { sep: true, x: r, y: r, z: r }, custom: [r, c(1), c(2), c(3)] }, particle(), out);
  expect(out.size).toEqual([2, 6, 12]);
  expect(out.rot).toEqual([2.1, 2.2, 2.3]);
  expect(out.custom).toEqual([4, 1, 2, 3]);
});

test('color multiplication precedes RGB linearization and preserves alpha', () => {
  const p = particle(), out = output();
  p.col = [0.5, 1, 2, 0.8];
  particleRenderState({ colorOL: { t: 'col', v: [0.5, 0.5, 1, 0.5] } }, p, out);
  expect(out.color[0]).toBeCloseTo(0.05087608817155679, 12);
  expect(out.color[1]).toBeCloseTo(0.21404114048223255, 12);
  expect(out.color[2]).toBeCloseTo(4.59479341998814, 12);
  expect(out.color[3]).toBe(0.4);
});

test('whole-sheet negative frame values wrap and single rows retain source rules', () => {
  const uv = { tx: 4, ty: 2, fot: c(-0.125), start: c(0), cycles: 1 };
  const out = output();
  particleRenderState({ uv }, particle(), out);
  expect(out.uv).toEqual([0.75, 0, 0.25, 0.5]);
  particleRenderState({ uv: { ...uv, type: 1, rowMode: 1, fot: c(0.25) } }, particle(), out);
  expect(out.uv).toEqual([0.25, 0, 0.25, 0.5]);
  particleRenderState({ uv: { ...uv, type: 1, rowMode: 0, row: -1, fot: c(0) } }, particle(), out);
  expect(out.uv).toEqual([0, 1, 0.25, 0.5]);
});
