import { Matrix3 } from 'three';

export function gradeMatrix(hue, saturation, target = new Matrix3()) {
  const a = hue * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  const H = [.213 + c * .787 - s * .213, .715 - c * .715 - s * .715, .072 - c * .072 + s * .928,
    .213 - c * .213 + s * .143, .715 + c * .285 + s * .140, .072 - c * .072 - s * .283,
    .213 - c * .213 - s * .787, .715 - c * .715 + s * .715, .072 + c * .928 + s * .072];
  const S = [.213 + .787 * saturation, .715 - .715 * saturation, .072 - .072 * saturation,
    .213 - .213 * saturation, .715 + .285 * saturation, .072 - .072 * saturation,
    .213 - .213 * saturation, .715 - .715 * saturation, .072 + .928 * saturation];
  const M = [];
  for (let r = 0; r < 3; r++) {
    for (let k = 0; k < 3; k++) {
      M.push(S[r * 3] * H[k] + S[r * 3 + 1] * H[3 + k] + S[r * 3 + 2] * H[6 + k]);
    }
  }
  return target.set(...M);
}

export function colorHS(col) {
  let r, g, b;
  if (typeof col === 'string') {
    const n = parseInt(col.replace('#', ''), 16);
    r = (n >> 16 & 255) / 255; g = (n >> 8 & 255) / 255; b = (n & 255) / 255;
  } else { r = col.r; g = col.g; b = col.b; }
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2;
  if (!d) return [0, 0];
  const s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
  const H = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [H * 60, s];
}
