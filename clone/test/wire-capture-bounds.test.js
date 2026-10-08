import { expect, test } from 'bun:test';
import { accumulateBounds, frameBounds } from '../src/wire-capture-bounds.js';

const empty = () => ({ x0: 1e9, x1: -1e9, y0: 1e9, y1: -1e9 });
const options = () => ({ size: 16, srcRes: 64, aspect: 'auto', padding: 0, framing: 'auto' });

test('coverage excludes alpha thirty and includes blue-only alpha thirty-one', () => {
  const black = new Uint8Array(256 * 256 * 4);
  const white = new Uint8Array(black.length).fill(255);
  white.set([225, 225, 225, 0], (3 * 256 + 2) * 4);
  white.set([255, 255, 224, 255], (9 * 256 + 7) * 4);
  const bounds = empty();
  accumulateBounds(bounds, black, white);
  expect(bounds).toEqual({ x0: 7, x1: 7, y0: 9, y1: 9 });
});

test('empty coverage does not construct a camera box', () => {
  expect(frameBounds(empty(), options())).toBeNull();
});

test('coverage retains all extrema across frames including a trailing empty frame', () => {
  const bounds = empty(), black = new Uint8Array(256 * 256 * 4);
  for (const points of [[[2, 9], [20, 3]], [[1, 8], [12, 30]], []]) {
    const white = new Uint8Array(black.length).fill(255);
    for (const [x, y] of points) white.set([0, 0, 0, 255], (y * 256 + x) * 4);
    accumulateBounds(bounds, black, white);
  }
  expect(bounds).toEqual({ x0: 1, x1: 20, y0: 3, y1: 30 });
});

test('rectangular auto framing divides per-cell extents but square aspect does not', () => {
  const bounds = { x0: 128, x1: 143, y0: 128, y1: 135 };
  const rect = frameBounds(bounds, options());
  expect([rect.left, rect.right, rect.bottom, rect.top]).toEqual([-0.25, 2.25, -0.125, 1.125]);
  expect(rect.worldPerPx).toBe(1.25 / 16);
  const square = frameBounds(bounds, { ...options(), aspect: 'square' });
  expect(square.shape).toEqual([1, 1]);
  expect(square.worldPerPx).toBe(2.25 / 16);
});

test('search scale and both explicit and default padding affect world extents', () => {
  const bounds = { x0: 128, x1: 128, y0: 128, y1: 128 };
  const padded = frameBounds(bounds, { ...options(), searchHalf: 8, padding: 0.5 });
  expect([padded.left, padded.right, padded.bottom, padded.top]).toEqual([-0.15625, 0.21875, -0.15625, 0.21875]);
  const defaults = frameBounds(bounds, { ...options(), padding: undefined });
  expect(defaults.worldPerPx).toBeCloseTo(0.42 / 16, 12);
  expect(frameBounds(bounds, { ...options(), size: 96, srcRes: 0 }).k).toBe(4);
});

test('one covered pixel expands asymmetrically then centers the final camera', () => {
  const r = frameBounds({ x0: 128, x1: 128, y0: 128, y1: 128 }, options());
  expect(r).toEqual({ left: -0.125, right: 0.25, bottom: -0.125, top: 0.25,
    shape: [1, 1], k: 4, width: 64, height: 64,
    origin: [1 / 3, 2 / 3], worldPerPx: 0.375 / 16 });
});

test('strict aspect thresholds and transpose select distinct canvas shapes', () => {
  for (const [dx, dy, shape] of [[14, 7, [1, 1]], [15, 7, [2, 1]], [7, 14, [1, 1]], [7, 15, [1, 2]]]) {
    const r = frameBounds({ x0: 128, x1: 128 + dx, y0: 128, y1: 128 + dy }, options());
    expect(r.shape).toEqual(shape);
    expect([r.width, r.height]).toEqual([64 * shape[0], 64 * shape[1]]);
  }
});

test('fixed framing and origin centering use final bounds for normalized origin', () => {
  const r = frameBounds({ x0: 150, x1: 165, y0: 130, y1: 137 },
    { ...options(), framing: 'fixed', worldPerPx: 0.25, center: 'origin' });
  expect([r.left, r.right, r.bottom, r.top]).toEqual([-4, 4, -2, 2]);
  expect(r.origin).toEqual([0.5, 0.5]);
  expect(r.worldPerPx).toBe(0.25);
});

test('source resolution rounds then clamps and zero falls back to 384', () => {
  for (const [srcRes, k] of [[1, 2], [39, 2], [40, 3], [1000, 8], [0, 8]]) {
    expect(frameBounds({ x0: 128, x1: 128, y0: 128, y1: 128 }, { ...options(), srcRes }).k).toBe(k);
  }
});
