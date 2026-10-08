import { expect, test } from 'bun:test';
import { reconstructFrame } from '../src/wire-capture-pixels.js';

test('uses maximum channel opacity and ignores framebuffer alpha', () => {
  // Channel opacities are 105, 155, 55. Straight half-color = h * 255 / 155.
  const black = new Uint8Array([10, 20, 30, 0]);
  const white = new Uint8Array([160, 120, 230, 255]);
  const half = new Uint8Array([31, 62, 93, 0]);
  const result = reconstructFrame(1, 1, black, white, half);
  expect(result.w).toBe(1);
  expect(result.h).toBe(1);
  expect(result.data).toBeInstanceOf(Uint8ClampedArray);
  expect(Array.from(result.data)).toEqual([51, 102, 153, 155]);
  expect(Array.from(black)).toEqual([10, 20, 30, 0]);
});

test('converts bottom-left readback rows to top-left without reversing columns', () => {
  const black = new Uint8Array(16);
  const white = new Uint8Array(16);
  const half = new Uint8Array([
    10, 20, 30, 0, 40, 50, 60, 0,
    70, 80, 90, 0, 100, 110, 120, 0,
  ]);
  expect(Array.from(reconstructFrame(2, 2, black, white, half).data)).toEqual([
    70, 80, 90, 255, 100, 110, 120, 255,
    10, 20, 30, 255, 40, 50, 60, 255,
  ]);
});

test('transparent pixels remain zero despite nonzero half-black samples', () => {
  expect(Array.from(reconstructFrame(1, 1,
    new Uint8Array([0, 0, 0, 255]), new Uint8Array([255, 255, 255, 0]),
    new Uint8Array([99, 77, 55, 255])).data)).toEqual([0, 0, 0, 0]);
});

test('blue alone can determine maximum opacity', () => {
  const result = reconstructFrame(1, 1,
    new Uint8Array([10, 20, 30, 0]), new Uint8Array([160, 220, 130, 255]),
    new Uint8Array([31, 62, 93, 0]));
  expect(Array.from(result.data)).toEqual([51, 102, 153, 155]);
});

test('clamps reconstructed alpha and uses clamped-array ties-to-even RGB rounding', () => {
  const opaque = reconstructFrame(1, 1, new Uint8Array([200, 0, 0, 0]),
    new Uint8Array([0, 0, 0, 0]), new Uint8Array([200, 30, 40, 0]));
  expect(Array.from(opaque.data)).toEqual([200, 30, 40, 255]);
  // Alpha 102: 1*255/102=2.5 -> 2; 3*255/102=7.5 -> 8.
  const rounded = reconstructFrame(1, 1, new Uint8Array(4),
    new Uint8Array([153, 153, 153, 0]), new Uint8Array([1, 3, 200, 0]));
  expect(Array.from(rounded.data)).toEqual([2, 8, 255, 102]);
});
