import { describe, expect, test } from 'bun:test';
import { applyHolds, bakeHolds, clampHold, totalTime, holdsFromMarkers, markersFromHolds, steppedHolds, recommendStep } from '../src/timing.js';
import { normalizeRange } from '../src/settings.js';
import { coverage, suggestMarkers } from '../src/timing.js';
import timingInputs from '../spec/fixtures/timing-input.json';
import timingExpected from '../spec/fixtures/timing-expected.json';

test('coverage counts partially transparent pixels rather than RGB or opacity only', () => {
  expect(coverage([{ data: new Uint8Array([255, 255, 255, 0, 0, 0, 0, 1, 0, 0, 0, 128]) }])).toEqual([2]);
});

for (const fixture of timingInputs.cases) {
  test(`source recommendation: ${fixture.id}`, () => {
    const frames = fixture.coverage.map(count => {
      const data = new Uint8Array(80);
      for (let i = 0; i < count; i++) data[i * 4 + 3] = 1;
      return { data };
    });
    expect(suggestMarkers(frames, fixture.fps, fixture.loop)).toEqual(timingExpected.cases[fixture.id].markers);
  });
}

test('recommendation preserves a tail above threshold and switches below 20 fps', () => {
  const frames = [0, 11, 20, 8, 8].map(count => {
    const data = new Uint8Array(80);
    for (let i = 0; i < count; i++) data[i * 4 + 3] = 1;
    return { data };
  });
  expect(suggestMarkers(frames, 19, false)).toEqual([{ t: 0.053, x: 3 }, { t: 0.105, x: 2 }]);
});

test('marker index rounding follows positive half ties and negative zero', () => {
  expect(holdsFromMarkers([{ t: 0.05, x: 3 }, { t: -0.01, x: 2 }], 3, 10)).toEqual([2, 3, 1]);
});

test('omitted holds preserve normal playback rather than dropping frames', () => {
  expect(applyHolds(['a', 'b'])).toEqual({ frames: ['a', 'b'], holds: [1, 1] });
  expect(bakeHolds(['a', 'b'], [])).toEqual([]);
  expect(() => bakeHolds(['a', 'b'])).toThrow();
  expect(() => totalTime([1], 0)).toThrow();
});

test('inclusive selection precedes dropping and baking holds', () => {
  const [start, end] = normalizeRange([2, 4], 4);
  const frames = ['a', 'b', 'c', 'd'].slice(start - 1, end);
  const holds = [8, 0, 3, 2].slice(start - 1, end);
  const kept = applyHolds(frames, holds);
  expect(bakeHolds(kept.frames, kept.holds)).toEqual(['c', 'c', 'c', 'd', 'd']);
});

test('markers preserve time when fps changes and unspecified holds default to one', () => {
  const markers = markersFromHolds([1, 3, 0], 10);
  expect(markers).toEqual([{ t: 0.1, x: 3 }, { t: 0.2, x: 0 }]);
  expect(holdsFromMarkers(markers, 5, 20)).toEqual([1, 1, 3, 1, 0]);
  expect(holdsFromMarkers([], 3, 10)).toEqual([1, 1, 1]);
});

test('marker boundaries and all-zero prevention are explicit', () => {
  expect(holdsFromMarkers([{ t: -1, x: 5 }, { t: 9, x: 5 }], 2, 10)).toEqual([1, 1]);
  expect(holdsFromMarkers([{ t: 0, x: 0 }, { t: 0.1, x: 0 }], 2, 10)).toEqual([1, 0]);
  expect(() => holdsFromMarkers([], 2, 0)).toThrow();
});

test('markers round to milliseconds and later colliding markers win', () => {
  expect(markersFromHolds([1, 3, 2], 12)).toEqual([{ t: 0.083, x: 3 }, { t: 0.167, x: 2 }]);
  expect(holdsFromMarkers([{ t: 0.101, x: 3 }, { t: 0.099, x: 2 }], 3, 10)).toEqual([1, 2, 1]);
  expect(holdsFromMarkers(undefined, 2, 12)).toEqual([1, 1]);
});

test('stepped holds preserve the shortened final group', () => {
  expect(steppedHolds(5, 2)).toEqual([2, 0, 2, 0, 1]);
  expect(totalTime(steppedHolds(5, 2), 10)).toBe(0.5);
  expect(steppedHolds(0, 2)).toEqual([]);
  expect(() => steppedHolds(5, 0)).toThrow();
});

test('step recommendation maps source and target rates to a bounded integer', () => {
  expect(recommendStep(12, 24, 12)).toBe(2);
  expect(recommendStep(12, 30, 24)).toBe(1);
  expect(recommendStep(12, 120, 1)).toBe(8);
  expect(() => recommendStep(12, 24, 0)).toThrow();
});

describe('clampHold', () => {
  test('signed coercion precedes clamping', () => {
    expect([Infinity, NaN, 4294967297, 2147483648].map(clampHold)).toEqual([0, 0, 1, 0]);
  });
  test('clamps -1 to 0 and 9 to 8', () => {
    expect(clampHold(-1)).toBe(0);
    expect(clampHold(9)).toBe(8);
  });

  test('in-range integers pass through unchanged', () => {
    expect(clampHold(0)).toBe(0);
    expect(clampHold(3)).toBe(3);
    expect(clampHold(8)).toBe(8);
  });

  test('fractional holds truncate toward zero', () => {
    expect(clampHold(2.9)).toBe(2);
    expect(clampHold(-0.9)).toBe(0);
  });
});

describe('applyHolds', () => {
  const frames = ['a', 'b', 'c'];
  const holds = [1, 0, 3];

  test('drops zero holds: [1,0,3] over a,b,c retains a,c', () => {
    const result = applyHolds(frames, holds);
    expect(result.frames).toEqual(['a', 'c']);
    expect(result.holds).toEqual([1, 3]);
  });

  test('nonempty input with all-zero holds keeps first frame with hold 1', () => {
    const result = applyHolds(['a', 'b', 'c'], [0, 0, 0]);
    expect(result.frames).toEqual(['a']);
    expect(result.holds).toEqual([1]);
  });

  test('empty frames return empty (clone-owned boundary)', () => {
    expect(applyHolds([], [1, 0, 3])).toEqual({ frames: [], holds: [] });
  });
});

describe('bakeHolds', () => {
  test('repeats frames by holds: [1,0,3] over a,b,c bakes a,c,c,c', () => {
    expect(bakeHolds(['a', 'b', 'c'], [1, 0, 3])).toEqual(['a', 'c', 'c', 'c']);
  });

  test('empty frames bake to empty (clone-owned boundary)', () => {
    expect(bakeHolds([], [1, 0, 3])).toEqual([]);
  });
});

describe('totalTime', () => {
  test('sum of holds over fps: (1+0+3)/20 = 0.2', () => {
    expect(totalTime([1, 0, 3], 20)).toBe(0.2);
  });
});
