// Final candidate gate: block-aware decode of each fresh GIF against the
// cumulative rounded delay schedule and the reported timing/units contract.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseGif } from "./gif-blocks.mjs";

const dir = process.argv[2];
const fails = [];
const rows = [];
const ids = readdirSync(dir)
	.filter((f) => f.endsWith("_preview.gif"))
	.map((f) => f.slice(0, -"_preview.gif".length))
	.sort();
if (ids.length !== 10) fails.push(`expected 10 gif candidates, found ${ids.length}`);
for (const id of ids) {
	const rep = JSON.parse(readFileSync(join(dir, `${id}_render.json`), "utf8"));
	const c = rep.conversion;
	const g = parseGif(readFileSync(join(dir, `${id}_preview.gif`)), `${id}.gif`);
	const fps = Number(c.fps);
	const n = Number(c.frames);
	const expected = Array.from({ length: n }, (_, i) => Math.round(((i + 1) * 100) / fps) - Math.round((i * 100) / fps));
	const speedMatch = String(c.durationUnits).match(/simulationSpeed\s+([0-9.]+)/);
	const speed = speedMatch ? Number(speedMatch[1]) : NaN;
	const checks = {
		frames: g.images === n,
		delays: JSON.stringify(g.delays) === JSON.stringify(expected),
		positive: g.delays.every((d) => d >= 1),
		loopExt: g.loop === 0,
		trailer: g.trailer === true && g.version === "89a",
		loopMs: g.delays.reduce((a, b) => a + b, 0) * 10 === Number(c.loopMs),
		sourcePeriod: Number(c.sourcePeriodSimulationSec) === 5,
		wallSpan: Math.abs(Number(c.sourcePeriodWallSec) - 5 / speed) < 1e-9,
		manufactured: Number(c.manufacturedWallRepeatSec) === 5,
		units: /simulation time/.test(String(c.durationUnits)) && /wall/.test(String(c.durationUnits)),
	};
	for (const [k, ok] of Object.entries(checks)) if (!ok) fails.push(`${id}: ${k} failed (images=${g.images} n=${n} sum=${g.delays.reduce((a, b) => a + b, 0)} loopMs=${c.loopMs})`);
	rows.push({ id, fps, frames: n, images: g.images, delaySum: g.delays.reduce((a, b) => a + b, 0), uniqueDelays: [...new Set(g.delays)].sort(), ok: Object.values(checks).every(Boolean) });
}
console.log(JSON.stringify({ rows, fails }, null, 1));
process.exit(fails.length ? 1 : 0);
