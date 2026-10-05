function lzwEncode(indices, minCodeSize) {
	const clearCode = 1 << minCodeSize;
	const eoiCode = clearCode + 1;
	let codeSize = minCodeSize + 1;
	let next = eoiCode + 1;
	const dict = new Map();
	const out = [];
	let cur = 0;
	let curBits = 0;
	const emit = (code) => {
		cur |= code << curBits;
		curBits += codeSize;
		while (curBits >= 8) {
			out.push(cur & 0xff);
			cur >>>= 8;
			curBits -= 8;
		}
	};
	emit(clearCode);
	let prefix = indices[0];
	for (let i = 1; i < indices.length; i++) {
		const k = indices[i];
		const key = prefix * 4096 + k;
		const hit = dict.get(key);
		if (hit !== undefined) {
			prefix = hit;
			continue;
		}
		emit(prefix);
		if (next < 4096) {
			dict.set(key, next);
			next++;
			if (next > 1 << codeSize && codeSize < 12) codeSize++;
		}
		prefix = k;
	}
	emit(prefix);
	emit(eoiCode);
	if (curBits > 0) out.push(cur & 0xff);
	return Uint8Array.from(out);
}

function subBlocks(bytes) {
	const out = [];
	let o = 0;
	while (o < bytes.length) {
		const n = Math.min(255, bytes.length - o);
		out.push(n);
		for (let i = 0; i < n; i++) out.push(bytes[o + i]);
		o += n;
	}
	out.push(0);
	return Uint8Array.from(out);
}

export function encodeGIF(opts) {
	const { width, height, frames, palette, transparentIndex, delayCs, loop } =
		opts;
	const bytes = [];
	const push = (arr) => {
		for (const b of arr) bytes.push(b & 0xff);
	};
	const pushStr = (s) => {
		for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i));
	};
	const pushLE16 = (v) => {
		bytes.push(v & 0xff, (v >> 8) & 0xff);
	};
	pushStr("GIF89a");
	pushLE16(width);
	pushLE16(height);
	let sizeFlag = 0;
	let entries = 2;
	while (entries < palette.length / 3) {
		entries *= 2;
		sizeFlag++;
	}
	if (entries > 256) {
		entries = 256;
		sizeFlag = 7;
	}
	const minBits = Math.max(2, sizeFlag + 1);
	bytes.push(0x80 | (7 << 4) | sizeFlag, 0, 0);
	const gct = new Uint8Array(entries * 3);
	gct.set(palette.subarray(0, Math.min(palette.length, entries * 3)));
	push(gct);
	push([0x21, 0xff, 0x0b]);
	pushStr("NETSCAPE2.0");
	const loopCount = Number.isFinite(loop)
		? Math.max(0, Math.min(65535, Math.round(loop)))
		: 0;
	push([0x03, 0x01, loopCount & 0xff, (loopCount >> 8) & 0xff, 0x00]);
	const hasTrans = transparentIndex !== undefined && transparentIndex !== null;
	for (const frame of frames) {
		push([0x21, 0xf9, 0x04, (2 << 2) | (hasTrans ? 1 : 0)]);
		pushLE16(Math.max(2, Math.round(delayCs)));
		bytes.push(hasTrans ? transparentIndex : 0);
		bytes.push(0);
		push([0x2c]);
		pushLE16(0);
		pushLE16(0);
		pushLE16(width);
		pushLE16(height);
		bytes.push(0);
		bytes.push(minBits);
		push(subBlocks(lzwEncode(frame, minBits)));
	}
	bytes.push(0x3b);
	return Uint8Array.from(bytes);
}

export function parseGIF(bytes) {
	const sig = String.fromCharCode(...bytes.subarray(0, 6));
	if (sig !== "GIF89a" && sig !== "GIF87a")
		return { ok: false, error: "bad signature" };
	const width = bytes[6] | (bytes[7] << 8);
	const height = bytes[8] | (bytes[9] << 8);
	const packed = bytes[10];
	let o = 13;
	if (packed & 0x80) o += 3 * (1 << ((packed & 7) + 1));
	const delays = [];
	const transparents = [];
	let imageCount = 0;
	let loop = null;
	while (o < bytes.length) {
		const b = bytes[o];
		if (b === 0x3b) break;
		if (b === 0x21) {
			const label = bytes[o + 1];
			if (label === 0xf9) {
				const gpacked = bytes[o + 3];
				delays.push(bytes[o + 4] | (bytes[o + 5] << 8));
				transparents.push(gpacked & 1 ? bytes[o + 6] : null);
			}
			if (
				label === 0xff &&
				String.fromCharCode(...bytes.subarray(o + 3, o + 14)) === "NETSCAPE2.0"
			) {
				loop = bytes[o + 16] | (bytes[o + 17] << 8);
			}
			o += 2;
			while (bytes[o] !== 0) o += 1 + bytes[o];
			o += 1;
		} else if (b === 0x2c) {
			imageCount++;
			const ipacked = bytes[o + 9];
			o += 10;
			if (ipacked & 0x80) o += 3 * (1 << ((ipacked & 7) + 1));
			o += 1;
			while (bytes[o] !== 0) o += 1 + bytes[o];
			o += 1;
		} else {
			return { ok: false, error: `unknown block 0x${b.toString(16)}` };
		}
	}
	return {
		ok: true,
		width,
		height,
		imageCount,
		delays,
		transparents,
		loop,
		totalDelay: delays.reduce((a, b2) => a + b2, 0),
	};
}
