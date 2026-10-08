#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_CODE_DIR = '/Users/indo/.omo/evidence/hun0fx-pixel-studio-demo/app-code';

const effectId = process.argv[2] || 'Slash_fire';
const size = parseInt(process.argv[3] || '64', 10);
const outGif = process.argv[4] || resolve(__dirname, `../out/${effectId}_${size}.gif`);

mkdirSync(dirname(outGif), { recursive: true });

console.log(`Rendering ${effectId} (${size}x${size}) via clone renderer...`);

const electronScript = `
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('no-sandbox');

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: 1024, height: 768, webPreferences: { nodeIntegration: true, contextIsolation: false } });
  await win.loadFile(path.join(__dirname, 'app', 'index.html'));

  const res = await win.webContents.executeJavaScript(\`
    (async () => {
      try {
        const { mountPak } = await import('./js/vfs.js');
        await mountPak('./data/hun0fx.pak');
        const { Capture } = await import('./js/capture.js');
        const { pixelate, DEFAULT_PIXEL } = await import('./js/pixel.js');
        const { encodeGif } = await import('./js/formats.js');

        const cap = new Capture('./data/');
        const captured = await cap.capture('${effectId}', {
          elevation: 35, facing: 0, roll: 0, nativeX: false, speed: 1, fps: 15, duration: 0.77, size: ${size}, framing: 'auto', aspect: 'square', padding: 0.06
        });
        const pix = pixelate(captured, ${size}, { ...DEFAULT_PIXEL, colors: 16, autoBright: true });
        const gif = encodeGif(pix.frames, { fps: 15, scale: 1 });
        return { ok: true, b64: btoa(Array.from(gif, b => String.fromCharCode(b)).join('')), frames: pix.frames.length };
      } catch (e) {
        return { ok: false, error: e.stack || e.message };
      }
    })()
  \`);

  if (res.ok) {
    fs.writeFileSync('${outGif}', Buffer.from(res.b64, 'base64'));
    console.log('SUCCESS: Rendered ' + res.frames + ' frames to ${outGif}');
  } else {
    console.error('ERROR: ' + res.error);
    process.exit(1);
  }
  app.quit();
});
`;

const runnerPath = join(APP_CODE_DIR, 'tmp_runner.cjs');
writeFileSync(runnerPath, electronScript);

const child = spawn('npx', ['-y', 'electron', runnerPath], {
  cwd: APP_CODE_DIR,
  stdio: 'inherit'
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
