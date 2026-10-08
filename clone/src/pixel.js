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
