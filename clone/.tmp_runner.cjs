
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

  await win.loadFile(`C:\Users\sook\pixel-vfx-local\clone\dist\runner.html`);

  try {
    const pakSafe = JSON.stringify(`C:\Users\sook\pixel-vfx-local\clone\hun0fx.pak`);
    const res = await win.webContents.executeJavaScript(`window.run('Hit_01_Fire', 64, ${pakSafe})`);
    if (res.ok) {
      fs.writeFileSync(`C:/Users/sook/pixel-vfx-local/clone/out/Hit_01_Fire_WIN_64.gif`, Buffer.from(res.b64, 'base64'));
      console.log('[SUCCESS] Rendered ' + res.frames + ' frames via PURE CLONE to: ' + `C:/Users/sook/pixel-vfx-local/clone/out/Hit_01_Fire_WIN_64.gif`);
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
