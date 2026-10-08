#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const effectId = process.argv[2] || 'Hit_01_Fire';
const size = parseInt(process.argv[3] || '64', 10);
const outPath = process.argv[4] || resolve(__dirname, `out/${effectId}_${size}_pure_clone.gif`);
const pakPath = process.env.HUN0FX_PAK || resolve(__dirname, 'hun0fx.pak');

mkdirSync(resolve(__dirname, 'out'), { recursive: true });

console.log(`[Pure Clone Standalone] Rendering ${effectId} (${size}x${size})...`);
console.log(`[Pure Clone Standalone] PAK Path: ${pakPath}`);

const htmlPath = resolve(__dirname, 'dist/runner.html');

const electronRunner = `
const { app, BrowserWindow } = require('electron');
const fs = require('fs');

app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('no-sandbox');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  win.webContents.on('console-message', (e, lvl, msg) => console.log('[PAGE]', msg));

  await win.loadFile(\`${htmlPath}\`);

  try {
    const pakSafe = JSON.stringify(\`${pakPath}\`);
    const res = await win.webContents.executeJavaScript(\`window.run('${effectId}', ${size}, \${pakSafe})\`);
    if (res.ok) {
      fs.writeFileSync(\`${outPath}\`, Buffer.from(res.b64, 'base64'));
      console.log('[SUCCESS] Rendered ' + res.frames + ' frames via PURE CLONE to: ' + \`${outPath}\`);
    } else {
      console.error('[FAIL]', res.error);
      process.exit(1);
    }
  } catch (err) {
    console.error('[ERROR]', err.stack || err.message);
    process.exit(1);
  } finally {
    app.quit();
  }
});
`;

const runnerFile = resolve(__dirname, '.tmp_runner.cjs');
writeFileSync(runnerFile, electronRunner);

import { existsSync } from 'node:fs';
const isWin = process.platform === 'win32';
const knownPaths = [
  resolve(__dirname, isWin ? 'node_modules/electron/dist/electron.exe' : 'node_modules/.bin/electron'),
  'C:\\Users\\sook\\clone-boundary-01a1154f\\node_modules\\electron\\dist\\electron.exe',
  'C:\\Users\\sook\\clone-cap-01a1154f\\node_modules\\electron\\dist\\electron.exe'
];
const foundBin = knownPaths.find(p => existsSync(p));
const electronBin = foundBin || (isWin ? 'npx.cmd' : 'npx');
const args = foundBin ? [runnerFile] : ['-y', 'electron', runnerFile];
console.log(`[Pure Clone Standalone] Using Electron binary: ${electronBin}`);

const child = spawn(electronBin, args, {
  cwd: __dirname,
  stdio: 'inherit',
  shell: isWin
});

child.on('exit', (code) => {
  try { fs.unlinkSync(runnerFile); } catch {}
  process.exit(code || 0);
});
