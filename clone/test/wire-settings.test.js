import { expect, test } from 'bun:test';
import { normalizeSeedEdit, normalizeGradientEdit, selectFrameRange, editFrameRange } from '../src/wire-settings.js';

test('seed edits use signed integer conversion before the minimum', () => {
  for (const [input, expected] of [[42.9, 42], ['17', 17], [0, 1], [-3, 1], [2147483648, 1], [4294967298, 2]]) {
    expect(normalizeSeedEdit(input)).toBe(expected);
  }
});

test('gradient migration preserves paired colors and returns original indices', () => {
  const input = { stops: ['a', 'b', 'c'], pos: [0.1, 0.7, 0.4], reverse: true, mix: 0.5 };
  const before = structuredClone(input);
  const { gradient, index } = normalizeGradientEdit(input, ['x', 'y']);
  expect(index).toEqual([1, 2, 0]);
  expect(gradient.stops).toEqual(['b', 'c', 'a']);
  expect(gradient.pos[0]).toBeCloseTo(0.3, 12);
  expect(gradient.pos[1]).toBeCloseTo(0.6, 12);
  expect(gradient.pos[2]).toBeCloseTo(0.9, 12);
  expect(gradient.reverse).toBe(false);
  expect(gradient.mix).toBe(0.5);
  expect(input).toEqual(before);
});

test('gradient replacement uses explicit fallback and four-decimal spacing', () => {
  const fallback = ['a', 'b', 'c', 'd'];
  const { gradient } = normalizeGradientEdit({ stops: null, pos: null }, fallback);
  expect(gradient.stops).toEqual(fallback);
  expect(gradient.stops).not.toBe(fallback);
  expect(gradient.pos).toEqual([0, 0.3333, 0.6667, 1]);
  const matching = normalizeGradientEdit({ stops: ['a', 'b'], pos: ['0.8', '0.2'] }, fallback);
  expect(matching.gradient.pos).toEqual(['0.2', '0.8']);
  expect(matching.index).toEqual([1, 0]);
});

test('selected frame ranges preserve zero-end and override precedence', () => {
  expect(selectFrameRange(8, { rangeFrom: 3, rangeTo: 0 })).toEqual({ a: 2, b: 8, full: false });
  expect(selectFrameRange(8, { rangeFrom: 3, rangeTo: 5 }, { from: '', to: null })).toEqual({ a: 2, b: 5, full: false });
  expect(selectFrameRange(8, { rangeFrom: 3, rangeTo: 5 }, { from: 1, to: 0 })).toEqual({ a: 0, b: 8, full: true });
  expect(selectFrameRange(8, { rangeFrom: 99, rangeTo: 2 })).toEqual({ a: 7, b: 8, full: false });
  expect(selectFrameRange(0, { rangeFrom: 1, rangeTo: 0 })).toEqual({ a: 0, b: 0, full: true });
});

test('crossing range edits preserve the endpoint just edited', () => {
  expect(editFrameRange(6, 2, 'from')).toEqual({ rangeFrom: 6, rangeTo: 0 });
  expect(editFrameRange(6, 2, 'to')).toEqual({ rangeFrom: 1, rangeTo: 2 });
  expect(editFrameRange(-4, -1, 'from')).toEqual({ rangeFrom: 1, rangeTo: 0 });
  expect(editFrameRange(2.9, 5.9, 'to')).toEqual({ rangeFrom: 2, rangeTo: 5 });
});
