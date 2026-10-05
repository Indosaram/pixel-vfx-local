let CRC_TABLE = null;

function crcTable() {
	if (CRC_TABLE) return CRC_TABLE;
	CRC_TABLE = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		CRC_TABLE[n] = c >>> 0;
	}
	return CRC_TABLE;
}

function crc32(bytes) {
	const t = crcTable();
	let c = 0xffffffff;
	for (let i = 0; i < bytes.length; i++)
		c = t[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
}

function adler32(bytes) {
	let a = 1;
	let b = 0;
	for (let i = 0; i < bytes.length; i++) {
		a = (a + bytes[i]) % 65521;
		b = (b + a) % 65521;
	}
	return ((b << 16) | a) >>> 0;
}

function u32be(v) {
	return [(v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff];
}

function chunk(type, data) {
	const typeBytes = [];
	for (let i = 0; i < 4; i++) typeBytes.push(type.charCodeAt(i));
	const len = data.length;
	const body = typeBytes.concat(Array.from(data));
	const crcIn = new Uint8Array(body.length);
	crcIn.set(body);
	return Uint8Array.from([...u32be(len), ...body, ...u32be(crc32(crcIn))]);
}

export function zlibStored(raw) {
	const out = [0x78, 0x01];
	let off = 0;
	const MAX = 65535;
	while (off < raw.length || off === 0) {
		const end = Math.min(off + MAX, raw.length);
		const len = end - off;
		const final = end >= raw.length ? 1 : 0;
		out.push(
			final,
			len & 0xff,
			(len >>> 8) & 0xff,
			~len & 0xff,
			(~len >>> 8) & 0xff,
		);
		for (let i = off; i < end; i++) out.push(raw[i]);
		off = end;
		if (raw.length === 0) break;
	}
	const ad = adler32(raw);
	out.push(
		(ad >>> 24) & 0xff,
		(ad >>> 16) & 0xff,
		(ad >>> 8) & 0xff,
		ad & 0xff,
	);
	return Uint8Array.from(out);
}

export function encodePNG(rgba, W, H) {
	const raw = new Uint8Array(H * (W * 4 + 1));
	for (let y = 0; y < H; y++) {
		const ro = y * (W * 4 + 1);
		raw[ro] = 0;
		for (let i = 0; i < W * 4; i++) raw[ro + 1 + i] = rgba[y * W * 4 + i];
	}
	const ihdr = Uint8Array.from([
		(W >>> 24) & 0xff,
		(W >>> 16) & 0xff,
		(W >>> 8) & 0xff,
		W & 0xff,
		(H >>> 24) & 0xff,
		(H >>> 16) & 0xff,
		(H >>> 8) & 0xff,
		H & 0xff,
		8,
		6,
		0,
		0,
		0,
	]);
	const parts = [
		Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		chunk("IHDR", ihdr),
		chunk("IDAT", zlibStored(raw)),
		chunk("IEND", new Uint8Array(0)),
	];
	let total = 0;
	for (const p of parts) total += p.length;
	const out = new Uint8Array(total);
	let o = 0;
	for (const p of parts) {
		out.set(p, o);
		o += p.length;
	}
	return out;
}

export function parsePNG(bytes) {
	const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
	for (let i = 0; i < 8; i++)
		if (bytes[i] !== sig[i]) return { ok: false, error: "bad signature" };
	let o = 8;
	const chunks = [];
	let w = 0;
	let h = 0;
	const idat = [];
	while (o + 8 <= bytes.length) {
		const len =
			(bytes[o] << 24) |
			(bytes[o + 1] << 16) |
			(bytes[o + 2] << 8) |
			bytes[o + 3];
		const type = String.fromCharCode(
			bytes[o + 4],
			bytes[o + 5],
			bytes[o + 6],
			bytes[o + 7],
		);
		const dataStart = o + 8;
		const data = bytes.subarray(dataStart, dataStart + len);
		const crcCalc = bytes.subarray(o + 4, dataStart + len);
		if (
			crc32(crcCalc) !==
			((bytes[dataStart + len] << 24) |
				(bytes[dataStart + len + 1] << 16) |
				(bytes[dataStart + len + 2] << 8) |
				bytes[dataStart + len + 3]) >>>
				0
		) {
			return { ok: false, error: `crc mismatch in ${type}` };
		}
		chunks.push(type);
		if (type === "IHDR") {
			w = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
			h = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];
		}
		if (type === "IDAT") idat.push(data);
		o = dataStart + len + 4;
		if (type === "IEND") break;
	}
	let rawLen = 0;
	for (const d of idat) rawLen += d.length;
	const z = new Uint8Array(rawLen);
	let zo = 0;
	for (const d of idat) {
		z.set(d, zo);
		zo += d.length;
	}
	return { ok: true, width: w, height: h, chunks, zlib: z };
}

export function decodePNG(bytes) {
	const p = parsePNG(bytes);
	if (!p.ok) throw new Error(p.error);
	const z = p.zlib;
	if (z[0] !== 0x78 || ((z[0] << 8) | z[1]) % 31 !== 0)
		throw new Error("bad zlib header");
	let o = 2;
	const out = [];
	for (;;) {
		const b = z[o];
		const final = b & 1;
		const type = (b >> 1) & 3;
		if (type !== 0) throw new Error(`unsupported deflate block type ${type}`);
		const len = z[o + 1] | (z[o + 2] << 8);
		const nlen = z[o + 3] | (z[o + 4] << 8);
		if (((len ^ nlen) & 0xffff) !== 0xffff)
			throw new Error("bad block lengths");
		o += 5;
		for (let i = 0; i < len; i++) out.push(z[o + i]);
		o += len;
		if (final) break;
	}
	const raw = Uint8Array.from(out);
	const stride = p.width * 4 + 1;
	if (raw.length !== p.height * stride) throw new Error("raw length mismatch");
	const rgba = new Uint8ClampedArray(p.width * p.height * 4);
	for (let y = 0; y < p.height; y++) {
		const f = raw[y * stride];
		if (f !== 0) throw new Error(`unsupported filter ${f}`);
		for (let i = 0; i < p.width * 4; i++)
			rgba[y * p.width * 4 + i] = raw[y * stride + 1 + i];
	}
	return { width: p.width, height: p.height, rgba };
}
