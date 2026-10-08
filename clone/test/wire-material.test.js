import { expect, test } from 'bun:test';
import { BackSide, FrontSide, DoubleSide, CustomBlending, OneFactor, SrcAlphaFactor, OneMinusSrcAlphaFactor, Texture } from 'three';
import { createWireMaterial } from '../src/wire-material.js';

const shaders = { VS: 'vertex-test', COMMON_FS: 'common-test', SIMPLE_FS: 'simple-test', STENCIL_FS: 'stencil-test', ADD_FS: 'add-test' };
function setup() {
  const white = new Texture(), image = new Texture(), requested = [];
  const opts = { timeU: { value: 2 }, gradeU: { value: 3 }, intU: { value: 4 } };
  const res = { white, texture: name => { requested.push(name); return name === 'image' ? image : null; }, srgb: name => name === 'missing' };
  return { white, image, requested, opts, res };
}

test('branch color uniforms linearize RGB while retaining alpha', () => {
  const s = setup();
  const simple = createWireMaterial({ shader: 'SH_HunFX_simple', c: { _Color_tint: [0.02, 0.5, 2, 0.3] } }, 0, s.opts, s.res, shaders);
  const tint = simple.uniforms.uTint.value.toArray();
  [0.02 / 12.92, 0.21404114048223255, 4.59479341998814].forEach((v, i) => expect(tint[i]).toBeCloseTo(v, 12));
  expect(tint[3]).toBe(0.3);
  const builtin = createWireMaterial({ shader: 'builtin_probe' }, 0, s.opts, s.res, shaders);
  builtin.uniforms.uTint.value.toArray().slice(0, 3).forEach(v => expect(v).toBeCloseTo(0.21404114048223255, 12));
  expect(builtin.uniforms.uTint.value.w).toBe(0.5);
});

test('common texture slots preserve distinct identities and metadata channel order', () => {
  const s = setup(), names = ['main', 'diss', 'mask', 'dist', 'sub'];
  const textures = Object.fromEntries(names.map(name => [name, new Texture()]));
  const tex = { _MainTexture: 'main', _DissolveTex: 'diss', _Mask: 'mask', _DistTex: 'dist', _SubDissolveTex: 'sub' };
  for (const flags of [[1, 0, 1, 0], [0, 1, 0, 1], [1, 1, 0, 0]]) {
    const res = { ...s.res, texture: name => textures[name], srgb: name => name === 'sub' || !!flags[names.indexOf(name)] };
    const material = createWireMaterial({ shader: 'other', tex }, 0, s.opts, res, shaders);
    ['tMain', 'tDiss', 'tMask', 'tDist', 'tSub'].forEach((key, i) => expect(material.uniforms[key].value).toBe(textures[names[i]]));
    expect(material.uniforms.sR.value.toArray()).toEqual(flags);
  }
});

test('shader selection and independent alpha blending preserve branch distinctions', () => {
  for (const [shader, fragment, side, additive] of [
    ['SH_HunFX_simple', shaders.SIMPLE_FS, DoubleSide, false],
    ['SH_HunFX_Stencil', shaders.STENCIL_FS, DoubleSide, false],
    ['builtin_probe', shaders.ADD_FS, DoubleSide, true],
    ['SH_HunFX_common_back', shaders.COMMON_FS, BackSide, false],
    ['SH_HunFX_common_front', shaders.COMMON_FS, FrontSide, false],
    ['other', shaders.COMMON_FS, DoubleSide, false],
  ]) {
    const s = setup(), material = createWireMaterial({ shader }, 0, s.opts, s.res, shaders);
    expect(material.vertexShader).toBe(shaders.VS);
    expect(material.fragmentShader).toBe(fragment);
    expect(material.side).toBe(side);
    expect(material.blending).toBe(CustomBlending);
    expect(material.blendSrc).toBe(additive ? OneFactor : SrcAlphaFactor);
    expect(material.blendDst).toBe(additive ? OneFactor : OneMinusSrcAlphaFactor);
    expect(material.blendSrcAlpha).toBe(OneFactor);
    expect(material.blendDstAlpha).toBe(OneMinusSrcAlphaFactor);
    expect(material.transparent).toBe(true);
    expect(material.depthWrite).toBe(false);
    expect(material.depthTest).toBe(true);
    expect(material.uniforms.uTime).toBe(s.opts.timeU);
    expect(material.uniforms.uGrade).toBe(s.opts.gradeU);
    expect(material.uniforms.uInt).toBe(s.opts.intU);
  }
});

test('texture fallback does not replace named sRGB metadata and exceptions propagate', () => {
  const s = setup();
  const m = createWireMaterial({ shader: 'SH_HunFX_simple', tex: { _MainTexture: 'missing' } }, 0, s.opts, s.res, shaders);
  expect(m.uniforms.tMain.value).toBe(s.white);
  expect(m.uniforms.sR.value.toArray()).toEqual([1, 0, 0, 0]);
  expect(s.requested).toEqual(['missing']);
  expect(() => createWireMaterial({ shader: 'SH_HunFX_simple', tex: { _MainTexture: 'x' } }, 0, s.opts,
    { ...s.res, texture() { throw new Error('decode failure'); } }, shaders)).toThrow('decode failure');
});

test('VO requires mesh mode, named texture and nonzero intensity', () => {
  const s = setup();
  for (const [mode, intensity, enabled] of [[0, 1, false], [4, 0, false], [4, -2, true]]) {
    const m = createWireMaterial({ shader: 'SH_HunFX_simple', tex: { _VOTex: 'image' }, f: { _VOintensity: intensity } }, mode,
      { ...s.opts, viewAlign: true }, s.res, shaders);
    expect(Object.hasOwn(m.defines, 'VO')).toBe(enabled);
    expect(m.defines.MODE).toBe(mode);
    expect(m.defines.VIEWALIGN).toBe('');
    if (enabled) {
      expect(m.uniforms.tVO.value).toBe(s.image);
      expect(m.uniforms.uVOI.value).toBe(-2);
    }
  }
});

test('legacy common suppresses modern keywords and overrides distortion and Fresnel', () => {
  const s = setup();
  const descriptor = { shader: 'other', kw: ['_USEDISSOLVECOLOR_ON', '_USEDEPTHFADE_ON'],
    f: { _ColorIntensity: 0, _MaskMult: 0, _Fresnel_pow: 0, _Distort_intensity: 2, _DepthFade_Distance: 0, _SubDissolveTex_multi: 0 },
    c: { _MaskTex_tile: [2, 3], _MaskTex_offset: [4, 5] }, st: { _Mask: [6, 7, 8, 9] } };
  const modern = createWireMaterial(descriptor, 0, s.opts, s.res, shaders);
  const legacy = createWireMaterial({ ...descriptor, shader: 'SH_HunFX_common_back' }, 0, s.opts, s.res, shaders);
  expect(modern.defines.DISSCOL).toBe('');
  expect(modern.defines.DEPTHFADE).toBe('');
  expect(Object.hasOwn(legacy.defines, 'DISSCOL')).toBe(false);
  expect(Object.hasOwn(legacy.defines, 'DEPTHFADE')).toBe(false);
  expect(legacy.defines.LEGACY).toBe('');
  expect(legacy.defines.USECOLOR).toBe('');
  expect(modern.uniforms.uMaskTile.value.toArray()).toEqual([2, 3]);
  expect(legacy.uniforms.uMaskTile.value.toArray()).toEqual([6, 7]);
  expect(legacy.uniforms.uMaskOff.value.toArray()).toEqual([8, 9]);
  for (const name of ['uCI', 'uMaskMult', 'uFresPow', 'uDFD']) expect(modern.uniforms[name].value).toBe(0);
  expect(modern.uniforms.uSub.value.y).toBe(0);
  expect(modern.uniforms.uDistI.value).toBe(2);
  expect(legacy.uniforms.uDistI.value).toBe(0);
  expect(legacy.uniforms.uFresPow.value).toBe(5);
});
