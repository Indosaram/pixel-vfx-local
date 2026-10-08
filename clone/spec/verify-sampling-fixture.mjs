#!/usr/bin/env node
// verify-sampling-fixture.mjs
// Independent oracle for the sibling fixture fixtures/pixel-sampling.json.
// Recomputes sample counts, RNG draw counts, percentile values and the
// boundary discriminator from fixture inputs only. Any mismatch exits non-zero.
// Prints one JSONL record per fixture item with checks count and method.

import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const NAME = 'pixel-sampling.json';
const CAP = 40000;    // pipeline addendum step 6: admit until sample length 40000
const KEEP = 0.1;     // thereafter append only when Math.random() < 0.1
const METHOD = 'append-while-sampleCount<40000-else-append-if-random<0.1; value=sortedAsc[floor(sampleCount*percentile)]';

const doc = JSON.parse(readFileSync(new URL(`fixtures/${NAME}`, import.meta.url), 'utf8'));
assert.ok(Array.isArray(doc.cases) && doc.cases.length > 0, `${NAME}: cases missing`);
assert.ok(doc.boundaryDiscriminator, `${NAME}: boundaryDiscriminator missing`);

let checks = 0;
const eq = (a, b, m) => { assert.equal(a, b, m); checks += 1; };
const ok = (c, m) => { assert.ok(c, m); checks += 1; };

function rngFrom(list) {
  const values = [...list];
  let i = 0;
  return () => {
    assert.ok(i < values.length, `RNG over-drawn after ${i} call(s)`);
    return values[i++];
  };
}

function candidates(c) {
  if (Array.isArray(c.values)) return [...c.values];
  const { start, count, step } = c.range;
  return Array.from({ length: count }, (_, k) => start + k * step);
}

// Oracle: first 40000 surviving candidates admit unconditionally (no draw);
// every later candidate costs exactly one draw and appends iff draw < 0.1.
// Append-only: existing samples are never replaced. Value is the
// floor(sampleCount * percentile) index of the ascending-sorted sample.
function run(values, percentile, randomValues) {
  const draw = rngFrom(randomValues);
  const sample = [];
  let draws = 0;
  for (const v of values) {
    if (sample.length < CAP) { sample.push(v); continue; }
    const r = draw();
    draws += 1;
    if (r < KEEP) sample.push(v);
  }
  const sorted = [...sample].sort((a, b) => a - b);
  const index = Math.floor(sorted.length * percentile);
  return { count: sorted.length, index, value: sorted[index], draws };
}

const records = [];
const emit = (id, before, detail) =>
  records.push({ fixture: NAME, id, ok: true, checks: checks - before, method: METHOD, ...detail });

for (const c of doc.cases) {
  const before = checks;
  const randomValues = c.randomValues ?? [];
  const out = run(candidates(c), c.percentile, randomValues);
  ok(out.index < out.count, `${c.id}: percentile index in bounds`);
  eq(out.index, Math.floor(out.count * c.percentile), `${c.id}: index formula`);
  if ('expectedSampleCount' in c) eq(out.count, c.expectedSampleCount, `${c.id}: sampleCount`);
  eq(out.value, c.expectedValue, `${c.id}: percentile value`);
  eq(out.draws, c.expectedRandomDraws, `${c.id}: RNG draw count`);
  eq(out.draws, randomValues.length, `${c.id}: all provided RNG values consumed once`);
  emit(c.id, before, { percentile: c.percentile, sampleCount: out.count, index: out.index, value: out.value, draws: out.draws });
}

{ // boundaryDiscriminator: same inputs, one draw flips min 1 -> 0
  const d = doc.boundaryDiscriminator;
  const before = checks;
  const base = [
    ...Array.from({ length: d.prefix.count }, () => d.prefix.value),
    ...d.suffix,
  ];
  ok(base.length === d.prefix.count + d.suffix.length, 'discriminator: input size');
  const acc = run(base, d.percentile, [d.accepted.random]);
  const rej = run(base, d.percentile, [d.rejected.random]);
  eq(acc.value, d.accepted.expectedValue, 'discriminator: accepted value');
  eq(rej.value, d.rejected.expectedValue, 'discriminator: rejected value');
  eq(acc.draws, d.expectedRandomDraws, 'discriminator: accepted draws');
  eq(rej.draws, d.expectedRandomDraws, 'discriminator: rejected draws');
  ok(acc.value !== rej.value, 'discriminator: branches must differ');
  emit('boundaryDiscriminator', before, {
    percentile: d.percentile,
    accepted: { random: d.accepted.random, value: acc.value, draws: acc.draws },
    rejected: { random: d.rejected.random, value: rej.value, draws: rej.draws },
  });
}

records.push({ fixture: NAME, ok: true, cases: doc.cases.length, checks, method: METHOD });
for (const r of records) console.log(JSON.stringify(r));
