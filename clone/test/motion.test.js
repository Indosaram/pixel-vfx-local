import { expect, test } from 'bun:test';
import { stepParticle, advanceTrail } from '../src/motion.js';

function particle(age = 0, life = 1) {
  return { age, life, position: [1, 2, 3], velocity: [4, 5, 6], totalVelocity: [7, 8, 9] };
}

test('clone trail points are copied and distance equality inserts a point', () => {
  const history = [], point = [0, 0, 0];
  const config = { minimumDistance: 5, lifetime: 10 };
  advanceTrail(history, point, 0, config);
  point[0] = 100;
  expect(history[0].position).toEqual([0, 0, 0]);
  advanceTrail(history, [0, 0, 4], 1, config);
  expect(history.length).toBe(1);
  advanceTrail(history, [3, 4, 0], 2, config);
  expect(history).toEqual([{ position: [0, 0, 0], time: 0 }, { position: [3, 4, 0], time: 2 }]);
});

test('trail points survive exact lifetime and expire only above it', () => {
  const history = [{ position: [0, 0, 0], time: 0 }, { position: [1, 0, 0], time: 0.5 }];
  const config = { minimumDistance: 5, lifetime: 1 };
  advanceTrail(history, [1, 0, 0], 1, config);
  expect(history.map(entry => entry.time)).toEqual([0, 0.5]);
  advanceTrail(history, [1, 0, 0], 1.25, config);
  expect(history.map(entry => entry.time)).toEqual([0.5]);
  advanceTrail(history, [1, 0, 0], 2, config);
  expect(history).toEqual([]);
});

test('age reaching life expires before the motion callback or vector mutation', () => {
  const p = particle(0.75);
  expect(stepParticle(p, 0.25, () => { throw new Error('motion ran after death'); })).toBe(false);
  expect(p).toEqual({ age: 1, life: 1, position: [1, 2, 3], velocity: [4, 5, 6], totalVelocity: [7, 8, 9] });
});

test('live motion sees advanced age and total velocity uses final displacement', () => {
  const p = particle();
  let calls = 0;
  expect(stepParticle(p, 0.25, (state, dt) => {
    calls++;
    expect(state.age).toBe(0.25);
    expect(dt).toBe(0.25);
    state.position = [2, 1, 5];
  })).toBe(true);
  expect(calls).toBe(1);
  expect(p.totalVelocity).toEqual([4, -4, 8]);
  expect(p.velocity).toEqual([4, 5, 6]);
});

test('total velocity is updated only strictly above the dt threshold', () => {
  for (const dt of [0, 0.5e-6, 1e-6]) {
    const p = particle();
    expect(stepParticle(p, dt, state => { state.position[0] += 1; })).toBe(true);
    expect(p.totalVelocity).toEqual([7, 8, 9]);
  }
  const p = particle();
  stepParticle(p, 2e-6, state => { state.position[0] += 1; });
  expect(p.totalVelocity).toEqual([500000, 0, 0]);
});
