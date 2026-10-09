import { spawn } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const args = process.argv.slice(2).filter(arg => arg !== '--');
const caseIndex = args.indexOf('--case');
const outIndex = args.indexOf('--out');
if (process.platform !== 'win32') throw new Error('QA rendering/encoding runs only on physical Windows');
if (caseIndex < 0 || args[caseIndex + 1] !== 'capabilities' || outIndex < 0 || !args[outIndex + 1]) {
  throw new Error('Usage: bun run qa -- --case capabilities --out <evidence-directory>');
}
const output = resolve(args[outIndex + 1]);
await mkdir(output, { recursive: true });
await rm(resolve(output, 'exit.txt'), { force: true });
const require = createRequire(import.meta.url);
const electron = require('electron');
const environment = { ...process.env };
delete environment.ELECTRON_RUN_AS_NODE;
const child = spawn(electron, [resolve('qa/capabilities.cjs'), output], { stdio: 'inherit', env: environment });
const exitCode = await new Promise((resolveExit, reject) => {
  child.once('error', reject);
  child.once('exit', code => resolveExit(code ?? 1));
});
// Electron's recorded outcome is authoritative even when a platform launcher
// reports a successful process handoff instead of the application exit code.
const { readFile } = await import('node:fs/promises');
const recordedExit = Number(await readFile(resolve(output, 'exit.txt'), 'utf8'));
if (!Number.isInteger(recordedExit) || ![0, 1].includes(recordedExit)) {
  throw new Error('Invalid capability exit receipt');
}
process.exit(exitCode !== 0 ? exitCode : recordedExit);
