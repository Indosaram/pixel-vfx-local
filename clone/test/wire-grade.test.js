import { expect, test } from 'bun:test';
import { Matrix3 } from 'three';
import { gradeMatrix, colorHS } from '../src/wire-grade.js';

test('grade defaults to a matrix and preserves supplied target identity', () => {
  expect(gradeMatrix(0, 1).elements).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  const target = new Matrix3();
  expect(gradeMatrix(0, 0, target)).toBe(target);
  const expected = [0.213, 0.213, 0.213, 0.715, 0.715, 0.715, 0.072, 0.072, 0.072];
  target.elements.forEach((v, i) => expect(v).toBeCloseTo(expected[i], 12));
});

test('quarter-turn hue uses degree input and Three column-major storage', () => {
  const expected = [0, 0.356, -0.574, 0, 0.855, 1.43, 1, -0.211, 0.144];
  gradeMatrix(90, 1).elements.forEach((v, i) => expect(v).toBeCloseTo(expected[i], 12));
});

test('combined hue and saturation multiply saturation after hue', () => {
  const expected = [0.106606, 0.284606, -0.180394, 0.3571425, 0.7846425,
    1.0721425, 0.5362515, -0.0692485, 0.1082515];
  gradeMatrix(90, 0.5).elements.forEach((v, i) => expect(v).toBeCloseTo(expected[i], 12));
});

test('color hue and HSL saturation cover grayscale, sectors and lightness branches', () => {
  for (const [input, expected] of [
    ['#808080', [0, 0]], ['#ff0000', [0, 1]], ['#00ff00', [120, 1]],
    ['#0000ff', [240, 1]], ['#ff00ff', [300, 1]], ['#ffff00', [60, 1]],
    [{ r: 0.75, g: 0.5, b: 0.25 }, [30, 0.5]],
    [{ r: 0.9, g: 0.7, b: 0.5 }, [30, 2 / 3]],
    [{ r: 0.25, g: 0.75, b: 0.5 }, [150, 0.5]],
    [{ r: 0.5, g: 0.25, b: 0.75 }, [270, 0.5]],
  ]) {
    const result = colorHS(input);
    expect(result.length).toBe(2);
    result.forEach((v, i) => expect(v).toBeCloseTo(expected[i], 12));
  }
});
