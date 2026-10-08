import { expect, test } from 'bun:test';
import { PlaneGeometry, Texture, Vector3 } from 'three';
import { createCaptureDriver } from '../src/wire-capture-driver.js';

const c = v => ({ t: 'c', v });
function setup() {
  const material = { shader: 'SH_HunFX_simple' };
  const emitter = name => ({ name, max: 4, dur: 1, delay: c(0), loop: false,
    bursts: [[0, c(1), 1, 0.01]], rate: c(0), life: c(1), speed: c(2), size: c(1), rotZ: c(0),
    render: { mat: material, mode: 0, align: 0, len: 1 }, pos: { x: 0, y: 0, z: 0 },
    rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } });
  const glow = emitter('Glow rim');
  glow.trail = { mat: material, world: 1, ratio: 1, life: c(1), minDist: 0.001, width: c(1) };
  const resources = { quad: new PlaneGeometry(), white: new Texture(), timeU: { value: 7 } };
  const uniforms = { gradeU: { value: 1 }, intU: { value: 1 } };
  const events = [];
  const gl = { RGBA: 6408, UNSIGNED_BYTE: 5121,
    readPixels(...args) { events.push(['pixels', ...args.slice(0, 6)]); args[6].fill(37); } };
  const renderer = { setSize: (...args) => events.push(['size', ...args]),
    setClearColor: (...args) => events.push(['clear', ...args]),
    render: (scene, camera) => events.push(['render', scene.children.length, camera]),
    getContext: () => gl };
  const driver = createCaptureDriver({ emitters: [glow, emitter('core')], roles: ['rim', 'body'] }, resources, uniforms, renderer);
  return { driver, resources, uniforms, events };
}

test('restart resets simulation but preserves the shared material clock and resources', () => {
  const { driver, resources } = setup();
  const first = driver.start({ seed: 17, speed: 2 });
  driver.update(1 / 60, null);
  expect(first.clock.t).toBeCloseTo(1 / 30, 12);
  expect(resources.timeU.value).toBeCloseTo(7 + 1 / 60, 12);
  expect(first.parts[0].mat.uniforms.uTime).toBe(resources.timeU);
  const disposed = [];
  for (const [name, obj] of [['geo', first.parts[0].geo], ['mat', first.parts[0].mat],
    ['trailGeo', first.parts[0].trail.geo], ['trailMat', first.parts[0].trail.mat],
    ['sharedQuad', resources.quad], ['sharedTexture', resources.white]]) {
    obj.addEventListener('dispose', () => disposed.push(name));
  }
  const next = driver.start({ seed: 829 });
  expect(next.clock.t).toBe(0);
  expect(next.clock.seed).toBe(829);
  expect(resources.timeU.value).toBeCloseTo(7 + 1 / 60, 12);
  expect(disposed).toEqual(['geo', 'mat', 'trailGeo', 'trailMat']);
  expect(first.group.parent).toBeNull();
  driver.dispose();
});

test('placement, hidden layers and native axis use options rather than effect identifiers', () => {
  const { driver } = setup();
  const first = driver.start({ facing: 90, roll: 30, hideGlow: true, hidden: [1], seed: 0 });
  expect(first.clock.seed).toBe(1);
  expect(first.group.rotation.order).toBe('YXZ');
  expect(first.group.rotation.z).toBeCloseTo(Math.PI / 6, 12);
  expect(first.parts.map(p => p.mesh.visible)).toEqual([false, false]);
  expect(first.parts[0].trail.mesh.visible).toBe(false);
  const next = driver.start({ nativeX: true, facing: 90 });
  const direction = new Vector3(0, 0, -1).applyQuaternion(next.group.quaternion);
  expect(direction.x).toBeCloseTo(-1, 12);
  expect(direction.z).toBeCloseTo(0, 12);
  expect(next.parts.map(p => p.mesh.visible)).toEqual([true, true]);
  driver.dispose();
});

test('read delegates clear, rendering and unsigned RGBA readback in order', () => {
  const { driver, uniforms, events } = setup();
  driver.start({});
  driver.resize(2, 3);
  driver.setIntensity(0.5);
  expect(uniforms.intU.value).toBe(0.5);
  const camera = {};
  expect(Array.from(driver.read(2, 3, 0xffffff, camera))).toEqual(Array(24).fill(37));
  expect(events).toEqual([['size', 2, 3, false], ['clear', 0xffffff, 1],
    ['render', 1, camera], ['pixels', 0, 0, 2, 3, 6408, 5121]]);
  driver.dispose();
});

test('hidden entries accept layer names and roles including trail visibility', () => {
  const { driver } = setup();
  for (const hidden of [['Glow rim'], ['rim']]) {
    const wire = driver.start({ hidden });
    expect(wire.parts[0].mesh.visible).toBe(false);
    expect(wire.parts[0].trail.mesh.visible).toBe(false);
    expect(wire.parts[1].mesh.visible).toBe(true);
  }
  driver.dispose();
});
