// Block-aware GIF structure verifier: walks header/LSD/GCT, extension blocks
// (GCE delays, NETSCAPE loop), image descriptors with LZW sub-blocks, and
// trailer. Never searches raw bytes for signatures.
import { readFileSync } from "node:fs";

export function parseGif(buf, name) {
	let p = 0;
	const need = (n) => {
		if (p + n > buf.length) throw new Error(`${name}: truncated at ${p}`);
	};
	need(6);
	const sig = buf.toString("ascii", 0, 3);
	const version = buf.toString("ascii", 3, 6);
	if (sig !== "GIF") throw new Error(`${name}: not a GIF header`);
	p = 6;
	need(7);
	const width = buf.readUInt16LE(p);
	const height = buf.readUInt16LE(p + 2);
	const packed = buf[p + 4];
	p += 7;
	const gctFlag = packed & 0x80;
	if (gctFlag) p += 3 * (1 << ((packed & 7) + 1));
	const delays = [];
	let images = 0;
	let loop = null;
	let trailer = false;
	let pendingDelay = null;
	for (;;) {
		need(1);
		const b = buf[p];
		if (b === 0x3b) {
			p += 1;
			trailer = true;
			break;
		}
		if (b === 0x21) {
			need(2);
			const label = buf[p + 1];
			p += 2;
			if (label === 0xf9) {
				const size = buf[p];
				if (size !== 4) throw new Error(`${name}: GCE size ${size} != 4`);
				pendingDelay = buf.readUInt16LE(p + 2);
				p += 1 + size;
				const term = buf[p];
				if (term !== 0) throw new Error(`${name}: GCE missing block terminator`);
				p += 1;
			} else if (label === 0xff) {
				const size = buf[p];
				const app = buf.toString("ascii", p + 1, p + 1 + size);
				p += 1 + size;
				// application data is a sub-block chain
				let sub = buf[p];
				let payload = Buffer.alloc(0);
				while (sub !== 0) {
					payload = Buffer.concat([payload, buf.subarray(p + 1, p + 1 + sub)]);
					p += 1 + sub;
					sub = buf[p];
				}
				p += 1;
				if (app === "NETSCAPE2.0" && payload.length >= 3 && payload[0] === 1) {
					loop = payload.readUInt16LE(1);
				}
			} else {
				let sub = buf[p];
				while (sub !== 0) {
					p += 1 + sub;
					sub = buf[p];
				}
				p += 1;
			}
			continue;
		}
		if (b === 0x2c) {
			need(10);
			p += 10; // descriptor (left/top/width/height/packed)
			p += 1; // LZW minimum code size
			let sub = buf[p];
			while (sub !== 0) {
				p += 1 + sub;
				sub = buf[p];
			}
			p += 1;
			images += 1;
			if (pendingDelay === null) throw new Error(`${name}: image ${images} has no GCE`);
			delays.push(pendingDelay);
			pendingDelay = null;
			continue;
		}
		throw new Error(`${name}: unexpected block introducer 0x${b.toString(16)} at ${p}`);
	}
	if (p !== buf.length) throw new Error(`${name}: ${buf.length - p} trailing bytes after trailer`);
	return { name, version, width, height, images, delays, loop, trailer };
}

if (import.meta.main) {
	const out = [];
	for (const f of process.argv.slice(2)) out.push(parseGif(readFileSync(f), f.replace(/\\/g, "/").split("/").pop()));
	console.log(JSON.stringify(out, null, 1));
}
