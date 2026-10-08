export function scalarWire(descriptor, time, randomFraction) {
  if (!descriptor) return 0;
  switch (descriptor.t) {
    case 'c': return descriptor.v;
    case 'r': return descriptor.a + (descriptor.b - descriptor.a) * randomFraction;
    case 'k': return descriptor.s * hermite(descriptor.k, time);
    case 'rk': {
      const low = hermite(descriptor.a, time);
      const high = hermite(descriptor.b, time);
      return descriptor.s * (low + (high - low) * randomFraction);
    }
    default: return 0;
  }
}

function hermite(keys, time) {
  if (!keys.length) return 0;
  if (time <= keys[0][0]) return keys[0][1];
  if (time >= keys.at(-1)[0]) return keys.at(-1)[1];
  for (let i = 1; i < keys.length; i++) {
    const left = keys[i - 1], right = keys[i];
    if (time > right[0]) continue;
    const dt = right[0] - left[0];
    if (dt <= 0) return right[1];
    const u = (time - left[0]) / dt;
    const u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * left[1]
      + (u3 - 2 * u2 + u) * left[3] * dt
      + (-2 * u3 + 3 * u2) * right[1]
      + (u3 - u2) * right[2] * dt;
  }
}
