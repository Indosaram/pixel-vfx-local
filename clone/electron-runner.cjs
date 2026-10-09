const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const effectId = process.argv[2] || 'Original Burst';
const size = Number(process.argv[3] || 64);
const outPath = process.argv[4] || path.join(__dirname,'out/sample.gif');
if(process.env.CLONE_SOFTWARE_GL === '1') {
  app.commandLine.appendSwitch('use-angle','swiftshader');
  app.commandLine.appendSwitch('enable-unsafe-swiftshader');
}
let win;
const timeout = setTimeout(() => {console.error('Render timed out after 120 seconds'); app.exit(1);},120000);
app.whenReady().then(async()=>{
  try {
    win = new BrowserWindow({show:false,width:1024,height:768,
      webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
    win.webContents.on('console-message',event=>console.log('[PAGE]',event.message));
    await win.loadFile(path.join(__dirname,'dist/runner.html'));
    const packBase64 = process.env.HUN0FX_PAK ? fs.readFileSync(process.env.HUN0FX_PAK).toString('base64') : null;
    const result = await win.webContents.executeJavaScript(`window.run(${JSON.stringify(effectId)},${JSON.stringify(size)},${JSON.stringify(packBase64)})`);
    if(!result?.ok || !result.b64) throw new Error(result?.error || 'Renderer returned no GIF');
    const bytes = Buffer.from(result.b64,'base64');
    if(bytes.subarray(0,6).toString() !== 'GIF89a') throw new Error('Invalid GIF output');
    fs.mkdirSync(path.dirname(outPath),{recursive:true});
    fs.writeFileSync(outPath,bytes);
    console.log(`Rendered ${result.frames} frames to ${outPath}`);
    clearTimeout(timeout); win.destroy(); app.exit(0);
  } catch(error) {console.error(error.stack || error); clearTimeout(timeout); win?.destroy(); app.exit(1);}
}).catch(error=>{console.error(error); clearTimeout(timeout); app.exit(1);});
