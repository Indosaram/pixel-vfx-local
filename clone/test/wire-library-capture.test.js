import { expect, test } from 'bun:test';
import { Texture, Matrix3 } from 'three';
import { createWireLibrary } from '../src/wire-library.js';
import { createWireResources } from '../src/wire-resources.js';
import { createCaptureDriver } from '../src/wire-capture-driver.js';

test('loaded mesh and texture feed the real capture scene across restarts', async () => {
  const c = v => ({ t: 'c', v });
  const definition = { textures: ['ink'], meshes: ['triangle'], emitters: [{
    name: 'authored', max: 4, dur: 1, delay: c(0), loop: false,
    bursts: [[0, c(1), 1, 0.01]], rate: c(0), life: c(1), speed: c(0), size: c(1), rotZ: c(0),
    pos: { x: 0, y: 0, z: 0 }, rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 },
    render: { mode: 4, align: 1, len: 1, mesh: 'triangle', mat: {
      shader: 'SH_HunFX_simple', tex: { _MainTexture: 'ink' }, c: { _uv: [1, 1, 0, 0] },
    } },
  }] };
  const manifest = { effects: [{ id: 'authored', file: 'effect.json' }],
    textures: { ink: { file: 'ink.png', srgb: true } }, meshes: { triangle: { file: 'mesh.json' } } };
  const calls = [];
  const readJson = async path => {
    calls.push(path);
    if (path === 'manifest.json') return manifest;
    if (path === 'effect.json') return definition;
    if (path === 'mesh.json') return { pos: [0, 0, 0, 1, 0, 0, 0, 1, 0], uv: [0, 0, 1, 0, 0, 1], idx: [0, 1, 2] };
    throw new Error(`Unexpected fixture path ${path}`);
  };
  const texture = new Texture();
  const resources = createWireResources({ ...manifest, readJson,
    async loadTexture(path) { calls.push(path); return texture; } });
  const library = createWireLibrary({ readJson, loadTexture: resources.loadTexture, loadMesh: resources.loadMesh });
  let driver;
  try {
    await library.load('authored');
    driver = createCaptureDriver(library.getDefinition('authored'), resources,
      { gradeU: { value: new Matrix3() }, intU: { value: 1 } }, {});
    const first = driver.start({ seed: 17 });
    driver.update(1 / 60, null);
    const part = first.parts[0], geometry = resources.geometry('triangle');
    expect(part.geo.attributes.position).toBe(geometry.attributes.position);
    expect(part.geo.index).toBe(geometry.index);
    expect(part.mat.uniforms.tMain.value).toBe(texture);
    expect(part.mat.uniforms.sR.value.x).toBe(1);
    expect(part.geo.instanceCount).toBe(1);
    expect(part.mat.uniforms.uTime).toBe(resources.timeU);
    const second = driver.start({ seed: 829 });
    expect(second).not.toBe(first);
    expect(second.clock.t).toBe(0);
    expect(second.parts[0].mat.uniforms.uTime).toBe(resources.timeU);
    expect(second.parts[0].geo.attributes.position).toBe(geometry.attributes.position);
    expect(second.parts[0].geo.index).toBe(geometry.index);
    expect(second.parts[0].mat.uniforms.tMain.value).toBe(texture);
    expect(resources.timeU.value).toBeCloseTo(1 / 60, 12);
    await library.load('authored');
    expect(calls.slice().sort()).toEqual(['effect.json', 'ink.png', 'manifest.json', 'mesh.json']);
  } finally { driver?.dispose(); resources.dispose(); }
});
