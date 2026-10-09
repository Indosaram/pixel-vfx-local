const { app, BrowserWindow } = require('electron');
const http = require('node:http');
const { mkdirSync, writeFileSync, readFileSync } = require('node:fs');
const { join, resolve, sep, extname } = require('node:path');

if (process.platform !== 'win32') throw new Error('GPU QA runs only on physical Windows');
const output = process.argv[2];
const root = resolve(process.argv[3]);
const probe = process.argv[4];
if (!['context', 'shaders', 'capture'].includes(probe)) throw new Error('Probe must be context, shaders or capture');
const lifecycle = [{ name: 'start', at: Date.now() }];
const DEADLINE = 30000, TELEMETRY = 5000;
const TYPES = { '.js': 'text/javascript', '.html': 'text/html', '.json': 'application/json' };
const consoleErrors = [];
const telemetry = { gpuFeatureStatus: null, gpuInfo: null };
const gpuFailures = [];
let win = null, renderGone = null, timer = null, settled = false;

mkdirSync(output, { recursive: true });
app.setPath('userData', join(output, 'profile'));
app.on('child-process-gone', (_event, details) => {
  if (details.type === 'GPU') gpuFailures.push({ ...details, at: Date.now() });
});

const server = http.createServer((req, res) => {
  let file = null;
  try { file = resolve(join(root, decodeURIComponent(String(req.url).split('?')[0]))); }
  catch (error) { res.writeHead(400); res.end(); return; }
  if (!file.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
  const type = TYPES[extname(file)];
  if (!type) { res.writeHead(404); res.end(); return; }
  let buf = null;
  try { buf = readFileSync(file); }
  catch (error) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': type });
  res.end(buf);
});

function deadline(promise, ms, fallback) {
  let id;
  return Promise.race([
    Promise.resolve(promise),
    new Promise((done) => { id = setTimeout(() => done(fallback), ms); }),
  ]).finally(() => clearTimeout(id));
}

function finalize(result) {
  if (settled) return;
  settled = true;
  clearTimeout(timer);
  const cases = result && Array.isArray(result.cases) ? result.cases : [];
  let imagesOk = true;
  for (let i = 0; i < cases.length; i++) {
    const item = cases[i];
    if (!item || typeof item.pngBase64 !== 'string') continue;
    const name = `case-${String(i).padStart(3, '0')}.png`;
    try {
      writeFileSync(join(output, name),
        Buffer.from(String(item.pngBase64).replace(/^data:[^,]*,/, ''), 'base64'));
      item.image = name;
      delete item.pngBase64;
    } catch (error) { console.error(error); imagesOk = false; }
  }
  const base = result && result.pass === true && consoleErrors.length === 0
    && !renderGone && imagesOk && gpuFailures.length === 0;
  let code = base ? 0 : 1;
  try { writeFileSync(join(output, 'exit.txt'), String(code)); }
  catch (error) { console.error(error); code = 1; }
  const payload = { ...result, pass: code === 0, versions: process.versions,
    gpuFeatureStatus: telemetry.gpuFeatureStatus, gpuInfo: telemetry.gpuInfo,
    consoleErrors, renderGone, gpuFailures, lifecycle, probe };
  try { writeFileSync(join(output, 'result.json'), JSON.stringify(payload, null, 2)); }
  catch (error) {
    console.error(error);
    code = 1;
    try { writeFileSync(join(output, 'exit.txt'), '1'); }
    catch (again) { console.error(again); }
  }
  if (win && !win.isDestroyed()) win.destroy();
  if (server.listening) server.close();
  if (code === 0) console.log('TAG=WIRE_GPU PASS');
  app.exit(code);
}

function watchdog() {
  finalize({ pass: false, error: 'timeout', timedOut: true });
}

timer = setTimeout(watchdog, DEADLINE);

app.whenReady().then(async () => {
  lifecycle.push({ name: 'ready', at: Date.now() });
  try {
    await new Promise((done, fail) => {
      server.once('error', fail);
      server.listen(0, '127.0.0.1', done);
    });
    win = new BrowserWindow({ width: 640, height: 480, show: false,
      webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false } });
    const wc = win.webContents;
    wc.on('console-message', (...args) => {
      const d = typeof args[1] === 'object' && args[1] !== null ? args[1] : null;
      const message = d ? d.message : args[2];
      const level = d ? d.level : args[1];
      if (message && (level === 'error' || level === 3)) consoleErrors.push(String(message));
    });
    wc.on('render-process-gone', (_event, details) => {
      renderGone = details || null;
      finalize({ pass: false, error: `render-process-gone: ${details && details.reason}` });
    });
    const url = `http://127.0.0.1:${server.address().port}/qa/wire-gpu.html?probe=${probe}`;
    lifecycle.push({ name: 'navigation', at: Date.now() });
    await win.loadURL(url);
    const result = await wc.executeJavaScript('window.wireGpuResult');
    try { telemetry.gpuInfo = await deadline(app.getGPUInfo('complete'), TELEMETRY, { timedOut: true }); }
    catch (error) { telemetry.gpuInfo = { error: String(error) }; }
    telemetry.gpuFeatureStatus = app.getGPUFeatureStatus();
    finalize(result);
  } catch (error) {
    finalize({ pass: false, error: String((error && error.stack) || error) });
  }
}).catch((error) => {
  finalize({ pass: false, error: String((error && error.stack) || error) });
});
