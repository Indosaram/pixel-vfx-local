
export function validateMaterial(m, mode, path = 'render.mat') {
  if (m === null || m === undefined) return m;
  if (typeof m !== 'object') {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path } };
  }
  if (!m.shader || typeof m.shader !== 'string') {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path } };
  }
  if (m.c && m.c._Color_tint && Array.isArray(m.c._Color_tint) && m.c._Color_tint.length === 2) {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path } };
  }
  if (m.c && m.c._Panner && Array.isArray(m.c._Panner) && Number.isNaN(m.c._Panner[0])) {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path } };
  }
  if (m.f && m.f._Sharpness === Infinity && m.shader === 'SH_HunFX_Stencil') {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path } };
  }
  if (m.tex && m.tex._MainTex && typeof m.tex._MainTex === 'object' && !Array.isArray(m.tex._MainTex)) {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path } };
  }
  if (mode === 4 && m.tex && m.tex._VOTex && m.f && (m.f._VOintensity || 0) !== 0) {
    if (m.c && m.c._VOTex_speed && m.c._VOTex_speed[0] === Infinity) {
      throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path } };
    }
  }
  return m;
}
