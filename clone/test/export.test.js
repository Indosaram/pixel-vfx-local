import { describe, expect, test } from 'bun:test';
import { metadataManifest } from '../src/export.js';

// Frames are opaque to this increment: only their count is metadata.
function frames(count) {
  return Array.from({ length: count }, (_, index) => ({ index }));
}

function request(overrides = {}) {
  return {
    w: 4,
    h: 4,
    fps: 8,
    frames: frames(3),
    holds: [1, 2, 0],
    loop: false,
    origin: { x: 2, y: 3 },
    ...overrides,
  };
}

function caught(fn) {
  try {
    fn();
    return undefined;
  } catch (error) {
    return error;
  }
}

function expectRejected(fn) {
  const error = caught(fn);
  expect(error).toBeDefined();
  expect(error.code).toBe('INVALID_EXPORT');
  expect(error.stage).toBe('export');
  expect(typeof error.message).toBe('string');
  expect(typeof error.context).toBe('object');
  return error;
}

describe('U11 bounded export metadata manifest (pure data, no encoding)', () => {
  test('evidenced manifest carries dimensions, frame count, fps, holds and duration (report sections 7 and 9)', () => {
    const manifest = metadataManifest(request());
    expect(manifest.w).toBe(4);
    expect(manifest.h).toBe(4);
    expect(manifest.frameCount).toBe(3);
    expect(manifest.fps).toBe(8);
    expect(manifest.holds).toEqual([1, 2, 0]);
    expect(manifest.duration).toBe(0.375);
    expect(manifest.loop).toBe(false);
    expect(manifest.origin).toEqual({ x: 2, y: 3 });
    expect(manifest.frames).toEqual([
      { index: 0, hold: 1, duration: 0.125 },
      { index: 1, hold: 2, duration: 0.25 },
      { index: 2, hold: 0, duration: 0 },
    ]);
  });

  test('evidenced holds are integers 0-8; fractional, negative and above-8 holds are rejected (report section 7)', () => {
    expect(metadataManifest(request({ holds: [0, 8, 3] })).holds).toEqual([0, 8, 3]);
    expectRejected(() => metadataManifest(request({ holds: [9, 1, 1] })));
    expectRejected(() => metadataManifest(request({ holds: [-1, 1, 1] })));
    expectRejected(() => metadataManifest(request({ holds: [1.5, 1, 1] })));
  });

  test('inconsistent frames/holds arrays are rejected with both counts in context', () => {
    const error = expectRejected(() => metadataManifest(request({ holds: [1, 2] })));
    expect(error.context).toEqual({ frameCount: 3, holdCount: 2 });
    expectRejected(() => metadataManifest(request({ holds: '120' })));
    expectRejected(() => metadataManifest(request({ frames: undefined })));
    expectRejected(() => metadataManifest(request({ holds: [, 1, 1] })));
  });

  test('dimensions must be positive integers', () => {
    expectRejected(() => metadataManifest(request({ w: 0 })));
    expectRejected(() => metadataManifest(request({ h: -4 })));
    expectRejected(() => metadataManifest(request({ w: 4.5 })));
    expectRejected(() => metadataManifest(request({ h: '4' })));
  });

  test('fps must be a positive finite number', () => {
    expectRejected(() => metadataManifest(request({ fps: 0 })));
    expectRejected(() => metadataManifest(request({ fps: -8 })));
    expectRejected(() => metadataManifest(request({ fps: Number.NaN })));
    expectRejected(() => metadataManifest(request({ fps: Number.POSITIVE_INFINITY })));
    expectRejected(() => metadataManifest(request({ fps: '8' })));
  });

  test('duration is sum(holds)/fps; all-zero holds stay zero-duration (clone-owned acceptance)', () => {
    const manifest = metadataManifest(request({ fps: 4, holds: [1, 3, 0] }));
    expect(manifest.duration).toBe(1);
    expect(manifest.frames.map(frame => frame.duration)).toEqual([0.25, 0.75, 0]);
    const allZero = metadataManifest(request({ fps: 4, holds: [0, 0, 0] }));
    expect(allZero.duration).toBe(0);
  });

  test('clone-owned required API shape: boolean loop and finite origin must be supplied', () => {
    const withoutLoop = request();
    delete withoutLoop.loop;
    expectRejected(() => metadataManifest(withoutLoop));
    expectRejected(() => metadataManifest(request({ loop: 'yes' })));
    const withoutOrigin = request();
    delete withoutOrigin.origin;
    expectRejected(() => metadataManifest(withoutOrigin));
    expectRejected(() => metadataManifest(request({ origin: { x: Number.NaN, y: 0 } })));
    expectRejected(() => metadataManifest(request({ origin: { x: 1 } })));
  });

  test('clone-owned meta defaults to an empty object and passes through; non-object meta is rejected', () => {
    expect(metadataManifest(request()).meta).toEqual({});
    expect(metadataManifest(request({ meta: { name: 'slash' } })).meta).toEqual({ name: 'slash' });
    expectRejected(() => metadataManifest(request({ meta: [] })));
    expectRejected(() => metadataManifest(request({ meta: null })));
  });

  test('clone-owned empty boundary: empty frames with empty holds is a zero-count manifest', () => {
    const manifest = metadataManifest(request({ frames: [], holds: [] }));
    expect(manifest.frameCount).toBe(0);
    expect(manifest.holds).toEqual([]);
    expect(manifest.frames).toEqual([]);
    expect(manifest.duration).toBe(0);
  });

  test('non-object requests are rejected with the structured boundary error', () => {
    expectRejected(() => metadataManifest(null));
    expectRejected(() => metadataManifest(undefined));
    expectRejected(() => metadataManifest([]));
  });
});
