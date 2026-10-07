import { describe, expect, test } from "bun:test";
import { gifDelaySchedule } from "../scripts/render-unity-asset.mjs";
import { encodeGIF, parseGIF } from "../src/gifenc.js";

// Tiny 2x2 indexed-color GIF for schedule-to-encoder boundary checks: one
// frame per requested delay so imageCount tracks the schedule length.
const miniPalette = new Uint8Array([0, 0, 0, 255, 0, 0]);
const encodeWith = (delays) =>
	parseGIF(encodeGIF({ width: 2, height: 2, frames: delays.map(() => new Uint8Array([0, 1, 1, 0])), palette: miniPalette, delayCsList: delays, loop: 0 }));

// Delays are differences of rounded cumulative centisecond boundaries:
// delays[i] = round((i+1)*100/fps) - round(i*100/fps), so the encoded total
// is exactly round(frameCount*100/fps) at any representable fps.
describe("candidate GIF delay schedule", () => {
	test("25 frames at 12fps: positive 8/9cs delays, total 208", () => {
		const d = gifDelaySchedule(12, 25);
		expect(d.length).toBe(25);
		expect(d.every((x) => x >= 1)).toBe(true);
		expect(d[0]).toBe(8);
		expect(d[1]).toBe(9);
		expect(d.reduce((a, b) => a + b, 0)).toBe(208);
	});

	test("2 frames at 12fps: total 17", () => {
		const d = gifDelaySchedule(12, 2);
		expect(d).toEqual([8, 9]);
		expect(d.reduce((a, b) => a + b, 0)).toBe(17);
	});

	test("25 frames at 25fps: uniform 4cs delays", () => {
		const d = gifDelaySchedule(25, 25);
		expect(d.every((x) => x === 4)).toBe(true);
		expect(d.reduce((a, b) => a + b, 0)).toBe(100);
	});

	test("fps without representable positive delays is rejected", () => {
		expect(() => gifDelaySchedule(1000, 5)).toThrow();
	});

	// Encoder boundary (src/gifenc.js floor is Math.max(2, round(dc))): a
	// positive-but-sub-2cs schedule is accepted by the arithmetic yet rewritten
	// by the encoder, so the schedule must reject it instead of reporting
	// loopMs the encoder would not emit.
	test("100fps cumulative schedule (1/1/1cs) is rejected at the 2cs encoder floor", () => {
		expect(() => gifDelaySchedule(100, 3)).toThrow(/encoder 2cs floor/);
	});

	test("60fps cumulative schedule contains a 1cs entry and is rejected", () => {
		// boundaries round(k*100/60): 0,2,3,5 -> delays [2,1,2]
		expect(() => gifDelaySchedule(60, 3)).toThrow(/encoder 2cs floor/);
	});

	test("encoder floor rewrites 1cs list entries to 2cs (rejection rationale)", () => {
		expect(encodeWith([1, 1, 1]).delays).toEqual([2, 2, 2]);
	});

	test("12fps accepted schedule IS the actual encoded schedule", () => {
		const d = gifDelaySchedule(12, 25);
		const parsed = encodeWith(d);
		expect(parsed.ok).toBe(true);
		expect(parsed.imageCount).toBe(25);
		expect(parsed.delays).toEqual(d); // encoder max(2,..) is identity here
		expect(parsed.totalDelay).toBe(208);
		expect(parsed.loop).toBe(0);
	});
});
