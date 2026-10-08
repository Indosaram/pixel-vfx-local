import { expect, test, spyOn } from 'bun:test';
import { BufferGeometry, Texture, ClampToEdgeWrapping, RepeatWrapping, NoColorSpace, SRGBColorSpace } from 'three';
import { createWireResources } from '../src/wire-resources.js';

test('texture loading shares pending work and configures shader-decoded textures', async () => {
  const ready = Promise.withResolvers();
  const calls = [];
  const resources = createWireResources({
    textures: { a: { file: 'a.png', clamp: true, srgb: true }, b: { file: 'b.png' } }, meshes: {},
    async readJson() {},
    loadTexture(path) { calls.push(path); return path === 'a.png' ? ready.promise : Promise.resolve(new Texture()); },
    anisotropy: 7,
  });
  const first = resources.loadTexture('a'), second = resources.loadTexture('a');
  expect(resources.texture('a')).toBeNull();
  const texture = new Texture();
  texture.colorSpace = SRGBColorSpace;
  ready.resolve(texture);
  expect(await first).toBe(texture);
  expect(await second).toBe(texture);
  expect(calls).toEqual(['a.png']);
  expect(texture.wrapS).toBe(ClampToEdgeWrapping);
  expect(texture.wrapT).toBe(ClampToEdgeWrapping);
  expect(texture.anisotropy).toBe(7);
  expect(texture.colorSpace).toBe(NoColorSpace);
  expect(resources.srgb('a')).toBe(true);
  expect(resources.srgb('missing')).toBe(false);
  const repeated = await resources.loadTexture('b');
  expect(repeated.wrapS).toBe(RepeatWrapping);
  expect(repeated.wrapT).toBe(RepeatWrapping);
  resources.dispose();
});

test('injected resource failures remain cached without repeated I/O', async () => {
  const failure = new Error('resource unavailable');
  let textureCalls = 0, meshCalls = 0;
  const resources = createWireResources({ textures: { a: { file: 'a.png' } }, meshes: { a: { file: 'a.json' } },
    async loadTexture() { textureCalls++; throw failure; },
    async readJson() { meshCalls++; throw failure; },
  });
  for (let i = 0; i < 2; i++) {
    await expect(resources.loadTexture('a')).rejects.toBe(failure);
    await expect(resources.loadMesh('a')).rejects.toBe(failure);
  }
  expect(textureCalls).toBe(1);
  expect(meshCalls).toBe(1);
  expect(resources.texture('a')).toBeNull();
  resources.dispose();
});

test('mesh attributes preserve source values and absent normals are computed', async () => {
  const calls = [];
  const mesh = { pos: [0, 0, 0, 1, 0, 0, 0, 1, 0], uv: [0, 0, 1, 0, 0, 1], idx: [0, 1, 2] };
  const resources = createWireResources({ textures: {}, meshes: { a: { file: 'a.json' }, b: { file: 'b.json' } },
    async readJson(path) { calls.push(path); return path === 'a.json' ? mesh : { ...mesh, nrm: [1, 0, 0, 1, 0, 0, 1, 0, 0] }; },
    async loadTexture() {},
  });
  const a = await resources.loadMesh('a');
  expect(await resources.loadMesh('a')).toBe(a);
  expect(resources.geometry('a')).toBe(a);
  expect(Array.from(a.attributes.position.array)).toEqual(mesh.pos);
  expect(Array.from(a.attributes.uv.array)).toEqual(mesh.uv);
  expect(Array.from(a.index.array)).toEqual(mesh.idx);
  expect(Array.from(a.attributes.normal.array)).toEqual([0, 0, 1, 0, 0, 1, 0, 0, 1]);
  const b = await resources.loadMesh('b');
  expect(Array.from(b.attributes.normal.array)).toEqual([1, 0, 0, 1, 0, 0, 1, 0, 0]);
  expect(calls).toEqual(['a.json', 'b.json']);
  resources.dispose();
});

test('pending mesh reads are shared and replaced by resolved geometry', async () => {
  const ready = Promise.withResolvers();
  let calls = 0;
  const resources = createWireResources({ textures: {}, meshes: { a: { file: 'a.json' } },
    readJson() { calls++; return ready.promise; }, async loadTexture() {},
  });
  const first = resources.loadMesh('a'), second = resources.loadMesh('a');
  expect(resources.geometry('a')).toBeInstanceOf(Promise);
  expect(calls).toBe(1);
  ready.resolve({ pos: [0, 0, 0, 1, 0, 0, 0, 1, 0], uv: [0, 0, 1, 0, 0, 1], idx: [0, 1, 2] });
  const geometry = await first;
  expect(await second).toBe(geometry);
  expect(resources.geometry('a')).toBe(geometry);
  resources.dispose();
});

test('disposal releases loaded resources and builtins exactly once', async () => {
  const texture = new Texture();
  const resources = createWireResources({ textures: { a: { file: 'a.png' } }, meshes: { a: { file: 'a.json' } },
    async loadTexture() { return texture; },
    async readJson() { return { pos: [0, 0, 0, 1, 0, 0, 0, 1, 0], uv: [0, 0, 1, 0, 0, 1], idx: [0, 1, 2] }; },
  });
  const mesh = await resources.loadMesh('a');
  await resources.loadTexture('a');
  const counts = { texture: 0, mesh: 0, white: 0, quad: 0 };
  for (const [name, item] of Object.entries({ texture, mesh, white: resources.white, quad: resources.quad })) {
    item.addEventListener('dispose', () => counts[name]++);
  }
  resources.dispose();
  resources.dispose();
  expect(counts).toEqual({ texture: 1, mesh: 1, white: 1, quad: 1 });
});

test('resources arriving after terminal disposal are released exactly once', async () => {
  const textureReady = Promise.withResolvers(), meshReady = Promise.withResolvers();
  const texture = new Texture();
  let textureDisposals = 0;
  texture.addEventListener('dispose', () => textureDisposals++);
  const geometries = [];
  const originalDispose = BufferGeometry.prototype.dispose;
  const disposal = spyOn(BufferGeometry.prototype, 'dispose').mockImplementation(function () {
    geometries.push(this);
    return originalDispose.call(this);
  });
  try {
    const resources = createWireResources({ textures: { a: { file: 'a.png' } }, meshes: { a: { file: 'a.json' } },
      loadTexture: () => textureReady.promise, readJson: () => meshReady.promise,
    });
    const pendingTexture = resources.loadTexture('a'), pendingMesh = resources.loadMesh('a');
    resources.dispose();
    expect(textureDisposals).toBe(0);
    textureReady.resolve(texture);
    meshReady.resolve({ pos: [0, 0, 0, 1, 0, 0, 0, 1, 0], uv: [0, 0, 1, 0, 0, 1], idx: [0, 1, 2] });
    const [loadedTexture, mesh] = await Promise.all([pendingTexture, pendingMesh]);
    expect(loadedTexture).toBe(texture);
    expect(textureDisposals).toBe(1);
    expect(geometries.filter(value => value === mesh)).toHaveLength(1);
    resources.dispose();
    expect(textureDisposals).toBe(1);
    expect(geometries.filter(value => value === mesh)).toHaveLength(1);
  } finally { disposal.mockRestore(); }
});
