import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { goldenHashes } from "../src/pipeline.js";

test("golden: pipeline output matches recorded hashes exactly", () => {
	const raw = readFileSync(new URL("./golden.json", import.meta.url), "utf8");
	const golden = JSON.parse(raw);
	const actual = goldenHashes();
	expect(actual.frameCount).toBe(golden.frameCount);
	expect(actual.frame0).toBe(golden.frame0);
	expect(actual.allFrames).toBe(golden.allFrames);
	expect(actual.sheet).toBe(golden.sheet);
	expect(actual.gif).toBe(golden.gif);
});
