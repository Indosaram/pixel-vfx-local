import { expect, test } from 'bun:test';
import { WireEmitter } from '../src/wire-emitter.js';

const c = v => ({ t: 'c', v });
const definition = () => ({ dur: 1, delay: c(0), loop: false, bursts: [[0, c(1), 1, 0.01]],
  rate: c(0), life: c(0.5), speed: c(2), size: c(1), rotZ: c(0), render: {} });

test('construction and pre-play update consume no random draws', () => {
  let draws = 0;
  const emitter = new WireEmitter({ ...definition(), rate: c(10) }, () => { draws++; return 0.5; });
  expect(draws).toBe(0);
  emitter.update(0.25, 0.25);
  expect(draws).toBe(0);
  expect(emitter.p).toEqual([]);
});

test('play initializes once; newborns move immediately and stopped particles expire', () => {
  let draws = 0;
  const emitter = new WireEmitter(definition(), () => { draws++; return 0.5; });
  emitter.play();
  expect(draws).toBe(1);
  emitter.update(0.25, 0.25);
  expect(draws).toBe(20);
  expect(emitter.p.length).toBe(1);
  expect(emitter.p[0].age).toBe(0.25);
  expect(emitter.p[0].pos).toEqual([0, 0, 0.5]);
  emitter.stop();
  expect(emitter.emitting(0.25)).toBe(false);
  emitter.update(0.25, 0.5);
  expect(emitter.p).toEqual([]);
  expect(draws).toBe(20);
  emitter.play();
  expect(emitter.stopped).toBe(false);
  expect(emitter.burstDone).toEqual([0]);
  expect(emitter.cycle).toBe(-1);
});

test('trail callback converts between local and world spaces', () => {
  const matrix = [0, 0, 2, 10, 0, 1, 0, 20, -1, 0, 0, 30];
  const inverse = [0, 0, -1, 30, 0, 1, 0, -20, 0.5, 0, 0, -5];
  for (const space of [0, 1]) {
    const emitter = new WireEmitter({ ...definition(), space,
      trail: { world: 1 - space, life: c(1), ratio: 1 } }, () => 0.5);
    emitter.wm = matrix;
    emitter.wmInv = inverse;
    emitter.play();
    emitter.update(0.25, 0.25);
    expect(emitter.p[0].trail).toEqual([space ? [0, 0, 0.5, 0.25] : [11, 20, 30, 0.25]]);
  }
});

test('prewarm uses repeated fixed steps and restores shifted delay', () => {
  let draws = 0;
  const emitter = new WireEmitter({ ...definition(), loop: true, prewarm: true,
    dur: 0.025, delay: { t: 'r', a: 0.1, b: 0.2 }, bursts: [], rate: c(60), life: c(1) }, () => ++draws / 100);
  emitter.play();
  expect(emitter.p.length).toBe(2);
  expect(emitter.p[0].age).toBeCloseTo(1 / 30, 12);
  expect(emitter.p[1].age).toBeCloseTo(1 / 60, 12);
  expect(emitter.preT).toBe(0.025);
  expect(emitter.delay).toBeCloseTo(0.076, 12);
  expect(draws).toBe(37);
  expect(emitter.p.map(p => p.rowR)).toEqual([0.19, 0.37]);
});
