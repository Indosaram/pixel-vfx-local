export function cleanupMask(alpha, colors, width, height, minimum, fillHoles = false) {
  const count = width * height;
  if (!Number.isInteger(width) || width < 1 || !Number.isInteger(height) || height < 1
      || alpha.length !== count || colors.length !== count * 3) {
    throw { code: 'INVALID_PIXELS', stage: 'pixel', message: 'Invalid mask dimensions', context: { width, height } };
  }
  if (!(minimum > 1)) return;
  function components(solid, diagonal, visit) {
    const seen = new Uint8Array(count);
    for (let start = 0; start < count; start++) {
      if (seen[start] || (alpha[start] > 0) !== solid) continue;
      const cells = [start], rim = [];
      let boundary = false;
      seen[start] = 1;
      for (let cursor = 0; cursor < cells.length; cursor++) {
        const index = cells[cursor], x = index % width, y = Math.floor(index / width);
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) boundary = true;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if ((!dx && !dy) || (!diagonal && dx && dy)) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const next = ny * width + nx;
          if ((alpha[next] > 0) !== solid) { rim.push(next); continue; }
          if (!seen[next]) { seen[next] = 1; cells.push(next); }
        }
      }
      visit(cells, rim, boundary);
    }
  }
  components(true, true, cells => {
    if (cells.length < minimum) for (const index of cells) alpha[index] = 0;
  });
  if (fillHoles) components(false, false, (cells, rim, boundary) => {
    if (boundary || cells.length >= minimum || !rim.length) return;
    const rgb = [0, 0, 0];
    let a = 0;
    for (const index of rim) {
      a += alpha[index];
      for (let channel = 0; channel < 3; channel++) rgb[channel] += colors[index * 3 + channel];
    }
    for (const index of cells) {
      alpha[index] = a / rim.length;
      for (let channel = 0; channel < 3; channel++) colors[index * 3 + channel] = rgb[channel] / rim.length;
    }
  });
}

export function thresholdAlpha(data, threshold, levels = 1) {
  if (!Number.isInteger(levels) || levels < 1 || levels > 255) {
    throw { code: 'INVALID_ALPHA_LEVELS', stage: 'pixel', message: 'Expected integer alpha levels in [1,255]', context: { levels } };
  }
  const output = new Uint8ClampedArray(data);
  for (let i = 3; i < output.length; i += 4) {
    output[i] = output[i] <= threshold ? 0
      : levels === 1 ? 255
      : Math.ceil((output[i] - threshold) * levels / (255 - threshold)) * 255 / levels;
  }
  return output;
}

export function quantizeChannels(data, levels) {
  if (!Number.isInteger(levels) || levels < 2 || levels > 256) {
    throw { code: 'INVALID_PIXEL_LEVELS', stage: 'pixel', message: 'Expected integer levels in [2,256]', context: { levels } };
  }
  const output = new Uint8ClampedArray(data);
  const intervals = levels - 1;
  for (let i = 0; i < output.length; i += 4) {
    for (let channel = 0; channel < 3; channel++) {
      output[i + channel] = Math.round(Math.round(output[i + channel] * intervals / 255) * 255 / intervals);
    }
  }
  return output;
}

export function medianCut(pixels, count) {
  if (!Number.isInteger(count) || count < 1 || count > 256) {
    throw { code: 'INVALID_PALETTE_SIZE', stage: 'pixel', message: 'Expected palette size in [1,256]', context: { count } };
  }
  const colors = [];
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] === 0) continue;
    colors.push([pixels[i] / 255, pixels[i + 1] / 255, pixels[i + 2] / 255]);
  }
  if (!colors.length) return [[0, 0, 0]];
  const boxes = [colors];
  while (boxes.length < count) {
    let selected = -1, selectedRange = -1, selectedChannel = 0;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].length < 2) continue;
      for (let channel = 0; channel < 3; channel++) {
        let low = Infinity, high = -Infinity;
        for (const color of boxes[i]) { low = Math.min(low, color[channel]); high = Math.max(high, color[channel]); }
        const range = (high - low) * (channel === 1 ? 1.2 : 1);
        if (range > selectedRange) { selected = i; selectedRange = range; selectedChannel = channel; }
      }
    }
    if (selected < 0 || selectedRange <= 1e-4) break;
    const box = boxes[selected].sort((a, b) => a[selectedChannel] - b[selectedChannel]);
    const split = Math.floor(box.length / 2);
    boxes.splice(selected, 1, box.slice(0, split), box.slice(split));
  }
  return boxes.map(box => {
    return [0, 1, 2].map(channel => box.reduce((sum, color) => sum + color[channel], 0) / box.length);
  });
}

export function mapPalette(pixels, palette, threshold = 0) {
  if (!palette.length) throw { code: 'EMPTY_PALETTE', stage: 'pixel', message: 'Palette must contain colors', context: {} };
  const weights = [2, 4, 3];
  const output = new Uint8ClampedArray(pixels);
  for (let i = 0; i < output.length; i += 4) {
    if (output[i + 3] < threshold) { output[i + 3] = 0; continue; }
    let selected = 0, best = Infinity;
    for (let p = 0; p < palette.length; p++) {
      let distance = 0;
      for (let channel = 0; channel < 3; channel++) {
        const delta = output[i + channel] / 255 - palette[p][channel];
        distance += weights[channel] * delta * delta;
      }
      if (distance < best) { best = distance; selected = p; }
    }
    for (let channel = 0; channel < 3; channel++) output[i + channel] = Math.round(palette[selected][channel] * 255);
  }
  return output;
}

export function bayerDither(pixels, width, height, levels, phaseX = 0, phaseY = 0) {
  if (!Number.isInteger(width) || width < 1 || !Number.isInteger(height) || height < 1 || pixels.length !== width * height * 4) {
    throw { code: 'INVALID_PIXELS', stage: 'pixel', message: 'Invalid dither dimensions', context: { width, height } };
  }
  if (!Number.isInteger(levels) || levels < 2 || levels > 256) {
    throw { code: 'INVALID_PIXEL_LEVELS', stage: 'pixel', message: 'Expected integer levels in [2,256]', context: { levels } };
  }
  const matrix = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  const output = new Uint8ClampedArray(pixels), intervals = levels - 1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const threshold = ((matrix[(y + phaseY + 4) % 4][(x + phaseX + 4) % 4] + 0.5) / 16 - 0.5) * (255 / intervals);
    const index = (y * width + x) * 4;
    for (let channel = 0; channel < 3; channel++) {
      output[index + channel] = Math.round(Math.max(0, Math.min(255, output[index + channel] + threshold)) * intervals / 255) * 255 / intervals;
    }
  }
  return output;
}

export function outlineMask(alpha, width, height, connectivity = 4) {
  if (!Number.isInteger(width) || width < 1 || !Number.isInteger(height) || height < 1 || alpha.length !== width * height || ![4, 8].includes(connectivity)) {
    throw { code: 'INVALID_PIXELS', stage: 'pixel', message: 'Invalid outline dimensions or connectivity', context: { width, height, connectivity } };
  }
  const inner = new Uint8Array(alpha.length), outer = new Uint8Array(alpha.length);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const index = y * width + x, solid = alpha[index] > 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if ((!dx && !dy) || (connectivity === 4 && dx && dy)) continue;
      const nx = x + dx, ny = y + dy;
      const inBounds = nx >= 0 && nx < width && ny >= 0 && ny < height;
      const neighbor = inBounds && alpha[ny * width + nx] > 0;
      if (solid && !neighbor) inner[index] = 1;
      if (inBounds && !solid && neighbor) outer[index] = 1;
    }
  }
  return { inner, outer };
}

export const DEFAULT_PIXEL = {
  alphaThreshold: 0.28, alphaLevels: 1, colors: 16, paletteMode: 'auto', palette: null,
  autoBright: true, brightness: 1, whiteHot: 0.4, edgeDark: 0.3, hue: 0, saturation: 1,
  dither: 'none', ditherStrength: 0.5, outline: 'none', outlineColor: 'auto', outlineCorners: false,
  cleanup: 0, fillHoles: true,
  gradient: { on: false, preset: 'Fire', stops: ['#2a0a12', '#a8231a', '#ff7a1a', '#ffe68a'], pos: [0, 0.3333, 0.6667, 1], mix: 1, reverse: false },
};

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
const BAYER2 = [0, 2, 3, 1].map(v => (v + 0.5) / 4);

function hueSat(r, g, b, hue, sat) {
  if (!hue && sat === 1) return [r, g, b];
  const a = hue * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  let R = r * (.213 + c * .787 - s * .213) + g * (.715 - c * .715 - s * .715) + b * (.072 - c * .072 + s * .928);
  let G = r * (.213 - c * .213 + s * .143) + g * (.715 + c * .285 + s * .140) + b * (.072 - c * .072 - s * .283);
  let B = r * (.213 - c * .213 - s * .787) + g * (.715 - c * .715 + s * .715) + b * (.072 + c * .928 + s * .072);
  const l = .213 * R + .715 * G + .072 * B;
  return [l + (R - l) * sat, l + (G - l) * sat, l + (B - l) * sat];
}

function nearest(pal, r, g, b) {
  let bi = 0, bd = Infinity;
  for (let i = 0; i < pal.length; i++) {
    const p = pal[i], dr = p[0] - r, dg = p[1] - g, db = p[2] - b, d = dr * dr + dg * dg + db * db;
    if (d < bd) { bd = d; bi = i; }
  }
  return bi;
}

export function pixelate(cap, size, p) {
  p = { ...DEFAULT_PIXEL, ...p };
  const [sw, sh] = cap.shape || [1, 1], W = Math.round(cap.outW || size * sw), H = Math.round(cap.outH || size * sh);
  if (!(W >= 1 && H >= 1) || !cap.frames?.length) throw new Error(`nothing to pixelate (size ${W}x${H}, ${cap.frames?.length ?? 0} frames)`);
  const tmp = [];
  for (const fr of cap.frames) {
    const k = fr.w / W;
    const col = new Float32Array(W * H * 3), al = new Float32Array(W * H);
    const sd = fr.data, kk = k * k;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let j = 0; j < k; j++) {
        let i = ((y * k + j) * fr.w + x * k) * 4;
        for (let q = 0; q < k; q++, i += 4) {
          const A = sd[i + 3]; a += A; r += sd[i] * A; g += sd[i + 1] * A; b += sd[i + 2] * A;
        }
      }
      const o = y * W + x, A = a / kk / 255; al[o] = A;
      if (a > 0) {
        let R = 2 * r / a / 255, G = 2 * g / a / 255, B = 2 * b / a / 255;
        const ex = Math.max(0, Math.max(R, G, B) - 1) * p.whiteHot;
        R = Math.min(1, R + ex); G = Math.min(1, G + ex); B = Math.min(1, B + ex);
        col[o * 3] = R; col[o * 3 + 1] = G; col[o * 3 + 2] = B;
      }
    }
    tmp.push({ col, al });
  }

  for (const t of tmp) for (let o = 0; o < W * H; o++) {
    const A = t.al[o]; if (!(A > 0)) continue;
    const [R, G2, B] = hueSat(t.col[o * 3], t.col[o * 3 + 1], t.col[o * 3 + 2], p.hue, p.saturation);
    const e = (1 - p.edgeDark) + p.edgeDark * Math.sqrt(A);
    t.col[o * 3] = R * e; t.col[o * 3 + 1] = G2 * e; t.col[o * 3 + 2] = B * e;
  }

  const thr = p.alphaThreshold, L = Math.max(1, p.alphaLevels | 0);
  const qa = (a) => a <= thr ? 0 : L === 1 ? 1 : Math.ceil(((a - thr) / (1 - thr)) * L) / L;
  let gain = p.brightness;
  const sample = [];
  for (const t of tmp) for (let o = 0; o < W * H; o++) if (qa(t.al[o]) > 0) {
    if (sample.length < 40000 || Math.random() < 0.1) sample.push([t.col[o * 3], t.col[o * 3 + 1], t.col[o * 3 + 2]]);
  }
  if (p.autoBright && sample.length) {
    const lum = sample.map(c => .3 * c[0] + .59 * c[1] + .11 * c[2]).sort((a, b) => a - b);
    gain *= Math.min(1.8, Math.max(1, 0.62 / Math.max(1e-3, lum[(lum.length * 0.9) | 0])));
  }
  for (const c of sample) {
    c[0] = Math.min(1, c[0] * gain); c[1] = Math.min(1, c[1] * gain); c[2] = Math.min(1, c[2] * gain);
  }

  let pal = p.paletteMode === 'custom' && p.palette && p.palette.length ? p.palette : medianCut(sample.length > 30000 ? sample.filter((_, i) => i % Math.ceil(sample.length / 30000) === 0) : sample, Math.max(2, p.colors | 0));
  let outline = null;
  if (p.outline !== 'none') {
    if (Array.isArray(p.outlineColor)) outline = p.outlineColor;
    else {
      let d = pal[0], dl = 9;
      for (const c of pal) {
        const l = .3 * c[0] + .59 * c[1] + .11 * c[2];
        if (l < dl) { dl = l; d = c; }
      }
      outline = d.map(v => v * 0.45);
    }
  }

  const bayer = p.dither === 'bayer4' ? [BAYER4, 4] : p.dither === 'bayer2' ? [BAYER2, 2] : null;
  const spread = p.ditherStrength / Math.max(2, Math.cbrt(pal.length));
  const out = [];

  for (const t of tmp) {
    const img = new ImageData(W, H), d = img.data, solid = new Uint8Array(W * H);
    const A = new Float32Array(W * H);
    for (let o = 0; o < W * H; o++) A[o] = qa(t.al[o]);
    if (p.cleanup > 1) cleanupMask(A, t.col, W, H, p.cleanup | 0, p.fillHoles);

    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const o = y * W + x, a = A[o]; if (!a) continue;
      let r = Math.min(1, t.col[o * 3] * gain), g = Math.min(1, t.col[o * 3 + 1] * gain), b = Math.min(1, t.col[o * 3 + 2] * gain);
      if (bayer) {
        const v = (bayer[0][(y % bayer[1]) * bayer[1] + (x % bayer[1])] - 0.5) * spread;
        r += v; g += v; b += v;
      }
      const c = pal[nearest(pal, r, g, b)], q = o * 4;
      d[q] = c[0] * 255 + 0.5; d[q + 1] = c[1] * 255 + 0.5; d[q + 2] = c[2] * 255 + 0.5; d[q + 3] = a * 255 + 0.5; solid[o] = 1;
    }

    if (outline) {
      const n4 = [[1, 0], [-1, 0], [0, 1], [0, -1]], n8 = n4.concat([[1, 1], [1, -1], [-1, 1], [-1, -1]]), N = p.outlineCorners ? n8 : n4;
      const mark = [];
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const o = y * W + x, inside = solid[o];
        if ((p.outline === 'outer') === !!inside) continue;
        for (const [dx, dy] of N) {
          const X = x + dx, Y = y + dy;
          const nb = X >= 0 && Y >= 0 && X < W && Y < H ? solid[Y * W + X] : 0;
          if (nb !== inside) { mark.push(o); break; }
        }
      }
      for (const o of mark) {
        const q = o * 4;
        d[q] = outline[0] * 255; d[q + 1] = outline[1] * 255; d[q + 2] = outline[2] * 255; d[q + 3] = 255;
      }
    }
    out.push(img);
  }

  const P = pal.map(c => c.map(v => Math.round(v * 255)));
  return { frames: out, w: W, h: H, palette: P, outline: outline && outline.map(v => Math.round(v * 255)), gain };
}
