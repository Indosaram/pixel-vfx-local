import { expect, test } from 'bun:test';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createProjectFiles } from '../src/project-files.js';
import { createWireLibrary } from '../src/wire-library.js';
import { createWireResources } from '../src/wire-resources.js';
import { DataTexture } from 'three';

test('project reads preserve bytes and reject malformed paths and external junctions', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'clone-project-files-'));
  const root = join(sandbox, 'project'), outside = join(sandbox, 'project-sibling');
  try {
    await mkdir(root); await mkdir(outside);
    await mkdir(join(root, 'nested'));
    await writeFile(join(root, 'nested', 'inside.json'), '{"inside":true}');
    await writeFile(join(root, 'data.json'), '{"value":7}');
    await writeFile(join(root, 'raw.bin'), new Uint8Array([0, 128, 255]));
    await writeFile(join(root, 'bad.json'), '{');
    await writeFile(join(root, 'bad-utf8.json'), new Uint8Array([0x22, 0xff, 0x22]));
    await writeFile(join(outside, 'secret.json'), '{"outside":true}');
    await symlink(outside, join(root, 'escape'), process.platform === 'win32' ? 'junction' : 'dir');
    await symlink(join(root, 'nested'), join(root, 'inside-link'), process.platform === 'win32' ? 'junction' : 'dir');
    const files = await createProjectFiles(root);
    expect(await files.readJson('data.json')).toEqual({ value: 7 });
    expect(await files.readJson('nested/inside.json')).toEqual({ inside: true });
    expect(await files.readJson('inside-link/inside.json')).toEqual({ inside: true });
    expect(Array.from(await files.read('raw.bin'))).toEqual([0, 128, 255]);
    for (const path of ['', '../project-sibling/secret.json', './data.json', 'a//b', '/data.json',
      'C:/data.json', 'a\\b', 'a:stream', 'a\0b', 'escape/secret.json']) {
      await expect(files.read(path)).rejects.toMatchObject({ code: 'INVALID_PATH', stage: 'library', context: { path } });
    }
    await expect(files.read('missing.json')).rejects.toMatchObject({ code: 'ASSET_READ_FAILED' });
    for (const path of ['bad.json', 'bad-utf8.json']) {
      await expect(files.readJson(path)).rejects.toMatchObject({ code: 'INVALID_DEFINITION', context: { path } });
    }
  } finally { await rm(sandbox, { recursive: true, force: true }); }
});

test('file-backed library loads an authored definition and confines catalog paths', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'clone-file-library-'));
  const root = join(sandbox, 'project');
  try {
    await mkdir(root);
    await writeFile(join(root, 'manifest.json'), JSON.stringify({ effects: [
      { id: 'local', file: 'effect.json' }, { id: 'escape', file: '../outside.json' },
    ] }));
    const authored = { emitters: [], textures: [], meshes: [] };
    await writeFile(join(root, 'effect.json'), JSON.stringify(authored));
    await writeFile(join(sandbox, 'outside.json'), JSON.stringify(authored));
    const files = await createProjectFiles(root);
    const library = createWireLibrary({ readJson: files.readJson,
      async loadTexture() { throw new Error('Unexpected texture request'); },
      async loadMesh() { throw new Error('Unexpected mesh request'); },
    });
    await library.load('local');
    expect(library.getDefinition('local')).toEqual(authored);
    await expect(library.load('escape')).rejects.toMatchObject({
      code: 'INVALID_PATH', stage: 'library', context: { path: '../outside.json' },
    });
    expect(library.getDefinition('escape')).toBeUndefined();
  } finally { await rm(sandbox, { recursive: true, force: true }); }
});

test('resource adapters resolve real mesh JSON and confined texture bytes', async () => {
  const root = await mkdtemp(join(tmpdir(), 'clone-file-resources-'));
  let resources;
  try {
    const mesh = { pos: [0, 0, 0, 1, 0, 0, 0, 1, 0], uv: [0, 0, 1, 0, 0, 1], idx: [0, 1, 2] };
    await writeFile(join(root, 'mesh.json'), JSON.stringify(mesh));
    await writeFile(join(root, 'pixel.rgba'), new Uint8Array([17, 31, 63, 255]));
    const files = await createProjectFiles(root);
    resources = createWireResources({ meshes: { triangle: { file: 'mesh.json' } },
      textures: { pixel: { file: 'pixel.rgba' }, escape: { file: '../outside.rgba' } },
      readJson: files.readJson,
      async loadTexture(path) { return new DataTexture(await files.read(path), 1, 1); },
    });
    const [geometry, texture] = await Promise.all([
      resources.loadMesh('triangle'), resources.loadTexture('pixel'),
    ]);
    expect(Array.from(geometry.attributes.position.array)).toEqual(mesh.pos);
    expect(Array.from(texture.image.data)).toEqual([17, 31, 63, 255]);
    await expect(resources.loadTexture('escape')).rejects.toMatchObject({ code: 'INVALID_PATH' });
    expect(resources.texture('escape')).toBeNull();
  } finally { resources?.dispose(); await rm(root, { recursive: true, force: true }); }
});
