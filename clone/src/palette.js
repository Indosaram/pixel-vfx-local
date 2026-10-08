export function parsePalette(text) {
  const matches = String(text).matchAll(/#?\b([\da-f]{6})\b/gi);
  const palette = Array.from(matches, match => [0, 2, 4].map(offset => parseInt(match[1].slice(offset, offset + 2), 16) / 255));
  if (!palette.length) {
    for (const match of String(text).matchAll(/^\s*(\d+)\s+(\d+)\s+(\d+)/gm)) {
      palette.push([Number(match[1]) / 255, Number(match[2]) / 255, Number(match[3]) / 255]);
    }
  }
  return palette;
}

export function paletteFromPixels(data) {
  const seen = new Set(), palette = [];
  for (let i = 0; i < data.length && palette.length < 256; i += 4) {
    if (data[i + 3] <= 127) continue;
    const key = data[i] * 65536 + data[i + 1] * 256 + data[i + 2];
    if (seen.has(key)) continue;
    seen.add(key);
    palette.push([data[i] / 255, data[i + 1] / 255, data[i + 2] / 255]);
  }
  return palette;
}
