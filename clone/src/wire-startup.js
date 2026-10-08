const DEFAULT_PIXEL = {
  alphaThreshold: 0.28, alphaLevels: 1, colors: 16, paletteMode: 'auto', palette: null,
  autoBright: true, brightness: 1, whiteHot: 0.4, edgeDark: 0.3, hue: 0, saturation: 1,
  dither: 'none', ditherStrength: 0.5, outline: 'none', outlineColor: 'auto', outlineCorners: false,
  cleanup: 0, fillHoles: true,
  gradient: { on: false, preset: 'Fire', stops: ['#2a0a12', '#a8231a', '#ff7a1a', '#ffe68a'], pos: [0, 0.3333, 0.6667, 1], mix: 1, reverse: false },
};

const DEFAULTS = {
  mode: 'combat',
  view: { elevation: 45, facing: 0, turn: 0, slashElevation: 75, sideUpright: true },
  frame: { size: 96, aspect: 'auto', framing: 'auto', worldPerPx: 0.06, center: 'auto', padding: 0.06 },
  time: { fps: 15, speed: 1, start: 0, maxDuration: 4, loopFrames: 24, warmup: 1.5, useSourceFps: true },
  layers: { hideGlow: true, hidden: {} },
  pixel: { ...DEFAULT_PIXEL },
  env: { canvas: '320x180', loopSec: 4, params: {} },
  sprite: { flip: false, rotate: 0, tints: {} },
  seeds: {}, timing: {},
  export: { formats: { sheet: true, frames: false, gif: true, json: true, aseprite: false, godot: false, unity: false },
    sheetLayout: 'auto', sheetCols: 10, outDir: '', effectFolders: false, gifScale: 3, gifBg: 'transparent',
    godotBase: 'res://pixel_vfx/', unityPPU: 32, views: ['current'], holdMode: 'timing', variations: 1, rangeFrom: 1, rangeTo: 0 },
};

const cloneJson = value => JSON.parse(JSON.stringify(value));
const isMergeObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function merge(target, source) {
  for (const key in source) {
    target[key] = isMergeObject(source[key])
      ? merge(target[key] && typeof target[key] === 'object' ? target[key] : {}, source[key])
      : source[key];
  }
  return target;
}

export function createStartupSettings(storedText) {
  const target = cloneJson(DEFAULTS);
  if (!storedText) return target;
  try { return merge(target, JSON.parse(storedText)); }
  catch { return target; }
}

export function loadStartupSettings(storage, key) {
  let raw = null;
  try { raw = storage.getItem(key); } catch { raw = null; }
  return createStartupSettings(raw);
}
