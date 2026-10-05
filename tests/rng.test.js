import { expect, test } from "bun:test";
import { hashSeed, makeRng, mulberry32 } from "../src/rng.js";

test("hashSeed is stable for same string", () => {
	expect(hashSeed("42")).toBe(hashSeed("42"));
	expect(hashSeed("42")).not.toBe(hashSeed("43"));
});

test("mulberry32 sequence is reproducible", () => {
	const a = mulberry32(12345);
	const b = mulberry32(12345);
	const seqA = Array.from({ length: 100 }, () => a());
	const seqB = Array.from({ length: 100 }, () => b());
	expect(seqA).toEqual(seqB);
	for (const v of seqA) {
		expect(v).toBeGreaterThanOrEqual(0);
		expect(v).toBeLessThan(1);
	}
});

test("different seeds give different streams", () => {
	const a = makeRng("alpha");
	const b = makeRng("beta");
	const sa = Array.from({ length: 20 }, () => a.next());
	const sb = Array.from({ length: 20 }, () => b.next());
	expect(sa).not.toEqual(sb);
});

test("rng helpers stay in bounds", () => {
	const r = makeRng("bounds");
	for (let i = 0; i < 500; i++) {
		const v = r.range(-5, 5);
		expect(v).toBeGreaterThanOrEqual(-5);
		expect(v).toBeLessThan(5);
		const n = r.int(2, 9);
		expect(n).toBeGreaterThanOrEqual(2);
		expect(n).toBeLessThanOrEqual(9);
	}
});
