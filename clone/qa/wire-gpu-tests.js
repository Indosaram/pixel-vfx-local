import * as THREE from 'three';
import * as shaders from '../src/wire-shaders.js';
import { createWireMaterial } from '../src/wire-material.js';
import { createWireScene } from '../src/wire-scene.js';

const c = v => ({ t: 'c', v });
export async function run() {
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setSize(32, 32);
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0, 0);
  const errors = [], cases = [];
  renderer.debug.onShaderError = (gl, program, vertex, fragment) => errors.push({
    program: gl.getProgramInfoLog(program), vertex: gl.getShaderInfoLog(vertex), fragment: gl.getShaderInfoLog(fragment),
  });
  const target = new THREE.WebGLRenderTarget(32, 32, { type: THREE.UnsignedByteType, depthBuffer: true });
  target.texture.colorSpace = THREE.LinearSRGBColorSpace;
  const white = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
  white.needsUpdate = true;
  const asymmetric = new THREE.DataTexture(new Uint8Array([
    255, 0, 0, 255, 0, 255, 0, 255,
    0, 0, 255, 255, 255, 255, 0, 255,
  ]), 2, 2);
  asymmetric.magFilter = asymmetric.minFilter = THREE.NearestFilter;
  asymmetric.needsUpdate = true;
  const resources = { quad: new THREE.PlaneGeometry(), white, timeU: { value: 0 }, texture: name => name === 'asymmetric' ? asymmetric : white, srgb: () => false };
  const uniforms = { gradeU: { value: new THREE.Matrix3() }, intU: { value: 1 } };
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 3;
  camera.updateMatrixWorld();
  const makeMaterial = (m, mode, opts, res) => createWireMaterial(m, mode, opts, res, shaders);
  function draw(descriptor, mode, count, alpha, align = 0, uv = undefined) {
    const d = { name: 'original-probe', max: 4, dur: 1, delay: c(0), loop: false,
      bursts: [[0, c(count), 1, 0.01]], rate: c(0), life: c(1), speed: c(0), size: c(1), rotZ: c(0),
      color: { t: 'col', v: [1, 1, 1, alpha] }, render: { mat: descriptor, mode, align, len: 1 },
      uv, pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } };
    const assembled = createWireScene({ emitters: [d] }, resources, uniforms, makeMaterial, () => {});
    const scene = new THREE.Scene(); scene.add(assembled.group);
    assembled.clock.play(1); assembled.clock.seek(1 / 120, camera);
    renderer.compile(scene, camera);
    if (assembled.parts.length !== 1 || assembled.parts[0].geo.instanceCount !== count) {
      throw new Error(`Probe emission mismatch: expected ${count} instances`);
    }
    renderer.setRenderTarget(target); renderer.clear(); renderer.render(scene, camera);
    const pixels = new Uint8Array(32 * 32 * 4);
    renderer.readRenderTargetPixels(target, 0, 0, 32, 32, pixels);
    for (const part of assembled.parts) { part.geo.dispose(); part.mat.dispose(); }
    return pixels;
  }
  const keywords = ['_USECOLOR_ON', '_USEDISSOLVECOLOR_ON', '_USEPOSXSCROLL_ON', '_USEFRESNEL_ON', '_USEDEPTHFADE_ON'];
  const variants = [
    { shader: 'SH_HunFX_simple' }, { shader: 'SH_HunFX_simple', kw: ['_USECOLOR_ON', '_USEGASALPHA_ON'] },
    { shader: 'SH_HunFX_Stencil' }, { shader: 'builtin_probe' },
    { shader: 'SH_HunFX_common_back' }, { shader: 'SH_HunFX_common_front' },
    { shader: 'common' }, ...keywords.map(k => ({ shader: 'common', kw: [k] })),
    { shader: 'common', kw: keywords },
  ];
  try {
    for (const mode of [0, 1, 4]) for (const descriptor of variants) {
      const before = errors.length;
      draw(descriptor, mode, 1, 1, mode === 4 ? 1 : 0);
      cases.push({ name: `compile:${mode}:${descriptor.shader}:${(descriptor.kw || []).join(',')}`, pass: errors.length === before, coverage: 'compile-only' });
    }
    for (const descriptor of [{ shader: 'SH_HunFX_simple' }, { shader: 'SH_HunFX_simple', tex: { _VOTex: 'white' }, f: { _VOintensity: 0.1 } }]) {
      const before = errors.length;
      draw(descriptor, 4, 1, 1, 0);
      cases.push({ name: `compile:viewalign:${!!descriptor.tex}`, pass: errors.length === before, coverage: 'compile-only' });
    }
    for (const [name, descriptor, count, alpha, expected] of [
      ['ordinary-one', { shader: 'SH_HunFX_simple' }, 1, 0.5, [128, 128, 128, 128]],
      ['ordinary-two', { shader: 'SH_HunFX_simple' }, 2, 0.5, [191, 191, 191, 191]],
      ['additive-one', { shader: 'builtin_probe', c: { _TintColor: [1, 1, 1, 0.125] } }, 1, 1, [128, 128, 128, 255]],
      ['additive-two', { shader: 'builtin_probe', c: { _TintColor: [1, 1, 1, 0.125] } }, 2, 1, [255, 255, 255, 255]],
    ]) {
      const pixels = draw(descriptor, 0, count, alpha);
      const center = Array.from(pixels.slice((16 * 32 + 16) * 4, (16 * 32 + 16) * 4 + 4));
      const outside = Array.from(pixels.slice(0, 4));
      cases.push({ name, expected, center, outside, tolerance: 2,
        pixels: Array.from(pixels), pixelOrigin: 'bottom-left',
        pass: center.every((v, i) => Math.abs(v - expected[i]) <= 2) && outside.every(v => v === 0) });
    }
    for (const [frame, expected] of [[0, [0, 0, 255, 255]], [1, [255, 255, 0, 255]],
      [2, [255, 0, 0, 255]], [3, [0, 255, 0, 255]]]) {
      const pixels = draw({ shader: 'SH_HunFX_simple', kw: ['_USECOLOR_ON'],
        tex: { _MainTexture: 'asymmetric' }, c: { _uv: [1, 1, 0, 0] } }, 0, 1, 1, 0,
      { tx: 2, ty: 2, fot: c(frame / 4), start: c(0), cycles: 1 });
      const center = Array.from(pixels.slice((16 * 32 + 16) * 4, (16 * 32 + 16) * 4 + 4));
      cases.push({ name: `asymmetric-frame:${frame}`, expected, center,
        pixels: Array.from(pixels), pixelOrigin: 'bottom-left',
        pass: center.every((v, i) => v === expected[i]) });
    }
    for (const [seed, cameraX] of [[17, 0], [829, 0.6]]) {
      const d = { name: 'replay-probe', max: 4, dur: 1, delay: c(0), loop: false,
        bursts: [[0, c(2), 1, 0.01]], rate: c(0), life: c(1), speed: c(0),
        size: { t: 'r', a: 0.4, b: 0.9 }, rotZ: { t: 'r', a: 0, b: 3 },
        color: { t: 'rcol', a: [0.2, 0.4, 0.6, 0.5], b: [1, 0.8, 0.2, 1] },
        render: { mat: { shader: 'SH_HunFX_simple' }, mode: 0, align: 0, len: 1 },
        pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } };
      const assembled = createWireScene({ emitters: [d] }, resources, uniforms, makeMaterial, () => {});
      const scene = new THREE.Scene(); scene.add(assembled.group);
      camera.position.set(cameraX, 0, 3); camera.lookAt(0, 0, 0); camera.updateMatrixWorld();
      const buffers = [];
      for (let replay = 0; replay < 2; replay++) {
        assembled.clock.play(seed); assembled.clock.seek(0.25, camera);
        renderer.setRenderTarget(target); renderer.clear(); renderer.render(scene, camera);
        const pixels = new Uint8Array(32 * 32 * 4);
        renderer.readRenderTargetPixels(target, 0, 0, 32, 32, pixels);
        buffers.push(pixels);
      }
      const visible = buffers[0].some((v, i) => i % 4 === 3 && v > 0);
      cases.push({ name: `replay:${seed}:${cameraX}`, seed, camera: [cameraX, 0, 3], time: 0.25,
        pixels: Array.from(buffers[0]), pixelOrigin: 'bottom-left',
        pass: visible && buffers[0].every((v, i) => v === buffers[1][i]), visible,
        coverage: 'deterministic-replay-not-reference-equivalence' });
      for (const part of assembled.parts) { part.geo.dispose(); part.mat.dispose(); }
    }
    for (const entry of cases) {
      if (!entry.pixels) continue;
      const canvas = new OffscreenCanvas(32, 32);
      const image = new ImageData(32, 32);
      for (let y = 0; y < 32; y++) {
        image.data.set(entry.pixels.slice(y * 128, (y + 1) * 128), (31 - y) * 128);
      }
      canvas.getContext('2d').putImageData(image, 0, 0);
      const png = new Uint8Array(await (await canvas.convertToBlob({ type: 'image/png' })).arrayBuffer());
      entry.pngBase64 = btoa(String.fromCharCode(...png));
      entry.imageEncoding = 'raw linear bytes displayed without transfer; top-left PNG origin';
    }
    const gl = renderer.getContext(), debug = gl.getExtension('WEBGL_debug_renderer_info');
    return { pass: errors.length === 0 && cases.every(c => c.pass), cases, errors,
      three: THREE.REVISION, dimensions: [32, 32], vendor: gl.getParameter(gl.VENDOR), renderer: gl.getParameter(gl.RENDERER),
      unmaskedRenderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : null,
      remaining: ['per-branch behavioral cases', 'image inspection'] };
  } finally {
    target.dispose(); white.dispose(); asymmetric.dispose(); resources.quad.dispose(); renderer.dispose();
  }
}
