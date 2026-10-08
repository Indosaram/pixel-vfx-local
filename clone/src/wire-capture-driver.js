import { Scene } from 'three';
import { createWireScene } from './wire-scene.js';
import { createWireMaterial } from './wire-material.js';
import * as shaders from './wire-shaders.js';

const DEG = Math.PI / 180;

export function createCaptureDriver(definition, resources, uniforms, renderer) {
  const scene = new Scene();
  let wire = null;
  const release = () => {
    if (!wire) return;
    scene.remove(wire.group);
    for (const part of wire.parts) {
      part.geo.dispose();
      part.mat.dispose();
      if (part.trail) { part.trail.geo.dispose(); part.trail.mat.dispose(); }
    }
    wire = null;
  };
  // Definition and resources have already been loaded by the caller.
  const load = async () => {};
  const place = (group, direction, roll) => {
    let x = direction[0], z = direction[2], base = 0;
    const l2 = x * x + z * z;
    if (l2 > 1e-10) { const l = Math.sqrt(l2); x /= l; z /= l; base = Math.atan2(-x, -z); }
    group.rotation.set(0, base, (roll || 0) * DEG, 'YXZ');
  };
  const start = (options = {}) => {
    release();
    wire = createWireScene(definition, resources, uniforms,
      (m, mode, opts, res) => createWireMaterial(m, mode, opts, res, shaders), () => {});
    scene.add(wire.group);
    const yaw = (options.facing || 0) * DEG;
    const dir = options.nativeX
      ? [-Math.sin(yaw), 0, -Math.cos(yaw)]
      : [Math.cos(yaw), 0, -Math.sin(yaw)];
    place(wire.group, dir, options.roll);
    const hide = new Set(options.hidden || []);
    if (options.hideGlow) {
      for (const part of wire.parts) {
        if (/glow/i.test(part.role || '') || /^Glow/i.test(part.name || '')) hide.add(part.idx);
      }
    }
    for (const part of wire.parts) {
      if (hide.has(part.idx) || hide.has(part.name) || (part.role && hide.has(part.role))) {
        part.mesh.visible = false;
        if (part.trail) part.trail.mesh.visible = false;
      }
    }
    wire.clock.tempo = options.speed || 1;
    wire.clock.play((options.seed >>> 0) || 1);
    return wire;
  };
  const update = (dt, camera) => {
    resources.timeU.value += dt;
    if (wire) wire.clock.update(dt, camera);
  };
  const resize = (w, h) => renderer.setSize(w, h, false);
  const read = (w, h, bg, camera) => {
    renderer.setClearColor(bg, 1);
    renderer.render(scene, camera);
    const gl = renderer.getContext();
    const buf = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    return buf;
  };
  const setIntensity = v => { uniforms.intU.value = v; };
  return { load, start, update, resize, read, setIntensity, dispose: release };
}
