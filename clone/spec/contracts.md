# U00 clone contract: shared data, error and stage API surface

Status: U00 SPEC ONLY. Field names and signatures below are FROZEN. No implementation,
runtime, asset, reference-source read, commit, network call or package change was performed
by the task that produced this file.

Authority: `state/sprite-clone-plan.md` §3 (shared data and error contracts) and §4 (stage
contracts, traceability and falsifiable acceptance) as the design authority, and
`state/sprite-decomposition-report.md` as the static technical authority for every rule
reproduced here. Where the plan leaves a field open it is marked OPEN; it is never filled by
invention.

Anchor convention: source anchors are reproduced from the report, not re-derived.
`sim.js` = `app/runtime/sim.js`, `formats.js` = `app/js/formats.js`, both under
SRC = `/Users/indo/.omo/evidence/hun0fx-pixel-studio-demo/app-code/`. Numeric ranges are
source lines.

These are CLONE-OWNED schemas. They are not an assertion of byte-compatible reference JSON
(plan §3). Every name fixed here is a contract-change surface: a downstream unit may add a
field only through coordinator integration, and may not rename or repurpose a frozen one
(plan §6).

## 1. Shared data contracts

### 1.1 EffectDefinition

```
EffectDefinition {
  id: string
  duration: number
  loop: boolean
  emitters: Emitter[]        // ORDERED; traversal order participates in RNG draw order
  assets: AssetRef[]
  placement: Placement
}
```

Rules:
- Ordered emitters are preserved; order is semantically significant (report §4 draw ordering).
- No implicit preset lookup by ID (plan §3).
- An `Emitter` carries explicitly tagged curves, color gradients, shape, transforms,
  rate/bursts, lifetime, motion, trails and material references. The per-field shape of
  `Emitter`, `AssetRef` and `Placement` beyond those named members is OPEN (G02).

### 1.2 Curves

Scalar curve tags: `c` constant, `r` random interval, `k` scaled Hermite, `rk` blended
scaled Hermite. Color evaluation supports constant/ranged colors and single/ranged gradients.

Frozen rules:
- Key arrays preserve the documented left[3] / right[2] tangent indexing. This exact index
  order matters more than informal tangent names (report §4, sim.js:6-31).
- Hermite clamps endpoints and uses the left key's index 3 tangent and the right key's
  index 2 tangent with segment duration (sim.js:6-31).
- The random fraction is an explicit evaluator argument, not drawn inside the evaluator.
- Color and alpha keys are independent (sim.js:33-66).
- Fixed mode chooses interpolation fraction 1 for an interior segment (sim.js:33-66).
- A missing or unknown scalar curve evaluates to 0; missing color input evaluates to white
  (sim.js:6-31, 33-66).

### 1.3 AssetResolver

```
AssetResolver.read(path: string): Promise<Uint8Array>
AssetResolver.loadDefinition(id: string): Promise<EffectDefinition>
```

- Isolates filesystem, JSON and assets from simulation.
- Relative paths only, confined to the selected project.
- Missing assets return a structured error (§1.8).
- Only a missing texture *reference* gets the documented white fallback (report §6,
  material.js:16-81); a missing asset file does not.

### 1.4 Simulation

```
Simulation.play(seed)
Simulation.update(dt)
Simulation.seek(seconds)
Simulation.stop()
Simulation.snapshot()
```

- One effect RNG shared across emitters; ordered emitters; no renderer dependency
  (report §4, sim.js:71-76,93-94,107-115; effect.js:29,45,84-91).
- `play` resets the effect stream; an emitter's own play does not independently reseed it.
- `snapshot()` exposes particles, time, RNG draw count, emission state and trail histories
  for tests.

### 1.5 RenderState

Per-instance position, velocity, size, rotation, color, UV, custom data and flip, plus
ordered trail segments and transforms. The renderer consumes this state without drawing
simulation randomness (plan §3).

### 1.6 CaptureResult and PixelResult

```
CaptureResult {
  frames: [{ w: number, h: number, data: Uint8ClampedArray | Uint8Array }]
  shape: "1:1" | "2:1" | "1:2"
  k: number          // integer supersampling factor, clamped 2-8
  origin: { x, y }
  fps: number
  loop: boolean
  outW?: number
  outH?: number
}

PixelResult {
  frames: ...
  w: number
  h: number
  palette: ...
  outline: ...
  gain: number
}
```

- `CaptureResult.data` is straight-alpha RGBA with half-color headroom. It is NOT
  premultiplied output (report §6, capture.js:91-113).
- `PixelResult` carries ordinary byte RGBA (plan §3).

### 1.7 Timing, ExportRequest, OutputFile

```
Timing        { fps: number, holds: number[], markers: ..., range: [number, number] }
ExportRequest { name, format, pixelResult, timing, layout, origin, options }
OutputFile    { relativePath: string, bytes: Uint8Array }
```

- Holds are integers 0-8; 0 drops a frame (report §7, timing.js:1-71).
- UI range is inclusive and 1-based; the internal slice is 0-based (report §9,
  app.js:324-345,570-597).
- Encoders never write files; the sink does (plan §3).

### 1.8 Boundary error

```
{ code: string, stage: string, message: string, context: object }
```

- Public boundary failures use this shape.
- Reject malformed external schemas at import.
- Do not add validation inside every integration step, and do not silently normalize
  unsupported structures into supported ones (plan §3, §8 R10).

## 2. Frozen stage API signatures

| Stage | Module | Frozen exported interface |
|---|---|---|
| Definitions/assets | `src/library.js` | `loadDefinition`, `resolveVariant`, `resolveMix`, `loadAssets` |
| Normalization | `src/settings.js` | `normalizeSettings(input, policy)`, `normalizeRange` |
| Curves/RNG | `src/curves.js` | `scalar(curve, t, r)`, `color(curve, t, r)`, `makeRng(seed)` |
| Spawn/scheduler | `src/emitter.js` | `play`, `emit`, `advanceEmission` |
| Update/state | `src/motion.js` | `stepParticle`, `particleState`, `advanceTrail` |
| Effect clock | `src/effect.js` | `Simulation` |
| Instances/trails | `src/render/instances.js` | `updateInstances(snapshot, camera)` |
| Materials/shaders | `src/render/materials.js` | `createMaterial(spec)` |
| Capture | `src/capture.js` | `capture(effect, options)` |
| Pixel stages | `src/pixel.js` | `pixelate(capture, size, options)` |
| Pixel stages | `src/palette.js` | palette import / selection |
| Timing | `src/timing.js` | holds, markers, apply, bake, total |
| Alternate captures | `src/sprite.js` | `captureSprite` |
| Alternate captures | `src/ambient.js` | `captureAmbient` |
| Export encoders | `src/export/{sheet,gif,zip,aseprite,metadata}.js` | `encode(request)` |
| Export orchestration/sinks | `src/export/jobs.js` | `planJobs`, `filesFor` |
| Export orchestration/sinks | `electron/output.js` | `writeFiles` |
| UI/settings | `src/app.js` | store, cache, bridge |
| UI/settings | `electron/main.js`, preload | shell, narrow output IPC |
| Harness (U00-owned) | `qa/run.mjs` | `qa` package-script launcher |

`bun test` targets and `bun run qa -- --case <case>` cases per stage are enumerated with
their report anchors in `stages.json`.

## 3. Error and validation policy (frozen)

- One structured error shape at every public boundary (§1.8).
- Validation lives at the import/boundary, not inside every integration step.
- Unsupported external structures are rejected, never silently normalized into supported
  ones.
- A missing texture reference alone gets the documented white fallback; every other missing
  asset is a structured error.
- No effect-name dispatch, tuned per-fixture constants or unavailable-branch avoidance
  (plan §1). Named fixtures are test data, never production conditions.

## 4. Explicitly not frozen here

- Exact `Emitter`/`AssetRef`/`Placement` field lists, all settings defaults, the complete
  wire schema and every RNG draw site: OPEN, see `spec-gaps.md` G02/G03/G12.
- Exact shader, pixel-coefficient, ambient and binary-encoder formulas: OPEN, see
  `spec-gaps.md` G04-G10.
- Exact Electron release is pinned to 44.6.0 in `runtime-lock.json`; capability certification
  remains open (G14), and no reference version match is claimed.
- Reference visual/numerical parity: NOT claimable under current evidence (plan §7).
