// Capture/post pipeline for 3D frames: HDR bloom (bright-pass + separable
// blur at half res), then a three-pass alpha matte (raw coverage pass ->
// dilation pass -> edge composite) and an ACES-approx tonemap to RGBA8.

function aces(x) {
	const a = 2.51;
	const b = 0.03;
	const c = 2.43;
	const d = 0.59;
	const e = 0.14;
	const n = x * (a * x + b);
	const dd = x * (c * x + d) + e;
	return Math.min(1, Math.max(0, n / dd));
}

export function hdrBloom(hdr, W, H, opts = {}) {
	const threshold = opts.threshold === undefined ? 0.85 : opts.threshold;
	const intensity = opts.intensity === undefined ? 0.6 : opts.intensity;
	const hw = Math.max(1, W >> 1);
	const hh = Math.max(1, H >> 1);
	const bright = new Float32Array(hw * hh * 3);
	for (let y = 0; y < hh; y++) {
		for (let x = 0; x < hw; x++) {
			const sx = Math.min(W - 1, x * 2);
			const sy = Math.min(H - 1, y * 2);
			const o = (sy * W + sx) * 4;
			for (let c = 0; c < 3; c++) {
				const v = hdr.data[o + c];
				const over = v - threshold;
				bright[(y * hw + x) * 3 + c] = over > 0 ? over : 0;
			}
		}
	}
	const tmp = new Float32Array(hw * hh * 3);
	boxBlurH(bright, tmp, hw, hh, 2);
	boxBlurV(tmp, bright, hw, hh, 2);
	boxBlurH(bright, tmp, hw, hh, 2);
	boxBlurV(tmp, bright, hw, hh, 2);
	for (let y = 0; y < H; y++) {
		const by = Math.min(hh - 1, y >> 1);
		for (let x = 0; x < W; x++) {
			const bx = Math.min(hw - 1, x >> 1);
			const bo = (by * hw + bx) * 3;
			const o = (y * W + x) * 4;
			hdr.data[o] += bright[bo] * intensity;
			hdr.data[o + 1] += bright[bo + 1] * intensity;
			hdr.data[o + 2] += bright[bo + 2] * intensity;
		}
	}
}

function boxBlurH(src, dst, w, h, radius) {
	const span = radius * 2 + 1;
	for (let y = 0; y < h; y++) {
		for (let c = 0; c < 3; c++) {
			let acc = 0;
			for (let k = -radius; k <= radius; k++) {
				const x = Math.min(w - 1, Math.max(0, k));
				acc += src[(y * w + x) * 3 + c];
			}
			for (let x = 0; x < w; x++) {
				dst[(y * w + x) * 3 + c] = acc / span;
				const xOut = Math.min(w - 1, Math.max(0, x - radius));
				const xIn = Math.min(w - 1, Math.max(0, x + radius + 1));
				acc += src[(y * w + xIn) * 3 + c] - src[(y * w + xOut) * 3 + c];
			}
		}
	}
}

function boxBlurV(src, dst, w, h, radius) {
	const span = radius * 2 + 1;
	for (let x = 0; x < w; x++) {
		for (let c = 0; c < 3; c++) {
			let acc = 0;
			for (let k = -radius; k <= radius; k++) {
				const y = Math.min(h - 1, Math.max(0, k));
				acc += src[(y * w + x) * 3 + c];
			}
			for (let y = 0; y < h; y++) {
				dst[(y * w + x) * 3 + c] = acc / span;
				const yOut = Math.min(h - 1, Math.max(0, y - radius));
				const yIn = Math.min(h - 1, Math.max(0, y + radius + 1));
				acc += src[(yIn * w + x) * 3 + c] - src[(yOut * w + x) * 3 + c];
			}
		}
	}
}

export function tonemapMatte3Pass(hdr, W, H) {
	const n = W * H;
	const out = new Uint8ClampedArray(n * 4);
	const cov = new Float32Array(n);
	for (let i = 0; i < n; i++) cov[i] = hdr.data[i * 4 + 3];

	const matte = new Float32Array(n);
	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const i = y * W + x;
			let m = cov[i];
			for (let dy = -1; dy <= 1; dy++) {
				const yy = y + dy;
				if (yy < 0 || yy >= H) continue;
				for (let dx = -1; dx <= 1; dx++) {
					const xx = x + dx;
					if (xx < 0 || xx >= W) continue;
					const v = cov[yy * W + xx];
					if (v > m) m = v;
				}
			}
			matte[i] = m;
		}
	}

	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const i = y * W + x;
			const o = i * 4;
			let r = hdr.data[o];
			let g = hdr.data[o + 1];
			let b = hdr.data[o + 2];
			if (cov[i] <= 0 && matte[i] > 0) {
				let best = -1;
				for (let dy = -1; dy <= 1; dy++) {
					const yy = y + dy;
					if (yy < 0 || yy >= H) continue;
					for (let dx = -1; dx <= 1; dx++) {
						const xx = x + dx;
						if (xx < 0 || xx >= W) continue;
						const j = yy * W + xx;
						if (cov[j] <= 0) continue;
						const lum =
							hdr.data[j * 4] + hdr.data[j * 4 + 1] + hdr.data[j * 4 + 2];
						if (lum > best) {
							best = lum;
							r = hdr.data[j * 4];
							g = hdr.data[j * 4 + 1];
							b = hdr.data[j * 4 + 2];
						}
					}
				}
				if (best >= 0) {
					r *= 0.9;
					g *= 0.9;
					b *= 0.9;
				}
			}
			out[o] = Math.round(aces(r) * 255);
			out[o + 1] = Math.round(aces(g) * 255);
			out[o + 2] = Math.round(aces(b) * 255);
			out[o + 3] = Math.round(Math.min(1, matte[i]) * 255);
		}
	}
	return out;
}
