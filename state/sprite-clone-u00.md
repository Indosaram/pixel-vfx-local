# U00 contract/spec gate receipt

Scope: accepted `state/sprite-clone-plan.md`, U00 only. Plan read in full. No pipeline modules, U01+ code, reference assets, original source copies, Astra, reference launch or Mac pipeline rendering/encoding.

## Runtime selection

JavaScript ES modules/JSDoc + Electron 44.6.0 + three.js 0.170.0; Bun 1.4.0 is the test/package runner. `clone/package.json` pins direct versions; `clone/bun.lock` locks transitive packages and registry integrity hashes. Electron was the registry latest response, not an inferred reference version. Installed Electron/Chromium/Node runtime capability remains NOT RUN. Version selection is frozen, capability certification is blocked.

The latest request narrows execution to spec artifacts and a fixture skeleton. Accordingly, no `qa/run.mjs`, Electron test window or rendering/encoding capability harness was implemented. The accepted plan's capability gate remains outstanding and explicitly blocks claiming full U00 runtime readiness or starting downstream work automatically.

## Created files

- `clone/.gitignore`: excludes future installed modules and evidence.
- `clone/package.json`: exact direct dependency/runtime selection, no no-op scripts.
- `clone/bun.lock`: resolved dependency lock; no install scripts executed.
- `clone/spec/runtime-lock.json`: exact versions, provenance and unrun capability gate.
- `clone/spec/contracts.md`: frozen shared data/error contracts.
- `clone/spec/stages.json`: module interfaces, source/report anchors and exact future acceptance commands.
- `clone/spec/oracles.json`: frozen report-backed constants/rules and labeled derived examples.
- `clone/spec/fixtures.json`: representative/held-out skeleton; no fabricated hashes.
- `clone/spec/spec-gaps.md`: UNVERIFIED risks and missing specifications with closure requirements.
- `state/sprite-clone-u00.md`: this receipt.

Only these paths belong in the U00 commit. Existing README changes, state files, evidence and scripts are unrelated and must remain untouched/uncommitted.

## Commands and observations

Working directory: `/Users/indo/code/project/pixel-vfx-local`, except lock resolution explicitly changes into `clone/`.

| Exact command | Exit | Result |
|---|---:|---|
| `git status --short` | 0 | Existing modified README and numerous untracked scripts/examples/state; clone absent |
| `git diff --cached --stat` | 0 | Empty index |
| `git branch --show-current` | 0 | main |
| `git log -10 --oneline` | 0 | English imperative subjects, e.g. `Document 21-preset export fps contract and tool-only verification scope` |
| `git log -5 --oneline -- clone state` | 0 | No prior path history |
| `bun --version` | 0 | 1.4.0 |
| `cd /Users/indo/code/project/pixel-vfx-local/clone && BUN_INSTALL_CACHE_DIR="$PWD/.bun-cache" bun install --lockfile-only --ignore-scripts` | 0 | Saved bun.lock; resolver reported 15 packages |
| `rm -rf clone/.bun-cache` | 0 | Removed this task's generated metadata cache only |
| `git diff --check` | 0 | No whitespace errors |
| `git add -- clone/.gitignore clone/package.json clone/bun.lock clone/spec/runtime-lock.json clone/spec/contracts.md clone/spec/stages.json clone/spec/oracles.json clone/spec/fixtures.json clone/spec/spec-gaps.md state/sprite-clone-u00.md` | 0 | Only U00 paths staged |
| `git diff --cached --check` | 0 | Staged whitespace check passed |
| `git diff --cached --stat` | 0 | Ten U00 files only |
| `git diff --cached --name-only` | 0 | Exact ten-file inventory above, unrelated work excluded |

Read-only JS `fetch` requests to `https://registry.npmjs.org/electron/latest`, `https://registry.npmjs.org/three/0.170.0`, `https://registry.npmjs.org/bun/1.4.0` each returned HTTP 200. They have HTTP statuses, not process exit codes. File inspection/edit tools likewise do not have shell exit codes. No package binaries or lifecycle scripts ran.

## Verification and commit

## Report-backed oracle checklist

These values are directly stated in the accepted report unless marked derived. Anchors below are the source anchors quoted by that report, not a new source inspection. The final `oracles.json` must agree with this checklist.

| Rule/value | Report section and quoted anchor |
|---|---|
| Park-Miller multiplier 16807, modulus 2147483647, zero seed fallback 1 | §4, `app/runtime/sim.js:71-76` |
| Seed 1 first recurrence integer 16807 (derived from the stated recurrence, not normalized RNG output) | §4, `app/runtime/sim.js:71-76` |
| Capacity `min(def.max || 1000,256)`; inputs 3/256/300 give 3/256/256 (derived examples) | §5, `app/runtime/sim.js:93-115` |
| Hermite left key tangent index 3, right key index 2; missing scalar 0 and missing color white | §4, `app/runtime/sim.js:6-66` |
| Minimum life 0.01 | §5, `app/runtime/sim.js:144-167` |
| Prewarm increment 1/60; effect step 1/120, epsilon 1e-9, incoming dt cap 0.25 before tempo | §5, `app/runtime/sim.js:111-115`; `app/runtime/effect.js:5-6,98-132` |
| Displacement-derived velocity only when dt exceeds 1e-6 | §5, `app/runtime/sim.js:202,225` |
| Modes 0/1/4; maximum 1024 trail segment instances | §6, `app/runtime/effect.js:10,38-81,8,67-77,166-197` |
| Capture stepping round(seconds*60) updates of 1/60 | §6, `app/js/capture.js:50` |
| Bounds pass 256 square, alpha threshold 30, aspect ratio threshold 1.7; supersampling k clamped 2-8 | §6, `app/js/capture.js:57-113` |
| Half-color restoration factor 2; gradient luminance percentiles 2/98; brightness percentile 90 | §7, `app/js/pixel.js:136-203` |
| Alpha at or below threshold becomes 0; surviving one-level alpha is opaque; other levels use ceiling quantization | §7, `app/js/pixel.js:183-203` |
| Foreground islands 8-connected; enclosed holes 4-connected; outlines 4 or 8 neighbors | §7, `app/js/pixel.js:99-134,204-229` |
| Holds 0-8; 0 drops; UI range inclusive 1-based | §§7,9, `app/js/timing.js:1-71`; `app/js/app.js:324-345` |
| GIF alpha cutoff 128, maximum 256 colors, cumulative centisecond rounding | §9, `app/js/formats.js:36-91` |
| Pixel sample randomness after first 40000 samples; no complete-output seed determinism claim | §4, `app/js/pixel.js:188-201` |
| Capture cache maximum 12; recapture debounce 350ms; gradient debounce 60ms | §10, `app/js/app.js:136-191,316-318,415-426` |

## Verification status

### Prompt-to-artifact acceptance checklist

| U00 requirement | Artifact | Acceptance evidence required |
|---|---|---|
| Shared data/error contracts frozen | `clone/spec/contracts.md` | Coordinator reads all contracts and checks plan section 3 field names, ordering and boundary errors |
| Stage interfaces and exact commands | `clone/spec/stages.json` | JSON parses; every plan section 4 row has interface, anchor, command and failure observable |
| Exact package/runtime lock | package.json, bun.lock, runtime-lock.json | Version agreement verified below; runtime capabilities explicitly not certified |
| Fixture manifest skeleton | `clone/spec/fixtures.json` | F01/F02/F03/P01/H01/H02 present, unresolved data labeled, no invented asset hashes |
| Only report-backed oracle values | `clone/spec/oracles.json` | Each value traced to the accepted report; mathematical examples distinguished from literal statements |
| All UNVERIFIED risks and missing formulas | `clone/spec/spec-gaps.md` | R01-R14 accounted for with blocking scope and named closure evidence |
| No pipeline or U01+ implementation | U00 path inventory | No src modules, reference assets or runtime launches; only listed U00 paths eligible for commit |
| Atomic commit in existing owner style | Git staged path list and resulting commit | Inspect scoped diff and ensure unrelated README/scripts/state are excluded before committing |

Spec worker `st_01a116c0` completed with actual model `inferhub/cb/deepseek-v4.1-flash`. Coordinator read the contracts, gaps, all 103 oracle rules, fixture skeleton and stage interfaces/commands. JSON validation passed; all 19 unique acceptance commands exactly match the accepted plan, across 16 stages. All six fixture IDs exist with unresolved inputs/hashes honestly marked null; 103 oracle IDs are unique. Values match the report at documented-rule scope, not runtime verification. Corrected stale Electron-pin status, fixture wording and an overbroad assertion that clone tests could close excluded parity claims.

Coordinator JS validation parsed package.json/runtime-lock.json with JSON.parse and bun.lock with Bun.JSON5.parse: PASS. Direct versions agree with both lock entries; 14 named package entries are present (the resolver's printed 15 is not substituted for this count). No package scripts are defined. This was an eval assertion, not a shell process; no exit code is invented. Runtime capability status remains BLOCKED_NOT_RUN.

`git diff --check` exited 0. This first check covers tracked changes only; the staged U00 check follows. One inspection attempt tried JSON.parse on tool-display text truncated by the transport and failed with `Unrecognized token '…'`; parsing the full file via the read helper passed. No malformed file was rewritten to hide that inspection failure.

The requested spec-only deliverables are complete. Capability execution, completed fixture assets and missing-report equations remain gates, not claimed complete. No runtime or parity PASS is inferred from JSON validation. The explicit U00 instruction authorizes one atomic U00-only commit despite the historical goal text's no-commit restriction. No other paths are to be staged.
