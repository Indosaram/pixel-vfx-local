const { app, BrowserWindow } = require('electron');
const { writeFile } = require('node:fs/promises');
const { join } = require('node:path');

const output = process.argv[2];
app.setPath('userData', join(output, 'profile'));
app.whenReady().then(async () => {
  const window = new BrowserWindow({ width: 640, height: 480, show: false,
    webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false } });
  const timeout = setTimeout(() => { console.error('Capability probe timed out'); app.exit(1); }, 30000);
  let code = 1;
  try {
    await window.loadURL('data:text/html,<title>Clone capability probe</title>');
    const result = await window.webContents.executeJavaScript(`(async () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      const image = new ImageData(2, 2);
      const offscreen = new OffscreenCanvas(2, 2);
      offscreen.getContext('2d').putImageData(image, 0, 0);
      const png = new Uint8Array(await (await offscreen.convertToBlob({type:'image/png'})).arrayBuffer());
      const original = new Uint8Array([1, 2, 3, 4]);
      const compressed = await new Response(new Blob([original]).stream().pipeThrough(new CompressionStream('deflate'))).arrayBuffer();
      const decoded = new Uint8Array(await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer());
      const random = new Uint8Array(16); crypto.getRandomValues(random);
      const checks = {
        instancing: !!gl && typeof gl.drawArraysInstanced === 'function',
        imageData: image.data.length === 16,
        png: [137,80,78,71,13,10,26,10].every((v,i) => png[i] === v),
        deflate: decoded.length === original.length && decoded.every((v,i) => v === original[i]),
        crypto: random.length === 16
      };
      const gpu = gl ? gl.getParameter(gl.RENDERER) : null;
      if (gl) gl.getExtension('WEBGL_lose_context')?.loseContext();
      return {checks, gpu, pass:Object.values(checks).every(Boolean)};
    })()`);
    await writeFile(join(output, 'capabilities.json'), JSON.stringify({ ...result, versions: process.versions }, null, 2));
    code = result.pass ? 0 : 1;
    console.log(JSON.stringify(result));
  } catch (error) {
    await writeFile(join(output, 'error.txt'), String(error.stack || error));
    console.error(error);
  } finally {
    clearTimeout(timeout);
    window.destroy();
    await writeFile(join(output, 'exit.txt'), String(code));
    app.exit(code);
  }
}).catch(error => { console.error(error); app.exit(1); });
