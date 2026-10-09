const { app, BrowserWindow } = require('electron');
const http = require('node:http');
const { mkdirSync, writeFileSync, readFileSync } = require('node:fs');
const { join, resolve, sep, extname } = require('node:path');

if (process.platform !== 'win32') throw new Error('Sample render runs only on physical Windows');
const output = process.argv[2];
const root = resolve(process.argv[3]);
if (!output || !root) throw new Error('Usage: electron qa/wire-sample.cjs <output> <root>');
const lifecycle = [{ name: 'start', at: Date.now() }];
const DEADLINE = 60000, TELEMETRY = 5000;
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

function writePng(name, base64) {
  writeFileSync(join(output, name),
    Buffer.from(String(base64).replace(/^data:[^,]*,/, ''), 'base64'));
}

function finalize(result) {
  if (settled) return;
  settled = true;
  clearTimeout(timer);
  const frames = result && Array.isArray(result.frames) ? result.frames : [];
  const written = [];
  let imagesOk = true;
  for (let i = 0; i < frames.length; i++) {
    const item = frames[i];
    if (!item || typeof item.pngBase64 !== 'string') continue;
    const name = `frame-${String(i).padStart(3, '0')}.png`;
    try { writePng(name, item.pngBase64); written.push(name); }
    catch (error) { console.error(error); imagesOk = false; }
    delete item.pngBase64;
  }
  let sheetName = null;
  if (result && result.sheet && typeof result.sheet.pngBase64 === 'string') {
    sheetName = 'sheet.png';
    try { writePng(sheetName, result.sheet.pngBase64); written.push(sheetName); }
    catch (error) { console.error(error); imagesOk = false; }
    delete result.sheet.pngBase64;
  }
  const base = result && result.pass === true && consoleErrors.length === 0
    && !renderGone && imagesOk && gpuFailures.length === 0 && sheetName !== null;
  let code = base ? 0 : 1;
  try { writeFileSync(join(output, 'exit.txt'), String(code)); }
  catch (error) { console.error(error); code = 1; }
  const payload = { ...result, pass: code === 0, versions: process.versions,
    written, sheetName, gpuFeatureStatus: telemetry.gpuFeatureStatus, gpuInfo: telemetry.gpuInfo,
    consoleErrors, renderGone, gpuFailures, lifecycle };
  try { writeFileSync(join(output, 'result.json'), JSON.stringify(payload, null, 2)); }
  catch (error) {
    console.error(error);
    code = 1;
    try { writeFileSync(join(output, 'exit.txt'), '1'); }
    catch (again) { console.error(again); }
  }
  if (win && !win.isDestroyed()) win.destroy();
  if (server.listening) server.close();
  if (code === 0) console.log('TAG=WIRE_SAMPLE PASS');
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
    win = new BrowserWindow({ width: 1024, height: 768, show: false,
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
    const url = `http://127.0.0.1:${server.address().port}/qa/wire-sample.html`;
    lifecycle.push({ name: 'navigation', at: Date.now() });
    await win.loadURL(url);
    const result = await wc.executeJavaScript('window.wireSampleResult');
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
