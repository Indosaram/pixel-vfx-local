export function accumulateBounds(bounds, black, white) {
  const R0 = 256;
  for (let i = 0, p = 0; p < R0 * R0; p++, i += 4) {
    const al = Math.max(
      255 - (white[i] - black[i]),
      255 - (white[i + 1] - black[i + 1]),
      255 - (white[i + 2] - black[i + 2]));
    if (al > 30) {
      const x = p % R0, y = (p / R0) | 0;
      if (x < bounds.x0) bounds.x0 = x;
      if (x > bounds.x1) bounds.x1 = x;
      if (y < bounds.y0) bounds.y0 = y;
      if (y > bounds.y1) bounds.y1 = y;
    }
  }
  return bounds;
}

export function frameBounds(bounds, options) {
  if (bounds.x1 < bounds.x0) return null;
  const H0 = options.searchHalf || 16, R0 = 256;
  const px = 2 * H0 / R0;
  let L = -H0 + (bounds.x0 - 1) * px, R = -H0 + (bounds.x1 + 2) * px;
  let B = -H0 + (bounds.y0 - 1) * px, T = -H0 + (bounds.y1 + 2) * px;
  let shape = [1, 1];
  if (options.aspect === 'auto') {
    const asp = (R - L) / (T - B);
    shape = asp > 1.7 ? [2, 1] : asp < 1 / 1.7 ? [1, 2] : [1, 1];
  }
  const pad = 1 + 2 * (options.padding ?? 0.06);
  let unit;
  if (options.framing === 'fixed') unit = options.size * options.worldPerPx;
  else unit = Math.max((R - L) / shape[0], (T - B) / shape[1]) * pad;
  let cx = (L + R) / 2, cy = (B + T) / 2;
  if (options.center === 'origin') { cx = 0; cy = 0; }
  L = cx - unit * shape[0] / 2; R = cx + unit * shape[0] / 2;
  B = cy - unit * shape[1] / 2; T = cy + unit * shape[1] / 2;
  const k = Math.max(2, Math.min(8, Math.round((options.srcRes || 384) / options.size)));
  const width = options.size * k * shape[0], height = options.size * k * shape[1];
  return {
    left: L, right: R, bottom: B, top: T, shape, k, width, height,
    origin: [(0 - L) / (R - L), (T - 0) / (T - B)],
    worldPerPx: unit / options.size,
  };
}
