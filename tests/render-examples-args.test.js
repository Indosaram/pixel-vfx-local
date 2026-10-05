import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dir, "..");
const runner = resolve(import.meta.dir, "..", "scripts", "render-examples.mjs");

function run(args) {
	return Bun.spawnSync([process.execPath, runner, ...args], {
		cwd: repoRoot,
		stdout: "pipe",
		stderr: "pipe",
	});
}

describe("render-examples CLI id validation", () => {
	test("rejects an unknown id before rendering anything", () => {
		const r = run(["definitely-not-an-id"]);
		expect(r.exitCode).not.toBe(0);
		const output = new TextDecoder().decode(r.stdout) + new TextDecoder().decode(r.stderr);
		expect(output).toContain("definitely-not-an-id");
		expect(output).toContain("valid ids:");
		expect(output).not.toContain("OK   ");
	});

	test("rejects a mixed valid/invalid request as a whole", () => {
		const r = run(["fire", "definitely-not-an-id"]);
		expect(r.exitCode).not.toBe(0);
		const output = new TextDecoder().decode(r.stdout) + new TextDecoder().decode(r.stderr);
		expect(output).toContain("unknown example id(s): definitely-not-an-id");
		expect(output).not.toContain("OK   fire");
	});
});
