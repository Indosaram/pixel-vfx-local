import * as THREE from 'three';

const lin = (x) => (x <= 0.04045 ? x / 12.92
  : x <= 1 ? Math.pow((x + 0.055) / 1.055, 2.4) : Math.pow(x, 2.2));
const linC = (c) => new THREE.Vector4(lin(c[0]), lin(c[1]), lin(c[2]), c[3]);
const v2 = (c, d = [0, 0]) => new THREE.Vector2(...(c || d).slice(0, 2));
const v4 = (c, d = [0, 0, 1, 1]) => new THREE.Vector4(...(c || d));

export function createWireMaterial(m, mode, opts, res, shaders) {
  const { VS, COMMON_FS, SIMPLE_FS, STENCIL_FS, ADD_FS } = shaders;
  const kw = m.kw || [], f = m.f || {}, c = m.c || {}, T = m.tex || {}, ST = m.st || {};
  const texU = (name) => ({ value: (name && res.texture(name)) || res.white });
  const srgbFlag = (name) => (name && res.srgb(name) ? 1 : 0);
  const defines = { MODE: mode };
  if (opts.viewAlign) defines.VIEWALIGN = '';
  let fs, side = THREE.DoubleSide, additive = false;
  const uniforms = {
    uTime: opts.timeU, uLen: { value: 2 }, uVelScale: { value: 0 }, uScale: { value: 1 },
    uPivot: { value: new THREE.Vector3() }, uGrade: opts.gradeU, uInt: opts.intU,
  };
  const st = (k) => new THREE.Vector4(...(ST[k] || [1, 1, 0, 0]));
  if (mode === 4 && T._VOTex && (f._VOintensity || 0) !== 0) {
    defines.VO = '';
    Object.assign(uniforms, {
      tVO: texU(T._VOTex), uVOuv: { value: v4(c._VOTex_uv) },
      uVOspd: { value: v2(c._VOTex_speed) }, uVOI: { value: f._VOintensity },
    });
  }
  if (m.shader === 'SH_HunFX_simple') {
    fs = SIMPLE_FS;
    if (kw.includes('_USECOLOR_ON')) defines.USECOLOR = '';
    if (kw.includes('_USEGASALPHA_ON')) defines.GASALPHA = '';
    Object.assign(uniforms, {
      tMain: texU(T._MainTexture), sR: { value: new THREE.Vector4(srgbFlag(T._MainTexture), 0, 0, 0) },
      uTint: { value: linC(c._Color_tint || [1, 1, 1, 1]) }, uUVs: { value: v4(c._uv) }, uPan: { value: v2(c._Panner) },
    });
  } else if (m.shader === 'SH_HunFX_Stencil') {
    fs = STENCIL_FS;
    Object.assign(uniforms, {
      tMain: texU(T._Main_Tex), sR: { value: new THREE.Vector4(srgbFlag(T._Main_Tex), 0, 0, 0) }, uST: { value: st('_Main_Tex') },
      uMainC: { value: linC(c._Main_Color || [1, 1, 1, 1]) }, uBGC: { value: linC(c._BG_Color || [0, 0, 0, 0]) }, uSharp: { value: f._Sharpness ?? 1 },
    });
  } else if (m.shader.startsWith('builtin_')) {
    fs = ADD_FS; additive = true;
    const tid = T._MainTex;
    Object.assign(uniforms, { tMain: texU(tid), sR: { value: new THREE.Vector4(srgbFlag(tid), 0, 0, 0) }, uST: { value: st('_MainTex') }, uTint: { value: linC(c._TintColor || [.5, .5, .5, .5]) } });
  } else {
    fs = COMMON_FS;
    const legacy = m.shader === 'SH_HunFX_common_back' || m.shader === 'SH_HunFX_common_front';
    if (legacy) { defines.LEGACY = ''; defines.USECOLOR = ''; side = m.shader.endsWith('back') ? THREE.BackSide : THREE.FrontSide; }
    if (kw.includes('_USECOLOR_ON')) defines.USECOLOR = '';
    if (!legacy && kw.includes('_USEDISSOLVECOLOR_ON')) defines.DISSCOL = '';
    if (kw.includes('_USEPOSXSCROLL_ON')) defines.POSX = '';
    if (kw.includes('_USEFRESNEL_ON')) defines.FRESNEL = '';
    if (!legacy && kw.includes('_USEDEPTHFADE_ON')) defines.DEPTHFADE = '';
    const mt = legacy ? (ST._Mask || [1, 1, 0, 0]) : [...(c._MaskTex_tile || [1, 1]).slice(0, 2), ...(c._MaskTex_offset || [0, 0]).slice(0, 2)];
    Object.assign(uniforms, {
      tMain: texU(T._MainTexture), tDiss: texU(T._DissolveTex), tMask: texU(T._Mask), tDist: texU(T._DistTex), tSub: texU(T._SubDissolveTex),
      sR: { value: new THREE.Vector4(srgbFlag(T._MainTexture), srgbFlag(T._DissolveTex), srgbFlag(T._Mask), srgbFlag(T._DistTex)) },
      uMainUV: { value: v4(c._MainTex_uv) }, uDissUV: { value: v4(c._DissolveTex_uv) }, uDistUVS: { value: v4(c._DistTex_uv_speed, [1, 1, 0, 0]) },
      uCol1: { value: linC(c._color1 || [1, 1, 1, 1]) }, uCol2: { value: linC(c._color2 || [0, 0, 0, 1]) }, uUDRL: { value: v4(c._Mask_udrl, [0, 0, 0, 0]) },
      uFlags: { value: new THREE.Vector4(f._MainTex_UV_invert || 0, f._DissTex_UV_invert || 0, f._MaskTex_UV_invert || 0, f._InvertFresnel || 0) },
      uSub: { value: new THREE.Vector4(f._UseSubDissTex || 0, f._SubDissolveTex_multi ?? 1, f._SubDissolveTex_add || 0, 0) },
      uMainSpd: { value: v2(c._MainTex_speed) }, uDissSpd: { value: v2(c._DissolveTex_speed) }, uSS: { value: v2(c._Smoothstep, [0, 1]) },
      uDCS: { value: v2(c._DissolveColor_step, [0, 1]) }, uMaskTile: { value: new THREE.Vector2(mt[0], mt[1]) }, uMaskOff: { value: new THREE.Vector2(mt[2], mt[3]) }, uMaskSpd: { value: v2(c._MaskTex_speed) },
      uCI: { value: f._ColorIntensity ?? 1 }, uMaskMult: { value: f._MaskMult ?? 1 }, uDistI: { value: legacy ? 0 : (f._Distort_intensity || 0) }, uFresPow: { value: legacy ? 5 : (f._Fresnel_pow ?? 5) },
      uDFD: { value: f._DepthFade_Distance ?? 1 },
    });
  }
  return new THREE.ShaderMaterial({
    vertexShader: VS, fragmentShader: fs, uniforms, defines,
    transparent: true, depthWrite: false, depthTest: true, side,
    blending: THREE.CustomBlending,
    blendSrc: additive ? THREE.OneFactor : THREE.SrcAlphaFactor, blendDst: additive ? THREE.OneFactor : THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  });
}
