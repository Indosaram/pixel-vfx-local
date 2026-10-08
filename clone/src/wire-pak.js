
const PAK_KEY = 0x6B30F1A5;

function fnv1a(s) {
  let h = 0x811C9DC5;
  for (const b of new TextEncoder().encode(s)) h = Math.imul(h ^ b, 0x01000193) >>> 0;
  return h;
}

function block(seed) {
  let x = ((seed ^ PAK_KEY) >>> 0) || 0x9E3779B9;
  const out = new Uint32Array(1024);
  for (let i = 0; i < 1024; i++) { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; out[i] = x; }
  return new Uint8Array(out.buffer);
}

function unscramble(src, key) {
  const b = block(fnv1a(key)), out = new Uint8Array(src.length);
  for (let i = 0; i < src.length; i++) out[i] = src[i] ^ b[i & 4095] ^ ((i >> 12) & 255);
  return out;
}

async function inflate(bytes) {
  const s = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
  return new Uint8Array(await new Response(s).arrayBuffer());
}

async function loadBuffer(pathOrUrl) {
  if (typeof window !== 'undefined' && window.require) {
    const fs = window.require('fs');
    return new Uint8Array(fs.readFileSync(pathOrUrl));
  }
  if (typeof fetch !== 'undefined') {
    const r = await fetch(pathOrUrl);
    return new Uint8Array(await r.arrayBuffer());
  }
  const fs = await import('node:fs');
  return new Uint8Array(fs.readFileSync(pathOrUrl));
}

export async function openPak(pakPath) {
  const buf = await loadBuffer(pakPath);
  if (String.fromCharCode(...buf.subarray(0, 4)) !== 'H0PK') throw new Error('Bad PAK magic');
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const ilen = dv.getUint32(8, true);
  const base = 12 + ilen;
  const indexJsonBytes = await inflate(unscramble(buf.subarray(12, base), '__index__'));
  const index = JSON.parse(new TextDecoder().decode(indexJsonBytes));
  const files = new Map(index.map(e => [e.p, e]));

  async function readFile(filePath) {
    let e = files.get(filePath);
    if (!e && !filePath.includes('/')) {
      e = files.get('textures/' + filePath) || files.get('meshes/' + filePath) || files.get('fx/' + filePath) || files.get('sprites/' + filePath);
    }
    if (!e) throw new Error('File not found in PAK: ' + filePath);
    const rawBytes = unscramble(buf.subarray(base + e.o, base + e.o + e.n), e.p);
    return e.f & 1 ? await inflate(rawBytes) : rawBytes;
  }

  async function readJson(filePath) {
    const bytes = await readFile(filePath);
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  return {
    index,
    files,
    readFile,
    readJson
  };
}
