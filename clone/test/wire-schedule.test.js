import { expect, test } from 'bun:test';
import { advanceEmission } from '../src/wire-schedule.js';

const constant = v => ({ t: 'c', v });
const state = () => ({ delay: 0, stopped: false, cycle: 0, burstDone: [], rateAcc: 0 });

test('burst counts sample curves at zero rather than the current local time', () => {
  const s = { ...state(), burstDone: [0] }, calls = [];
  const curve = { t: 'k', s: 1, k: [[0, 2, 0, 0], [1, 6, 0, 0]] };
  const d = { dur: 1, loop: false, bursts: [[0.5, curve, 1, 0.01]], rate: constant(0) };
  advanceEmission(d, s, 0.5, 0.5, () => 0, (n, t) => calls.push([n, t]));
  expect(calls).toEqual([[2, 0.5]]);
});

test('first eligible endpoint initializes burst counters from the play cycle sentinel', () => {
  const s = { ...state(), cycle: -1, burstDone: [9] }, calls = [];
  const d = { dur: 1, loop: false, bursts: [[0, constant(1), 1, 0.01]], rate: constant(0) };
  advanceEmission(d, s, 0.25, 0.25, () => 0, n => calls.push(n));
  expect(s.cycle).toBe(0);
  expect(s.burstDone).toEqual([1]);
  expect(calls).toEqual([1]);
});

test('burst spawn completes before rate evaluation consumes its draw', () => {
  const s = { ...state(), burstDone: [0] }, events = [];
  let draws = 0;
  const random = () => { events.push(`draw${++draws}`); return 0.25; };
  const spawn = (count, time) => { events.push(['spawn', count, time]); random(); };
  advanceEmission({ dur: 1, loop: false, bursts: [[0, constant(1), 1, 0.01]], rate: constant(0) }, s, 0.25, 0.25, random, spawn);
  expect(events).toEqual(['draw1', ['spawn', 1, 0.25], 'draw2', 'draw3']);
  expect(s.burstDone).toEqual([1]);
});

test('delayed endpoint uses entire dt and nonloop duration endpoint is inclusive', () => {
  const s = { ...state(), delay: 0.5 }, calls = [];
  let draws = 0;
  const definition = { dur: 1, loop: false, bursts: [], rate: constant(4) };
  const run = (dt, time) => advanceEmission(definition, s, dt, time, () => { draws++; return 0; }, (n, t) => calls.push([n, t]));
  run(0.25, 0.25);
  expect(draws).toBe(0);
  run(0.75, 0.75);
  run(0.25, 1.5);
  run(0.25, 1.75);
  expect(calls).toEqual([[3, 0.25], [1, 1]]);
  expect(draws).toBe(2);
});

test('skipped loop cycles reset bursts only for current cycle and retain rate remainder', () => {
  const s = { ...state(), burstDone: [1], rateAcc: 0.75 }, calls = [];
  const d = { dur: 1, loop: true, bursts: [[0, constant(2), 1, 0.01]], rate: constant(1) };
  advanceEmission(d, s, 0.25, 3.25, () => 0, (n, t) => calls.push([n, t]));
  expect(calls).toEqual([[2, 0.25], [1, 0.25]]);
  expect(s.cycle).toBe(3);
  expect(s.rateAcc).toBe(0);
});

test('later-cycle bursts wait for their local endpoint rather than total elapsed time', () => {
  const s = { ...state(), burstDone: [1] }, calls = [];
  const d = { dur: 1, loop: true, bursts: [[0.75, constant(2), 1, 0.01]], rate: constant(0) };
  let draws = 0;
  const random = () => { draws++; return 0; };
  advanceEmission(d, s, 0.25, 3.25, random, (n, t) => calls.push([n, t]));
  expect(calls).toEqual([]);
  expect(s.burstDone).toEqual([0]);
  expect(draws).toBe(1);
  advanceEmission(d, s, 0.5, 3.75, random, (n, t) => calls.push([n, t]));
  expect(calls).toEqual([[2, 0.75]]);
  expect(draws).toBe(3);
});

test('repeated bursts round counts, catch up in order and use falsy defaults', () => {
  const s = { ...state(), burstDone: [0, 0] }, calls = [];
  const d = { dur: 1, loop: false, bursts: [[0, constant(1.6), 3, 0.1], [0, constant(0.4), 0, 0]], rate: constant(0) };
  let draws = 0;
  advanceEmission(d, s, 0.2, 0.2, () => { draws++; return 0; }, n => calls.push(n));
  expect(calls).toEqual([2, 2, 2, 0]);
  expect(draws).toBe(5);
  expect(s.burstDone).toEqual([3, 1]);
});

test('rate accumulator is reduced before spawn and stopped state consumes nothing', () => {
  const s = { ...state(), rateAcc: 0.5 }, seen = [];
  const d = { dur: 1, loop: false, bursts: [], rate: constant(6) };
  let draws = 0;
  const random = () => { draws++; return 0; };
  advanceEmission(d, s, 0.25, 0.25, random, n => seen.push([n, s.rateAcc]));
  s.stopped = true;
  advanceEmission(d, s, 0.25, 0.5, random, () => { throw new Error('Stopped spawn'); });
  expect(seen).toEqual([[2, 0]]);
  expect(draws).toBe(1);
});

test('rate curves use normalized local time and negative rates preserve the remainder', () => {
  const s = { ...state(), delay: 1 }, calls = [];
  const d = {
    dur: 2, loop: false, bursts: [],
    rate: { t: 'k', s: 8, k: [[0, 0, 0, 0], [1, 1, 0, 0]] },
  };
  let draws = 0;
  const random = () => { draws++; return 0.25; };
  advanceEmission(d, s, 0.25, 2, random, (n, t) => calls.push([n, t]));
  expect(calls).toEqual([[1, 1]]);
  s.rateAcc = 0.75;
  d.rate = constant(-4);
  advanceEmission(d, s, 0.25, 2.25, random, () => { throw new Error('Negative-rate spawn'); });
  expect(s.rateAcc).toBe(0.75);
  expect(draws).toBe(2);
});

test('zero burst interval defaults to 0.01 rather than firing every repetition immediately', () => {
  const s = { ...state(), burstDone: [0] }, calls = [];
  const d = { dur: 1, loop: false, bursts: [[0, constant(1), 3, 0]], rate: constant(0) };
  advanceEmission(d, s, 0.005, 0.005, () => 0, n => calls.push(n));
  expect(calls).toEqual([1]);
  expect(s.burstDone).toEqual([1]);
  advanceEmission(d, s, 0.01, 0.015, () => 0, n => calls.push(n));
  expect(calls).toEqual([1, 1]);
  expect(s.burstDone).toEqual([2]);
});

test('exact loop boundary fires only the new cycle and preserves fractional rate remainder', () => {
  const s = { ...state(), burstDone: [1], rateAcc: 0.75 }, calls = [];
  const d = { dur: 1, loop: true, bursts: [[0, constant(2), 1, 0.01]], rate: constant(1) };
  let draws = 0;
  advanceEmission(d, s, 0.25, 1, () => { draws++; return 0; }, (n, t) => calls.push([n, t]));
  expect(s.cycle).toBe(1);
  expect(s.burstDone).toEqual([1]);
  expect(calls).toEqual([[2, 0], [1, 0]]);
  expect(s.rateAcc).toBe(0);
  expect(draws).toBe(2);
});
