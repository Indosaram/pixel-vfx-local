import { expect, test, spyOn } from 'bun:test';
import { TextureLoader, Texture } from 'three';
import { createTextureLoader } from '../src/wire-texture-loader.js';

test('decoder URL ownership covers success, rejection and allocation failures', async () => {
  const created = spyOn(URL, 'createObjectURL').mockReturnValue('blob:owned');
  const revoked = spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  const decode = spyOn(TextureLoader.prototype, 'loadAsync');
  const failure = new Error('sentinel');
  try {
    const failedRead = createTextureLoader(async () => { throw failure; });
    await expect(failedRead('x')).rejects.toBe(failure);
    expect(created).not.toHaveBeenCalled();
    expect(decode).not.toHaveBeenCalled();
    const load = createTextureLoader(async () => new Uint8Array([1]));
    created.mockImplementationOnce(() => { throw failure; });
    await expect(load('x')).rejects.toBe(failure);
    expect(decode).not.toHaveBeenCalled();
    expect(revoked).not.toHaveBeenCalled();
    for (const reject of [false, true]) {
      const pending = Promise.withResolvers(), started = Promise.withResolvers();
      decode.mockImplementationOnce(() => { started.resolve(); return pending.promise; });
      const before = revoked.mock.calls.length;
      const outcome = load('x').then(value => ({ value }), error => ({ error }));
      await started.promise;
      expect(decode.mock.calls.at(-1)).toEqual(['blob:owned']);
      expect(revoked.mock.calls.length).toBe(before);
      const texture = new Texture();
      if (reject) pending.reject(failure); else pending.resolve(texture);
      const settled = await outcome;
      if (reject) expect(settled.error).toBe(failure);
      else expect(settled.value).toBe(texture);
      expect(revoked.mock.calls.length).toBe(before + 1);
      expect(revoked.mock.calls.at(-1)).toEqual(['blob:owned']);
      texture.dispose();
    }
  } finally { decode.mockRestore(); revoked.mockRestore(); created.mockRestore(); }
});
