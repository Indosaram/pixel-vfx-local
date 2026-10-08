import { expect, test } from 'bun:test';
import { validateScalar, validateColor } from '../src/wire-value-validation.js';

test('scalar validation preserves known values and source fallthrough tags', () => {
  const values = [null, undefined, { t: 'c', v: -2 }, { t: 'r', a: 5, b: -1 },
    { t: 'k', s: 2, k: [] }, { t: 'rk', s: -1, a: [[1, 2, 3, 4]], b: [] },
    { t: 'k', s: 1, k: [[2, 0, 0, 0], [1, 1, 2, 3]] },
    { t: 'k', s: 1, k: [[0, 1, 2, 3, 'ignored']] }, { t: 'unknown' }];
  for (const value of values) expect(validateScalar(value, 'emitter.life')).toBe(value);
});

test('malformed scalar structures report the originating field', () => {
  for (const value of [1, [], {}, { t: 'c', v: NaN }, { t: 'r', a: 1 },
    { t: 'k', s: Infinity, k: [] }, { t: 'k', s: 1, k: [[0, 1, 2]] },
    { t: 'rk', s: 1, a: [], b: [[0, 1, '2', 3]] },
    { t: 'k', s: 1, k: [[0, 1, Infinity, 0]] }]) {
    expect(() => validateScalar(value, 'emitter.life')).toThrow();
    try { validateScalar(value, 'emitter.life'); }
    catch (error) { expect(error).toMatchObject({ code: 'INVALID_DEFINITION', stage: 'library', context: { path: 'emitter.life' } }); }
  }
});

test('color validation preserves HDR values, empty gradients and unknown tags', () => {
  const gradient = { c: [[0, 2, -1, 0]], a: [[0, 0.5]], m: 9 };
  for (const value of [null, undefined, { t: 'col', v: [2, -1, 0, 0.5] },
    { t: 'rcol', a: [0, 0, 0, 0], b: [1, 1, 1, 1] },
    { t: 'grad', g: gradient }, { t: 'rgrad', a: gradient, b: { c: [], a: [] } },
    { t: 'grad', g: { m: '1', c: [[2, 1, 0, 0], [-1, 0, 1, 0]], a: [[2, 3], [2, -1]] } },
    { t: 'col', v: [1, 0, 0, 1, 'ignored'] },
    { t: 'grad', g: { c: [[0, 1, 0, 0, 'ignored']], a: [[0, 1, 'ignored']] } },
    { t: 'unknown' }]) {
    expect(validateColor(value, 'emitter.color')).toBe(value);
  }
});

test('malformed color and gradient fields reject without coercion', () => {
  for (const value of [{ t: 'col', v: [1, 1, 1] }, { t: 'rcol', a: [1, 1, 1, 1], b: null },
    { t: 'grad', g: { c: [], a: [[0, Infinity]] } }, { t: 'col', v: [1, NaN, 0, 1] },
    { t: 'rgrad', a: { c: [], a: [] }, b: { c: [[0, 1, 1]], a: [] } }]) {
    expect(() => validateColor(value, 'emitter.color')).toThrow();
    try { validateColor(value, 'emitter.color'); }
    catch (error) { expect(error).toMatchObject({ code: 'INVALID_DEFINITION', stage: 'library', context: { path: 'emitter.color' } }); }
  }
});

test('sparse consumed vectors and key arrays cannot bypass validation', () => {
  const vector = [1, , 0, 1];
  const keys = new Array(1);
  for (const value of [{ t: 'k', s: 1, k: keys }, { t: 'k', s: 1, k: [[0, 1, , 0]] }]) {
    expect(() => validateScalar(value, 'curve')).toThrow();
  }
  for (const value of [{ t: 'col', v: vector }, { t: 'grad', g: { c: keys, a: [] } },
    { t: 'grad', g: { c: [], a: keys } }]) {
    expect(() => validateColor(value, 'color')).toThrow();
  }
});
