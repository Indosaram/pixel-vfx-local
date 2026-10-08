import { describe, expect, test } from 'bun:test';
import { makeRng, createRandomStream, scalar, color } from '../src/curves.js';

test('two consumers share one effect stream and reset replays its sequence', () => {
  const stream = createRandomStream(1);
  const emitterA = () => scalar({ type: 'r', min: 0, max: 1 }, 0, stream.next());
  const emitterB = () => scalar({ type: 'r', min: 0, max: 1 }, 0, stream.next());
  expect(emitterA()).toBe(16806 / 2147483646);
  expect(emitterB()).toBe(282475248 / 2147483646);
  expect(stream.draws).toBe(2);
  stream.reset();
  expect(stream.draws).toBe(0);
  expect(emitterB()).toBe(16806 / 2147483646);
  stream.reset(2);
  expect(emitterA()).toBe(33613 / 2147483646);
});

test('seed 42 matches frozen fixture fractions and draw counts', () => {
  const stream = createRandomStream(42);
  expect(stream.next()).toBe(705893 / 2147483646);
  expect(stream.next()).toBe(1126542222 / 2147483646);
  expect(stream.draws).toBe(2);
  while (stream.draws < 38) stream.next();
  expect(stream.next()).toBe(1339106790 / 2147483646);
  expect(stream.next()).toBe(739215776 / 2147483646);
  expect(stream.draws).toBe(40);
  stream.reset(42);
  expect(stream.draws).toBe(0);
  expect(stream.next()).toBe(705893 / 2147483646);
});

test('seed 2147483647 yields zero state and a negative fraction', () => {
  expect(makeRng(2147483647)()).toBe(0);
  const stream = createRandomStream(2147483647);
  const fraction = stream.next();
  expect(fraction).toBe(-1 / 2147483646);
  expect(fraction).toBeLessThan(0);
  expect(stream.draws).toBe(1);
});

test('color constants and ranges return independent RGBA values', () => {
  const input = { type: 'c', value: [1, 0, 0, 0.5] };
  const result = color(input, 0, 0);
  result[0] = 0;
  expect(input.value[0]).toBe(1);
  expect(color(null, 0, 0)).toEqual([1, 1, 1, 1]);
  expect(color({ type: 'r', min: [0, 0, 1, 0], max: [1, 0, 0, 1] }, 0, 0.25))
    .toEqual([0.25, 0, 0.75, 0.25]);
});

test('gradient color and alpha keys interpolate independently', () => {
  const value = { type: 'g', colors: [[0, [1, 0, 0]], [2, [0, 0, 1]]],
    alpha: [[0, 0], [1, 1]] };
  expect(color(value, 0.5, 0)).toEqual([0.75, 0, 0.25, 0.5]);
  expect(color({ ...value, fixed: true }, 0.5, 0)).toEqual([0, 0, 1, 1]);
  expect(color(value, -1, 0)).toEqual([1, 0, 0, 0]);
  expect(color(value, 3, 0)).toEqual([0, 0, 1, 1]);
});

test('ranged gradients blend separately evaluated endpoints', () => {
  const low = { colors: [[0, [0, 0, 0]]], alpha: [[0, 0]] };
  const high = { colors: [[0, [1, 0.5, 1]]], alpha: [[0, 1]] };
  expect(color({ type: 'rg', min: low, max: high }, 0.5, 0.5)).toEqual([0.5, 0.25, 0.5, 0.5]);
});

test('scalar constants and intervals use the supplied fraction', () => {
  expect(scalar({ type: 'c', value: 7 }, 0, 0)).toBe(7);
  expect(scalar({ type: 'r', min: 2, max: 6 }, 0, 0.25)).toBe(3);
  expect(scalar(null, 0, 0)).toBe(0);
  expect(scalar({ type: 'unknown' }, 0, 0)).toBe(0);
});

test('Hermite tangents use duration and asymmetric left/right indexes', () => {
  const curve = { type: 'k', keys: [[0, 0, 19, 2], [2, 2, 0, 23]] };
  expect(scalar(curve, 1, 0)).toBe(1.5);
  expect(scalar(curve, -1, 0)).toBe(0);
  expect(scalar(curve, 3, 0)).toBe(2);
  expect(scalar({ ...curve, scale: 2 }, 1, 0)).toBe(3);
});

test('ranged Hermite blends evaluated curves then scales', () => {
  expect(scalar({ type: 'rk', minKeys: [[0, 2, 0, 0]],
    maxKeys: [[0, 10, 0, 0]], scale: 2 }, 1, 0.25)).toBe(8);
});

describe('makeRng (Park-Miller: multiplier 16807, modulus 2147483647)', () => {
  test('seed 1 first integer is 16807, second is 282475249', () => {
    const rng = makeRng(1);
    expect(rng()).toBe(16807);
    expect(rng()).toBe(282475249);
  });

  test('seed 0 is equivalent to seed 1 (zero falls back to 1)', () => {
    const zero = makeRng(0);
    const one = makeRng(1);
    for (let i = 0; i < 8; i++) {
      expect(zero()).toBe(one());
    }
  });

  test('unsigned seed conversion: negative seed matches its uint32 form', () => {
    const negative = makeRng(-123456789);
    const unsigned = makeRng(4171510507); // (-123456789) >>> 0
    for (let i = 0; i < 8; i++) {
      const value = negative();
      expect(value).toBe(unsigned());
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(2147483647);
    }
  });

  test('two separately created streams keep independent state', () => {
    // Same seed, interleaved calls: each closure follows the canonical
    // seed-1 sequence (16807, 282475249, ...) - no shared state.
    const a = makeRng(1);
    const b = makeRng(1);
    expect([a(), b(), a(), b()]).toEqual([16807, 16807, 282475249, 282475249]);

    // Different seeds, interleaved calls: neither stream is perturbed by the
    // other (seed 2 solo draws are 33614 then 564950498).
    const x = makeRng(1);
    const y = makeRng(2);
    expect([x(), y(), x(), y()]).toEqual([16807, 33614, 282475249, 564950498]);
  });
});
