# U00 spec gaps: risk dispositions, missing formulas and closure evidence

Status: U00 SPEC ONLY. No implementation, runtime, asset, reference-source read, commit,
network call or package change was performed by the task that produced this file.

Authority: `state/sprite-clone-plan.md` §2, §7 and §8 (risk register, evidence levels,
gap policy) and `state/sprite-decomposition-report.md` (the report whose UNVERIFIED
boundaries and omitted algorithms these gaps name).

Anchor convention: anchors are reproduced from the report. `sim.js` =
`app/runtime/sim.js`, `formats.js` = `app/js/formats.js`, under SRC =
`/Users/indo/.omo/evidence/hun0fx-pixel-studio-demo/app-code/`. EVID is the parent of SRC.

Gate classes used below:

- **exclusion** — the clone does not attempt the claim at all; the boundary is removed from
  scope rather than verified.
- **gap-gated** — the stage runs and produces useful results, but fidelity or parity
  approval is withheld while the named gap is open. A passing test suite does not lift it.
- **blocked** — no clone-side work can close it. Only an owner-supplied/accepted static
  report addendum can (plan §2, §8 R14).

## 1. Disposition register R01-R14

| ID | Report boundary | Disposition and named verification step | Gate class | Gap refs |
|---|---|---|---|---|
| R01 | §1 paid content / external Unity originals / builtin-shader equivalence assumption | Exclude content and Unity parity. U00 asset provenance inventory permits only authored/user-owned inputs; U07 verifies clone branch behavior without Unity claims. | exclusion | — |
| R02 | §§1,11 complete three.js/OrbitControls internals unaudited | Dependency boundary retained. U00 pins versions; U06/U07/U16 exercise the used APIs and record environment. No whole-engine audit claim. | gap-gated | G14 |
| R03 | §3 HTTP/path checks not a security guarantee | Do not copy that guarantee. U13 tests sandbox/context isolation and narrow IPC; U14 tests absolute paths, traversal, separator variations and denied writes against a task-owned root. Security beyond these cases remains unverified. | gap-gated | — |
| R04 | §4 end-to-end numerical reproducibility | U02 asserts only seeded simulation cases. U09 exercises sampling above 40000; U11 validates generated Unity identifiers semantically. U15 reports deterministic and nondeterministic stages separately. | gap-gated | G03, G08 |
| R05 | §6 post.js output not actual capture output | Exclude post helper. U08 checks direct render call graph and ensures no bloom/post stage is invoked; this establishes clone wiring only. | exclusion | — |
| R06 | §6 shared shader clock visual consequences | Preserve reported clock lifetime; U08 logs clock at both passes and renders an authored time-varying material. Result proves clone consequence, not original visual behavior. | gap-gated | G07 |
| R07 | §8 ambient seamlessness for all settings | U12 phase t/t+L comparison across authored families, speeds, winds and seeds; no universal seam-free claim beyond cases. Unspecified formula gap blocks reference seam parity. | gap-gated | G09 |
| R08 | §9 importer compatibility / lossless round-trip / arbitrary encoder data | U11 independent decode and malformed/boundary fixtures. Actual Aseprite/Godot/Unity import is a separate named `importer-smoke` check of clone outputs on physical Windows with versions recorded; until available, advertise format generation only, not importer certification. No original app dependency. | gap-gated | G10 |
| R09 | §§9,10,11 successful writes / storage availability / persistence round-trip | U14 chosen-folder writes, permission error and partial-batch cases; U13 clone restart and denied-storage scenarios. Inspect actual files and persisted values. Do not infer success from IPC return alone. | gap-gated | — |
| R10 | §11 external authoring/export toolchain | Exclude wire compatibility not described by report. U00 clone schema documents every accepted field; U01 rejects unsupported imports without silently discarding fields. | exclusion + gap-gated | G02 |
| R11 | §11 GPU output | U06-U08 Windows GPU readbacks plus inspected screenshots and analytic scenes; U16 packaged rerun. No reference-image equivalence claim. | gap-gated | G07 |
| R12 | §11 all OS behavior outside static proof | U13/U14/U16 verify Windows clone lifecycle, dialogs, storage and package isolation. Other OS support unclaimed; no Mac render/encode validation. | gap-gated | — |
| R13 | §11 inventory metadata not every original asset definition / whole-engine or full-edition reconstruction | U00 authored fixture inventory is exhaustive for the clone's claimed support only. Missing reference assets are excluded, not inferred from catalog counts. | exclusion | — |
| R14 | Additional specification risk: exact algorithms absent from the report (§2 of the plan) | U00 enumerates them, downstream gates retain them, and only an accepted static addendum can resolve them. A worker completion, passing test suite or image that looks plausible cannot close R14. | **blocked** | G01-G13 |

## 2. Missing formulas and schemas

### Subsequent bounded static review

The original rows below preserve the U00 baseline, not the latest status.
G07's named shader/material formula omissions are resolved at bounded static
scope by reviewed vertex, fragment and material addenda under state/.
Three.js chunk/default behavior, resource decoding, implementation conformance,
material fixtures and GPU output remain unverified; this is not a render gate.
Reviewed addenda now supply G04 shape equations, G05 motion and G06 UV rules,
G08 pixel equations, and G13 timing recommendations:
`state/sprite-static-emission-addendum.md`,
`state/sprite-static-motion-addendum.md`,
`state/sprite-static-timing-cleanup-addendum.md`,
`state/sprite-static-pixel-pipeline-addendum.md`, and
`state/sprite-static-pixel-helpers-addendum.md`.
Reviewer st_01a1170f performed bounded Astra source audits; incorporated
corrections are recorded in those files. This resolves those named static
omissions only, not full fixtures, runtime equivalence or implementation gates.
G03 remains partial (cross-module RNG traversal). G11 is statically resolved:
the emission addendum records material.js:2,5 importing sim.js:68's lin for RGB
and preserving alpha; bounded Astra review confirmed both anchors. Shader and
rendered-color verification remain open. All other baseline gaps remain open unless
explicitly resolved by their own evidence.

Each row is a detail the report does not specify. The report's anchors identify where the
detail was read in the original; they are not a specification of the omitted content, and
no value below may be guessed and claimed as fidelity (plan §2).

| ID | Missing detail | Report anchor | Required value / equation | Affected acceptance case | Gate class |
|---|---|---|---|---|---|
| G01 | H0PK pack binary schema: magic layout, index encoding, path/offset/length/flags record shape, deflate framing | §3 `vfs.js:8-27,29-64` | Full byte-level container schema | `test/library.test.js` H0PK import (currently EXCLUDED from shipping input) | blocked |
| G02 | Complete `EffectDefinition` wire schema, all settings defaults, and the full `Emitter`/`AssetRef`/`Placement` field lists | §3 `library.js:18-158,164-211`; §4 `app.js:24-40,72,228-232,252-260,324-345,440-445`; `bridge.js:49-64` | Field list, types and default table | `test/library.test.js`, `test/settings.test.js` | blocked |
| G03 | Exhaustive RNG draw-site order and consumption count | §4 `sim.js:71-76,117-180`; `effect.js:130-132` | Ordered list of every draw site with its draw count per call | `test/curves-rng.test.js` two-emitter stream case; `test/emission.test.js` | blocked |
| G04 | Shape distribution formulas (position sampling inside sphere/hemisphere/cone/circle/box) | §5 `sim.js:79-87,117-143` | Exact sampling equations per shape code | `test/emission.test.js` shape cases | blocked |
| G05 | Orbit/radial motion and sequential sinusoidal noise equations | §5 `sim.js:202-224` | Exact equations | `test/motion.test.js` | blocked |
| G06 | UV wrapping and lifetime/FPS sheet-addressing equations | §5 `sim.js:240-273` | Exact addressing and wrap equations | `test/motion.test.js`, `test/instances.test.js` | blocked |
| G07 | Shader vertex/fragment equations and keyword branch formulas | §6 `shaders.js:6-63,65-123,125-169` | Full shader source or equivalent equations | `qa --case shaders`, `qa --case capture` | blocked |
| G08 | Pixel grading/distance/dither coefficients (gradient-mapping LUT, nearest-color distance metric, Bayer phase, edge-darkening strength, white-hot brightening amount) | §7 `pixel.js:23-97,99-229` | Exact coefficients | `test/pixel.test.js`, `test/palette.test.js` | blocked |
| G09 | Ambient generator formulas: layer path equations, speeds, winds, `rngFrom` hash, depth tiers | §8 `env2d.js:12-109,110-257,56-79` | Exact formulas | `qa --case alternate` | blocked |
| G10 | Binary encoder field details: Aseprite chunk fields, GIF LZW tables, ZIP records, PNG blob options | §9 `formats.js:5-301` | Exact field layout and values | `qa --case exports` | blocked |
| G11 | Gamma-to-linear interior branch constants | §4 `sim.js:68`; `material.js:5` | The full piecewise expression between the 0.04045 and 1 breakpoints (breakpoints and the exponent 2.2 above 1 are stated; the interior branch is not) | `test/curves-rng.test.js`, `qa --case shaders` | blocked |
| G12 | Settings normalization unspecified defaults | §4 `app.js:24-40,72,228-232,252-260,324-345,440-445`; `bridge.js:49-64` | Default value table | `test/settings.test.js` | blocked |
| G13 | Timing recommendation heuristics beyond the reported coverage basis | §7 `timing.js:1-71`; `app.js:430-445,530-540` | Exact recommendation rule | `test/timing.test.js` | blocked |
| G14 | Exact Electron release | not identified by the report (§1 of the plan) | A selected currently supported release that passes `qa --case capabilities`, recorded before any GPU baseline is accepted | `qa --case capabilities` and every GPU stage | open decision, **not** a fidelity gap: claiming a reference version match would be invented |

## 3. Not gaps: rules that are specified, values that must be independently enumerated

These are listed so they are not mistaken for missing report content.

- **Prewarm expected step count.** The rule is specified (repeated 1/60 updates while
  accumulated time is below duration; `sim.js:111-115`). The expected step count is a test
  author's independent enumeration, not a report omission.
- **Derived oracle values.** `oracles.json` marks three values as derived rather than
  report-literal: the seed-1 first integer 16807 (O-RNG-02), the capacity table
  3/256/256/256 (O-CAP-02) and holds `[1,0,3]` giving two retained and four baked frames
  (O-TIMING-04). Each carries its derivation and must be recomputed independently by the
  test author.
- **Unity identifier bytes.** The report states the generator is `crypto.getRandomValues`
  and that repeated generation is not specified as byte-identical
  (`formats.js:177-180`). Uniqueness and shape are validated; byte equality is not claimed.
- **Nondeterministic pixel sampling.** The report states the sampler uses `Math.random()`
  after its initial 40000 samples (`pixel.js:188-201`). The H02 40001+ sample fixture
  records this separately and never promises seed-only byte equality.

## 4. Closure evidence required

- **G01-G13 close only** when the owner supplies or accepts a static report addendum that
  contains the required value or equation. Closing requires all three of: (a) the addendum
  text, (b) a re-authored entry in `oracles.json` anchored to that addendum, and (c) the
  affected stage test updated to assert it.
- **Nothing else closes a gap:** not a passing test suite, not a plausible image, not a
  worker completion, and not an observation of the original application. Resolving a gap by
  launching the original, inspecting new reference material without authorization, or
  silently assigning a plausible value is prohibited (plan §2, §8 R14).
- **Gap-gated R01-R13 claims** require the named verification evidence: Windows run with
  recorded build/runtime/GPU and input hashes, decoded outputs, screenshots/readbacks
  and exit status. Exclusions remain exclusions; a clone test cannot establish paid-content,
  Unity or reference parity, or close an excluded claim.
- **Deviation policy.** An explicit clone-only choice may support a working tool, but it must
  be labeled a deviation and cannot pass that stage's fidelity gate (plan §2).
- **Evidence levels.** Stage acceptance never upgrades level 1 (report-rule conformity) to
  level 3 (reference visual/numerical parity). Level 3 is NOT claimable under current
  evidence; level 4 (Unity/full-edition parity) is excluded (plan §7).
- **Shipped scope.** A documented approximation, unspecified algorithm or nondeterministic
  output must stay visible in the shipped scope manifest. A reusable working clone with open
  fidelity gaps may be called functional, not a fully faithful reproduction (plan §7).

## 5. U00 remainder not produced by this task

The task that produced these five files was scoped to `clone/spec/contracts.md`,
`stages.json`, `oracles.json`, `fixtures.json` and this file only. The following are U00
deliverables under the plan but are outside that edit scope and remain open:

- `qa/run.mjs`, the `qa` package script and `qa/cases/capabilities.mjs` (plan §4 harness
  contract; the capability command is recorded in `stages.json`).
- The package/runtime lock and version selection are now recorded in `runtime-lock.json`
  and `../bun.lock`: Electron 44.6.0, three.js 0.170.0, Bun 1.4.0. G14 remains open only
  for capability certification, not version selection.
- Filling the fixture manifest values: every null in `fixtures.json` plus its SHA256 and
  oracle origin.
- The U00 asset provenance inventory (plan §8 R01, R13).

Also excluded by the plan and not gaps to be filled: H0PK ingestion, exact external
authoring-tool compatibility, exhaustive three.js internals, the optional HunFXPost
bloom/tonemap/vignette path, the full-edition control server, reference auto-cleanup of old
runtimes and external-link destinations (plan §7).
