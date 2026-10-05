export function sheetLayout(count, cellW, cellH) {
	const n = Math.max(1, Math.round(count));
	const w = Math.max(1, Math.round(cellW));
	const h = Math.max(1, Math.round(cellH));
	const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
	const rows = Math.ceil(n / cols);
	return {
		cols,
		rows,
		width: cols * w,
		height: rows * h,
		cellW: w,
		cellH: h,
		count: n,
	};
}

export function buildSheet(frames, cellW, cellH) {
	const layout = sheetLayout(frames.length, cellW, cellH);
	const out = new Uint8ClampedArray(layout.width * layout.height * 4);
	for (let i = 0; i < frames.length; i++) {
		const col = i % layout.cols;
		const row = Math.floor(i / layout.cols);
		const dstX = col * layout.cellW;
		const dstY = row * layout.cellH;
		const src = frames[i];
		for (let y = 0; y < layout.cellH; y++) {
			const srcOff = y * layout.cellW * 4;
			const dstOff = ((dstY + y) * layout.width + dstX) * 4;
			out.set(src.subarray(srcOff, srcOff + layout.cellW * 4), dstOff);
		}
	}
	return { rgba: out, width: layout.width, height: layout.height, layout };
}
