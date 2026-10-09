import * as THREE from 'three';
import { captureFrames } from '../src/wire-capture.js';
import { createCaptureDriver } from '../src/wire-capture-driver.js';
import { runTextureDecode, runTextureAlphaDecode } from './wire-texture-tests.js';

const c = v => ({ t: 'c', v });
export async function run() {
  const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  const errors = [], cases = [];
  renderer.debug.onShaderError = (gl, program) => errors.push(gl.getProgramInfoLog(program));
  const white = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
  white.needsUpdate = true;
  const resources = { quad: new THREE.PlaneGeometry(), white, timeU: { value: 0 },
    texture: () => white, srgb: () => false };
  const uniforms = { gradeU: { value: new THREE.Matrix3() }, intU: { value: 1 } };
  const emitter = { name: 'analytic-square', max: 4, dur: 1, delay: c(0), loop: false,
    bursts: [[0, c(1), 1, 0.01]], rate: c(0), life: c(2), speed: c(0), size: c(1), rotZ: c(0),
    color: { t: 'col', v: [1, 1, 1, 1] },
    render: { mat: { shader: 'SH_HunFX_simple' }, mode: 0, align: 0, len: 1 },
    pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } };
  const driver = createCaptureDriver({ emitters: [emitter] }, resources, uniforms, renderer);
  const clockTexture = new THREE.DataTexture(new Uint8Array([
    255, 0, 0, 255, 0, 255, 0, 255,
  ]), 2, 1);
  clockTexture.magFilter = clockTexture.minFilter = THREE.NearestFilter;
  clockTexture.wrapS = THREE.RepeatWrapping;
  clockTexture.needsUpdate = true;
  const quadrants = new THREE.DataTexture(new Uint8Array([
    255, 0, 0, 255, 0, 255, 0, 255,
    0, 0, 255, 255, 255, 255, 0, 255,
  ]), 2, 2);
  quadrants.magFilter = quadrants.minFilter = THREE.NearestFilter;
  quadrants.needsUpdate = true;
  try {
    for (const [seed, elevation] of [[17, 30], [829, 65]]) {
      const options = { seed, elevation, fps: 4, duration: 0.5, start: 0,
        size: 16, srcRes: 32, aspect: 'square', framing: 'fixed', worldPerPx: 0.125, center: 'origin' };
      const before = resources.timeU.value;
      const result = await captureFrames(driver, options);
      const repeat = await captureFrames(driver, options);
      for (let i = 0; i < result.frames.length; i++) {
        const frame = result.frames[i], data = frame.data;
        const center = Array.from(data.slice((16 * 32 + 16) * 4, (16 * 32 + 16) * 4 + 4));
        const corner = Array.from(data.slice(0, 4));
        const replay = repeat.frames[i];
        const same = replay && data.every((value, index) => value === replay.data[index]);
        const canvas = document.createElement('canvas'); canvas.width = frame.w; canvas.height = frame.h;
        canvas.getContext('2d').putImageData(new ImageData(data, frame.w, frame.h), 0, 0);
        cases.push({ name: `capture:${seed}:${elevation}:${i}`, center, corner,
          expectedCenter: [188, 188, 188, 255], tolerance: 2,
          width: frame.w, height: frame.h, pixels: Array.from(data),
          replayPixels: replay ? Array.from(replay.data) : null,
          coverage: 'constant billboard capture and invariant replay; not seed/camera sensitivity',
          pass: frame.w === 32 && frame.h === 32 && center.every((v, j) => Math.abs(v - (j === 3 ? 255 : 188)) <= 2)
            && corner.every(v => v === 0) && same,
          pngBase64: canvas.toDataURL('image/png') });
      }
      cases.push({ name: `clock:${seed}`, before, after: resources.timeU.value,
        delta: resources.timeU.value - before, intensity: uniforms.intU.value,
        pass: result.frames.length === 2 && repeat.frames.length === 2
        && Math.abs(resources.timeU.value - before - 2) < 1e-10 && uniforms.intU.value === 1 });
    }
    const empty = await captureFrames(driver, { seed: 17, elevation: 30, fps: 4, duration: 0.25,
      size: 16, srcRes: 32, hidden: [0] });
    cases.push({ name: 'hidden-empty', pass: empty.empty === true && empty.frames.length === 0 });
    driver.dispose();
    resources.timeU.value = 0;
    const timed = { ...emitter, render: { ...emitter.render, mat: {
      shader: 'SH_HunFX_simple', kw: ['_USECOLOR_ON'], tex: { _MainTexture: 'clock' },
      c: { _uv: [0, 0, 0.1875, 0.5], _Panner: [0.5, 0] },
    } } };
    const timedDriver = createCaptureDriver({ emitters: [timed] },
      { ...resources, texture: () => clockTexture }, uniforms, renderer);
    try {
      const capture = await captureFrames(timedDriver, { seed: 17, elevation: 30, fps: 4,
        duration: 0.5, start: 0, size: 16, srcRes: 32, aspect: 'square',
        framing: 'fixed', worldPerPx: 0.125, center: 'origin' });
      const centers = capture.frames.map(frame => Array.from(frame.data.slice(2112, 2116)));
      const frame = capture.frames[0];
      const canvas = document.createElement('canvas'); canvas.width = frame.w; canvas.height = frame.h;
      canvas.getContext('2d').putImageData(new ImageData(frame.data, frame.w, frame.h), 0, 0);
      cases.push({ name: 'shared-clock-visible-pan', centers,
        expectedCenters: [[0, 188, 0, 255], [0, 188, 0, 255]],
        expectedSampleU: [0.5625, 0.6875], resetClockSampleU: [0.3125, 0.4375],
        pass: centers.length === 2 && centers.every(pixel => pixel.every((v, i) =>
          Math.abs(v - [0, 188, 0, 255][i]) <= 2)) && Math.abs(resources.timeU.value - 1) < 1e-10,
        width: frame.w, height: frame.h, pixels: Array.from(frame.data),
        pngBase64: canvas.toDataURL('image/png') });
    } finally { timedDriver.dispose(); }
    const asymmetric = { ...emitter, render: { ...emitter.render, mat: {
      shader: 'SH_HunFX_simple', kw: ['_USECOLOR_ON'], tex: { _MainTexture: 'quadrants' },
      c: { _uv: [1, 1, 0, 0] },
    } } };
    const asymmetricDriver = createCaptureDriver({ emitters: [asymmetric] },
      { ...resources, texture: () => quadrants }, uniforms, renderer);
    try {
      const result = await captureFrames(asymmetricDriver, { seed: 17, elevation: 30, fps: 4,
        duration: 0.25, start: 0, size: 16, srcRes: 32, aspect: 'square',
        framing: 'fixed', worldPerPx: 0.125, center: 'origin' });
      const frame = result.frames[0];
      const coordinates = [[12, 12], [20, 12], [12, 20], [20, 20]];
      const expected = [[0, 0, 188, 255], [188, 188, 0, 255], [188, 0, 0, 255], [0, 188, 0, 255]];
      const samples = coordinates.map(([x, y]) => Array.from(frame.data.slice((y * frame.w + x) * 4, (y * frame.w + x) * 4 + 4)));
      const canvas = document.createElement('canvas'); canvas.width = frame.w; canvas.height = frame.h;
      canvas.getContext('2d').putImageData(new ImageData(frame.data, frame.w, frame.h), 0, 0);
      cases.push({ name: 'asymmetric-vertical-orientation', coordinates, expected, samples,
        origin: result.origin, width: frame.w, height: frame.h,
        pass: result.frames.length === 1 && frame.w === 32 && frame.h === 32
          && result.origin.every(v => v === 0.5)
          && samples.every((pixel, i) => pixel.every((v, j) => Math.abs(v - expected[i][j]) <= 2)),
        pixels: Array.from(frame.data), pngBase64: canvas.toDataURL('image/png') });
    } finally { asymmetricDriver.dispose(); }
    cases.push(await runTextureDecode());
    cases.push(await runTextureAlphaDecode());
    const glError = renderer.getContext().getError();
    return { pass: cases.length === 11 && cases.every(c => c.pass) && errors.length === 0 && glError === 0,
      cases, errors, glError, outputColorSpace: renderer.outputColorSpace, toneMapping: renderer.toneMapping };
  } finally {
    driver.dispose(); resources.quad.dispose(); white.dispose(); clockTexture.dispose(); quadrants.dispose(); renderer.dispose();
  }
}
