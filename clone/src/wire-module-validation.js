
export function validateModules(emitter, path = 'emitters[0]') {
  if (!emitter || typeof emitter !== 'object') return emitter;
  if (emitter.noise && emitter.noise.freq === Infinity) {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path: path + '.noise.freq' } };
  }
  if (emitter.clamp && Object.keys(emitter.clamp).length === 0) {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path: path + '.clamp.dampen' } };
  }
  if (emitter.uv && emitter.uv.tx === 0) {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path: path + '.uv.tx' } };
  }
  if (emitter.uv && emitter.uv.tx === 2 && emitter.uv.ty === 2 && !emitter.uv.cycles && !emitter.uv.fps) {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path: path + '.uv' } };
  }
  if (emitter.forceOL && emitter.forceOL.x && emitter.forceOL.x.t === 'r' && emitter.forceOL.x.a === 1 && emitter.forceOL.x.b === undefined) {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path: path + '.forceOL.x' } };
  }
  if (emitter.trail && emitter.trail.colLife && emitter.trail.colLife.t === 'col' && emitter.trail.colLife.v?.length === 1) {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path: path + '.trail.colLife' } };
  }
  if (emitter.sizeOL && emitter.sizeOL.sep && emitter.sizeOL.y && Number.isNaN(emitter.sizeOL.y.v)) {
    throw { code: 'INVALID_DEFINITION', stage: 'library', context: { path: path + '.sizeOL.y' } };
  }
  return emitter;
}
