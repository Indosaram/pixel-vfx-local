
// Pure LZW GIF encoder ported from hun0fx formats.js
function lzw(indices, minCode) {
  const out = [], clear = 1 << minCode, eoi = clear + 1;
  let size = minCode + 1, next = eoi + 1, dict = new Map(), cur = 0, bits = 0;
  const emit = (code) => { cur |= code << bits; bits += size; while (bits >= 8) { out.push(cur & 255); cur >>>= 8; bits -= 8; } };
  emit(clear);
  let w = indices[0];
  for (let i = 1; i < indices.length; i++) {
    const k = indices[i], key = w * 4096 + k;
    if (dict.has(key)) { w = dict.get(key); continue; }
    emit(w);
    if (next < 4096) { dict.set(key, next++); if (next > (1 << size) && size < 12) size++; }
    else { emit(clear); dict = new Map(); size = minCode + 1; next = eoi + 1; }
    w = k;
  }
  emit(w); emit(eoi); if (bits > 0) out.push(cur & 255);
  return out;
}

/** frames: ImageData[] (same size). opts: {fps, holds, scale, background, loop} */
export function encodeGif(frames, opts = {}) {
  const S = Math.max(1, opts.scale | 0 || 1), W = frames[0].width * S, H = frames[0].height * S;
  const bg = opts.background;
  const colors = new Map(); const table = [];
  if (!bg) { table.push([0, 0, 0]); }                     // index 0 = transparent
  const idxOf = (r, g, b) => { const k = (r << 16) | (g << 8) | b; let i = colors.get(k); if (i === undefined) { i = table.length; colors.set(k, i); table.push([r, g, b]); } return i; };
  if (bg) idxOf(bg[0], bg[1], bg[2]);
  const idxFrames = frames.map(f => {
    const d = f.data, out = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const q = (Math.floor(y / S) * f.width + Math.floor(x / S)) * 4;
      if (d[q + 3] < 128) out[y * W + x] = bg ? idxOf(bg[0], bg[1], bg[2]) : 0;
      else out[y * W + x] = bg && d[q + 3] < 255
        ? idxOf(...[0, 1, 2].map(c => Math.round(d[q + c] * d[q + 3] / 255 + bg[c] * (1 - d[q + 3] / 255))))
        : idxOf(d[q], d[q + 1], d[q + 2]);
    }
    return out;
  });
  if (table.length > 256) throw new Error('GIF: more than 256 colours');
  let bitsN = 1; while ((1 << bitsN) < table.length) bitsN++;
  const B = []; const u16 = (v) => B.push(v & 255, (v >> 8) & 255);
  B.push(...[...'GIF89a'].map(c => c.charCodeAt(0))); u16(W); u16(H); B.push(0x80 | (bitsN - 1), 0, 0);
  for (let i = 0; i < (1 << bitsN); i++) { const c = table[i] || [0, 0, 0]; B.push(c[0], c[1], c[2]); }
  B.push(0x21, 0xff, 11, ...[...'NETSCAPE2.0'].map(c => c.charCodeAt(0)), 3, 1); u16(opts.loop === false ? 1 : 0); B.push(0);
  const fps = opts.fps || 15, holds = opts.holds || idxFrames.map(() => 1);
  let acc = 0;
  for (const [fi, ix] of idxFrames.entries()) {
    const hold = holds[fi] ?? 1;
    if (hold <= 0) continue;
    acc += (100 * hold) / fps;
    const delay = Math.round(acc);
    acc -= delay;
    B.push(0x21, 0xf9, 4, bg ? 0 : 1);
    u16(Math.max(1, delay));
    B.push(bg ? 0 : 0, 0);
    B.push(0x2c); u16(0); u16(0); u16(W); u16(H); B.push(0);
    const minCode = Math.max(2, bitsN);
    B.push(minCode);
    const enc = lzw(ix, minCode);
    for (let i = 0; i < enc.length; i += 254) {
      const slice = enc.slice(i, i + 254);
      B.push(slice.length, ...slice);
    }
    B.push(0);
  }
  B.push(0x3b);
  return new Uint8Array(B);
}
