
import * as THREE from 'three';
import { createTextureLoader } from './wire-texture-loader.js';
import { openPak } from './wire-pak.js';
import { createSamplePack } from './sample-pack.js';
import { validateRenderOptions } from './render-options.js';
import { createWireLibrary } from './wire-library.js';
import { createWireResources } from './wire-resources.js';
import { createCaptureDriver } from './wire-capture-driver.js';
import { captureFrames } from './wire-capture.js';
import { pixelate, DEFAULT_PIXEL } from './pixel.js';
import { encodeGif } from './export.js';

export async function renderEffectClone({
  pakPath,
  effectId,
  size = 64,
  fps = 15,
  duration = 0.77,
  elevation = 35,
  facing = 0,
  colors = 16,
  renderer,
  pack,
  seed = 1
}) {
  validateRenderOptions({ effectId, size, fps, duration, colors, seed, elevation, facing });
  const pak = pack || (pakPath ? await openPak(pakPath) : createSamplePack());
  const manifest = await pak.readJson('manifest.json');

  const loadTexture = createTextureLoader(path => pak.readFile(path));
  const resources = createWireResources({
    textures: manifest.textures || {}, meshes: manifest.meshes || {},
    readJson: path => pak.readJson(path), loadTexture
  });
  let driver;
  try {
    const library = createWireLibrary({
      readJson: path => pak.readJson(path),
      loadTexture: resources.loadTexture, loadMesh: resources.loadMesh
    });
    await library.load(effectId);
    const def = library.getDefinition(effectId);
  // 4. Uniforms 및 CaptureDriver 설정
  const uniforms = {
    gradeU: { value: new THREE.Matrix3() },
    intU: { value: 1 }
  };

  driver = createCaptureDriver(def, resources, uniforms, renderer);

  // 5. wire-capture 로 프레임 캡처
  const captureOptions = {
    elevation,
    facing,
    seed,
    roll: 0,
    nativeX: false,
    speed: 1,
    fps,
    duration,
    size,
    framing: 'auto',
    aspect: 'square',
    padding: 0.06
  };

  const captured = await captureFrames(driver, captureOptions);

  // 6. pixel.js 로 픽셀화
  const pix = pixelate(captured, size, {
    ...DEFAULT_PIXEL,
    colors,
    autoBright: true
  });

  // 7. export.js 의 encodeGif 로 GIF 바이너리 생성
  const gifBytes = encodeGif(pix.frames, { fps, scale: 1 });

  return {
    gifBytes,
    frameCount: pix.frames.length,
    captured,
    frames: pix.frames,
    palette: pix.palette
  };
  } finally {
    driver?.dispose();
    resources?.dispose();
  }
}
