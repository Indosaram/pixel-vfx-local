import { expect, test } from 'bun:test';
import { parsePalette, paletteFromPixels } from '../src/palette.js';

test('decimal fallback preserves duplicates and does not clamp channels', () => {
  expect(parsePalette('256 0 255\n256 0 255')).toEqual([[256 / 255, 0, 1], [256 / 255, 0, 1]]);
  expect(parsePalette('255 0 0\n#00ff00')).toEqual([[0, 1, 0]]);
});

test('text palettes have no image cap and reject embedded hex tokens', () => {
  expect(parsePalette(Array(257).fill('#010203').join('\n'))).toHaveLength(257);
  expect(parsePalette('xabcdef abcdef0 0abcdef _abcdef abcdef_')).toEqual([]);
});

test('image palette accepts alpha128 but excludes alpha127', () => {
  expect(paletteFromPixels(new Uint8Array([255, 0, 0, 127, 0, 255, 0, 128]))).toEqual([[0, 1, 0]]);
});

test('image palette caps distinct colors rather than encountered pixels', () => {
  const data = new Uint8Array(258 * 4);
  for (let i = 0; i < 258; i++) {
    const value = Math.max(0, i - 1);
    data.set([value % 256, Math.floor(value / 256), 0, 255], i * 4);
  }
  const palette = paletteFromPixels(data);
  expect(palette).toHaveLength(256);
  expect(palette[0]).toEqual([0, 0, 0]);
  expect(palette[255]).toEqual([1, 0, 0]);
});

test('hex palette import decodes channel order and ignores malformed tokens', () => {
  expect(parsePalette('#ff0000 00FF00 junk #0000ff xyz123')).toEqual([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
  expect(parsePalette('not-a-palette')).toEqual([]);
});

test('clone opaque-pixel import deduplicates colors in encounter order', () => {
  expect(paletteFromPixels(new Uint8Array([
    255, 0, 0, 255, 255, 0, 0, 255, 0, 255, 0, 0, 0, 0, 255, 255
  ]))).toEqual([[1, 0, 0], [0, 0, 1]]);
});
