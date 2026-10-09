#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { validateRenderOptions } from './src/render-options.js';
const root = dirname(fileURLToPath(import.meta.url));
const effectId = process.argv[2] || 'Original Burst';
const size = Number(process.argv[3] || 64);
const outPath = resolve(process.argv[4] || resolve(root, 'out/sample.gif'));
try {
  validateRenderOptions({effectId,size,fps:15,duration:1.2,colors:16,seed:1});
  const electron = createRequire(import.meta.url)('electron');
  const env = {...process.env}; delete env.ELECTRON_RUN_AS_NODE;
  const child = spawn(electron, [resolve(root,'electron-runner.cjs'),effectId,String(size),outPath], {cwd:root,stdio:'inherit',env});
  child.once('error', error => {console.error(error.message); process.exitCode=1;});
  child.once('exit',(code,signal)=>{if(signal) console.error(`Renderer killed by ${signal}`); process.exitCode=code ?? 1;});
} catch(error) {console.error(error.message); process.exitCode=1;}
