export function normalizeSeedEdit(value) {
  return Math.max(1, +value | 0);
}

const even = (n) => Array.from({ length: n }, (_, i) => +(i / Math.max(1, n - 1)).toFixed(4));

export function normalizeGradientEdit(gradient, fallbackStops) {
  const g = structuredClone(gradient);
  if (!Array.isArray(g.stops) || g.stops.length < 2) g.stops = fallbackStops.slice();
  if (!Array.isArray(g.pos) || g.pos.length !== g.stops.length) g.pos = even(g.stops.length);
  if (g.reverse) { g.pos = g.pos.map((v) => 1 - v); g.reverse = false; }
  const index = g.stops.map((_, i) => i).sort((a, b) => g.pos[a] - g.pos[b]);
  g.stops = index.map((i) => g.stops[i]);
  g.pos = index.map((i) => g.pos[i]);
  return { gradient: g, index };
}

export function selectFrameRange(frameCount, exportSettings, overrides) {
  const X = exportSettings;
  const pick = (k, d) => (overrides && overrides[k] != null && overrides[k] !== '' ? +overrides[k] : d);
  const from = Math.max(1, pick('from', +X.rangeFrom || 1) | 0);
  const to = Math.max(0, pick('to', +X.rangeTo || 0) | 0);
  const a = Math.min(from, Math.max(1, frameCount));
  const b = Math.min(Math.max(a, to || frameCount), frameCount);
  return { a: a - 1, b, full: a === 1 && b === frameCount };
}

export function editFrameRange(from, to, which) {
  from = Math.max(1, from | 0);
  to = Math.max(0, to | 0);
  if (to && to < from) {
    if (which === 'from') to = 0;
    else from = 1;
  }
  return { rangeFrom: from, rangeTo: to };
}
