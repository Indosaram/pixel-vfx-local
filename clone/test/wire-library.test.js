import { expect, test } from 'bun:test';
import { createWireLibrary } from '../src/wire-library.js';

const definition = () => ({ emitters: [], textures: ['white'], meshes: ['quad'] });

test('empty mix normalizes roles and exposes the loaded definition', async () => {
  const original = { emitters: [{ name: 'body' }], textures: [], meshes: [] };
  const lib = createWireLibrary({
    async readJson(path) {
      return path === 'manifest.json' ? { effects: [{ id: 'a', file: 'a.json', mix: [] }] } : original;
    },
    async loadTexture() {}, async loadMesh() {},
  });
  expect(lib.getDefinition('a')).toBeUndefined();
  await lib.load('a');
  const loaded = lib.getDefinition('a');
  expect(loaded.roles).toEqual([null]);
  expect(loaded).not.toBe(original);
  expect(loaded.emitters).not.toBe(original.emitters);
  expect(loaded.textures).not.toBe(original.textures);
  expect(loaded.meshes).not.toBe(original.meshes);
  expect(original.roles).toBeUndefined();
});

for (const kind of ['texture', 'mesh']) {
  test(`load propagates a pending ${kind} rejection`, async () => {
    const started = Promise.withResolvers();
    const resource = Promise.withResolvers();
    const failure = new Error(`${kind} rejected`);
    resource.promise.catch(() => {});
    const loadResource = () => { started.resolve(); return resource.promise; };
    const lib = createWireLibrary({
      async readJson(path) {
        return path === 'manifest.json' ? { effects: [{ id: 'a', file: 'a.json' }] } : definition();
      },
      loadTexture: kind === 'texture' ? loadResource : async () => {},
      loadMesh: kind === 'mesh' ? loadResource : async () => {},
    });
    const outcome = lib.load('a').then(
      value => ({ fulfilled: true, value }),
      error => ({ fulfilled: false, error }));
    await started.promise;
    resource.reject(failure);
    expect(await outcome).toEqual({ fulfilled: false, error: failure });
  });
}

test('concurrent loads share definition work and wait for resources', async () => {
  const reads = [], textures = [], meshes = [];
  const textureReady = Promise.withResolvers();
  const textureStarted = Promise.withResolvers();
  const lib = createWireLibrary({
    async readJson(path) {
      reads.push(path);
      return path === 'manifest.json' ? { effects: [{ id: 'a', file: 'a.json', category: 'test' }] } : definition();
    },
    loadTexture(name) { textures.push(name); textureStarted.resolve(); return textureReady.promise; },
    async loadMesh(name) { meshes.push(name); },
  });
  const first = lib.load('a'), second = lib.load('a');
  let finished = false;
  const observed = first.then(() => { finished = true; });
  await textureStarted.promise;
  expect(finished).toBe(false);
  textureReady.resolve();
  await Promise.all([observed, second]);
  await lib.load('a');
  expect(reads).toEqual(['manifest.json', 'a.json']);
  expect(textures).toEqual(['white']);
  expect(meshes).toEqual(['quad']);
  expect(lib.list({ category: 'test' })).toEqual(['a']);
  expect(lib.list({ category: 'absent' })).toEqual([]);
  expect(lib.info('missing')).toBeNull();
});

test('failed definition promises remain cached and unknown ids never read a definition', async () => {
  const reads = [];
  const failure = new Error('fixture read failure');
  const lib = createWireLibrary({
    async readJson(path) {
      reads.push(path);
      if (path === 'manifest.json') return { effects: [{ id: 'a', file: 'a.json' }] };
      throw failure;
    },
    async loadTexture() {}, async loadMesh() {},
  });
  await expect(lib.load('a')).rejects.toBe(failure);
  await expect(lib.load('a')).rejects.toBe(failure);
  await expect(lib.load('unknown')).rejects.toBeInstanceOf(Error);
  expect(reads).toEqual(['manifest.json', 'a.json']);
});

test('variant bundle is shared and selected mix layers contribute resources', async () => {
  const emitter = { name: 'borrow', delay: { t: 'r', a: 1, b: 2 },
    pos: { x: 1, y: 2, z: 3 }, scale: { x: 1, y: 1, z: 1 },
    render: { mode: 4, mesh: 'borrowMesh', mat: { tex: { main: 'borrowTexture' } } } };
  const reads = [], textures = [], meshes = [];
  const documents = {
    'manifest.json': { effects: [
      { id: 'base', file: 'base.json' },
      { id: 'v1', base: 'base', file: 'variants.json' },
      { id: 'v2', base: 'base', file: 'variants.json' },
      { id: 'borrowed', file: 'borrowed.json' },
      { id: 'mixed', file: 'mixed.json', mix: [{ from: 'borrowed', layers: ['borrow'], delay: 2 }] },
    ] },
    'base.json': { emitters: [emitter], textures: [], meshes: [] },
    'variants.json': { v1: { top: { textures: ['one'] }, emitters: {} },
      v2: { top: { textures: ['two'] }, emitters: {} } },
    'borrowed.json': { emitters: [emitter], roles: ['body'], textures: [], meshes: [] },
    'mixed.json': { emitters: [], textures: [], meshes: [] },
  };
  const lib = createWireLibrary({
    async readJson(path) { reads.push(path); return structuredClone(documents[path]); },
    async loadTexture(name) { textures.push(name); },
    async loadMesh(name) { meshes.push(name); },
  });
  await lib.load(['v1', 'v2']);
  expect(reads.filter(path => path === 'variants.json')).toHaveLength(1);
  expect(reads.filter(path => path === 'base.json')).toHaveLength(2);
  expect(textures.slice().sort()).toEqual(['one', 'two']);
  await lib.load('mixed');
  expect(textures).toContain('borrowTexture');
  expect(meshes).toEqual(['borrowMesh']);
  expect(reads.filter(path => path === 'borrowed.json')).toHaveLength(1);
});
