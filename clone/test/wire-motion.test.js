import { expect, test } from 'bun:test';
import { advanceParticles } from '../src/wire-motion.js';

const c = v => ({ t: 'c', v });
const particle = () => ({ age: 0, life: 4, pos: [0, 0, 0], vel: [0, 0, 0], r: Array(8).fill(0.5), seed: 0 });

test('clamp skips speed exactly at its threshold but applies above it', () => {
  const d = { clamp: { mag: c(0), dampen: 1, drag: c(0) } };
  const boundary = particle(), above = particle();
  boundary.vel = [1e-6, 0, 0];
  above.vel = [2e-6, 0, 0];
  advanceParticles(d, [boundary, above], 1, 1);
  expect(boundary.vel).toEqual([1e-6, 0, 0]);
  expect(boundary.pos).toEqual([1e-6, 0, 0]);
  expect(above.vel).toEqual([0, 0, 0]);
  expect(above.pos).toEqual([0, 0, 0]);
});

test('force uses post-increment normalized age', () => {
  const p = particle();
  advanceParticles({ forceOL: { x: { t: 'k', s: 8, k: [[0, 0, 0, 0], [1, 1, 0, 0]] } } }, [p], 1, 1);
  expect(p.vel).toEqual([1.25, 0, 0]);
  expect(p.pos).toEqual([1.25, 0, 0]);
});

test('force and trail lifetime use slot three while clamp uses slot four', () => {
  const p = particle();
  p.r = [0.1, 0.2, 0.3, 0.25, 0.4, 0.6, 0.7, 0.8];
  const r = { t: 'r', a: 0, b: 4 };
  advanceParticles({ forceOL: { x: r, y: r, z: r } }, [p], 0.5, 0.5);
  expect(p.vel).toEqual([0.5, 0.5, 0.5]);
  const q = particle();
  q.vel = [4, 0, 0];
  q.r = [0.1, 0.2, 0.3, 0.4, 0.25, 0.6, 0.7, 0.8];
  advanceParticles({ clamp: { mag: { t: 'r', a: 0, b: 8 }, dampen: 1,
    drag: { t: 'r', a: 0, b: 4 * Math.log(2) } } }, [q], 1, 1);
  expect(q.vel[0]).toBeCloseTo(1, 12);
  p.trail = [[0, 0, 0, 0], [0, 0, 0, 0.2]];
  advanceParticles({ trail: { life: { t: 'r', a: 0, b: 1 } } }, [p], 0.1, 1.1, () => [0, 0, 0]);
  expect(p.trail).toEqual([[0, 0, 0, 0.2]]);
});

test('noise strength uses slot six', () => {
  const p = particle();
  p.r = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.25, 0.8];
  advanceParticles({ noise: { str: { t: 'r', a: 0, b: 4 }, freq: 0 } }, [p], 0.5, 0.5);
  [1.7, 1.3, 1.9].forEach((angle, i) => expect(p.pos[i]).toBeCloseTo(Math.sin(angle) * 0.5, 12));
});

test('orbital rates and radial motion use slot five but offsets use zero', () => {
  const p = particle();
  p.pos = [2, 0, 0];
  p.r = [0.1, 0.2, 0.3, 0.4, 0.5, 0.25, 0.7, 0.8];
  advanceParticles({ velOL: { speedModifier: c(1), orbitalZ: { t: 'r', a: 0, b: 2 * Math.PI },
    radial: { t: 'r', a: 0, b: 4 }, orbitalOffsetX: { t: 'r', a: 1, b: 5 } } }, [p], 1, 1);
  expect(p.pos[0]).toBeCloseTo(1, 12);
  expect(p.pos[1]).toBeCloseTo(2, 12);
  expect(p.pos[2]).toBeCloseTo(0, 12);
});

test('expiry precedes force and trail callbacks; traversal is reverse', () => {
  const first = { ...particle(), trail: [], tag: 'first' };
  const expired = { ...particle(), life: 0.5, trail: [], tag: 'expired' };
  const last = { ...particle(), trail: [], tag: 'last' };
  const particles = [first, expired, last], visits = [];
  advanceParticles({ trail: { life: c(1) } }, particles, 0.5, 0.5, p => {
    visits.push(p.tag); return p.pos;
  });
  expect(particles).toEqual([first, last]);
  expect(visits).toEqual(['last', 'first']);
  expect(expired.pos).toEqual([0, 0, 0]);
});

test('force precedes damping and exponential drag, then position and total velocity', () => {
  const p = particle();
  p.vel = [2, 0, 0];
  const dt = 1 / 30;
  advanceParticles({ forceOL: { x: c(60) }, clamp: { mag: c(2), dampen: 0.5, drag: c(30 * Math.log(2)) } }, [p], dt, dt);
  expect(p.vel[0]).toBeCloseTo(1.5, 12);
  expect(p.pos[0]).toBeCloseTo(0.05, 12);
  expect(p.tv[0]).toBeCloseTo(1.5, 12);
});

test('gravity evaluates at time zero and total velocity retains its threshold state', () => {
  const p = particle();
  p.tv = [7, 8, 9];
  const d = { grav: { t: 'k', s: 1, k: [[0, 2, 0, 0], [1, 6, 0, 0]] } };
  advanceParticles(d, [p], 1e-6, 1e-6);
  expect(p.vel[1]).toBeCloseTo(-19.62e-6, 12);
  expect(p.tv).toEqual([7, 8, 9]);
});

test('trail inserts converted points before pruning and retains exact-age boundary', () => {
  const p = { ...particle(), trail: [[0, 0, 0, 0]] };
  const d = { trail: { minDist: 0, life: c(0.25) } };
  advanceParticles(d, [p], 0.25, 1, () => [0.01, 0, 0]);
  expect(p.trail).toEqual([[0, 0, 0, 0], [0.01, 0, 0, 1]]);
  advanceParticles(d, [p], 0.25, 1.25, () => [0.015, 0, 0]);
  expect(p.trail).toEqual([[0.01, 0, 0, 1]]);
});

test('orbital rotations run X then Y then Z before radial displacement', () => {
  const p = particle();
  p.pos = [2, 3, 4];
  advanceParticles({ velOL: { speedModifier: c(1), orbitalX: c(Math.PI / 2),
    orbitalY: c(Math.PI / 2), orbitalZ: c(Math.PI / 2), radial: c(Math.sqrt(14)),
    orbitalOffsetX: c(1), orbitalOffsetY: c(1), orbitalOffsetZ: c(1) } }, [p], 1, 1);
  // Centered [1,2,3] becomes [3,2,-1], then doubles radially.
  [7, 5, -1].forEach((value, i) => expect(p.pos[i]).toBeCloseTo(value, 12));
  [5, 2, -5].forEach((value, i) => expect(p.tv[i]).toBeCloseTo(value, 12));
});

test('velocity module reuses slot five for extra speed and its modifier', () => {
  const p = particle();
  p.vel = [1, 0, 0];
  p.r[5] = 0.25;
  advanceParticles({ velOL: { x: { t: 'r', a: 0, b: 4 },
    speedModifier: { t: 'r', a: 1, b: 5 } } }, [p], 0.5, 0.5);
  expect(p.pos).toEqual([2, 0, 0]);
  expect(p.vel).toEqual([1, 0, 0]);
  expect(p.tv).toEqual([4, 0, 0]);
});

test('noise z uses updated x rather than the original position', () => {
  const p = particle();
  // age=0.5 gives T=1; initial position and seed are zero.
  const x = Math.sin(1.7) * 0.5;
  const y = Math.sin(1.3) * 0.5;
  const z = Math.sin(x * 2.9 + 1.9) * 0.5;
  advanceParticles({ noise: { str: c(1), freq: 1 } }, [p], 0.5, 0.5);
  [x, y, z].forEach((value, i) => expect(p.pos[i]).toBeCloseTo(value, 12));
  expect(Math.abs(z - Math.sin(1.9) * 0.5)).toBeGreaterThan(0.1);
});
