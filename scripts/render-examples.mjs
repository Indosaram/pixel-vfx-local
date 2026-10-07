#!/usr/bin/env bun
// Batch-render every example in examples/manifest.json.
//
//   bun scripts/render-examples.mjs            # all ten
//   bun scripts/render-examples.mjs fire       # only the named ids
//   bun scripts/render-examples.mjs --candidate [ids]
//        opt-in quality-v1 profile -> examples/out-quality-v1/ (separate
//        candidate outputs; legacy examples/out/ is never touched)
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
const argv = process.argv.slice(2);
const candidate = argv.includes("--candidate");
const only = argv.filter((a) => a !== "--candidate");
const knownIds = manifest.examples.map((e) => e.id);
const unknownIds = only.filter((id) => !knownIds.includes(id));
if (unknownIds.length > 0) {
	console.error(`unknown example id(s): ${unknownIds.join(", ")}`);
	console.error(`valid ids: ${knownIds.join(", ")}`);
	process.exit(2);
}
const outDir = join(repoRoot, "examples", candidate ? "out-quality-v1" : "out");
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
	if (candidate) args.push("--profile", "quality-v1");
	const r = Bun.spawnSync([process.execPath, ...args], {
		cwd: repoRoot,
		stdout: "pipe",
		stderr: "pipe",
	});
	const code = r.exitCode ?? -1;
	const text = `${new TextDecoder().decode(r.stdout)}${new TextDecoder().decode(r.stderr)}`.trim();
	const lines = text.split("\n");
	const last = lines.slice(-1)[0] ?? "";
	// R4: retain EVERY child warning in the row/log, not only the last line.
	const warnings = lines.filter((l) => l.startsWith("WARN quality-v1:"));
	if (code !== 0) failed++;
	const dir = candidate ? "examples/out-quality-v1" : "examples/out";
	rows.push({
		id: ex.id,
		kind: ex.kind,
		motion: ex.motion,
		exit: code,
		sheet: `${dir}/${ex.id}_sheet.png`,
		gif: `${dir}/${ex.id}_preview.gif`,
		renderJson: `${dir}/${ex.id}_render.json`,
		...(candidate ? { warnings } : {}),
		note: code === 0 ? last : lines.slice(-4).join(" | "),
	});
	for (const wl of warnings) console.log(`  WARN ${ex.id}: ${wl}`);
	console.log(`${code === 0 ? "OK  " : "FAIL"} ${ex.id.padEnd(12)} exit=${code} ${code === 0 ? last : `(${rows.at(-1).note})`}`);
}

// R4: assert selected-directory identity for candidate artifacts.
if (candidate) {
	const bad = rows.filter(
		(r) =>
			r.exit === 0 &&
			(!r.sheet.includes("out-quality-v1") ||
				!r.gif.includes("out-quality-v1") ||
				!r.renderJson.includes("out-quality-v1")),
	);
	if (bad.length > 0) {
		console.error(`candidate path assertion failed: ${bad.map((b) => b.id).join(", ")}`);
		failed += bad.length;
	}
}

const cat = (w) =>
	w.includes("renderMode")
		? "renderMode"
			: w.includes("rotationOverLifetime")
				? "rotationOverLifetime"
					: w.includes("sizeOverLifetime")
						? "sizeOverLifetime"
							: "other";
const warningAgg = {};
for (const row of rows) {
	for (const w of row.warnings ?? []) {
		const c = cat(w);
		warningAgg[c] ??= { occurrences: 0, outputs: [], motions: [] };
		warningAgg[c].occurrences++;
		if (!warningAgg[c].outputs.includes(row.id)) warningAgg[c].outputs.push(row.id);
		if (row.motion && !warningAgg[c].motions.includes(row.motion))
			warningAgg[c].motions.push(row.motion);
	}
}

const summary = {
	generatedBy: candidate
		? "scripts/render-examples.mjs --candidate (profile quality-v1)"
		: "scripts/render-examples.mjs",
	renderer: "scripts/render-unity-asset.mjs (converted renderer; approximate, not Unity)",
	...(candidate ? { profile: "quality-v1", qualityV1Warnings: warningAgg } : {}),
	entries: rows,
	failures: failed,
};
writeFileSync(join(outDir, "render-summary.json"), JSON.stringify(summary, null, "\t") + "\n");
console.log(`\n${rows.length - failed}/${rows.length} examples rendered -> ${outDir.replace(/\\/g, "/")}/ (summary: ${outDir.replace(/\\/g, "/")}/render-summary.json)`);
process.exit(failed === 0 && rows.length > 0 ? 0 : 1);
