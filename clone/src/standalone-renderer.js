
import * as THREE from 'three';
import { openPak } from './wire-pak.js';
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
  renderer
}) {
  const pak = await openPak(pakPath);
  const manifest = await pak.readJson('manifest.json');

  // 1. 텍스처 로더: 브라우저/Electron 환경의 ImageBitmap 또는 텍스처 생성
  const loadTexture = async (nameOrPath) => {
    const meta = manifest.textures[nameOrPath];
    const filePath = meta ? meta.file : nameOrPath;
    const bytes = await pak.readFile(filePath);
    const blob = new Blob([bytes], { type: 'image/webp' });
    const imgBitmap = await createImageBitmap(blob);
    const tex = new THREE.CanvasTexture(imgBitmap);
    tex.needsUpdate = true;
    return tex;
  };

  const readJson = async (filePath) => {
    return await pak.readJson(filePath);
  };

  // 2. wire-library 로 이펙트 정의 로드
  const library = createWireLibrary({
    readJson,
    loadTexture,
    loadMesh: async (name) => {
      const meta = manifest.meshes[name];
      const filePath = meta ? meta.file : name;
      return await pak.readJson(filePath);
    }
  });
  await library.init();
  await library.load(effectId);
  const def = library.getDefinition(effectId);

  // 3. wire-resources 로 리소스 바인딩
  const resources = createWireResources({
    textures: manifest.textures,
    meshes: manifest.meshes,
    readJson,
    loadTexture
  });

  // 필요한 텍스처와 메시 사전 로드
  if (def.textures) {
    for (const t of def.textures) await resources.loadTexture(t);
  }
  if (def.meshes) {
    for (const m of def.meshes) await resources.loadMesh(m);
  }

  // 4. Uniforms 및 CaptureDriver 설정
  const uniforms = {
    gradeU: { value: new THREE.Matrix3() },
    intU: { value: 1 }
  };

  const driver = createCaptureDriver(def, resources, uniforms, renderer);

  // 5. wire-capture 로 프레임 캡처
  const captureOptions = {
    elevation,
    facing,
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

  driver.dispose();
  resources.dispose();

  return {
    gifBytes,
    frameCount: pix.frames.length,
    captured
  };
}
