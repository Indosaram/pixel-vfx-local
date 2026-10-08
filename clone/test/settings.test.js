import { expect, test } from 'bun:test';
import { normalizeSettings, normalizeRange } from '../src/settings.js';
import { clampHold } from '../src/timing.js';

test('settings hold coercion agrees with timing across signed integer boundaries', () => {
  const holds = [4294967297, 2147483648, 2.9];
  const normalized = normalizeSettings({ holds }, { defaults: { holds: [] } }).holds;
  expect(normalized).toEqual([1, 0, 2]);
  expect(normalized).toEqual(holds.map(clampHold));
  expect(normalizeSettings({ holds: [4294967296, 2147483648] }, { defaults: { holds: [] } }).holds).toEqual([1, 0]);
});

test('nested normalization preserves siblings and never mutates inputs', () => {
  const defaults = { pixel: { alpha: 2, outline: 'outer' }, seed: 1 };
  const input = { pixel: { alpha: 4 }, seed: 42.9 };
  expect(normalizeSettings(input, { defaults })).toEqual({ pixel: { alpha: 4, outline: 'outer' }, seed: 42 });
  expect(defaults.pixel.alpha).toBe(2);
  expect(input.seed).toBe(42.9);
});
test('unknown and malformed fields fail at the boundary', () => {
  for (const input of [{ other: 3 }, { seed: NaN }, { seed: '3' }, JSON.parse('{"__proto__":{}}')]) {
    try { normalizeSettings(input, { defaults: { seed: 1 } }); throw new Error('accepted invalid settings'); }
    catch (error) { expect(error.code).toBe('INVALID_SETTINGS'); }
  }
});
test('holds clamp and all-zero playback keeps one frame', () => {
  expect(normalizeSettings({ holds: [-2, 10, 2.9] }, { defaults: { holds: [] } }).holds).toEqual([0, 8, 2]);
  expect(normalizeSettings({ holds: [0, 0] }, { defaults: { holds: [] } }).holds).toEqual([1, 0]);
});
test('clone gradient migration mirrors and sorts color stops', () => {
  const gradient = { reverse: true, stops: [{ position: 0.2, color: 'red' }, { position: 0.9, color: 'blue' }] };
  const result = normalizeSettings({ gradient }, { defaults: { gradient: { reverse: false, stops: [] } } });
  expect(result.gradient.reverse).toBe(false);
  expect(result.gradient.stops.map(stop => stop.color)).toEqual(['blue', 'red']);
  expect(result.gradient.stops[0].position).toBeCloseTo(0.1);
  expect(result.gradient.stops[1].position).toBeCloseTo(0.8);
  expect(gradient.reverse).toBe(true);
});
test('inclusive frame ranges clamp with explicit empty behavior', () => {
  expect(normalizeRange([-3, 99], 8)).toEqual([1, 8]);
  expect(normalizeRange([6, 2], 8)).toEqual([6, 6]);
  expect(normalizeRange([1, 3], 0)).toEqual([0, 0]);
});
