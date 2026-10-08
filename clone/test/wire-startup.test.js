import { test, expect, describe } from 'bun:test';
import { createStartupSettings, loadStartupSettings } from '../src/wire-startup.js';

describe('reference-derived startup settings merge', () => {
  test('deep clones literal defaults, including nested gradient and arrays', () => {
    const a = createStartupSettings(null), b = createStartupSettings('');
    expect(a).toEqual(b);
    expect(a.pixel.gradient.stops).toEqual(['#2a0a12', '#a8231a', '#ff7a1a', '#ffe68a']);
    a.pixel.gradient.stops[0] = 'changed';
    expect(b.pixel.gradient.stops[0]).toBe('#2a0a12');
  });

  test('recurses stored objects, replaces arrays and preserves unknown root keys', () => {
    const s = createStartupSettings(JSON.stringify({ view: { facing: 90 }, export: { views: ['side'] }, extra: 7 }));
    expect(s.view).toEqual({ elevation: 45, facing: 90, turn: 0, slashElevation: 75, sideUpright: true });
    expect(s.export.views).toEqual(['side']);
    expect(s.extra).toBe(7);
  });

  test('matches enumerable primitive and array root behavior', () => {
    expect(createStartupSettings('null').mode).toBe('combat');
    expect(createStartupSettings('false').mode).toBe('combat');
    expect(createStartupSettings('"xy"')[0]).toBe('x');
    expect(createStartupSettings('[3,4]')[1]).toBe(4);
    expect(createStartupSettings('{broken').mode).toBe('combat');
  });

  test('replaces leaves with null and false instead of recursing into destination objects', () => {
    const s = createStartupSettings('{"view":null,"layers":false}');
    expect(s.view).toBeNull();
    expect(s.layers).toBe(false);
  });

  test('reuses an array destination when recursively merging an object', () => {
    const s = createStartupSettings(JSON.stringify({ export: { views: { 0: 'top', 2: 'side' } } }));
    expect(s.export.views).toEqual(['top', undefined, 'side']);
  });

  test('loads caller-selected storage key and falls back on access failure', () => {
    expect(loadStartupSettings({ getItem: key => key === 'prefs' ? '{"mode":"sprite"}' : null }, 'prefs').mode).toBe('sprite');
    expect(loadStartupSettings({ getItem() { throw new Error('blocked'); } }, 'prefs').mode).toBe('combat');
  });
});
