const PI = Math.PI;
const TAU = PI * 2;
const HALF_PI = PI / 2;

function reduce(x) {
	return x - Math.floor((x + PI) / TAU) * TAU;
}

export function fsin(x) {
	let t = reduce(x);
	const neg = t < 0;
	if (neg) t = -t;
	if (t > HALF_PI) t = PI - t;
	const x2 = t * t;
	return (
		(neg ? -1 : 1) *
		t *
		(1 - (x2 / 6) * (1 - (x2 / 20) * (1 - (x2 / 42) * (1 - x2 / 72))))
	);
}

export function fcos(x) {
	return fsin(x + HALF_PI);
}

export function tri(x) {
	const t = x - Math.floor(x);
	return 1 - Math.abs(2 * t - 1);
}

export function clamp(v, lo, hi) {
	return v < lo ? lo : v > hi ? hi : v;
}

export function clamp01(v) {
	return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function lerp(a, b, u) {
	return a + (b - a) * u;
}
