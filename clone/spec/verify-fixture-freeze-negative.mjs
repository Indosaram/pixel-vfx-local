import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const spec = dirname(fileURLToPath(import.meta.url));
const names = [
  'alpha-rescale.json', 'f01-expected.json', 'f01-input.json', 'f01-wire-input.json',
  'f02-expected.json', 'f02-input.json', 'f03-expected.json', 'f03-input.json',
  'median-cut.json', 'p01-expected.json', 'p01-input.json', 'pixel-sampling.json',
  'shared-rng-trace.json', 'sheet-layout.json', 'timing-expected.json', 'timing-input.json',
];
const mutations = [
  ['alpha-rescale.json', value => { value.expectedAlphaBytes[2] = 0; }],
  ['median-cut.json', value => { value.cases[1].expected[1][0] = 0; }],
  ['pixel-sampling.json', value => { value.cases[0].expectedValue = -1; }],
  ['sheet-layout.json', value => { value.cases[0].expectedColumns = 1; }],
  ['timing-expected.json', value => { value.clampExpected[0] = 8; }],
  ['timing-input.json', value => { value.clampInputs[0] = 8; }],
  ['shared-rng-trace.json', value => { value.expected.stateCheckpoints[0].state += 1; }],
  ['shared-rng-trace.json', value => { value.expected.firstUpdate[1].burstCountDraw += 1; }],
];
const scripts = {
  'alpha-rescale.json': 'verify-fixture-freeze.mjs',
  'timing-input.json': 'verify-timing-fixture.mjs',
  'timing-expected.json': 'verify-timing-fixture.mjs',
  'sheet-layout.json': 'verify-sheet-layout-fixture.mjs',
  'shared-rng-trace.json': 'verify-rng-trace-fixture.mjs',
  'pixel-sampling.json': 'verify-sampling-fixture.mjs',
  'median-cut.json': 'verify-median-fixture.mjs',
};
if (process.argv[2] && !mutations.some(([name]) => name === process.argv[2])) {
  throw new Error(`Unknown fixture mutation selector: ${process.argv[2]}`);
}
let failures = 0;
for (const [name, mutate] of mutations) {
  if (process.argv[2] && process.argv[2] !== name) continue;
  const root = mkdtempSync(join(tmpdir(), 'fixture-freeze-negative-'));
  try {
    const target = join(root, 'fixtures');
    mkdirSync(target);
    const script = scripts[name];
    copyFileSync(join(spec, script), join(root, script));
    if (name.startsWith('timing-')) copyFileSync(join(spec, 'timing-independent-oracle.json'), join(root, 'timing-independent-oracle.json'));
    for (const file of names) copyFileSync(join(spec, 'fixtures', file), join(target, file));
    const baseline = spawnSync(process.execPath, [join(root, script)], { encoding: 'utf8', timeout: 30000 });
    if (baseline.status !== 0 || baseline.error) {
      throw new Error(`Unmodified temporary fixture audit failed: ${baseline.error?.message || baseline.stderr || baseline.stdout}`);
    }
    const file = join(target, name);
    const value = JSON.parse(readFileSync(file, 'utf8'));
    mutate(value);
    writeFileSync(file, JSON.stringify(value));
    const result = spawnSync(process.execPath, [join(root, script)], { encoding: 'utf8', timeout: 30000 });
    const rejected = result.status !== null && result.status !== 0 && !result.error;
    console.log(JSON.stringify({ file: name, script, mutationRejected: rejected, exit: result.status, stdout: result.stdout, stderr: result.stderr, error: result.error?.message }));
    if (!rejected) failures++;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
process.exitCode = failures ? 1 : 0;
