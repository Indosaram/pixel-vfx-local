import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { createRandomStream } from '../src/curves.js';
import { scalarWire } from '../src/wire-curves.js';
import { colorWire } from '../src/wire-color.js';

test('authored wire descriptors consume supplied shared fractions without changing inputs', () => {
  const fixture = JSON.parse(readFileSync(new URL('../spec/fixtures/f01-wire-input.json', import.meta.url), 'utf8'));
  const emitter = fixture.effect.emitters[1];
  const before = structuredClone(emitter);
  const random = createRandomStream(42);
  const fraction = random.next();
  expect(scalarWire(emitter.speed, 0, fraction)).toBe(2 + 4 * (705893 / 2147483646));
  const out = [0, 0, 0, 0];
  expect(colorWire(emitter.color, 0, fraction, out)).toBe(out);
  expect(out).toEqual([0.75, 0.25, 0.5, 1]);
  expect(random.draws).toBe(1);
  expect(emitter).toEqual(before);
});
