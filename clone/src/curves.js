// Curve object fields are clone-owned, not reference wire-format compatibility.

const MULTIPLIER = 16807;
const MODULUS = 2147483647;

/**
 * Park-Miller ("minimal standard") PRNG: state = state * 16807 mod 2147483647.
 *
 * CLONE-OWNED INTERFACE: each call returns the raw integer state, not a
 * normalized float. The reference normalization (state-1)/2147483646 is
 * applied only by createRandomStream, so raw-state callers must not assume
 * [0, 1) values here.
 *
 * The seed is converted to its unsigned 32-bit form; a resulting 0 is not a
 * valid Park-Miller state and falls back to 1 (same stream as seed 1).
 *
 * @param {number} seed unsigned 32-bit seed (negative numbers wrap via >>> 0)
 * @returns {() => number} callable returning the next integer state
 */
export function makeRng(seed) {
  let state = seed >>> 0;
  if (state === 0) state = 1;
  return () => {
    state = (state * MULTIPLIER) % MODULUS;
    return state;
  };
}

// Reference normalization is (state-1)/2147483646 per the static emission
// addendum, applied only at the effect boundary; makeRng keeps the raw
// integer API. Seed 2147483647's zero state is not repaired, so its first
// draw is a negative fraction, matching the source.
export function createRandomStream(seed) {
  let generator = makeRng(seed);
  let draws = 0;
  return {
    next() { draws++; return (generator() - 1) / (MODULUS - 1); },
    reset(nextSeed = seed) { seed = nextSeed; generator = makeRng(seed); draws = 0; },
    get draws() { return draws; }
  };
}

export function samplePercentile(values, percentile, random) {
  if (!values.length) throw { code: 'EMPTY_SAMPLE', stage: 'pixel', message: 'Cannot sample an empty set', context: {} };
  // Preserve the first 40000 values; each later value appends with probability 0.1.
  const sample = values.slice(0, 40000);
  for (let i = 40000; i < values.length; i++) {
    if (random() < 0.1) sample.push(values[i]);
  }
  sample.sort((a, b) => a - b);
  return sample[Math.floor(sample.length * percentile)];
}

function hermite(keys, t) {
  if (!keys.length) return 0;
  if (t <= keys[0][0]) return keys[0][1];
  if (t >= keys.at(-1)[0]) return keys.at(-1)[1];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t > b[0]) continue;
    const duration = b[0] - a[0];
    const u = (t - a[0]) / duration;
    const u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * a[1]
      + (u3 - 2 * u2 + u) * duration * a[3]
      + (-2 * u3 + 3 * u2) * b[1]
      + (u3 - u2) * duration * b[2];
  }
}

export function scalar(curve, t, r) {
  switch (curve?.type) {
    case 'c': return curve.value;
    case 'r': return curve.min + (curve.max - curve.min) * r;
    case 'k': return hermite(curve.keys, t) * (curve.scale ?? 1);
    case 'rk': {
      const low = hermite(curve.minKeys, t);
      const high = hermite(curve.maxKeys, t);
      return (low + (high - low) * r) * (curve.scale ?? 1);
    }
    default: return 0;
  }
}

function sampleKeys(keys, t, fixed) {
  if (t <= keys[0][0]) return keys[0][1];
  if (t >= keys.at(-1)[0]) return keys.at(-1)[1];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t > b[0]) continue;
    const u = fixed ? 1 : (t - a[0]) / (b[0] - a[0]);
    return Array.isArray(a[1])
      ? a[1].map((value, channel) => value + (b[1][channel] - value) * u)
      : a[1] + (b[1] - a[1]) * u;
  }
}

function gradient(value, t) {
  const rgb = sampleKeys(value.colors, t, value.fixed);
  const alpha = sampleKeys(value.alpha, t, value.fixed);
  return [...rgb, alpha];
}

export function color(curve, t, r) {
  if (!curve) return [1, 1, 1, 1];
  switch (curve.type) {
    case 'c': return [...curve.value];
    case 'r': return curve.min.map((value, i) => value + (curve.max[i] - value) * r);
    case 'g': return gradient(curve, t);
    case 'rg': {
      const low = gradient(curve.min, t), high = gradient(curve.max, t);
      return low.map((value, i) => value + (high[i] - value) * r);
    }
    default: return [1, 1, 1, 1];
  }
}
