import { createTextureLoader } from '../src/wire-texture-loader.js';

export async function runTextureDecode() {
  const source = document.createElement('canvas');
  source.width = source.height = 2;
  const expected = [255, 0, 0, 255, 0, 255, 0, 255,
    0, 0, 255, 255, 255, 255, 0, 255];
  source.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(expected), 2, 2), 0, 0);
  const blob = await new Promise(resolve => source.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Windows browser PNG encoding returned null');
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const reads = [];
  const load = createTextureLoader(async path => { reads.push(path); return bytes; });
  const texture = await load('authored-quadrants.png');
  let malformedRejected = false;
  const malformed = createTextureLoader(async () => new Uint8Array([0, 1, 2, 3]));
  try {
    const unexpected = await malformed('malformed.png');
    unexpected.dispose();
  } catch { malformedRejected = true; }
  try {
    const decoded = document.createElement('canvas');
    decoded.width = decoded.height = 2;
    const context = decoded.getContext('2d');
    context.drawImage(texture.image, 0, 0);
    const pixels = Array.from(context.getImageData(0, 0, 2, 2).data);
    return { name: 'png-byte-decoder', width: texture.image.width, height: texture.image.height,
      expected, pixels, reads, malformedRejected, pngBase64: decoded.toDataURL('image/png'),
      pass: texture.image.width === 2 && texture.image.height === 2
        && reads.length === 1 && reads[0] === 'authored-quadrants.png'
        && malformedRejected && pixels.every((value, index) => value === expected[index]) };
  } finally { texture.dispose(); }
}

export async function runTextureAlphaDecode() {
  const expected = [255, 0, 0, 128, 0, 255, 0, 64, 0, 0, 255, 192, 0, 0, 0, 0];
  const source = document.createElement('canvas');
  source.width = source.height = 2;
  source.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(expected), 2, 2), 0, 0);
  const blob = await new Promise(resolve => source.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Windows browser PNG encoding returned null');
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const texture = await createTextureLoader(async () => bytes)('authored-alpha.png');
  try {
    const decoded = document.createElement('canvas');
    decoded.width = decoded.height = 2;
    const context = decoded.getContext('2d');
    context.drawImage(texture.image, 0, 0);
    const pixels = Array.from(context.getImageData(0, 0, 2, 2).data);
    return { name: 'png-partial-alpha', expected, pixels, width: texture.image.width,
      height: texture.image.height, pngBase64: decoded.toDataURL('image/png'),
      pass: texture.image.width === 2 && texture.image.height === 2
        && pixels.every((value, index) => value === expected[index]) };
  } finally { texture.dispose(); }
}
