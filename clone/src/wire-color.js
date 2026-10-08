export function colorWire(descriptor, time, randomFraction, out) {
  if (!descriptor) {
    out[0] = out[1] = out[2] = out[3] = 1;
    return out;
  }
  const t = descriptor.t;
  if (t === 'col') {
    const v = descriptor.v;
    for (let i = 0; i < 4; i++) out[i] = v[i];
    return out;
  }
  if (t === 'rcol') {
    const a = descriptor.a, b = descriptor.b, r = randomFraction;
    for (let i = 0; i < 4; i++) out[i] = a[i] + (b[i] - a[i]) * r;
    return out;
  }
  if (t === 'grad') return gradientWire(descriptor.g, time, out);
  if (t === 'rgrad') {
    const lo = gradientWire(descriptor.a, time, [0, 0, 0, 0]);
    const hi = gradientWire(descriptor.b, time, [0, 0, 0, 0]);
    for (let i = 0; i < 4; i++) out[i] = lo[i] + (hi[i] - lo[i]) * randomFraction;
    return out;
  }
  return out;
}

function pickSegment(keys, time, m) {
  const first = keys[0];
  if (keys.length === 1 || time <= first[0]) return [first, first, 0];
  const last = keys[keys.length - 1];
  if (time >= last[0]) return [last, last, 0];
  for (let i = 0; i + 1 < keys.length; i++) {
    const left = keys[i];
    const right = keys[i + 1];
    if (time <= right[0]) {
      const f = m === 1 ? 1 : (time - left[0]) / Math.max(1e-6, right[0] - left[0]);
      return [left, right, f];
    }
  }
  return [last, last, 0];
}

function gradientWire(payload, time, out) {
  const m = payload.m;
  const c = payload.c;
  if (c.length === 0) {
    out[0] = 1; out[1] = 1; out[2] = 1;
  } else {
    const s = pickSegment(c, time, m);
    for (let i = 0; i < 3; i++) out[i] = s[0][i + 1] + (s[1][i + 1] - s[0][i + 1]) * s[2];
  }
  const a = payload.a;
  if (a.length === 0) {
    out[3] = 1;
  } else {
    const s = pickSegment(a, time, m);
    out[3] = s[0][1] + (s[1][1] - s[0][1]) * s[2];
  }
  return out;
}
