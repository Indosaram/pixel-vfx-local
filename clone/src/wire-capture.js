import { reconstructFrame } from './wire-capture-pixels.js';
import { accumulateBounds, frameBounds } from './wire-capture-bounds.js';
import { createCaptureCamera } from './wire-capture-camera.js';

export async function captureFrames(driver, options, progress = () => {},
  yieldTick = () => new Promise(r => setTimeout(r))) {
  await driver.load();
  const fps = options.fps, step = 1 / fps;
  const n = Math.max(1, Math.round(options.duration * fps));
  const pre = (options.loop ? (options.warmup || 0) : 0) + (options.start || 0);
  const H0 = options.searchHalf || 16, R0 = 256;
  driver.resize(R0, R0);
  let camera = createCaptureCamera(options, -H0, H0, -H0, H0);
  const advance = (seconds) => {
    const count = Math.round(seconds * 60);
    for (let i = 0; i < count; i++) driver.update(1 / 60, camera);
  };
  driver.start(options);
  advance(pre);
  const bounds = { x0: 1e9, x1: -1e9, y0: 1e9, y1: -1e9 };
  for (let f = 0; f < n; f++) {
    advance(step);
    accumulateBounds(bounds,
      driver.read(R0, R0, 0x000000, camera),
      driver.read(R0, R0, 0xffffff, camera));
    if (f % 4 === 0) { progress(0.4 * f / n); await yieldTick(); }
  }
  const fb = frameBounds(bounds, options);
  if (!fb) return { frames: [], empty: true };
  driver.resize(fb.width, fb.height);
  camera = createCaptureCamera(options, fb.left, fb.right, fb.bottom, fb.top);
  driver.start(options);
  advance(pre);
  const frames = [];
  for (let f = 0; f < n; f++) {
    advance(step);
    const black = driver.read(fb.width, fb.height, 0x000000, camera);
    const white = driver.read(fb.width, fb.height, 0xffffff, camera);
    driver.setIntensity(0.5);
    const half = driver.read(fb.width, fb.height, 0x000000, camera);
    driver.setIntensity(1);
    frames.push(reconstructFrame(fb.width, fb.height, black, white, half));
    if (f % 2 === 0) { progress(0.4 + 0.6 * f / n); await yieldTick(); }
  }
  progress(1);
  return { frames, origin: fb.origin, shape: fb.shape, k: fb.k, fps, worldPerPx: fb.worldPerPx };
}
