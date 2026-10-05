import { expect, test } from "bun:test";
import {
	clampRange,
	defaultHolds,
	expandFrames,
	markers,
	suggestHolds,
	totalTime,
} from "../src/timing.js";

test("defaultHolds gives all ones", () => {
	expect(defaultHolds(5)).toEqual([1, 1, 1, 1, 1]);
});

test("clampRange repairs reversed range", () => {
	expect(clampRange(10, 2, 20)).toEqual({ from: 2, to: 10 });
});

test("clampRange repairs NaN and out-of-bounds", () => {
	expect(clampRange(NaN, NaN, 8)).toEqual({ from: 0, to: 7 });
	expect(clampRange(-5, 999, 8)).toEqual({ from: 0, to: 7 });
	expect(clampRange("abc", "3", 8)).toEqual({ from: 0, to: 3 });
});

test("clampRange handles zero frames", () => {
	expect(clampRange(0, 0, 0)).toEqual({ from: 0, to: 0 });
});

test("expandFrames repeats by hold and drops zeros", () => {
	expect(expandFrames([2, 0, 3], 0, 2)).toEqual([0, 0, 2, 2, 2]);
	expect(expandFrames([1], 0, 0)).toEqual([0]);
});

test("expandFrames clamps weird hold values", () => {
	expect(expandFrames([NaN, -3], 0, 1)).toEqual([0]);
	expect(expandFrames([99], 0, 0)).toEqual(Array.from({ length: 8 }, () => 0));
});

test("totalTime guards fps", () => {
	expect(totalTime(24, 12)).toBe(2);
	expect(totalTime(24, 0)).toBe(24);
	expect(totalTime(24, NaN)).toBe(24);
});

test("suggestHolds alternates 2/1", () => {
	expect(suggestHolds(6)).toEqual([2, 1, 2, 1, 2, 1]);
});

test("markers respects stride and clamps below 1", () => {
	expect(markers(10, 4)).toEqual([0, 4, 8]);
	expect(markers(5, 0)).toEqual([0, 1, 2, 3, 4]);
});
