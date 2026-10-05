export const LUTS = {
	none: null,
	ember: [
		[10, 0, 0],
		[120, 10, 0],
		[230, 80, 10],
		[255, 170, 40],
		[255, 240, 180],
	],
	frost: [
		[5, 10, 40],
		[30, 60, 150],
		[80, 140, 230],
		[170, 220, 255],
		[250, 253, 255],
	],
	spark: [
		[0, 5, 40],
		[20, 50, 180],
		[60, 140, 250],
		[160, 230, 255],
		[255, 255, 255],
	],
	venom: [
		[5, 25, 5],
		[20, 90, 20],
		[90, 200, 40],
		[190, 240, 90],
		[245, 255, 190],
	],
	radiance: [
		[40, 25, 0],
		[150, 100, 10],
		[240, 190, 50],
		[255, 235, 150],
		[255, 252, 230],
	],
	crimson: [
		[15, 0, 5],
		[90, 5, 15],
		[190, 20, 40],
		[240, 90, 110],
		[255, 190, 200],
	],
	arcane: [
		[10, 0, 20],
		[70, 10, 120],
		[150, 50, 220],
		[220, 130, 255],
		[250, 225, 255],
	],
	verdant: [
		[0, 20, 10],
		[10, 80, 40],
		[40, 160, 80],
		[130, 230, 150],
		[225, 255, 230],
	],
	tide: [
		[0, 15, 25],
		[5, 70, 110],
		[20, 150, 190],
		[110, 225, 235],
		[225, 252, 255],
	],
	dusk: [
		[20, 0, 25],
		[120, 20, 80],
		[230, 90, 60],
		[255, 170, 70],
		[255, 235, 170],
	],
};

export function buildLut(stops) {
	const lut = new Uint8Array(768);
	for (let i = 0; i < 256; i++) {
		const t = (i / 255) * (stops.length - 1);
		const s = Math.min(stops.length - 1, Math.floor(t));
		const f = t - s;
		const a = stops[s];
		const b = stops[Math.min(stops.length - 1, s + 1)];
		lut[i * 3] = Math.round(a[0] + (b[0] - a[0]) * f);
		lut[i * 3 + 1] = Math.round(a[1] + (b[1] - a[1]) * f);
		lut[i * 3 + 2] = Math.round(a[2] + (b[2] - a[2]) * f);
	}
	return lut;
}

export function recolor(rgba, lut) {
	if (!lut) return;
	for (let i = 0; i < rgba.length; i += 4) {
		if (rgba[i + 3] === 0) continue;
		const l = Math.min(
			255,
			Math.round(0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2]),
		);
		rgba[i] = lut[l * 3];
		rgba[i + 1] = lut[l * 3 + 1];
		rgba[i + 2] = lut[l * 3 + 2];
	}
}

export function alphaThreshold(rgba, t) {
	const cut = Math.round(Math.min(0.98, Math.max(0.02, t)) * 255);
	for (let i = 3; i < rgba.length; i += 4) {
		rgba[i] = rgba[i] < cut ? 0 : 255;
	}
}

function channelVal(c, ch) {
	return (c >> ((2 - ch) * 8)) & 255;
}

export function medianCutPalette(frames, maxColors) {
	const samples = [];
	let total = 0;
	for (const f of frames) {
		for (let i = 3; i < f.length; i += 4) if (f[i] > 0) total++;
	}
	if (total === 0) return new Uint8Array([0, 0, 0]);
	const stride = Math.max(1, Math.floor(total / 60000));
	let idx = 0;
	for (const f of frames) {
		for (let i = 0; i < f.length; i += 4) {
			if (f[i + 3] === 0) continue;
			if (idx % stride === 0)
				samples.push((f[i] << 16) | (f[i + 1] << 8) | f[i + 2]);
			idx++;
		}
	}
	const boxes = [samples];
	const target = Math.max(1, Math.min(256, Math.round(maxColors)));
	while (boxes.length < target) {
		let best = -1;
		let bestRange = 0;
		let bestCh = 0;
		for (let bi = 0; bi < boxes.length; bi++) {
			const box = boxes[bi];
			if (box.length < 2) continue;
			for (let ch = 0; ch < 3; ch++) {
				let lo = 255;
				let hi = 0;
				for (const c of box) {
					const v = channelVal(c, ch);
					if (v < lo) lo = v;
					if (v > hi) hi = v;
				}
				const r = hi - lo;
				if (r > bestRange) {
					bestRange = r;
					best = bi;
					bestCh = ch;
				}
			}
		}
		if (best < 0 || bestRange === 0) break;
		const box = boxes[best];
		box.sort((a, b) => channelVal(a, bestCh) - channelVal(b, bestCh));
		const mid = Math.floor(box.length / 2);
		boxes.splice(best, 1, box.slice(0, mid), box.slice(mid));
	}
	const palette = new Uint8Array(boxes.length * 3);
	for (let i = 0; i < boxes.length; i++) {
		let sr = 0;
		let sg = 0;
		let sb = 0;
		for (const c of boxes[i]) {
			sr += (c >> 16) & 255;
			sg += (c >> 8) & 255;
			sb += c & 255;
		}
		const n = boxes[i].length || 1;
		palette[i * 3] = Math.round(sr / n);
		palette[i * 3 + 1] = Math.round(sg / n);
		palette[i * 3 + 2] = Math.round(sb / n);
	}
	return palette;
}

export function nearestIndex(palette, r, g, b) {
	let best = 0;
	let bestD = Infinity;
	for (let i = 0; i < palette.length; i += 3) {
		const dr = palette[i] - r;
		const dg = palette[i + 1] - g;
		const db = palette[i + 2] - b;
		const d = dr * dr + dg * dg + db * db;
		if (d < bestD) {
			bestD = d;
			best = i / 3;
		}
	}
	return best;
}

const BAYER2 = [0, 2, 3, 1];
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const DITHER_STRENGTH = 48;

export function quantizeFrame(rgba, palette, dither, W) {
	const isBayer2 = dither === "bayer2";
	const on = isBayer2 || dither === "bayer4";
	const mat = isBayer2 ? BAYER2 : BAYER4;
	const msize = isBayer2 ? 2 : 4;
	const mlen = msize * msize;
	for (let y = 0; y * 4 < rgba.length / W; y++) {
		for (let x = 0; x < W; x++) {
			const i = (y * W + x) * 4;
			if (rgba[i + 3] === 0) continue;
			let r = rgba[i];
			let g = rgba[i + 1];
			let b = rgba[i + 2];
			if (on) {
				const th =
					((mat[(y % msize) * msize + (x % msize)] + 0.5) / mlen - 0.5) *
					DITHER_STRENGTH;
				r = r + th < 0 ? 0 : r + th > 255 ? 255 : r + th;
				g = g + th < 0 ? 0 : g + th > 255 ? 255 : g + th;
				b = b + th < 0 ? 0 : b + th > 255 ? 255 : b + th;
			}
			const pi = nearestIndex(palette, r, g, b);
			rgba[i] = palette[pi * 3];
			rgba[i + 1] = palette[pi * 3 + 1];
			rgba[i + 2] = palette[pi * 3 + 2];
		}
	}
}

export function outlineFrame(rgba, W, H, color) {
	const pending = [];
	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const i = (y * W + x) * 4;
			if (rgba[i + 3] !== 0) continue;
			let touch = false;
			for (let dy = -1; dy <= 1 && !touch; dy++) {
				for (let dx = -1; dx <= 1; dx++) {
					if (dx === 0 && dy === 0) continue;
					const nx = x + dx;
					const ny = y + dy;
					if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
					if (rgba[(ny * W + nx) * 4 + 3] !== 0) {
						touch = true;
						break;
					}
				}
			}
			if (touch) pending.push(i);
		}
	}
	for (const i of pending) {
		rgba[i] = color[0];
		rgba[i + 1] = color[1];
		rgba[i + 2] = color[2];
		rgba[i + 3] = 255;
	}
}
