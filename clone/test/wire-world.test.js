import { expect, test } from 'bun:test';
import { Group } from 'three';
import { syncWorld } from '../src/wire-world.js';

test('world synchronization propagates ancestors and converts both affine directions', () => {
  const root = new Group(), parent = new Group(), holder = new Group();
  root.position.set(10, 20, 30);
  root.add(parent); parent.add(holder);
  holder.position.set(1, 2, 3);
  holder.scale.set(2, 4, 8);
  const sim = { world: true, wm: null, wmInv: null };
  syncWorld(parent, [{ holder, sim }]);
  expect(sim.wm).toEqual([2, 0, -0, 11, 0, 4, -0, 22, -0, -0, 8, -33]);
  expect(sim.wmInv).toEqual([0.5, 0, -0, -5.5, 0, 0.25, -0, -5.5, -0, -0, 0.125, 4.125]);
  const wm = sim.wm, inverse = sim.wmInv;
  root.position.x = 14;
  syncWorld(parent, [{ holder, sim }]);
  expect(sim.wm).toBe(wm);
  expect(sim.wmInv).toBe(inverse);
  expect(sim.wm[3]).toBe(15);
  expect(sim.wmInv[3]).toBe(-7.5);
});

test('trails require matrices even for local simulation but unrelated parts stay untouched', () => {
  const parent = new Group(), holder = new Group();
  parent.add(holder);
  holder.rotation.y = Math.PI / 2;
  const sim = { world: false, wm: null, wmInv: null };
  const skipped = { world: false, wm: ['sentinel'], wmInv: null };
  syncWorld(parent, [{ holder, sim, trail: {} }, { holder, sim: skipped }]);
  expect(sim.wm[2]).toBeCloseTo(-1, 12);
  expect(sim.wm[8]).toBeCloseTo(1, 12);
  expect(sim.wmInv[2]).toBeCloseTo(1, 12);
  expect(sim.wmInv[8]).toBeCloseTo(-1, 12);
  expect(skipped.wm).toEqual(['sentinel']);
  expect(skipped.wmInv).toBe(null);
});

test('world conversion negates Y-Z mixing in both affine directions', () => {
  const parent = new Group(), holder = new Group();
  parent.add(holder);
  holder.rotation.x = Math.PI / 2;
  const sim = { world: true, wm: null, wmInv: null };
  syncWorld(parent, [{ holder, sim }]);
  expect(sim.wm[6]).toBeCloseTo(1, 12);
  expect(sim.wm[9]).toBeCloseTo(-1, 12);
  expect(sim.wmInv[6]).toBeCloseTo(-1, 12);
  expect(sim.wmInv[9]).toBeCloseTo(1, 12);
});

test('no world particles or trails requires no matrix update', () => {
  syncWorld({ updateWorldMatrix() { throw new Error('Unexpected matrix update'); } }, [{ sim: { world: false } }]);
});
