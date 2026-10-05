export function defaultHolds(frameCount) {
	const holds = [];
	for (let i = 0; i < frameCount; i++) holds.push(1);
	return holds;
}

export function clampRange(from, to, frameCount) {
	const max = Math.max(0, frameCount - 1);
	let a = Number.isFinite(Number(from)) ? Math.round(Number(from)) : 0;
	let b = Number.isFinite(Number(to)) ? Math.round(Number(to)) : max;
	a = Math.min(Math.max(a, 0), max);
	b = Math.min(Math.max(b, 0), max);
	if (a > b) {
		const t = a;
		a = b;
		b = t;
	}
	return { from: a, to: b };
}

export function expandFrames(holds, from, to) {
	const out = [];
	for (let i = from; i <= to; i++) {
		const raw = holds && holds[i] !== undefined ? holds[i] : 1;
		const h = Number.isFinite(Number(raw))
			? Math.min(8, Math.max(0, Math.round(Number(raw))))
			: 1;
		for (let k = 0; k < h; k++) out.push(i);
	}
	return out;
}

export function totalTime(outputFrameCount, fps) {
	const f = Number(fps) > 0 ? Number(fps) : 1;
	return outputFrameCount / f;
}

export function suggestHolds(frameCount) {
	const holds = [];
	for (let i = 0; i < frameCount; i++) holds.push(i % 2 === 0 ? 2 : 1);
	return holds;
}

export function markers(frameCount, stride = 4) {
	const s = Math.max(1, Math.round(stride));
	const out = [];
	for (let i = 0; i < frameCount; i += s) out.push(i);
	return out;
}
