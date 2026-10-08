import { expect, test } from 'bun:test';
import { cleanupMask, thresholdAlpha, quantizeChannels, medianCut, mapPalette, bayerDither, outlineMask } from '../src/pixel.js';
import { samplePercentile } from '../src/curves.js';

test('alpha threshold drops equality and quantization preserves alpha', () => {
  const data = new Uint8ClampedArray([63, 127, 255, 30, 64, 128, 200, 31]);
  expect([...thresholdAlpha(data, 31)]).toEqual([63, 127, 255, 0, 64, 128, 200, 0]);
  expect([...thresholdAlpha(new Uint8ClampedArray([1, 2, 3, 32]), 31)]).toEqual([1, 2, 3, 255]);
  expect([...quantizeChannels(data, 3)]).toEqual([0, 128, 255, 30, 128, 128, 255, 31]);
  expect(() => quantizeChannels(data, 1)).toThrow();
});

test('weighted palette split preserves exact centroids and ignores transparent pixels', () => {
  const pixels = new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 200, 0, 0, 0]);
  expect(medianCut(pixels, 2)).toEqual([[0, 0, 0], [0.5, 0.5, 0.5]]);
  expect(medianCut(pixels, 8)).toEqual([[0, 0, 0], [0, 0, 0], [1, 1, 1]]);
  expect(() => medianCut(pixels, 0)).toThrow();
});

test('median cut keeps empty black and selects weighted green before red', () => {
  expect(medianCut(new Uint8Array(), 2)).toEqual([[0, 0, 0]]);
  const palette = medianCut(new Uint8Array([0,192,0,255,255,0,0,255,128,224,0,255,128,64,0,255]), 2);
  const expected = [[191.5 / 255, 32 / 255, 0], [64 / 255, 208 / 255, 0]];
  expect(palette).toHaveLength(2);
  for (const color of palette) expect(color).toHaveLength(3);
  palette.forEach((color, i) => color.forEach((value, c) => expect(value).toBeCloseTo(expected[i][c], 12)));
});

test('median cut preserves first axis and first box on tied ranges', () => {
  const axis = medianCut(new Uint8Array([0,0,255,255,255,0,0,255,64,0,191,255,191,0,64,255]), 2);
  expect(axis).toHaveLength(2);
  const expected = [[32 / 255, 0, 223 / 255], [223 / 255, 0, 32 / 255]];
  for (let i = 0; i < 2; i++) {
    expect(axis[i]).toHaveLength(3);
    for (let c = 0; c < 3; c++) expect(axis[i][c]).toBeCloseTo(expected[i][c], 12);
  }
  const boxes = medianCut(new Uint8Array([0,0,0,255,64,0,0,255,128,0,0,255,192,0,0,255]), 3);
  expect(boxes).toHaveLength(3);
  for (let i = 0; i < 3; i++) {
    expect(boxes[i]).toHaveLength(3);
    expect(boxes[i][0]).toBeCloseTo([0, 64 / 255, 160 / 255][i], 12);
    expect(boxes[i].slice(1)).toEqual([0, 0]);
  }
});

test('alpha levels use ceiling steps after the inclusive threshold', () => {
  const data = new Uint8ClampedArray([1, 2, 3, 30, 4, 5, 6, 31, 7, 8, 9, 85, 10, 11, 12, 86]);
  expect([...thresholdAlpha(data, 30, 3)]).toEqual([1, 2, 3, 0, 4, 5, 6, 85, 7, 8, 9, 85, 10, 11, 12, 85]);
  expect([...thresholdAlpha(new Uint8ClampedArray([1, 2, 3, 255]), 30, 3)]).toEqual([1, 2, 3, 255]);
  expect(() => thresholdAlpha(data, 30, 0)).toThrow();
});

test('alpha-rescale fixture full vector preserves RGB and input', () => {
  const input = new Uint8ClampedArray([
    10, 20, 30, 29,
    40, 50, 60, 30,
    70, 80, 90, 31,
    100, 110, 120, 85,
    130, 140, 150, 86,
    160, 170, 180, 105,
    190, 200, 210, 106,
    220, 230, 240, 180,
    1, 2, 3, 181,
    254, 253, 252, 255,
  ]);
  const expected = new Uint8ClampedArray([
    10, 20, 30, 0,
    40, 50, 60, 0,
    70, 80, 90, 85,
    100, 110, 120, 85,
    130, 140, 150, 85,
    160, 170, 180, 85,
    190, 200, 210, 170,
    220, 230, 240, 170,
    1, 2, 3, 255,
    254, 253, 252, 255,
  ]);
  const before = [...input];
  const result = thresholdAlpha(input, 30, 3);
  expect([...result]).toEqual([...expected]);
  for (let i = 0; i < result.length; i += 4) {
    expect([result[i], result[i + 1], result[i + 2]]).toEqual([input[i], input[i + 1], input[i + 2]]);
  }
  expect([...input]).toEqual(before);
});

test('percentile uses all small samples and keeps the first 40000 for large inputs', () => {
  expect(samplePercentile([3, 1, 2], 0.5, () => { throw Error('unexpected RNG'); })).toBe(2);
  expect(samplePercentile(Array.from({ length: 10 }, (_, i) => i), 0.9, () => { throw Error('unexpected RNG'); })).toBe(9);
  let draws = 0;
  expect(samplePercentile(Array.from({ length: 40001 }, (_, i) => i), 0.5, () => { draws++; return 0.5; })).toBe(20000);
  expect(draws).toBe(1);
});

test('append probability boundary decides with a single draw at percentile 0', () => {
  const values = [...Array(40000).fill(1), 0];
  let draws = 0;
  expect(samplePercentile(values, 0, () => { draws++; return 0.099; })).toBe(0);
  expect(draws).toBe(1);
  draws = 0;
  expect(samplePercentile(values, 0, () => { draws++; return 0.1; })).toBe(1);
  expect(draws).toBe(1);
});

test('accepted candidates append instead of replacing the preserved prefix', () => {
  let draws = 0;
  expect(samplePercentile(Array.from({ length: 40002 }, (_, i) => i), 0.5, () => { draws++; return 0; })).toBe(20001);
  expect(draws).toBe(2);
  expect(samplePercentile(Array.from({ length: 40002 }, (_, i) => i), 0, () => 0)).toBe(0);
});

test('palette mapping picks nearest RGB while preserving surviving alpha', () => {
  const source = new Uint8ClampedArray([240, 10, 0, 77, 0, 230, 20, 9]);
  expect([...mapPalette(source, [[1, 0, 0], [0, 1, 0]], 10)]).toEqual([255, 0, 0, 77, 0, 230, 20, 0]);
  expect(() => mapPalette(source, [])).toThrow();
});

test('weighted palette distance prefers red 0.6 over green 0.5 for black source', () => {
  const black = new Uint8ClampedArray([0, 0, 0, 255]);
  expect([...mapPalette(black, [[0, 0.5, 0], [0.6, 0, 0]])]).toEqual([153, 0, 0, 255]);
});

test('exact weighted distance tie keeps the first palette entry', () => {
  // Dyadic values on a black source: 4*(1/2)^2 and 4*(1/4)^2+3*(1/2)^2 both equal 1 exactly.
  const black = new Uint8ClampedArray([0, 0, 0, 255]);
  expect([...mapPalette(black, [[0, 0.5, 0], [0, 0.25, 0.5]])]).toEqual([0, 128, 0, 255]);
  expect([...mapPalette(black, [[0, 0.25, 0.5], [0, 0.5, 0]])]).toEqual([0, 64, 128, 255]);
});

test('Bayer phase changes quantization and outlines detect adjacent empty pixels', () => {
  const input = new Uint8ClampedArray(4 * 4);
  for (let i = 0; i < 4; i++) { input[i * 4 + 3] = 255; input[i * 4] = 128; input[i * 4 + 1] = 128; input[i * 4 + 2] = 128; }
  const a = bayerDither(input, 4, 1, 2, 0, 0), b = bayerDither(input, 4, 1, 2, 1, 0);
  expect([...a.slice(0, 16)]).not.toEqual([...b.slice(0, 16)]);
  const mask = new Uint8Array([1, 0, 0, 1]);
  expect(outlineMask(mask, 2, 2, 4).outer[1]).toBe(1);
  expect(outlineMask(mask, 2, 2, 8).outer[1]).toBe(1);
  expect(outlineMask(mask, 2, 2, 4).inner[0]).toBe(1);
});

test('inner outlines treat outside the image as empty', () => {
  for (const connectivity of [4, 8]) {
    const filled = outlineMask(new Uint8Array(9).fill(1), 3, 3, connectivity);
    expect([...filled.inner]).toEqual([1, 1, 1, 1, 0, 1, 1, 1, 1]);
    expect([...filled.outer]).toEqual(Array(9).fill(0));
    const one = outlineMask(new Uint8Array([1]), 1, 1, connectivity);
    expect([...one.inner]).toEqual([1]);
    expect([...one.outer]).toEqual([0]);
    const empty = outlineMask(new Uint8Array([0]), 1, 1, connectivity);
    expect([...empty.inner]).toEqual([0]);
    expect([...empty.outer]).toEqual([0]);
  }
});

test('diagonal foreground is one eight-connected island', () => {
  const alpha = new Float32Array([1, 0, 0, 1]);
  cleanupMask(alpha, new Float32Array(12), 2, 2, 2);
  expect([...alpha]).toEqual([1, 0, 0, 1]);
  cleanupMask(alpha, new Float32Array(12), 2, 2, 3);
  expect([...alpha]).toEqual([0, 0, 0, 0]);
});

test('enclosed four-connected hole fills but diagonal boundary opening does not join it', () => {
  const alpha = new Float32Array([0, 1, 1, 1, 0, 1, 1, 1, 1]);
  const colors = new Float32Array(27).fill(0.5);
  cleanupMask(alpha, colors, 3, 3, 2, true);
  expect(alpha[0]).toBe(0);
  expect(alpha[4]).toBe(1);
  expect([...colors.slice(12, 15)]).toEqual([0.5, 0.5, 0.5]);
});

test('cleanup threshold is strict and filling is optional', () => {
  const alpha = new Float32Array([1, 1, 1, 1, 0, 1, 1, 1, 1]);
  cleanupMask(alpha, new Float32Array(27), 3, 3, 2, false);
  expect(alpha[4]).toBe(0);
  expect(() => cleanupMask(alpha, new Float32Array(3), 3, 3, 2)).toThrow();
});
