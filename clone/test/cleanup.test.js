import { expect, test } from 'bun:test';
import { cleanupMask } from '../src/pixel.js';
import input from '../spec/fixtures/p01-input.json';
import expected from '../spec/fixtures/p01-expected.json';

input.cleanupCases.forEach((fixture, index) => {
  test(`cleanup connectivity and strict size case ${index}`, () => {
    const mask = input.masks[fixture.mask];
    const alpha = new Float32Array(mask.alpha);
    cleanupMask(alpha, new Float32Array(mask.w * mask.h * 3), mask.w, mask.h, fixture.threshold, fixture.fillHoles);
    expect([...alpha]).toEqual(expected.expectations.cleanupMasks[index]);
  });
});

test('cleanup skips NaN and preserves holes at exact threshold size', () => {
  const alpha = new Float32Array(25).fill(1);
  for (const i of [6, 7, 11]) alpha[i] = 0;
  const colors = new Float32Array(75);
  cleanupMask(alpha, colors, 5, 5, NaN, true);
  expect([alpha[6], alpha[7], alpha[11]]).toEqual([0, 0, 0]);
  cleanupMask(alpha, colors, 5, 5, 3, true);
  expect([alpha[6], alpha[7], alpha[11]]).toEqual([0, 0, 0]);
});

test('foreground removal occurs before enclosed hole discovery', () => {
  const alpha = new Float32Array([1, 1, 1, 1, 0, 1, 1, 1, 1]);
  cleanupMask(alpha, new Float32Array(27), 3, 3, 9, true);
  expect([...alpha]).toEqual(Array(9).fill(0));
});

test('hole averages count repeated solid adjacencies', () => {
  const fixture = input.weightedHole;
  const oracle = expected.expectations.weightedHole;
  const alpha = new Float32Array(fixture.w * fixture.h).fill(fixture.defaultAlpha);
  const colors = new Float32Array(alpha.length * 3);
  for (let i = 0; i < alpha.length; i++) colors.set(fixture.defaultRGB, i * 3);
  for (const i of fixture.holeIndexes) alpha[i] = fixture.holeAlpha;
  for (const item of fixture.overrides) {
    alpha[item.index] = item.alpha;
    colors.set(item.rgb, item.index * 3);
  }
  cleanupMask(alpha, colors, fixture.w, fixture.h, fixture.threshold, fixture.fillHoles);
  for (const i of oracle.filledIndexes) {
    expect(alpha[i]).toBe(oracle.filledAlpha);
    expect([...colors.slice(i * 3, i * 3 + 3)]).toEqual(oracle.filledRGB);
  }
  expect(alpha[12]).toBe(0.5);
  expect([...colors.slice(36, 39)]).toEqual([1, 0, 0]);
});
