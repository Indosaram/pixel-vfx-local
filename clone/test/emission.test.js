import { expect, test } from 'bun:test';
import { EmitterScheduler } from '../src/emitter.js';
import { createRandomStream } from '../src/curves.js';

const make = (definition = {}, random = createRandomStream(1)) =>
  new EmitterScheduler({ rate: 0, ...definition }, random);

test('capacity applies documented default, zero fallback and cap', () => {
  expect(make({ max: 3 }).capacity).toBe(3);
  expect(make({ max: 0 }).capacity).toBe(256);
  expect(make({ max: 300 }).capacity).toBe(256);
});

test('fractional rate accumulates across updates and consumes draws only for emitted particles', () => {
  const random = createRandomStream(1), emitter = make({ rate: 2 }, random);
  expect(emitter.advance(0.25)).toBe(0);
  expect(random.draws).toBe(0);
  expect(emitter.advance(0.25)).toBe(1);
  expect(random.draws).toBe(1);
});

test('ranged rate receives the normalized shared-stream fraction', () => {
  const random = createRandomStream(1);
  const emitter = make({ rate: { type: 'r', min: 2, max: 6 } }, random);
  expect(emitter.advance(0.25)).toBe(0);
  expect(emitter.rateRemainder).toBe((2 + 4 * (16806 / 2147483646)) * 0.25);
  expect(random.draws).toBe(1);
});

test('delay and one-shot duration are applied with inclusive duration boundary', () => {
  const emitter = make({ delay: 1, duration: 1, rate: 2 });
  expect(emitter.advance(0.5)).toBe(0);
  expect(emitter.advance(1)).toBe(1);
  expect(emitter.advance(0.5)).toBe(1);
  expect(emitter.advance(0.01)).toBe(0);
});

test('burst at time zero fires once and play resets the scheduler', () => {
  const emitter = make({ bursts: [{ time: 0, count: 2 }] });
  expect(emitter.advance(0)).toBe(2);
  expect(emitter.advance(0.1)).toBe(0);
  emitter.play();
  expect(emitter.advance(0)).toBe(2);
});

test('loop burst repeats at the cycle boundary and stop suppresses future emission', () => {
  const emitter = make({ duration: 1, loop: true, bursts: [{ time: 0, count: 1 }] });
  expect(emitter.advance(0)).toBe(1);
  expect(emitter.advance(1)).toBe(1);
  emitter.stop();
  expect(emitter.advance(1)).toBe(0);
});

test('bursts crossed inside a large update fire exactly once', () => {
  const emitter = make({ duration: 3, bursts: [{ time: 0, count: 1 }, { time: 1, count: 2 }, { time: 2, count: 3 }] });
  expect(emitter.advance(2.5)).toBe(6);
  expect(emitter.advance(0.5)).toBe(0);
});

test('loop burst repeats across multiple cycles in one update', () => {
  const emitter = make({ duration: 1, loop: true, bursts: [{ time: 0, count: 1 }] });
  expect(emitter.advance(2.5)).toBe(3);
});

test('loop events fire once per absolute time regardless of update partition', () => {
  const definition = { delay: 0.5, duration: 1, loop: true, rate: 2, bursts: [{ time: 0, count: 1 }, { time: 0.25, count: 2 }] };
  const whole = make(definition), split = make(definition);
  expect(whole.advance(3)).toBe(14);
  expect(split.advance(0.5)).toBe(1);
  expect(split.advance(0)).toBe(0);
  expect(split.advance(0.25)).toBe(2);
  expect(split.advance(0.75)).toBe(3);
  expect(split.advance(1.5)).toBe(8);
  expect(split.liveCount).toBe(whole.liveCount);
});

test('capacity saturation prevents further particles and their draws', () => {
  const random = createRandomStream(1), emitter = make({ max: 1, rate: 8 }, random);
  expect(emitter.advance(1)).toBe(1);
  expect(random.draws).toBe(1);
  expect(emitter.advance(1)).toBe(0);
  expect(random.draws).toBe(1);
});
