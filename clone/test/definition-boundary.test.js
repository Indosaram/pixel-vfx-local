import { expect, test } from 'bun:test';
import { createLibrary } from '../src/library.js';

test('incomplete decoded definition is rejected before caching and a corrected retry loads', async () => {
  let reads = 0;
  const complete = {
    id: 'boundary', duration: 1, loop: false,
    emitters: [{ id: 'first' }], assets: [], placement: {},
  };
  const { duration, ...incomplete } = complete;
  const library = createLibrary({ read: async () => {
    reads++;
    return new TextEncoder().encode(JSON.stringify(reads === 1 ? incomplete : complete));
  } });
  await expect(library.loadDefinition('boundary')).rejects.toMatchObject({
    code: 'INVALID_DEFINITION', stage: 'library',
  });
  expect(reads).toBe(1);
  expect(await library.loadDefinition('boundary')).toEqual(complete);
  expect(reads).toBe(2);
  expect(await library.loadDefinition('boundary')).toEqual(complete);
  expect(reads).toBe(2);
});
