import { expect, test } from 'bun:test';
import { colorWire } from '../src/wire-color.js';

test('falsy descriptors write white and unknown descriptors preserve caller output', () => {
  for (const descriptor of [undefined, null, false, 0, '']) {
    const out = [2, 3, 4, 5];
    expect(colorWire(descriptor, 0.5, 0.25, out)).toBe(out);
    expect(out).toEqual([1, 1, 1, 1]);
  }
  const out = [2, 3, 4, 5];
  expect(colorWire({ t: 'unknown' }, 0, 0, out)).toBe(out);
  expect(out).toEqual([2, 3, 4, 5]);
});

test('constant and ranged wire colors fill caller output without changing descriptors', () => {
  const descriptor = { t: 'rcol', a: [0, 2, 4, 0], b: [4, 6, 8, 1] };
  const before = structuredClone(descriptor);
  const out = [];
  expect(colorWire(descriptor, 0.7, 0.25, out)).toBe(out);
  expect(out).toEqual([1, 3, 5, 0.25]);
  expect(descriptor).toEqual(before);
  expect(colorWire({ t: 'col', v: [0.25, 0.5, 0.75, 1] }, 0, 0, out)).toBe(out);
  expect(out).toEqual([0.25, 0.5, 0.75, 1]);
});

test('gradient RGB and alpha sample independent key times and clamp endpoints', () => {
  const g = { c: [[0, 0, 2, 4], [2, 4, 6, 8]], a: [[0, 0], [1, 1]], m: 0 };
  expect(colorWire({ t: 'grad', g }, 0.5, 0, [])).toEqual([1, 3, 5, 0.5]);
  expect(colorWire({ t: 'grad', g }, -1, 0, [])).toEqual([0, 2, 4, 0]);
  expect(colorWire({ t: 'grad', g }, 3, 0, [])).toEqual([4, 6, 8, 1]);
});

test('fixed gradients choose the right key between keys, not the left', () => {
  const g = { c: [[0, 0, 0, 0], [1, 1, 0.5, 0.25]], a: [[0, 0], [1, 1]], m: 1 };
  expect(colorWire({ t: 'grad', g }, 0.25, 0, [])).toEqual([1, 0.5, 0.25, 1]);
  expect(colorWire({ t: 'grad', g }, 0, 0, [])).toEqual([0, 0, 0, 0]);
});

test('empty gradient components default independently and ranged gradients blend', () => {
  const a = { c: [], a: [[0, 0.25]], m: 0 };
  const b = { c: [[0, 0, 0, 0]], a: [], m: 0 };
  expect(colorWire({ t: 'grad', g: a }, 0.5, 0, [])).toEqual([1, 1, 1, 0.25]);
  expect(colorWire({ t: 'grad', g: b }, 0.5, 0, [])).toEqual([0, 0, 0, 1]);
  expect(colorWire({ t: 'rgrad', a, b }, 0.5, 0.25, [])).toEqual([0.75, 0.75, 0.75, 0.4375]);
});

test('ranged gradients evaluate both changing payloads at the supplied time', () => {
  const a = { c: [[0, 0, 0, 0], [1, 4, 4, 4]], a: [[0, 0], [1, 1]], m: 0 };
  const b = { c: [[0, 8, 8, 8], [1, 12, 12, 12]], a: [[0, 1], [1, 0]], m: 0 };
  expect(colorWire({ t: 'rgrad', a, b }, 0.25, 0.5, [])).toEqual([5, 5, 5, 0.5]);
});

test('sub-microsecond gradient intervals use the minimum denominator', () => {
  const g = { c: [[0, 0, 0, 0], [0.0000005, 1, 1, 1]], a: [], m: 0 };
  expect(colorWire({ t: 'grad', g }, 0.00000025, 0, [])).toEqual([0.25, 0.25, 0.25, 1]);
});
