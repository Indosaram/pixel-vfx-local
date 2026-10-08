import { expect, test } from 'bun:test';
import { createLibrary, resolveVariant, resolveMix } from '../src/library.js';

test('variants patch selected layers without mutating source definitions', () => {
  const base = { id: 'base', emitters: [{ delay: 1 }, { delay: 2 }], assets: ['a'] };
  const result = resolveVariant(base, { id: 'variant', layers: [{ index: 1, patch: { delay: 5 } }], assets: ['a', 'b'] });
  expect(result.emitters.map(e => e.delay)).toEqual([1, 5]);
  expect(result.assets).toEqual(['a', 'b']);
  expect(base.emitters[1].delay).toBe(2);
});

test('mixes preserve requested order, transform copied layers and merge assets', () => {
  const definition = { emitters: [{ delay: 1, position: [1, 2, 3], scale: [1, 2, 1] }, { delay: 4 }], assets: ['texture'] };
  const result = resolveMix('mix', [{ definition, indices: [1, 0], delay: 2, scale: 2, position: [10, 0, -1] }]);
  expect(result.emitters.map(e => e.delay)).toEqual([6, 3]);
  expect(result.emitters[1].position).toEqual([12, 4, 5]);
  expect(result.emitters[1].scale).toEqual([2, 4, 2]);
  expect(result.assets).toEqual(['texture']);
  expect(definition.emitters[0].position).toEqual([1, 2, 3]);
  expect(() => resolveMix('bad', [{ definition, indices: [2] }])).toThrow();
});

const bytes = value => new TextEncoder().encode(JSON.stringify(value));
const validDefinition = (id = 'demo') => ({ id, duration: 1, loop: false, emitters: [], assets: [], placement: {} });
const omit = (object, key) => {
  const copy = { ...object };
  delete copy[key];
  return copy;
};
test('definition decoding preserves emitter order and caches successful loads', async () => {
  let calls = 0;
  const library = createLibrary({ read: async path => {
    expect(path).toBe('definitions/demo.json'); calls++;
    return bytes({ ...validDefinition(), emitters: [{ tag: 'second' }, { tag: 'first' }] });
  } });
  expect((await library.loadDefinition('demo')).emitters.map(emitter => emitter.tag)).toEqual(['second', 'first']);
  await library.loadDefinition('demo');
  expect(calls).toBe(1);
});
test('concurrent loads share a pending operation without timing waits', async () => {
  let release;
  const signal = new Promise(resolve => { release = resolve; });
  let calls = 0;
  const library = createLibrary({ read: () => { calls++; return signal; } });
  const a = library.loadDefinition('demo'), b = library.loadDefinition('demo');
  expect(a).toBe(b);
  release(bytes(validDefinition()));
  await Promise.all([a, b]);
  expect(calls).toBe(1);
});
test('rejected read is not cached or automatically retried', async () => {
  let calls = 0;
  const library = createLibrary({ read: async () => {
    if (++calls === 1) throw new Error('missing');
    return bytes(validDefinition());
  } });
  await expect(library.loadDefinition('demo')).rejects.toMatchObject({ code: 'ASSET_READ_FAILED' });
  expect(calls).toBe(1);
  expect((await library.loadDefinition('demo')).id).toBe('demo');
  expect(calls).toBe(2);
});
test('invalid identifiers and malformed definitions fail', async () => {
  const library = createLibrary({ read: async () => new TextEncoder().encode('{broken') });
  await expect(library.loadDefinition('../bad')).rejects.toMatchObject({ code: 'INVALID_ID' });
  await expect(library.loadDefinition('demo')).rejects.toMatchObject({ code: 'INVALID_DEFINITION' });
});
const malformedDefinitions = [
  ['decoded null', 'null'],
  ['decoded array', '[]'],
  ['mismatched id', JSON.stringify({ ...validDefinition(), id: 'other' })],
  ['non-string id', JSON.stringify({ ...validDefinition(), id: 7 })],
  ['missing duration', JSON.stringify(omit(validDefinition(), 'duration'))],
  ['non-numeric duration', JSON.stringify({ ...validDefinition(), duration: '1' })],
  ['non-finite duration', '{"id":"demo","duration":1e999,"loop":false,"emitters":[],"assets":[],"placement":{}}'],
  ['missing loop', JSON.stringify(omit(validDefinition(), 'loop'))],
  ['non-boolean loop', JSON.stringify({ ...validDefinition(), loop: 0 })],
  ['missing emitters', JSON.stringify(omit(validDefinition(), 'emitters'))],
  ['emitters not an array', JSON.stringify({ ...validDefinition(), emitters: {} })],
  ['emitter is a string', JSON.stringify({ ...validDefinition(), emitters: ['second'] })],
  ['emitter is null', JSON.stringify({ ...validDefinition(), emitters: [null] })],
  ['emitter is an array', JSON.stringify({ ...validDefinition(), emitters: [[]] })],
  ['missing assets', JSON.stringify(omit(validDefinition(), 'assets'))],
  ['assets not an array', JSON.stringify({ ...validDefinition(), assets: 'texture' })],
  ['missing placement', JSON.stringify(omit(validDefinition(), 'placement'))],
  ['placement is null', JSON.stringify({ ...validDefinition(), placement: null })],
  ['placement is an array', JSON.stringify({ ...validDefinition(), placement: [] })],
  ['placement is a string', JSON.stringify({ ...validDefinition(), placement: 'center' })],
];
for (const [name, payload] of malformedDefinitions) {
  test(`malformed top-level definition: ${name}`, async () => {
    let calls = 0;
    const library = createLibrary({ read: async () => {
      calls++;
      return new TextEncoder().encode(calls === 1 ? payload : JSON.stringify(validDefinition()));
    } });
    await expect(library.loadDefinition('demo')).rejects.toMatchObject({ code: 'INVALID_DEFINITION', stage: 'library' });
    expect((await library.loadDefinition('demo')).id).toBe('demo');
    expect(calls).toBe(2);
  });
}
test('asset paths are validated before reads and output order is preserved', async () => {
  const calls = [];
  const library = createLibrary({ read: async path => { calls.push(path); return path; } });
  for (const bad of ['/absolute', '../up', 'a/../b', 'C:/file', 'a\\b', 'a//b', './a']) {
    await expect(library.loadAssets(['safe.png', bad])).rejects.toMatchObject({ code: 'INVALID_PATH' });
  }
  expect(calls).toEqual([]);
  expect(await library.loadAssets(['b.png', 'a.png'])).toEqual(['b.png', 'a.png']);
});
