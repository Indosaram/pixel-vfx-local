function fail(path, message) {
  const error = new Error(message);
  error.code = 'INVALID_DEFINITION';
  error.stage = 'library';
  error.context = { path };
  return error;
}

const finite = x => typeof x === 'number' && Number.isFinite(x);
const minFinite = (x, n) => Array.isArray(x) && x.length >= n && Array.from(x.slice(0, n)).every(finite);
const keyFrames = x => Array.isArray(x) && Array.from(x).every(k => minFinite(k, 4));

function descriptor(value, path) {
  if (value === undefined || value === null) return value;
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw fail(path, 'descriptor must be an object');
  }
  if (typeof value.t !== 'string') throw fail(path, 'descriptor t must be a string tag');
  return value;
}

function checkGradient(g, path) {
  if (!g || typeof g !== 'object' || Array.isArray(g)
    || !Array.isArray(g.c) || !Array.isArray(g.a)) {
    throw fail(path, 'gradient must have c and a arrays');
  }
  if (!Array.from(g.c).every(k => minFinite(k, 4))) throw fail(path, 'gradient c entries need at least 4 finite numbers');
  if (!Array.from(g.a).every(k => minFinite(k, 2))) throw fail(path, 'gradient a entries need at least 2 finite numbers');
}

export function validateScalar(value, path) {
  const d = descriptor(value, path);
  if (d === undefined || d === null) return d;
  switch (d.t) {
    case 'c':
      if (!finite(d.v)) throw fail(path, 'c.v must be a finite number');
      break;
    case 'r':
      if (!finite(d.a) || !finite(d.b)) throw fail(path, 'r.a and r.b must be finite numbers');
      break;
    case 'k':
      if (!finite(d.s) || !keyFrames(d.k)) throw fail(path, 'k.s must be finite and k must be key frames');
      break;
    case 'rk':
      if (!finite(d.s) || !keyFrames(d.a) || !keyFrames(d.b)) throw fail(path, 'rk.s must be finite and a/b must be key frames');
      break;
  }
  return d;
}

export function validateColor(value, path) {
  const d = descriptor(value, path);
  if (d === undefined || d === null) return d;
  switch (d.t) {
    case 'col':
      if (!minFinite(d.v, 4)) throw fail(path, 'col.v needs at least 4 finite numbers');
      break;
    case 'rcol':
      if (!minFinite(d.a, 4) || !minFinite(d.b, 4)) throw fail(path, 'rcol.a and rcol.b need at least 4 finite numbers');
      break;
    case 'grad':
      checkGradient(d.g, path);
      break;
    case 'rgrad':
      checkGradient(d.a, path);
      checkGradient(d.b, path);
      break;
  }
  return d;
}
