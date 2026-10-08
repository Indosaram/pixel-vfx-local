import { expect, test } from 'bun:test';
import { validateModules } from '../src/wire-module-validation.js';

test('optional curve modules preserve zero defaults and comparison fallthroughs', () => {
  const emitter = { forceOL: {}, velOL: {}, sizeOL: {}, rotOL: {},
    trail: { world: 7 }, uv: { tx: 2, ty: 3, cycles: 1, type: 7, rowMode: '1' },
    custom: [] };
  expect(validateModules(emitter, 'emitters[0]')).toBe(emitter);
  expect(validateModules({}, 'emitters[0]')).toEqual({});
});

test('conditional axis and UV fields are validated only when consumed', () => {
  const emitter = { sizeOL: { y: 'unused' }, rotOL: { x: 'unused' },
    uv: { tx: 2, ty: 2, fps: 12, cycles: 'unused' } };
  expect(validateModules(emitter, 'e')).toBe(emitter);
  expect(() => validateModules({ sizeOL: { sep: true, y: { t: 'c', v: NaN } } }, 'e')).toThrow();
  expect(() => validateModules({ uv: { tx: 2, ty: 2 } }, 'e')).toThrow();
});

test('unsafe raw operands and malformed descriptors reject at field paths', () => {
  for (const [emitter, path] of [
    [{ noise: { freq: Infinity } }, 'e.noise.freq'],
    [{ clamp: {} }, 'e.clamp.dampen'],
    [{ uv: { tx: 0, ty: 2, cycles: 1 } }, 'e.uv.tx'],
    [{ forceOL: { x: { t: 'r', a: 1 } } }, 'e.forceOL.x'],
    [{ trail: { colLife: { t: 'col', v: [1] } } }, 'e.trail.colLife'],
  ]) {
    expect(() => validateModules(emitter, 'e')).toThrow();
    try { validateModules(emitter, 'e'); }
    catch (error) { expect(error).toMatchObject({ code: 'INVALID_DEFINITION', stage: 'library', context: { path } }); }
  }
});
