import { expect, test } from 'bun:test';
import { spawnParticles } from '../src/wire-spawn.js';
import { advanceEmission } from '../src/wire-schedule.js';

const c = v => ({ t: 'c', v });
const definition = () => ({ max: 3, dur: 2, life: c(2), speed: c(3), size: c(4), rotZ: c(0.5), render: {} });

test('scheduler and particle constructor share draws even when burst fills capacity', () => {
  const d = { ...definition(), max: 1, loop: false,
    bursts: [[0, c(1), 1, 0.01]], rate: { t: 'r', a: 0, b: 100 } };
  const state = { delay: 0, stopped: false, cycle: -1, burstDone: [], rateAcc: 0 };
  const particles = [], requested = [];
  let draws = 0;
  const random = () => ++draws / 100;
  const spawn = (count, time) => {
    requested.push(count);
    spawnParticles(d, particles, count, time, random);
  };
  advanceEmission(d, state, 1, 1, random, spawn);
  expect(requested).toEqual([1, 19]);
  expect(draws).toBe(19);
  expect(particles.length).toBe(1);
  expect(particles[0].r).toEqual([0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.13, 0.14]);
  expect(particles[0].rowR).toBe(0.18);
  advanceEmission(d, state, 1, 2, random, spawn);
  expect(requested).toEqual([1, 19, 20]);
  expect(draws).toBe(20);
  expect(particles.length).toBe(1);
});

test('base particle consumes seventeen ordered draws including constant evaluators', () => {
  let draws = 0;
  const particles = [];
  spawnParticles(definition(), particles, 1, 0, () => ++draws / 100);
  expect(draws).toBe(17);
  expect(particles[0]).toEqual({ age: 0, life: 2, pos: [0, 0, 0], vel: [0, 0, 3],
    sz: [4, 4, 4], rot: [0, 0, 0.5], col: [1, 1, 1, 1],
    r: [0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.13],
    flip: [0, 0], seed: 16, rowR: 0.17 });
});

test('capacity stops particle draws and preserves the existing particles', () => {
  for (const [max, capacity] of [[3, 3], [256, 256], [300, 256]]) {
    const d = { ...definition(), max }, particles = [];
    let draws = 0;
    const random = () => { draws++; return 0.5; };
    spawnParticles(d, particles, 300, 0, random);
    expect(particles.length).toBe(capacity);
    expect(draws).toBe(17 * capacity);
    spawnParticles(d, particles, 1, 0, random);
    expect(draws).toBe(17 * capacity);
  }
});

test('optional dimensions, rotation, flips and inclusive trail consume ordered draws', () => {
  const d = { ...definition(), size3D: true, sizeY: c(5), sizeZ: c(6),
    rot3D: true, rotX: c(0.2), rotY: c(0.3), flipRot: 0.5,
    render: { flip: { x: 0.5, y: 0.5 } }, trail: { ratio: 0.5 } };
  const particles = [];
  let draws = 0;
  spawnParticles(d, particles, 1, 0, () => { draws++; return draws === 7 ? 0.25 : 0.5; });
  expect(draws).toBe(23);
  expect(particles[0].sz).toEqual([4, 5, 6]);
  expect(particles[0].rot).toEqual([0.2, 0.3, -0.5]);
  expect(particles[0].flip).toEqual([0, 0]);
  expect(particles[0].trail).toEqual([]);
});

test('world transform translates position but not velocity', () => {
  const particles = [];
  spawnParticles({ ...definition(), space: 1 }, particles, 1, 0, () => 0.5,
    [0, 0, 2, 10, 0, 1, 0, 20, -1, 0, 0, 30]);
  expect(particles[0].pos).toEqual([10, 20, 30]);
  expect(particles[0].vel).toEqual([6, 0, 0]);
});

test('shape direction drives alignment and nonzero position transforms', () => {
  const shape = { type: 11, radius: 2, arc: 360, align: true,
    scale: { x: 1, y: 1, z: 1 }, rot: { x: 0, y: 0, z: 0 }, pos: { x: 0, y: 0, z: 0 } };
  for (const space of [0, 1]) {
    let draws = 0;
    const particles = [];
    spawnParticles({ ...definition(), shape, space }, particles, 1, 0,
      () => { draws++; return 0; }, [0, 0, 2, 10, 0, 1, 0, 20, -1, 0, 0, 30]);
    expect(draws).toBe(18);
    expect(particles[0].pos).toEqual(space ? [10, 20, 28] : [2, 0, 0]);
    expect(particles[0].vel).toEqual(space ? [0, 0, -3] : [3, 0, 0]);
    expect(particles[0].rot).toEqual([0, Math.PI / 2, 0.5]);
  }
});

test('ranged fields distinguish every evaluator draw including optional axes', () => {
  const r = { t: 'r', a: 1, b: 2 };
  for (const axes of [false, true]) {
    const d = { ...definition(), life: r, speed: r, size: r, rotZ: r,
      size3D: axes, sizeY: r, sizeZ: r, rot3D: axes, rotX: r, rotY: r,
      color: { t: 'rcol', a: [0, 0, 0, 0], b: [1, 1, 1, 1] } };
    let draws = 0;
    const particles = [];
    spawnParticles(d, particles, 1, 0, () => ++draws / 100);
    expect(particles[0].life).toBe(1.01);
    expect(particles[0].vel).toEqual([0, 0, 1.02]);
    expect(particles[0].sz).toEqual(axes ? [1.03, 1.04, 1.05] : [1.03, 1.03, 1.03]);
    expect(particles[0].rot).toEqual(axes ? [1.07, 1.08, 1.06] : [0, 0, 1.04]);
    expect(particles[0].col).toEqual(Array(4).fill(axes ? 0.09 : 0.05));
    expect(draws).toBe(axes ? 21 : 17);
  }
});

test('spawn curves use normalized clamped time and lifetime has a positive minimum', () => {
  const d = { ...definition(), life: c(0), speed: { t: 'k', s: 8, k: [[0, 0, 0, 0], [1, 1, 0, 0]] } };
  const particles = [];
  spawnParticles(d, particles, 1, 1, () => 0);
  spawnParticles(d, particles, 1, 3, () => 0);
  expect(particles.map(p => p.vel[2])).toEqual([4, 8]);
  expect(particles.map(p => p.life)).toEqual([0.01, 0.01]);
});

test('normalized spawn time clamps before evaluating keys beyond time one', () => {
  const particles = [];
  const d = { ...definition(), speed: { t: 'k', s: 8, k: [[0, 0, 0, 0], [2, 1, 0, 0]] } };
  spawnParticles(d, particles, 1, 3, () => 0);
  expect(particles[0].vel).toEqual([0, 0, 4]);
});
