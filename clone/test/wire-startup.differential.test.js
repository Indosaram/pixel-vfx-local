import { test, expect } from 'bun:test';
import { createStartupSettings } from '../src/wire-startup.js';

const defaults = () => ({
  mode: 'combat', view: { elevation: 45, facing: 0, turn: 0, slashElevation: 75, sideUpright: true },
  frame: { size: 96, aspect: 'auto', framing: 'auto', worldPerPx: 0.06, center: 'auto', padding: 0.06 },
  time: { fps: 15, speed: 1, start: 0, maxDuration: 4, loopFrames: 24, warmup: 1.5, useSourceFps: true },
  layers: { hideGlow: true, hidden: {} },
  pixel: { alphaThreshold: 0.28, alphaLevels: 1, colors: 16, paletteMode: 'auto', palette: null,
    autoBright: true, brightness: 1, whiteHot: 0.4, edgeDark: 0.3, hue: 0, saturation: 1,
    dither: 'none', ditherStrength: 0.5, outline: 'none', outlineColor: 'auto', outlineCorners: false,
    cleanup: 0, fillHoles: true, gradient: { on: false, preset: 'Fire',
      stops: ['#2a0a12', '#a8231a', '#ff7a1a', '#ffe68a'], pos: [0, 0.3333, 0.6667, 1], mix: 1, reverse: false } },
  env: { canvas: '320x180', loopSec: 4, params: {} }, sprite: { flip: false, rotate: 0, tints: {} },
  seeds: {}, timing: {}, export: { formats: { sheet: true, frames: false, gif: true, json: true,
    aseprite: false, godot: false, unity: false }, sheetLayout: 'auto', sheetCols: 10, outDir: '',
    effectFolders: false, gifScale: 3, gifBg: 'transparent', godotBase: 'res://pixel_vfx/', unityPPU: 32,
    views: ['current'], holdMode: 'timing', variations: 1, rangeFrom: 1, rangeTo: 0 },
});

function sourceMerge(target, source) {
  for (const key in source) {
    target[key] = source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])
      ? sourceMerge(target[key] && typeof target[key] === 'object' ? target[key] : {}, source[key])
      : source[key];
  }
  return target;
}

test('startup implementation agrees with independently transcribed source merge', () => {
  const samples = [null, false, 0, 'text', [3, 4], {},
    { view: { facing: 90 }, export: { views: ['side'] } },
    { export: { views: { 0: 'top', 2: 'side' } } },
    { pixel: { gradient: null }, extension: { nested: true } },
    { layers: false, frame: null },];
  for (const value of samples) {
    const encoded = JSON.stringify(value);
    const expected = sourceMerge(JSON.parse(JSON.stringify(defaults())), JSON.parse(encoded));
    expect(createStartupSettings(encoded)).toEqual(expected);
  }
});
