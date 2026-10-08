import { expect, test } from 'bun:test';
import { applyWireVariant, appendWireMix } from '../src/wire-library-mix.js';

const layer = (name, delay) => ({ name, delay, loop: true,
  scale: { x: 1, y: 2, z: 3 }, pos: { x: 2, y: -3, z: 4 },
  render: { mode: 4, mesh: 'triangle', mat: { tex: { main: 'new', mask: 'same', absent: null } } },
  trail: { mat: { tex: { main: 'trail-only' } } } });

test('variant applies top fields then indexed shallow emitter patches', () => {
  const first = layer('first', { t: 'c', v: 1 });
  const second = layer('second', { t: 'c', v: 2 });
  const base = { emitters: [first, second], textures: ['same'], meshes: [], duration: 1 };
  const result = applyWireVariant(base, { top: { duration: 3, emitters: [] }, emitters: { 1: { name: 'patched' } } });
  expect(result.duration).toBe(3);
  expect(result.emitters).toHaveLength(2);
  expect(result.emitters[0]).toBe(first);
  expect(result.emitters[1]).not.toBe(second);
  expect(result.emitters[1].name).toBe('patched');
  expect(result.emitters[1].render).toBe(second.render);
  expect(second.name).toBe('second');
  const replaced = applyWireVariant(base, { top: {}, emitters: { 1: { render: { mode: 0 } } } });
  expect(replaced.emitters[1].render).toEqual({ mode: 0 });
});

test('mix preserves random delay range and applies scale before position', () => {
  const source = { emitters: [layer('skip', { t: 'c', v: 0 }), layer('selected', { t: 'r', a: 1, b: 3 })], roles: ['other', 'body'] };
  const base = { emitters: [layer('base', { t: 'c', v: 0 })], textures: ['same'], meshes: [] };
  const before = structuredClone({ source, base });
  const result = appendWireMix(base, source, { layers: ['selected'], delay: 2, scale: 2, pos: [1, 5, -2], loop: null });
  expect(result.emitters.map(e => e.name)).toEqual(['base', 'selected']);
  expect(result.roles).toEqual([null, 'body']);
  expect(result.emitters[1].delay).toEqual({ t: 'r', a: 3, b: 5 });
  expect(result.emitters[1].scale).toEqual({ x: 2, y: 4, z: 6 });
  expect(result.emitters[1].pos).toEqual({ x: 5, y: -1, z: 6 });
  expect(result.emitters[1].loop).toBe(false);
  expect(result.textures).toEqual(['same', 'new']);
  expect(result.meshes).toEqual(['triangle']);
  expect({ source, base }).toEqual(before);
});

test('mix preserves undefined loop and ignores zero scale and delay', () => {
  const original = layer('only', { t: 'k', v: 4 });
  const base = { emitters: [], textures: [], meshes: [] };
  const unchanged = appendWireMix(base, { emitters: [original] }, { delay: 0, scale: 0, loop: undefined });
  expect(unchanged.emitters[0]).toEqual(original);
  expect(unchanged.emitters[0]).not.toBe(original);
  expect(unchanged.emitters[0].render).not.toBe(original.render);
  expect(unchanged.emitters[0].trail).not.toBe(original.trail);
  expect(unchanged.emitters[0].delay).not.toBe(original.delay);
  expect(unchanged.roles).toEqual([null]);
  const shifted = appendWireMix(base, { emitters: [original] }, { delay: -2 });
  expect(shifted.emitters[0].delay).toEqual({ t: 'c', v: 2 });
});

test('mesh references deduplicate and are collected only for mode four', () => {
  const mesh = layer('mesh', { t: 'c', v: 0 });
  const billboard = layer('billboard', { t: 'c', v: 0 });
  billboard.render.mode = 0;
  billboard.render.mesh = 'ignored';
  const result = appendWireMix({ emitters: [], textures: [], meshes: ['triangle'] },
    { emitters: [mesh, billboard] }, {});
  expect(result.meshes).toEqual(['triangle']);
});
