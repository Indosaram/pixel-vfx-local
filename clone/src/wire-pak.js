
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

export function transformPakBytes(src, key) {
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
    if(!r.ok) throw new Error(`Pack fetch failed: HTTP ${r.status}`);
    return new Uint8Array(await r.arrayBuffer());
  }
  const fs = await import('node:fs');
  return new Uint8Array(fs.readFileSync(pathOrUrl));
}

export async function openPak(pakPath) {
  const buf = pakPath instanceof Uint8Array ? pakPath : await loadBuffer(pakPath);
  if(buf.length < 12) throw new Error('Truncated PAK header');
  if (String.fromCharCode(...buf.subarray(0, 4)) !== 'H0PK') throw new Error('Bad PAK magic');
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const ilen = dv.getUint32(8, true);
  const base = 12 + ilen;
  if(!ilen || base > buf.length) throw new Error('Invalid PAK index length');
  const indexJsonBytes = await inflate(transformPakBytes(buf.subarray(12, base), '__index__'));
  const index = JSON.parse(new TextDecoder().decode(indexJsonBytes));
  if(!Array.isArray(index) || index.length > 10000) throw new Error('Invalid PAK index');
  const files = new Map();
  for(const entry of index) {
    if(typeof entry.p !== 'string' || !entry.p || entry.p.includes('..') || entry.p.startsWith('/') || entry.p.includes('\\') || files.has(entry.p) ||
      !Number.isSafeInteger(entry.o) || entry.o < 0 || !Number.isSafeInteger(entry.n) || entry.n < 0 || base + entry.o + entry.n > buf.length || !Number.isInteger(entry.f)) throw new Error('Invalid PAK entry');
    files.set(entry.p,entry);
  }

  async function readFile(filePath) {
    let e = files.get(filePath);
    if (!e && !filePath.includes('/')) {
      e = files.get('textures/' + filePath) || files.get('meshes/' + filePath) || files.get('fx/' + filePath) || files.get('sprites/' + filePath);
    }
    if (!e) throw new Error('File not found in PAK: ' + filePath);
    const rawBytes = transformPakBytes(buf.subarray(base + e.o, base + e.o + e.n), e.p);
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
