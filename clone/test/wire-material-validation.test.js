import { expect, test } from 'bun:test';
import { validateMaterial } from '../src/wire-material-validation.js';

test('material validation preserves shader fallback and constructor vector defaults', () => {
  for (const material of [null, undefined, { shader: 'unknown-common' },
    { shader: 'SH_HunFX_simple', c: { _uv: [], _Panner: [2], _Color_tint: [1, 2, 3] } },
    { shader: 'builtin_add', st: { _MainTex: [2] } },
    { shader: 'common', c: { _MaskTex_tile: [2], _MaskTex_offset: [3, 4] } },
    { shader: 'SH_HunFX_simple', c: { _Color_tint: [null, 1, 1, null], _Panner: [null, 2], _uv: [null, 1, 0, 0] } },
    { shader: 'SH_HunFX_simple', c: { _Panner: [1, 2, Infinity], _uv: [1, 1, 0, 0, Infinity] } },
    { shader: 'SH_HunFX_common_back', f: { _Distort_intensity: Infinity, _Fresnel_pow: 'unused' },
      c: { _MaskTex_tile: 'unused', _MaskTex_offset: 'unused' }, st: { _Mask: [1, 1, 0, 0] } },
    { shader: 'SH_HunFX_simple', f: { _Sharpness: 'unused' }, c: { _Main_Color: 'unused' } }]) {
    expect(validateMaterial(material, 0, 'render.mat')).toBe(material);
  }
});

test('malformed branch-consumed material values produce structured failures', () => {
  for (const material of [{}, { shader: 1 }, { shader: 'SH_HunFX_simple', c: { _Color_tint: [1, 2] } },
    { shader: 'SH_HunFX_simple', c: { _Panner: [NaN] } },
    { shader: 'SH_HunFX_Stencil', f: { _Sharpness: Infinity } },
    { shader: 'builtin_add', tex: { _MainTex: {} } }]) {
    expect(() => validateMaterial(material, 0, 'render.mat')).toThrow();
    try { validateMaterial(material, 0, 'render.mat'); }
    catch (error) { expect(error).toMatchObject({ code: 'INVALID_DEFINITION', stage: 'library', context: { path: 'render.mat' } }); }
  }
});

test('vertex displacement values are checked only when its gate is active', () => {
  const material = { shader: 'SH_HunFX_simple', tex: { _VOTex: 'offset' },
    f: { _VOintensity: 1 }, c: { _VOTex_speed: [Infinity] } };
  expect(validateMaterial(material, 0, 'render.mat')).toBe(material);
  expect(() => validateMaterial(material, 4, 'render.mat')).toThrow();
  const disabled = { ...material, f: { _VOintensity: 0 } };
  expect(validateMaterial(disabled, 4, 'render.mat')).toBe(disabled);
  const missingTexture = { ...material, tex: {} };
  expect(validateMaterial(missingTexture, 4, 'render.mat')).toBe(missingTexture);
});
