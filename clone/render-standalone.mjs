#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const effectId = process.argv[2] || 'Hit_01_Fire';
const size = process.argv[3] || '64';
const outPath = process.argv[4] || resolve(__dirname, `out/${effectId}_${size}_pure_clone.gif`);

const isWin = process.platform === 'win32';
const knownPaths = [
  resolve(__dirname, isWin ? 'node_modules/electron/dist/electron.exe' : 'node_modules/.bin/electron'),
  'C:\\Users\\sook\\clone-boundary-01a1154f\\node_modules\\electron\\dist\\electron.exe',
  'C:\\Users\\sook\\clone-cap-01a1154f\\node_modules\\electron\\dist\\electron.exe'
];
const foundBin = knownPaths.find(p => existsSync(p));
const electronBin = foundBin || (isWin ? 'npx.cmd' : 'npx');
const runnerFile = resolve(__dirname, 'electron-runner.cjs');
const args = foundBin 
  ? [runnerFile, effectId, size, outPath]
  : ['-y', 'electron', runnerFile, effectId, size, outPath];

console.log(`[Pure Clone Standalone] Rendering ${effectId} (${size}x${size})...`);
console.log(`[Pure Clone Standalone] Binary: ${electronBin}`);

const child = spawn(electronBin, args, {
  cwd: __dirname,
  stdio: 'inherit',
  shell: isWin
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
