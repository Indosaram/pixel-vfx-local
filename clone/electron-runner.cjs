
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const effectId = process.argv[2] || 'Hit_01_Fire';
const size = parseInt(process.argv[3] || '64', 10);
const outPath = process.argv[4] || path.join(__dirname, 'out', `${effectId}_${size}.gif`);
const pakPath = process.env.HUN0FX_PAK || path.join(__dirname, 'hun0fx.pak');

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

  const targetHtml = path.join(__dirname, 'dist', 'runner.html');
  await win.loadFile(targetHtml);

  try {
    const pakSafe = JSON.stringify(pakPath);
    const code = `window.run('${effectId}', ${size}, ${pakSafe})`;
    const res = await win.webContents.executeJavaScript(code);
    if (res.ok) {
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, Buffer.from(res.b64, 'base64'));
      console.log('[SUCCESS] Rendered ' + res.frames + ' frames to: ' + outPath);
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
