#!/usr/bin/env bun
// Batch-render every example in examples/manifest.json.
//
//   bun scripts/render-examples.mjs            # all ten
//   bun scripts/render-examples.mjs fire       # only the named ids
//
// Prerequisite: python scripts/import-examples.py --extract-dir <dir>
// (produces examples/<id>.json + examples/textures/<id>.png).
// Writes examples/out/<id>_sheet.png, <id>_preview.gif, <id>_render.json
// plus examples/out/render-summary.json with per-example exit codes.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const repoRoot = resolve(import.meta.dir, "..");
const manifestPath = join(repoRoot, "examples", "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const defaults = manifest.defaults ?? {
	width: 128,
	height: 128,
	frames: 25,
	fps: 12,
	palette: 16,
	dither: "bayer4",
	alphaThreshold: 0.28,
};
const only = process.argv.slice(2);
const knownIds = manifest.examples.map((e) => e.id);
const unknownIds = only.filter((id) => !knownIds.includes(id));
if (unknownIds.length > 0) {
	console.error(`unknown example id(s): ${unknownIds.join(", ")}`);
	console.error(`valid ids: ${knownIds.join(", ")}`);
	process.exit(2);
}
const outDir = join(repoRoot, "examples", "out");
mkdirSync(outDir, { recursive: true });

const renderer = join(import.meta.dir, "render-unity-asset.mjs");
const rows = [];
let failed = 0;

for (const ex of manifest.examples) {
	if (only.length > 0 && !only.includes(ex.id)) continue;
	const cfg = join(repoRoot, "examples", `${ex.id}.json`);
	const tex = join(repoRoot, "examples", "textures", `${ex.id}.png`);
	if (!existsSync(cfg) || !existsSync(tex)) {
		rows.push({
			id: ex.id,
			exit: 97,
			note: "missing config or texture - run: python scripts/import-examples.py --extract-dir <extract dir>",
		});
		failed++;
		continue;
	}
	const d = { ...defaults, ...(ex.render ?? {}) };
	const v = ex.view ?? { scale: 10, originX: 64, originY: 120 };
	const args = [
		renderer,
		"--extract", cfg,
		"--texture", tex,
		"--out-dir", outDir,
		"--name", ex.id,
		"--width", String(d.width),
		"--height", String(d.height),
		"--frames", String(d.frames),
		"--fps", String(d.fps),
		"--palette", String(d.palette),
		"--dither", d.dither,
		"--alpha-threshold", String(d.alphaThreshold),
		"--scale", String(v.scale),
		"--origin-x", String(v.originX),
		"--origin-y", String(v.originY),
	];
	if (v.startSize) args.push("--start-size", JSON.stringify(v.startSize));
	const r = Bun.spawnSync([process.execPath, ...args], {
		cwd: repoRoot,
		stdout: "pipe",
		stderr: "pipe",
	});
	const code = r.exitCode ?? -1;
	const text = `${new TextDecoder().decode(r.stdout)}${new TextDecoder().decode(r.stderr)}`.trim();
	const last = text.split("\n").slice(-1)[0] ?? "";
	if (code !== 0) failed++;
	rows.push({
		id: ex.id,
		kind: ex.kind,
		motion: ex.motion,
		exit: code,
		sheet: `examples/out/${ex.id}_sheet.png`,
		gif: `examples/out/${ex.id}_preview.gif`,
		renderJson: `examples/out/${ex.id}_render.json`,
		note: code === 0 ? last : text.split("\n").slice(-4).join(" | "),
	});
	console.log(`${code === 0 ? "OK  " : "FAIL"} ${ex.id.padEnd(12)} exit=${code} ${code === 0 ? last : `(${rows.at(-1).note})`}`);
}

const summary = {
	generatedBy: "scripts/render-examples.mjs",
	renderer: "scripts/render-unity-asset.mjs (converted renderer; approximate, not Unity)",
	entries: rows,
	failures: failed,
};
writeFileSync(join(outDir, "render-summary.json"), JSON.stringify(summary, null, "\t") + "\n");
console.log(`\n${rows.length - failed}/${rows.length} examples rendered -> examples/out/ (summary: examples/out/render-summary.json)`);
process.exit(failed === 0 && rows.length > 0 ? 0 : 1);
