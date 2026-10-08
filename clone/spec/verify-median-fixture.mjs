#!/usr/bin/env node
// clone/spec/verify-median-fixture.mjs - standalone, no implementation import.
// Recomputes each median-cut palette from its samples using the reviewed rules
// in state/sprite-static-pixel-helpers-addendum.md (Quantization), then
// assert.deepStrictEqual against the declared expected centroids.

import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const fixtureUrl = new URL('./fixtures/median-cut.json', import.meta.url);
const fixture = JSON.parse(readFileSync(fixtureUrl, 'utf8'));

const GREEN_WEIGHT = 1.2; // green channel range weighted 1.2
const MIN_RANGE = 1e-4;   // stop when best (weighted) range <= 1e-4

const channelRange = (box, axis) => {
  let lo = Infinity;
  let hi = -Infinity;
  for (const s of box) {
    if (s[axis] < lo) lo = s[axis];
    if (s[axis] > hi) hi = s[axis];
  }
  return hi - lo;
};

// Largest weighted range wins; strict > keeps prior choice on ties (R, G, B).
const pickAxis = (box) => {
  let axis = 0;
  let best = -Infinity;
  for (let a = 0; a < 3; a++) {
    const w = channelRange(box, a) * (a === 1 ? GREEN_WEIGHT : 1);
    if (w > best) {
      best = w;
      axis = a;
    }
  }
  return [axis, best];
};

const centroid = (box) => {
  const out = [0, 0, 0];
  for (const s of box) {
    out[0] += s[0];
    out[1] += s[1];
    out[2] += s[2];
  }
  return out.map((v) => v / box.length);
};

// Empty samples -> one black; duplicates stay duplicated; sort by selected axis
// (stable, ties keep arrival order); split at length >> 1 (floor half); replace
// the chosen box with left then right; stop at count, or when no splittable box
// remains or the best weighted range <= 1e-4. Palette order = box order.
const medianCut = (samples, count) => {
  if (samples.length === 0) return [[0, 0, 0]];
  const boxes = [samples.slice()];
  while (boxes.length < count) {
    let target = -1;
    let axis = 0;
    let best = MIN_RANGE;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].length < 2) continue;
      const [a, w] = pickAxis(boxes[i]);
      if (w > best) {
        best = w;
        axis = a;
        target = i;
      }
    }
    if (target < 0) break;
    const sorted = boxes[target].slice().sort((x, y) => x[axis] - y[axis]);
    const cut = sorted.length >> 1;
    boxes.splice(target, 1, sorted.slice(0, cut), sorted.slice(cut));
  }
  return boxes.map(centroid);
};

assert.ok(Array.isArray(fixture.cases) && fixture.cases.length > 0, 'fixture declares cases');

let checks = 0;
for (const c of fixture.cases) {
  const computed = medianCut(c.samples, c.count);
  assert.ok(computed.length > 0, `${c.id}: computed palette nonempty`);
  assert.ok(c.expected.length > 0, `${c.id}: declared expected nonempty`);
  assert.deepStrictEqual(computed, c.expected, `${c.id}: recomputed centroids`);
  checks += 1;
  console.log(`PASS ${c.id}: ${c.samples.length} samples -> ${computed.length} centroids`);
}

console.log(`checks: ${checks}/${fixture.cases.length} passed`);
console.log('method: median-cut recomputed from samples only - empty -> [[0,0,0]],');
console.log('  duplicates retained, green range x1.2, strict tie order (first box, then R/G/B),');
console.log('  floor split length>>1, stable axis sort, centroid = arithmetic mean,');
console.log('  assert.deepStrictEqual vs declared expected; no implementation executed');
