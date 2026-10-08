function fail(path, message) {
  const error = new Error(message);
  error.code = 'INVALID_DEFINITION';
  error.stage = 'library';
  error.context = { path };
  return error;
}

const finite = x => typeof x === 'number' && Number.isFinite(x);
const BRANCHES = new Map([
  [0, ['radius', 'thick']], [1, ['radius', 'thick']],
  [2, ['radius', 'thick']], [3, ['radius', 'thick']],
  [4, ['radius', 'thick', 'arc', 'angle']], [7, ['radius', 'thick', 'arc', 'angle']],
  [8, ['radius', 'thick', 'arc', 'angle']], [9, ['radius', 'thick', 'arc', 'angle']],
  [10, ['radius', 'thick', 'arc']], [11, ['radius', 'arc']],
]);

export function validateShape(value, path) {
  if (value === undefined || value === null) return value;
  if (typeof value !== 'object' || Array.isArray(value)) throw fail(path, 'shape must be an object');
  if (!finite(value.type)) throw fail(path, 'shape type must be a finite number');
  for (const name of ['pos', 'rot', 'scale']) {
    const v = value[name];
    if (!v || typeof v !== 'object' || Array.isArray(v)
      || !finite(v.x) || !finite(v.y) || !finite(v.z)) {
      throw fail(path, `shape ${name} must be an object with finite x, y and z`);
    }
  }
  for (const name of BRANCHES.get(value.type) || []) {
    if (!finite(value[name])) throw fail(path, `shape ${name} must be a finite number`);
  }
  if ((value.type === 8 || value.type === 9) && value.len != null && !finite(value.len)) {
    throw fail(path, 'shape len must be a finite number when present');
  }
  return value;
}
