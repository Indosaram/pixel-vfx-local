export function hashSeed(seed) {
	const s = String(seed);
	let h = 0x811c9dc5;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return h >>> 0;
}

export function mulberry32(a) {
	let state = a >>> 0;
	return function next() {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function makeRng(seed) {
	const next = mulberry32(hashSeed(seed));
	return {
		next,
		range(min, max) {
			return min + (max - min) * next();
		},
		int(min, max) {
			return Math.floor(min + (max - min + 1) * next());
		},
		pick(arr) {
			return arr[Math.min(arr.length - 1, Math.floor(next() * arr.length))];
		},
		chance(p) {
			return next() < p;
		},
	};
}
