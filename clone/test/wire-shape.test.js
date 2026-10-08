import { expect, test } from 'bun:test';
import { sampleShape } from '../src/wire-shape.js';

const shape = type => ({ type, radius: 2, thick: 1, arc: 360, angle: 0, len: 4,
  scale: { x: 1, y: 1, z: 1 }, rot: { x: 0, y: 0, z: 0 }, pos: { x: 0, y: 0, z: 0 } });
function stream(values) {
  let count = 0;
  return { random: () => {
    if (count >= values.length) throw new Error('Unexpected shape RNG draw');
    return values[count++];
  }, count: () => count };
}
function vector(actual, expected) {
  expect(actual.length).toBe(3);
  actual.forEach((v, i) => expect(v).toBeCloseTo(expected[i], 12));
}

test('absent and unsupported shapes consume no draws; unsupported still transforms', () => {
  const rng = stream([]);
  expect(sampleShape(null, rng.random)).toEqual({ pos: [0, 0, 0], dir: [0, 0, 1] });
  const s = shape(99);
  s.pos = { x: 2, y: 3, z: 4 };
  expect(sampleShape(s, rng.random)).toEqual({ pos: [2, 3, 4], dir: [0, 0, 1] });
  expect(rng.count()).toBe(0);
});

test('sphere family uses cube-root radius and hemisphere reflects negative z', () => {
  for (const type of [0, 1, 2, 3]) {
    const rng = stream([0.5, 0.75, 0.125]);
    const result = sampleShape(shape(type), rng.random);
    vector(result.dir, [0, 0, type < 2 ? -1 : 1]);
    vector(result.pos, [0, 0, type < 2 ? -1 : 1]);
    expect(rng.count()).toBe(3);
  }
});

test('cone family samples the disk and only extended types draw axial distance', () => {
  for (const type of [4, 7, 8, 9]) {
    const rng = stream(type < 8 ? [0, 0.25] : [0, 0.25, 0.5]);
    const result = sampleShape(shape(type), rng.random);
    vector(result.pos, [1, 0, type < 8 ? 0 : 2]);
    vector(result.dir, [0, 0, 1]);
    expect(rng.count()).toBe(type < 8 ? 2 : 3);
  }
});

test('cone direction normalizes radial factor independently of configured radius', () => {
  const s = shape(4);
  s.angle = 45;
  const rng = stream([0, 0.25]);
  const result = sampleShape(s, rng.random);
  vector(result.pos, [1, 0, 0]);
  vector(result.dir, [1 / Math.sqrt(5), 0, 2 / Math.sqrt(5)]);
  expect(rng.count()).toBe(2);
});

test('extended cones divide axial distance by direction z and extend laterally', () => {
  for (const type of [8, 9]) {
    const s = shape(type);
    s.angle = 45;
    const rng = stream([0, 0.25, 0.5]);
    const result = sampleShape(s, rng.random);
    vector(result.dir, [1 / Math.sqrt(5), 0, 2 / Math.sqrt(5)]);
    vector(result.pos, [2, 0, 2]);
    expect(rng.count()).toBe(3);
  }
});

test('disk sampling honors configured thickness and arc', () => {
  const s = shape(10);
  s.thick = 0.5;
  s.arc = 180;
  const rng = stream([0.5, 0.25]);
  const result = sampleShape(s, rng.random);
  vector(result.pos, [0, 1.5, 0]);
  vector(result.dir, [0, 1, 0]);
  expect(rng.count()).toBe(2);
});

test('circle edge omits the radial draw used by the disk', () => {
  for (const type of [10, 11]) {
    const rng = stream(type === 10 ? [0.25, 0.25] : [0.25]);
    const result = sampleShape(shape(type), rng.random);
    vector(result.pos, [0, type === 10 ? 1 : 2, 0]);
    vector(result.dir, [0, 1, 0]);
    expect(rng.count()).toBe(type === 10 ? 2 : 1);
  }
});

test('box position scales then rotates Z-X-Y then translates; direction never scales', () => {
  const s = shape(5);
  s.scale = { x: 2, y: 4, z: 8 };
  s.rot = { x: 90, y: 90, z: 90 };
  s.pos = { x: 10, y: 20, z: 30 };
  const rng = stream([1, 0.75, 0.625]);
  const result = sampleShape(s, rng.random);
  vector(result.pos, [11, 19, 31]);
  vector(result.dir, [0, -1, 0]);
  expect(rng.count()).toBe(3);
});
