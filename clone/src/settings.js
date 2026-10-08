// Clone-owned settings schema: defaults are supplied by the caller, not
// inferred from the reference report's incomplete defaults inventory.
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function invalid(path, message) {
  throw { code: 'INVALID_SETTINGS', stage: 'settings', message, context: { path } };
}

function merge(defaults, input, path) {
  if (!object(input)) invalid(path, 'Expected a settings object');
  const result = structuredClone(defaults);
  for (const [key, value] of Object.entries(input)) {
    const at = path ? `${path}.${key}` : key;
    if (!Object.hasOwn(defaults, key) || ['__proto__', 'constructor', 'prototype'].includes(key)) {
      invalid(at, 'Unknown settings field');
    }
    if (object(defaults[key])) result[key] = merge(defaults[key], value, at);
    else {
      if (Array.isArray(defaults[key]) ? !Array.isArray(value) : typeof value !== typeof defaults[key]) {
        invalid(at, 'Settings field type mismatch');
      }
      if (typeof value === 'number' && !Number.isFinite(value)) invalid(at, 'Expected finite number');
      result[key] = structuredClone(value);
    }
  }
  return result;
}

export function normalizeRange(range, frameCount) {
  if (!Number.isInteger(frameCount) || frameCount < 0) invalid('frameCount', 'Expected nonnegative frame count');
  if (!Array.isArray(range) || range.length !== 2 || !range.every(Number.isFinite)) {
    invalid('range', 'Expected two finite endpoints');
  }
  // Empty [0,0] is a clone boundary convention, not a reference behavior claim.
  if (frameCount === 0) return [0, 0];
  const start = Math.max(1, Math.min(frameCount, Math.trunc(range[0])));
  const end = Math.max(start, Math.min(frameCount, Math.trunc(range[1])));
  return [start, end];
}

export function normalizeSettings(input, policy) {
  if (!object(policy?.defaults)) invalid('policy.defaults', 'Explicit defaults required');
  const result = merge(policy.defaults, input, '');
  // Seed conversion is clone-owned; exact reference seed normalization is open.
  if (Object.hasOwn(result, 'seed')) result.seed = result.seed >>> 0;
  if (Object.hasOwn(result, 'holds')) {
    if (!result.holds.every(Number.isFinite)) invalid('holds', 'Expected finite holds');
    result.holds = result.holds.map(value => Math.max(0, Math.min(8, value | 0)));
    if (result.holds.length && result.holds.every(value => value === 0)) result.holds[0] = 1;
  }
  if (result.gradient) {
    // Clone stop representation is {position,color}; reverse mirrors positions.
    if (!Array.isArray(result.gradient.stops)) invalid('gradient.stops', 'Expected stops');
    for (const stop of result.gradient.stops) {
      if (!object(stop) || !Number.isFinite(stop.position) || stop.position < 0 || stop.position > 1) {
        invalid('gradient.stops', 'Expected positions in [0,1]');
      }
    }
    result.gradient.stops = result.gradient.stops.map(stop => ({ ...stop,
      position: result.gradient.reverse ? 1 - stop.position : stop.position
    })).sort((a, b) => a.position - b.position);
    if (Object.hasOwn(result.gradient, 'reverse')) result.gradient.reverse = false;
  }
  if (Object.hasOwn(result, 'range')) result.range = normalizeRange(result.range, policy.frameCount);
  return result;
}
