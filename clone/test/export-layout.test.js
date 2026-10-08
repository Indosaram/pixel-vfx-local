import { describe, expect, test } from 'bun:test';
import { layoutSheet } from '../src/export/sheet-layout.js';
import { normalizeRange } from '../src/settings.js';
import { applyHolds } from '../src/timing.js';
import layoutFixtures from '../spec/fixtures/sheet-layout.json';

for (const fixture of layoutFixtures.cases) {
  test(`audited layout: ${fixture.id}`, () => {
    const result = layoutSheet({ w: fixture.w, h: fixture.h, count: fixture.count, columns: fixture.columns });
    expect([result.columns, result.rows]).toEqual([fixture.expectedColumns, fixture.expectedRows]);
    expect(result.sheet).toEqual({ w: fixture.w * fixture.expectedColumns, h: fixture.h * fixture.expectedRows });
  });
}

function caught(fn) {
  try {
    fn();
    return null;
  } catch (error) {
    return error;
  }
}

function expectRejected(fn) {
  const error = caught(fn);
  expect(error).not.toBeNull();
  expect(error.code).toBe('INVALID_SHEET_LAYOUT');
  expect(error.stage).toBe('export');
  expect(typeof error.message).toBe('string');
  expect(error.message.length).toBeGreaterThan(0);
  expect(typeof error.context).toBe('object');
  expect(error.context).not.toBeNull();
  return error;
}

// Independent overlap predicate written against the literal expectations.
function overlaps(a, b) {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

describe('U11 bounded sheet layout (pure calculation, no encoding)', () => {
  test('three non-square 5x3 frames in 2 columns match hand-authored literal rectangles', () => {
    const result = layoutSheet({ w: 5, h: 3, count: 3, columns: 2 });
    expect(result.columns).toBe(2);
    expect(result.rows).toBe(2);
    expect(result.sheet).toEqual({ w: 10, h: 6 });
    expect(result.rects).toEqual([
      { index: 0, x: 0, y: 0, w: 5, h: 3 },
      { index: 1, x: 5, y: 0, w: 5, h: 3 },
      { index: 2, x: 0, y: 3, w: 5, h: 3 },
    ]);
    for (let i = 0; i < result.rects.length; i += 1) {
      for (let j = i + 1; j < result.rects.length; j += 1) {
        expect(overlaps(result.rects[i], result.rects[j])).toBe(false);
      }
    }
  });

  test('a single frame occupies a 1x1 grid', () => {
    const result = layoutSheet({ w: 7, h: 4, count: 1 });
    expect(result.columns).toBe(1);
    expect(result.rows).toBe(1);
    expect(result.sheet).toEqual({ w: 7, h: 4 });
    expect(result.rects).toEqual([{ index: 0, x: 0, y: 0, w: 7, h: 4 }]);
  });

  test('incomplete last row holds only the remaining frames, no phantom rectangles', () => {
    const result = layoutSheet({ w: 2, h: 2, count: 5, columns: 3 });
    expect(result.columns).toBe(3);
    expect(result.rows).toBe(2);
    expect(result.sheet).toEqual({ w: 6, h: 4 });
    expect(result.rects).toEqual([
      { index: 0, x: 0, y: 0, w: 2, h: 2 },
      { index: 1, x: 2, y: 0, w: 2, h: 2 },
      { index: 2, x: 4, y: 0, w: 2, h: 2 },
      { index: 3, x: 0, y: 2, w: 2, h: 2 },
      { index: 4, x: 2, y: 2, w: 2, h: 2 },
    ]);
    expect(result.rects.length).toBe(5);
  });

  test('columns greater than count clamp to count', () => {
    const result = layoutSheet({ w: 3, h: 3, count: 2, columns: 8 });
    expect(result.columns).toBe(2);
    expect(result.rows).toBe(1);
    expect(result.sheet).toEqual({ w: 6, h: 3 });
    expect(result.rects).toEqual([
      { index: 0, x: 0, y: 0, w: 3, h: 3 },
      { index: 1, x: 3, y: 0, w: 3, h: 3 },
    ]);
  });

  test('automatic grid prefers exact fits and wide ties', () => {
    expect(layoutSheet({ w: 1, h: 1, count: 1 }).columns).toBe(1);
    expect(layoutSheet({ w: 1, h: 1, count: 2 }).columns).toBe(2);
    expect(layoutSheet({ w: 1, h: 1, count: 3 }).columns).toBe(2);
    expect(layoutSheet({ w: 1, h: 1, count: 4 }).columns).toBe(2);
    const ten = layoutSheet({ w: 1, h: 1, count: 10 });
    expect(ten.columns).toBe(4);
    expect(ten.rows).toBe(3);
    expect(ten.sheet).toEqual({ w: 4, h: 3 });
    expect(ten.rects[9]).toEqual({ index: 9, x: 1, y: 2, w: 1, h: 1 });
  });

  test('empty export (count 0) is rejected: documented clone-owned empty-boundary decision', () => {
    const error = expectRejected(() => layoutSheet({ w: 4, h: 4, count: 0 }));
    expect(error.context).toEqual({ count: 0 });
  });

  test('invalid dimensions, count and columns are rejected with structured context', () => {
    expectRejected(() => layoutSheet({ w: 0, h: 3, count: 1 }));
    expectRejected(() => layoutSheet({ w: -4, h: 3, count: 1 }));
    expectRejected(() => layoutSheet({ w: 4.5, h: 3, count: 1 }));
    expectRejected(() => layoutSheet({ w: '4', h: 3, count: 1 }));
    expectRejected(() => layoutSheet({ w: 4, h: 0, count: 1 }));
    expectRejected(() => layoutSheet({ w: 4, h: -2, count: 1 }));
    expectRejected(() => layoutSheet({ w: 4, h: 3.5, count: 1 }));
    expectRejected(() => layoutSheet({ w: 4, h: 3, count: -1 }));
    expectRejected(() => layoutSheet({ w: 4, h: 3, count: 1.5 }));
    expectRejected(() => layoutSheet({ w: 4, h: 3, count: '3' }));
    expectRejected(() => layoutSheet({ w: 4, h: 3, count: Number.NaN }));
    expectRejected(() => layoutSheet({ w: 4, h: 3, count: 1, columns: 0 }));
    expectRejected(() => layoutSheet({ w: 4, h: 3, count: 1, columns: -2 }));
    expectRejected(() => layoutSheet({ w: 4, h: 3, count: 1, columns: 1.5 }));
    expectRejected(() => layoutSheet({ w: 4, h: 3, count: 1, columns: '2' }));
    expectRejected(() => layoutSheet({ w: 4, h: 3, count: 1, columns: Number.NaN }));
    expectRejected(() => layoutSheet({ w: 4, h: 3, count: 1, columns: null }));
  });

  test('non-object requests are rejected with the structured boundary error', () => {
    expectRejected(() => layoutSheet(null));
    expectRejected(() => layoutSheet(undefined));
    expectRejected(() => layoutSheet([]));
    expectRejected(() => layoutSheet('sheet'));
  });

  test('integration: inclusive 1-based range selection then hold dropping feeds layout', () => {
    const frames = ['f0', 'f1', 'f2', 'f3', 'f4', 'f5'];
    const holds = [1, 1, 0, 2, 1, 1];

    // Range selection first: the UI range is inclusive and 1-based (report section 9).
    const range = normalizeRange([2, 5], frames.length);
    expect(range).toEqual([2, 5]);
    const selectedFrames = frames.slice(range[0] - 1, range[1]);
    const selectedHolds = holds.slice(range[0] - 1, range[1]);
    expect(selectedFrames).toEqual(['f1', 'f2', 'f3', 'f4']);
    expect(selectedHolds).toEqual([1, 0, 2, 1]);

    // Then hold dropping: hold 0 removes the frame (report section 7).
    const kept = applyHolds(selectedFrames, selectedHolds);
    expect(kept.frames).toEqual(['f1', 'f3', 'f4']);
    expect(kept.holds).toEqual([1, 2, 1]);

    const result = layoutSheet({ w: 5, h: 3, count: kept.frames.length, columns: 2 });
    expect(result.columns).toBe(2);
    expect(result.rows).toBe(2);
    expect(result.sheet).toEqual({ w: 10, h: 6 });
    expect(result.rects).toEqual([
      { index: 0, x: 0, y: 0, w: 5, h: 3 },
      { index: 1, x: 5, y: 0, w: 5, h: 3 },
      { index: 2, x: 0, y: 3, w: 5, h: 3 },
    ]);
  });

  test('integration: out-of-range endpoints clamp through normalizeRange before layout', () => {
    const frames = ['f0', 'f1', 'f2'];
    const range = normalizeRange([0, 99], frames.length);
    expect(range).toEqual([1, 3]);
    const selected = frames.slice(range[0] - 1, range[1]);
    expect(selected).toEqual(frames);
    const result = layoutSheet({ w: 6, h: 2, count: selected.length });
    expect(result.columns).toBe(1);
    expect(result.rows).toBe(3);
    expect(result.sheet).toEqual({ w: 6, h: 6 });
    expect(result.rects).toEqual([
      { index: 0, x: 0, y: 0, w: 6, h: 2 },
      { index: 1, x: 0, y: 2, w: 6, h: 2 },
      { index: 2, x: 0, y: 4, w: 6, h: 2 },
    ]);
  });
});
