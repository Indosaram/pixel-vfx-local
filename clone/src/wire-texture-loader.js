import { TextureLoader } from 'three';

export function createTextureLoader(readBytes) {
  const loader = new TextureLoader();
  return async path => {
    const bytes = await readBytes(path);
    const url = URL.createObjectURL(new Blob([bytes]));
    try { return await loader.loadAsync(url); }
    finally { URL.revokeObjectURL(url); }
  };
}
