import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Coordinator-authored execution wrapper. Independent oracle values were
// recomputed by implementation-blind MiMo worker st_01a117a8 and preserved verbatim.
const load = name => JSON.parse(readFileSync(new URL(name, import.meta.url), 'utf8'));
const input = load('./fixtures/timing-input.json');
const expected = load('./fixtures/timing-expected.json');
const oracle = load('./timing-independent-oracle.json');
assert.equal(oracle.independent, true);
assert.ok(input.cases.length > 0);
assert.equal(new Set(input.cases.map(c => c.id)).size, input.cases.length);
assert.deepEqual(Object.keys(expected.cases).sort(), input.cases.map(c => c.id).sort());
assert.deepEqual(Object.keys(oracle.cases).sort(), Object.keys(expected.cases).sort());
let checks = 0;
for (const c of input.cases) {
  const coverage = c.coverage;
  const max = Math.max(...coverage);
  let holds = [];
  if (!c.loop && coverage.length >= 4 && max > 0) {
    holds = coverage.map(() => 1);
    const peak = coverage.indexOf(max);
    const impact = coverage.findIndex(v => v >= max * 0.55);
    const hold = c.fps >= 20 ? 4 : c.fps >= 12 ? 3 : 2;
    holds[impact] = hold;
    if (impact + 1 < holds.length) holds[impact + 1] = Math.max(2, hold - 1);
    const start = Math.max(peak, impact + 2);
    const tail = coverage.findIndex((v, i) => i >= start && v < max * 0.4);
    if (tail > 0) for (let i = tail; i < holds.length - 1; i++) holds[i] = (i - tail) % 2 ? 0 : 2;
  }
  const markers = holds.flatMap((x, i) => x === 1 ? [] : [{ t: Number((i / c.fps).toFixed(3)), x }]);
  assert.deepEqual({ holds, markers }, oracle.cases[c.id], `${c.id}: independent oracle vs inputs`);
  for (const [key, value] of Object.entries(expected.cases[c.id])) {
    assert.ok(key === 'holds' || key === 'markers', `${c.id}: unverified expected field ${key}`);
    assert.deepEqual(value, oracle.cases[c.id][key], `${c.id}: fixture vs independent oracle`);
    checks++;
  }
}
const clamps = input.clampInputs.map(v => Math.max(0, Math.min(8, v | 0)));
assert.deepEqual(clamps, oracle.clampExpected, 'input clamp values vs independent oracle');
assert.deepEqual(expected.clampExpected, oracle.clampExpected, 'declared clamp values vs independent oracle');
checks += 2;
console.log(JSON.stringify({ files: ['timing-input.json', 'timing-expected.json'], checks, cases: input.cases.length, method: 'Coordinator execution wrapper cross-checks both inputs and expectations against preserved implementation-blind worker arithmetic', oracleAuthor: 'st_01a117a8', exit: 0 }));
