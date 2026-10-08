import { expect, test } from 'bun:test';
import { scalarWire } from '../src/wire-curves.js';

test('wire constants and ranges use their supplied values and fraction', () => {
  expect(scalarWire({ t: 'c', v: -3 }, 0.7, 0.2)).toBe(-3);
  expect(scalarWire({ t: 'r', a: 2, b: 10 }, 0.7, 0.25)).toBe(4);
  for (const value of [undefined, null, false, 0, '', { t: 'unknown' }]) {
    expect(scalarWire(value, 0.5, 0.25)).toBe(0);
  }
});

test('wire Hermite uses segment duration and asymmetric outgoing and incoming tangents', () => {
  const k = [[0, 2, 99, 3], [2, 6, -1, 77]];
  const before = structuredClone(k);
  // Midpoint basis: .5, .125, .5, -.125, with tangent duration 2.
  expect(scalarWire({ t: 'k', s: 2, k }, 1, 0)).toBe(10);
  expect(scalarWire({ t: 'k', s: 2, k }, -1, 0)).toBe(4);
  expect(scalarWire({ t: 'k', s: 2, k }, 3, 0)).toBe(12);
  expect(k).toEqual(before);
});

test('wire ranged Hermite blends evaluated curves before applying scale', () => {
  const a = [[0, 2, 0, 0], [2, 6, 0, 0]];
  const b = [[0, 10, 0, 0], [2, 14, 0, 0]];
  expect(scalarWire({ t: 'rk', a, b, s: 3 }, 1, 0.25)).toBe(18);
  expect(scalarWire({ t: 'k', k: a, s: 1 }, 0.5, 0)).toBe(2.625);
});

test('wire empty keys and omitted scale retain specified arithmetic', () => {
  expect(scalarWire({ t: 'k', k: [], s: 3 }, 1, 0)).toBe(0);
  expect(scalarWire({ t: 'rk', a: [], b: [], s: 3 }, 1, 0.25)).toBe(0);
  expect(scalarWire({ t: 'k', k: [[0, 2, 0, 0]] }, 1, 0)).toBeNaN();
  expect(scalarWire({ t: 'rk', a: [], b: [] }, 1, 0.25)).toBeNaN();
});

test('wire duplicate endpoint keys preserve the first endpoint and input order', () => {
  const k = [[0, 2, 0, 0], [0, 9, 0, 0], [1, 4, 0, 0]];
  expect(scalarWire({ t: 'k', k, s: 1 }, 0, 0)).toBe(2);
  expect(scalarWire({ t: 'k', k, s: 1 }, 0.5, 0)).toBe(6.5);
});
