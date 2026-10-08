import { expect, test } from 'bun:test';
import { validateShape } from '../src/wire-shape-validation.js';

const shape = type => ({ type, pos: { x: 0, y: 0, z: 0 },
  rot: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } });

test('branch-specific shape inputs preserve box and unsupported-code fallthroughs', () => {
  for (const value of [null, undefined, shape(5), shape(6), shape(123), shape(123.5),
    { ...shape(5), radius: Infinity }, { ...shape(11), radius: 1, arc: 90, thick: Infinity },
    { ...shape(11), radius: -2, arc: 450, len: Infinity },
    { ...shape(10), radius: 2, arc: 90, thick: 3 },
    ...[0, 1, 2, 3].map(type => ({ ...shape(type), radius: 1, thick: 0 })),
    ...[4, 7, 8, 9].map(type => ({ ...shape(type), radius: 1, thick: 1, arc: 360, angle: 30 }))]) {
    expect(validateShape(value, 'emitter.shape')).toBe(value);
  }
});

test('malformed consumed fields reject with the originating shape path', () => {
  const cases = [[], ...[undefined, '5', NaN, Infinity].map(type => shape(type)),
    { ...shape(5), rot: { x: 0, y: Infinity, z: 0 } },
    { ...shape(6), pos: null }, { ...shape(5), scale: { x: 1, y: 1 } },
    { ...shape(0), radius: 1 }, { ...shape(10), radius: 1, thick: 0 },
    { ...shape(4), radius: 1, thick: 0, arc: 90 },
    { ...shape(8), radius: 1, thick: 0, arc: 90, angle: 30, len: Infinity }];
  for (const value of cases) {
    expect(() => validateShape(value, 'emitter.shape')).toThrow();
    try { validateShape(value, 'emitter.shape'); }
    catch (error) { expect(error).toMatchObject({ code: 'INVALID_DEFINITION', stage: 'library', context: { path: 'emitter.shape' } }); }
  }
});
