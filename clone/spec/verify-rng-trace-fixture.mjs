#!/usr/bin/env node
// clone/spec/verify-rng-trace-fixture.mjs - standalone; reads only the fixture.
// Rules from state/sprite-static-emission-addendum.md and
// state/sprite-static-effect-clock-addendum.md (RNG, draw order, effect clock).

import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const url = new URL('./fixtures/shared-rng-trace.json', import.meta.url);
const trace = JSON.parse(readFileSync(url, 'utf8'));
const sc = trace.scenario;
const ex = trace.expected;

// Scenario assumptions: this fixture covers only the listed branches.
assert.strictEqual(sc.seed, 42, 'seed');
assert.deepStrictEqual(sc.parts, ['A', 'B'], 'definition-order traversal');
assert.strictEqual(sc.materialPresent, true, 'render.mat present, no skipped emitters');
assert.strictEqual(sc.loop, false, 'nonloop');
assert.strictEqual(sc.prewarm, false, 'prewarm off');
assert.strictEqual(sc.delay, 0, 'constant delay still draws once');
assert.strictEqual(sc.rate, 0, 'rate still consumes its evaluator draw');
assert.strictEqual(sc.shape, null, 'no shape sampling draws');
assert.strictEqual(sc.size3D, false, 'no size-Y/Z draws');
assert.strictEqual(sc.rot3D, false, 'no rotation-X/Y draws');
assert.strictEqual(sc.flipRot, 0, 'no flip-rotation draw');
assert.strictEqual(sc.trail, null, 'no trail draw');
assert.deepStrictEqual(sc.burst, { time: 0, count: 1, repetitions: 1 }, 'burst tuple');
assert.ok(sc.capacityPerPart >= 1, 'capacity guard does not clip the spawn');
assert.ok(sc.life > sc.duration, 'burst particle still alive at first update');
assert.deepStrictEqual(sc.firstUpdate.dtFraction, [1, 120], 'fixed step 1/120');
assert.deepStrictEqual(sc.firstUpdate.systemTimeFraction, [1, 120], 'absolute clock 1/120');

// Per-particle zero-based draw offsets (emission addendum ordering).
const off = {};
let k = 0;
off.life = k++; off.speed = k++; off.size = k++;
if (sc.size3D) { off.sizeY = k++; off.sizeZ = k++; }
off.rotationZ = k++;
if (sc.flipRot) off.flipRotation = k++;
if (sc.rot3D) { off.rotationX = k++; off.rotationY = k++; }
off.color = k++;
off.storedRandoms = Array.from({ length: 8 }, () => k++);
off.flipX = k++; off.flipY = k++; off.seed = k++; off.row = k++;
const particleDraws = k;
assert.deepStrictEqual(off, ex.particleDrawOffsetsZeroBased, 'zero-based offsets');

// Ordinals: play delay draws, then per part burst -> spawns -> rate.
let draw = 0;
const playDraws = sc.parts.map((part) => ({ part, site: 'delay', ordinal: ++draw }));
assert.deepStrictEqual(playDraws, ex.playDraws, 'play ordinals');
assert.strictEqual(draw, ex.drawCountAfterPlay, 'drawCountAfterPlay');

const firstUpdate = sc.parts.map((part) => {
  const burstCountDraw = ++draw;
  const start = draw + 1;
  draw += particleDraws;
  const range = [start, draw];
  const rateDraw = ++draw;
  return { part, burstCountDraw, particleDrawRangeInclusive: range, rateDraw };
});
assert.deepStrictEqual(firstUpdate, ex.firstUpdate, 'first-update ordinals');
assert.strictEqual(draw, ex.drawCountAfterFirstUpdate, 'drawCountAfterFirstUpdate');
assert.deepStrictEqual(sc.parts.map(() => 1), ex.particleCountPerPart, 'one spawn per part');

// BigInt checkpoints: state*16807 mod 2147483647, fraction (state-1)/2147483646.
const MOD = 2147483647n;
let state = BigInt(sc.seed === 0 ? 1 : sc.seed); // unsigned seed, zero falls back to 1
const states = [];
for (let i = 1; i <= draw; i++) {
  state = (state * 16807n) % MOD;
  states.push({ ordinal: i, state: Number(state), numerator: Number(state - 1n) });
}
for (const cp of ex.stateCheckpoints) {
  const got = states[cp.ordinal - 1];
  assert.ok(got, `checkpoint ordinal ${cp.ordinal} within draw count`);
  assert.strictEqual(cp.numerator, cp.state - 1, 'numerator = state - 1');
  assert.strictEqual(got.state, cp.state, `state at ordinal ${cp.ordinal}`);
  assert.strictEqual(got.numerator, cp.numerator, `numerator at ordinal ${cp.ordinal}`);
}
assert.strictEqual(ex.normalizedFractionDenominator, 2147483646, 'denominator = modulus - 1');

console.log(`checks: ${ex.stateCheckpoints.length} checkpoints plus ordinals, offsets, counts, denominator`);
console.log('method: re-derived from scenario only - BigInt Park-Miller 16807 mod 2147483647,');
console.log('  fraction (state-1)/2147483646, order delay -> burst -> 17 particle draws -> rate;');
console.log('  assert.deepStrictEqual vs declared expectations; no implementation executed');
