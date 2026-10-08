import { expect, test } from 'bun:test';
import { WireEffect } from '../src/wire-effect.js';

const c = v => ({ t: 'c', v });
const definition = () => ({ dur: 1, delay: c(0), loop: false, bursts: [[0, c(1), 1, 0.01]],
  rate: c(0), life: c(1), speed: c(2), size: c(1), rotZ: c(0), render: {} });
const hooks = events => ({ syncWorld: e => events.push(['sync', e.t]),
  write: (e, camera) => events.push(['write', e.t, camera]), finished: e => events.push(['finished', e.t]) });

test('clock caps dt before tempo and writes after fixed-step updates', () => {
  const events = [], effect = new WireEffect([definition()], hooks(events));
  effect.update(1);
  expect(events).toEqual([]);
  effect.play(1);
  expect(events).toEqual([['sync', 0], ['write', 0, null]]);
  effect.tempo = 2;
  effect.update(1, 'camera');
  expect(effect.clock).toBe(0.5);
  expect(effect.t).toBeCloseTo(0.5, 12);
  expect(effect.parts[0].p[0].age).toBeCloseTo(0.5, 12);
  expect(events.at(-1)).toEqual(['write', effect.t, 'camera']);
});

test('fixed-step epsilon distinguishes targets on either side of tolerance', () => {
  const effect = new WireEffect([definition()], hooks([]));
  effect.play(1);
  effect.seek(1 / 120 - 2e-9);
  expect(effect.t).toBe(0);
  effect.seek(1 / 120 - 0.5e-9);
  expect(effect.t).toBe(1 / 120);
});

test('backward seek replays the same shared stream and particle state', () => {
  const effect = new WireEffect([definition(), definition()], hooks([]));
  effect.play(42);
  effect.seek(1 / 120);
  const snapshot = structuredClone(effect.parts.map(p => p.p));
  const draws = effect.rng.draws;
  expect(draws).toBe(40);
  expect(snapshot[0][0].r).not.toEqual(snapshot[1][0].r);
  effect.seek(0.1);
  effect.seek(1 / 120);
  expect(effect.parts.map(p => p.p)).toEqual(snapshot);
  expect(effect.rng.draws).toBe(draws);
});

test('play and update traverse emitters in definition order on one stream', () => {
  const effect = new WireEffect([
    { ...definition(), delay: { t: 'r', a: 0, b: 1 } },
    { ...definition(), delay: { t: 'r', a: 10, b: 11 } },
  ], hooks([]));
  effect.play(1);
  expect(effect.parts[0].delay).toBe(16806 / 2147483646);
  expect(effect.parts[1].delay).toBe(10 + 282475248 / 2147483646);
  const active = new WireEffect([definition(), definition()], hooks([]));
  active.play(1);
  active.seek(1 / 120);
  expect(active.parts[0].p[0].rowR).toBe(143542611 / 2147483646);
  expect(active.parts[1].p[0].rowR).toBe(2128236578 / 2147483646);
});

test('seek writes without completion and update performs the completion check', () => {
  const events = [], effect = new WireEffect([{ ...definition(), dur: 0, bursts: [] }], hooks(events));
  effect.play(1);
  effect.seek(1 / 120);
  expect(events.at(-1)).toEqual(['write', 1 / 120, null]);
  expect(effect.finished).toBe(false);
  expect(effect.playing).toBe(true);
  expect(events.filter(e => e[0] === 'finished')).toEqual([]);
  effect.update(0);
  expect(events.at(-2)).toEqual(['write', 1 / 120, null]);
  expect(events.at(-1)).toEqual(['finished', 1 / 120]);
  expect(effect.finished).toBe(true);
  expect(effect.playing).toBe(false);
});

test('stop permits expiry then completion fires once after write', () => {
  const events = [], effect = new WireEffect([{ ...definition(), life: c(1 / 60) }], hooks(events));
  effect.play(1);
  effect.update(1 / 120);
  effect.stop();
  expect(effect.finished).toBe(false);
  effect.update(1 / 120);
  expect(effect.finished).toBe(true);
  expect(effect.playing).toBe(false);
  expect(events.at(-2)).toEqual(['write', effect.t, null]);
  expect(events.at(-1)).toEqual(['finished', effect.t]);
  const count = events.length;
  effect.update(1);
  expect(events.length).toBe(count);
});

test('completion requires every emitter to stop emitting and every particle to expire', () => {
  const events = [];
  const effect = new WireEffect([
    { ...definition(), dur: 0, bursts: [] },
    { ...definition(), dur: 1 / 60, bursts: [] },
  ], hooks(events));
  effect.play(1);
  effect.update(1 / 120);
  expect(effect.parts.every(p => p.p.length === 0)).toBe(true);
  expect(effect.finished).toBe(false);
  effect.update(1 / 120);
  expect(effect.finished).toBe(false);
  effect.update(1 / 120);
  expect(effect.finished).toBe(true);
  expect(events.filter(e => e[0] === 'finished').length).toBe(1);
});
