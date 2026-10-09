import * as THREE from 'three';
import { captureFrames } from '../src/wire-capture.js';
import { createCaptureDriver } from '../src/wire-capture-driver.js';
import { layoutSheet } from '../src/export/sheet-layout.js';

const FIXTURE = '/spec/fixtures/f01-wire-input.json';
const COLUMNS = 4;

const OPTIONS = {
  seed: 17, elevation: 30, fps: 12, duration: 1, start: 0,
  size: 64, srcRes: 384, aspect: 'square', framing: 'fit', padding: 0.06,
};

function coverageOf(data) {
  let n = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 0) n++;
  return n;
}

export async function run() {
  const fixtureResponse = await fetch(FIXTURE);
  if (!fixtureResponse.ok) throw new Error(`fixture fetch failed: ${fixtureResponse.status}`);
  const fixture = await fixtureResponse.json();
  const definition = fixture.effect;

  const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  const shaderErrors = [];
  renderer.debug.onShaderError = (gl, program) => shaderErrors.push(gl.getProgramInfoLog(program));

  const white = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat);
  white.needsUpdate = true;
  const resources = {
    quad: new THREE.PlaneGeometry(), white, timeU: { value: 0 },
    texture: () => white, srgb: () => false,
  };
  const uniforms = { gradeU: { value: new THREE.Matrix3() }, intU: { value: 1 } };

  const driver = createCaptureDriver(definition, resources, uniforms, renderer);
  let result;
  try {
    result = await captureFrames(driver, OPTIONS);
  } finally {
    driver.dispose();
  }

  const frames = [];
  for (let i = 0; i < result.frames.length; i++) {
    const frame = result.frames[i];
    const canvas = document.createElement('canvas');
    canvas.width = frame.w; canvas.height = frame.h;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(new ImageData(frame.data, frame.w, frame.h), 0, 0);
    frames.push({
      index: i, w: frame.w, h: frame.h, coverage: coverageOf(frame.data),
      pngBase64: canvas.toDataURL('image/png'),
    });
  }

  let sheet = null;
  if (frames.length) {
    const layout = layoutSheet({ w: frames[0].w, h: frames[0].h, count: frames.length, columns: COLUMNS });
    const canvas = document.createElement('canvas');
    canvas.width = layout.sheet.w; canvas.height = layout.sheet.h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0d0d12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < frames.length; i++) {
      const rect = layout.rects[i];
      const image = new Image();
      image.src = frames[i].pngBase64;
      await image.decode();
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h);
    }
    sheet = {
      w: layout.sheet.w, h: layout.sheet.h, columns: layout.columns, rows: layout.rows,
      rects: layout.rects, cellW: frames[0].w, cellH: frames[0].h, count: frames.length,
      pngBase64: canvas.toDataURL('image/png'),
    };
  }

  const glError = renderer.getContext().getError();
  const covered = frames.filter(f => f.coverage > 0).length;
  const pass = frames.length > 0 && covered > 0 && sheet !== null
    && shaderErrors.length === 0 && glError === 0;

  white.dispose();
  resources.quad.dispose();
  renderer.dispose();

  return {
    pass,
    cases: [
      { name: 'sample-frames', count: frames.length, covered,
        coverages: frames.map(f => f.coverage), pass: frames.length > 0 && covered > 0 },
      { name: 'sample-sheet', w: sheet ? sheet.w : 0, h: sheet ? sheet.h : 0,
        columns: sheet ? sheet.columns : 0, rows: sheet ? sheet.rows : 0,
        pass: sheet !== null },
    ],
    frames, sheet, options: OPTIONS, fixture: { id: fixture.id, path: FIXTURE, status: fixture.status },
    origin: result.origin, shape: result.shape, k: result.k, worldPerPx: result.worldPerPx,
    shaderErrors, glError, outputColorSpace: renderer.outputColorSpace,
  };
}
