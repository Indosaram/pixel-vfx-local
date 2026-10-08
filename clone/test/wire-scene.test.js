import { expect, test } from 'bun:test';
import { PlaneGeometry, ShaderMaterial, Vector3, Matrix4 } from 'three';
import { createWireScene } from '../src/wire-scene.js';

const c = v => ({ t: 'c', v });
const emitter = mat => ({ name: 'probe', max: 4, dur: 1, delay: c(0), loop: false,
  bursts: [[0, c(1), 1, 0.01]], rate: c(0), life: c(1), speed: c(2), size: c(1), rotZ: c(0),
  render: { mat, mode: 0, align: 0, len: 1 }, pos: { x: 0, y: 0, z: 0 },
  rot: { x: 0, y: 0, z: 0, w: 1 }, scale: { x: 1, y: 1, z: 1 } });
function scene(definition, finished = () => {}) {
  const resources = { quad: new PlaneGeometry(), timeU: { value: 0 } };
  const makeMaterial = () => new ShaderMaterial({ uniforms: {
    uLen: { value: 0 }, uVelScale: { value: 0 }, uPivot: { value: new Vector3() }, uScale: { value: 1 },
  } });
  return createWireScene(definition, resources, { gradeU: { value: 1 }, intU: { value: 1 } }, makeMaterial, finished);
}

test('material-less emitters do not enter the shared random stream', () => {
  const full = scene({ emitters: [emitter(null), emitter('visible')], roles: ['skip', 'body'] });
  const baseline = scene({ emitters: [emitter('visible')] });
  expect(full.clock.playing).toBe(false);
  expect(full.parts.length).toBe(1);
  expect(full.parts[0].idx).toBe(1);
  expect(full.parts[0].role).toBe('body');
  expect(full.clock.parts.length).toBe(1);
  full.clock.play(1); baseline.clock.play(1);
  full.clock.seek(1 / 120); baseline.clock.seek(1 / 120);
  expect(full.clock.rng.draws).toBe(20);
  expect(full.parts[0].sim.p).toEqual(baseline.parts[0].sim.p);
  expect(full.parts[0].geo.instanceCount).toBe(1);
  expect(full.parts[0].A.iPos.array[2]).toBeCloseTo(-1 / 60, 7);
});

test('matrix synchronization precedes spawning and both buffer writers run', () => {
  const d = emitter('visible');
  d.space = 1;
  d.pos = { x: 10, y: 20, z: 30 };
  d.trail = { mat: 'trail', world: 1, ratio: 1, life: c(1), minDist: 0.001, width: c(1) };
  const result = scene({ emitters: [d] });
  result.clock.play(1);
  result.clock.seek(1 / 60);
  const p = result.parts[0];
  expect(p.sim.p[0].pos[0]).toBe(10);
  expect(p.sim.p[0].pos[1]).toBe(20);
  expect(p.sim.p[0].pos[2]).toBeCloseTo(30 + 1 / 30, 12);
  expect(p.A.iPos.array[2]).toBeCloseTo(-1 / 30, 7);
  expect(p.geo.instanceCount).toBe(1);
  expect(p.trail.geo.instanceCount).toBe(1);
  expect(p.trail.A.iSize.array[1]).toBeCloseTo(1 / 60, 7);
});

test('seek forwards camera changes to sorted buffers without advancing particles', () => {
  const d = emitter('visible');
  d.render.sort = 1;
  d.bursts[0][1] = c(2);
  const result = scene({ emitters: [d] });
  result.clock.play(1);
  result.clock.seek(1 / 120);
  const part = result.parts[0], [a, b] = part.sim.p;
  a.pos = [0, 0, 1]; b.pos = [0, 0, 3];
  const age = a.age, draws = result.clock.rng.draws, time = result.clock.t;
  result.clock.seek(time, { matrixWorldInverse: new Matrix4() });
  expect(part.A.iPos.array[2]).toBe(-3);
  result.clock.seek(time, { matrixWorldInverse: new Matrix4().makeRotationY(Math.PI) });
  expect(part.A.iPos.array[2]).toBe(-1);
  expect(part.sim.p[0]).toBe(a);
  expect(part.sim.p[1]).toBe(b);
  expect(a.age).toBe(age);
  expect(result.clock.rng.draws).toBe(draws);
});

test('completion callback receives the assembled scene after buffers clear', () => {
  const delivered = [];
  const d = emitter('visible'); d.life = c(1 / 60);
  const result = scene({ emitters: [d] }, s => delivered.push([s, s.parts[0].geo.instanceCount]));
  result.clock.play(1);
  result.clock.update(1 / 120);
  result.clock.stop();
  result.clock.update(1 / 120);
  expect(delivered).toEqual([[result, 0]]);
});
