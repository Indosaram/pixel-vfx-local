# pixel-vfx-local

## 원본 프로그램 실제 이펙트 vs 픽셀화 변환 결과 비교 (Genuine 1:1 Comparison)

원본 3D VFX 런타임(Three.js/WebGL)에서 재생되는 부드러운 고화질 원본 애니메이션과,
이를 픽셀화 엔진으로 변환한 64x64 및 32x32 결과물입니다.

| 이펙트 (Effect ID) | 원본 3D 모션 애니메이션 (Original 3D VFX) | 픽셀 변환 결과 (64x64 Pixel Art) | 픽셀 변환 결과 (32x32 Pixel Art) |
|---|:---:|:---:|:---:|
| **Slash_fire** (화염 참격) | <img src="examples/comparison/genuine/Slash_fire_ORIGINAL_MOTION.gif" width="128" alt="Slash_fire Original"> | <img src="examples/comparison/genuine/Slash_fire_PIXEL_64.gif" width="128" alt="Slash_fire 64"> | <img src="examples/comparison/genuine/Slash_fire_PIXEL_32.gif" width="128" alt="Slash_fire 32"> |
| **Hit_01_Fire** (화염 타격/폭발) | <img src="examples/comparison/genuine/Hit_01_Fire_ORIGINAL_MOTION.gif" width="128" alt="Hit_01_Fire Original"> | <img src="examples/comparison/genuine/Hit_01_Fire_PIXEL_64.gif" width="128" alt="Hit_01_Fire 64"> | <img src="examples/comparison/genuine/Hit_01_Fire_PIXEL_32.gif" width="128" alt="Hit_01_Fire 32"> |
| **Blast_Electricity_01** (전격 폭발) | <img src="examples/comparison/genuine/Blast_Electricity_01_ORIGINAL_MOTION.gif" width="128" alt="Blast_Electricity Original"> | <img src="examples/comparison/genuine/Blast_Electricity_01_PIXEL_64.gif" width="128" alt="Blast_Electricity 64"> | <img src="examples/comparison/genuine/Blast_Electricity_01_PIXEL_32.gif" width="128" alt="Blast_Electricity 32"> |


## Export fps limits (per format)

- **Playback, PNG sheet, frame, atlas, Aseprite, .tres, .meta exports:** fps **1–60** as
  entered.
- **GIF export:** every encoded frame delay must be **≥ 2 centiseconds** (the encoder
  floor). Legacy scalar-delay presets clamp the delay up to 2 cs (so fps > 50 plays
  slightly slower than nominal). Boundary-scheduled **quality presets do not clamp**: GIF
  at fps **51–60 is unsupported and fails explicitly** with `delaySchedule=boundary:
  fps=… yields a sub-2cs delay at the encoder floor; unsupported candidate fps` (MCP
  returns JSON-RPC error `-32000`; the editor shows the message and this guidance in the
  export log). Use **fps ≤ 50** for quality-preset GIFs; sheet/frame exports stay valid
  at fps ≤ 60.

## Launch (Windows)

Desktop shell (recommended): `scripts\launch-desktop.cmd` starts the token-gated local
server and opens an app window pointed at it with the session token. The server
(`scripts/serve.py`) returns 403 without `?t=<token>` and serves subsequent files from an
HttpOnly session cookie; directory listing is disabled.

Plain static serving (no token gate) also works:

```
python -m http.server 8123 --bind 127.0.0.1
```

then open <http://127.0.0.1:8123/>.

## 3D workflow

Pick a preset labeled `(3D)` (Shard Burst, Orbital Ring, Crystal Growth, Nebula Swarm,
Warp Tunnel, Gem Spin). The Camera 3D section appears: yaw/pitch/distance/FOV sliders,
drag the preview canvas to orbit, use the wheel to zoom. 3D frames flow through the same
capture path as 2D (palette quantize, outline, holds, frame range) into sheet/GIF/Aseprite
exports.

## Editable timing markers

In the Timing section, set a frame number and optional label, press "Add marker".
Markers are sorted, clipped to 40 chars, capped at 32, removable from the list, and are
exported in the Atlas JSON under `meta.userMarkers` alongside the auto-suggested markers.

## MCP control server

```
bun scripts/mcp-server.mjs
```

Newline-delimited JSON-RPC 2.0 over stdio: `initialize`, `tools/list`, `tools/call` with
`list_presets`, `render_sheet`, `render_gif`, `golden_hashes`.

## Sourced sprite gallery

Ten examples render real source assets through the converted renderer: six original
sample-prefab / texture pairs (`source-prefab`) and four texture variants that pair a
recorded motion with a different pack sprite (`source-texture-variant`), each rendered
with the documented presentation adjustments described under Constraints. Each entry
links its preview GIF and its full contact sheet PNG under `examples/out/`.
All sprites are
from the **Kenney Particle Pack** by Kenney Vleugels (kenney.nl), **CC0-1.0** — see
`examples/LICENSE-Kenney-Particle-Pack.txt`; pack URL + zip sha256 are pinned in
`examples/manifest.json` (`pack`).

| Example | Kind | Motion record | Sprite |
|---|---|---|---|
| Fire | source-prefab | [Fire.json](examples/prefabs/Fire.json) | [smoke_07.png](examples/src-sprites/smoke_07.png) |
| Smoke | source-prefab | [Smoke.json](examples/prefabs/Smoke.json) | [smoke_01.png](examples/src-sprites/smoke_01.png) |
| Sparks | source-prefab | [Sparks.json](examples/prefabs/Sparks.json) | [trace_02_rotated.png](examples/src-sprites/trace_02_rotated.png) |
| Magic | source-prefab | [Magic.json](examples/prefabs/Magic.json) | [star_06.png](examples/src-sprites/star_06.png) |
| Hearts | source-prefab | [Hearts.json](examples/prefabs/Hearts.json) | [symbol_01.png](examples/src-sprites/symbol_01.png) |
| Electricity | source-prefab | [Electricity.json](examples/prefabs/Electricity.json) | [spark_05_rotated.png](examples/src-sprites/spark_05_rotated.png) |
| Flame jet | texture-variant | Fire motion | [flame_03.png](examples/src-sprites/flame_03.png) |
| Star burst | texture-variant | Sparks motion | [star_01.png](examples/src-sprites/star_01.png) |
| Magic swirl | texture-variant | Magic motion | [twirl_01.png](examples/src-sprites/twirl_01.png) |
| Glow orb | texture-variant | Electricity motion | [light_01.png](examples/src-sprites/light_01.png) |

- **Fire** — source-prefab — [sheet](examples/out/fire_sheet.png)  
  ![Fire](examples/out/fire_preview.gif)
- **Smoke** — source-prefab — [sheet](examples/out/smoke_sheet.png)  
  ![Smoke](examples/out/smoke_preview.gif)
- **Sparks** — source-prefab — [sheet](examples/out/sparks_sheet.png)  
  ![Sparks](examples/out/sparks_preview.gif)
- **Magic** — source-prefab — [sheet](examples/out/magic_sheet.png)  
  ![Magic](examples/out/magic_preview.gif)
- **Hearts** — source-prefab — [sheet](examples/out/hearts_sheet.png)  
  ![Hearts](examples/out/hearts_preview.gif)
- **Electricity** — source-prefab — [sheet](examples/out/electricity_sheet.png)  
  ![Electricity](examples/out/electricity_preview.gif)
- **Flame jet** — texture-variant — [sheet](examples/out/flame_jet_sheet.png)  
  ![Flame jet](examples/out/flame_jet_preview.gif)
- **Star burst** — texture-variant — [sheet](examples/out/star_burst_sheet.png)  
  ![Star burst](examples/out/star_burst_preview.gif)
- **Magic swirl** — texture-variant — [sheet](examples/out/magic_swirl_sheet.png)  
  ![Magic swirl](examples/out/magic_swirl_preview.gif)
- **Glow orb** — texture-variant — [sheet](examples/out/glow_orb_sheet.png)  
  ![Glow orb](examples/out/glow_orb_preview.gif)

### Resolution comparison (16x16 / 32x32 / 64x64)

**These three columns are derived, not re-renders.** Each cell is an
area/coverage-preserving box downsample of the matching native gallery render: 16x16
takes every 8th pixel of a 128x128 cell (every 12th of the 192x192 pair), 32x32 takes
every 4th (6th) and 64x64 every 2nd (3rd). Colour is averaged alpha-weighted so
coverage and energy survive the reduction, and GIF binary transparency marks a
destination pixel visible when its contributing source block has **any** nonzero alpha —
so a visible native pixel is never dropped. Colour is quantised against a palette built
from the native frames with the manifest's dither. Nothing is re-simulated: seeds, frame
count (25 frames @ 12 fps), timing, framing and colours all come from the native render,
so every column frames exactly the same world region as the gallery GIFs above.

The honest cost of that coverage rule: sparse particles read **thicker at 16x16** than a
native 16x16 render would, rather than fading out. Low-resolution pixelation and density
differences between the columns are expected — they are the thing being compared.

Each file really is 16x16, 32x32 or 64x64 on disk
(`examples/out/<id>_<size>_preview.gif`) — that is conversion from the native render,
not a re-render at that resolution, and each `examples/out/<id>_<size>_render.json`
receipt records it under `derivation` with the method, the integer factor and the
source sheet's sha256.

Each cell is displayed at 64 px so the three sizes line up for comparison. GitHub
strips inline CSS, so no `image-rendering` hint survives: your browser smooths the two
smaller columns as it enlarges them. That softness is the browser's scaling — the
files carry the pixel dimensions named in the column headers.

| 애셋 (Unity Prefab) | 유니티 원본 파티클 모션 (Original VFX) | 픽셀 변환 (64x64) | 픽셀 변환 (32x32) | 픽셀 변환 (16x16) |
|---|:---:|:---:|:---:|:---:|
| **Fire** | <img src="examples/out/fire_preview.gif" width="96" alt="Fire original"> | <img src="examples/out/fire_64_preview.gif" width="96" alt="Fire 64"> | <img src="examples/out/fire_32_preview.gif" width="96" alt="Fire 32"> | <img src="examples/out/fire_16_preview.gif" width="96" alt="Fire 16"> |
| **Smoke** | <img src="examples/out/smoke_preview.gif" width="96" alt="Smoke original"> | <img src="examples/out/smoke_64_preview.gif" width="96" alt="Smoke 64"> | <img src="examples/out/smoke_32_preview.gif" width="96" alt="Smoke 32"> | <img src="examples/out/smoke_16_preview.gif" width="96" alt="Smoke 16"> |
| **Sparks** | <img src="examples/out/sparks_preview.gif" width="96" alt="Sparks original"> | <img src="examples/out/sparks_64_preview.gif" width="96" alt="Sparks 64"> | <img src="examples/out/sparks_32_preview.gif" width="96" alt="Sparks 32"> | <img src="examples/out/sparks_16_preview.gif" width="96" alt="Sparks 16"> |
| **Magic** | <img src="examples/out/magic_preview.gif" width="96" alt="Magic original"> | <img src="examples/out/magic_64_preview.gif" width="96" alt="Magic 64"> | <img src="examples/out/magic_32_preview.gif" width="96" alt="Magic 32"> | <img src="examples/out/magic_16_preview.gif" width="96" alt="Magic 16"> |
| **Hearts** | <img src="examples/out/hearts_preview.gif" width="96" alt="Hearts original"> | <img src="examples/out/hearts_64_preview.gif" width="96" alt="Hearts 64"> | <img src="examples/out/hearts_32_preview.gif" width="96" alt="Hearts 32"> | <img src="examples/out/hearts_16_preview.gif" width="96" alt="Hearts 16"> |
| **Electricity** | <img src="examples/out/electricity_preview.gif" width="96" alt="Electricity original"> | <img src="examples/out/electricity_64_preview.gif" width="96" alt="Electricity 64"> | <img src="examples/out/electricity_32_preview.gif" width="96" alt="Electricity 32"> | <img src="examples/out/electricity_16_preview.gif" width="96" alt="Electricity 16"> |
| **Flame jet** | <img src="examples/out/flame_jet_preview.gif" width="96" alt="Flame jet original"> | <img src="examples/out/flame_jet_64_preview.gif" width="96" alt="Flame jet 64"> | <img src="examples/out/flame_jet_32_preview.gif" width="96" alt="Flame jet 32"> | <img src="examples/out/flame_jet_16_preview.gif" width="96" alt="Flame jet 16"> |
| **Star burst** | <img src="examples/out/star_burst_preview.gif" width="96" alt="Star burst original"> | <img src="examples/out/star_burst_64_preview.gif" width="96" alt="Star burst 64"> | <img src="examples/out/star_burst_32_preview.gif" width="96" alt="Star burst 32"> | <img src="examples/out/star_burst_16_preview.gif" width="96" alt="Star burst 16"> |
| **Magic swirl** | <img src="examples/out/magic_swirl_preview.gif" width="96" alt="Magic swirl original"> | <img src="examples/out/magic_swirl_64_preview.gif" width="96" alt="Magic swirl 64"> | <img src="examples/out/magic_swirl_32_preview.gif" width="96" alt="Magic swirl 32"> | <img src="examples/out/magic_swirl_16_preview.gif" width="96" alt="Magic swirl 16"> |
| **Glow orb** | <img src="examples/out/glow_orb_preview.gif" width="96" alt="Glow orb original"> | <img src="examples/out/glow_orb_64_preview.gif" width="96" alt="Glow orb 64"> | <img src="examples/out/glow_orb_32_preview.gif" width="96" alt="Glow orb 32"> | <img src="examples/out/glow_orb_16_preview.gif" width="96" alt="Glow orb 16"> |

### Quick start (sprite pipeline)

Prerequisites: [Bun](https://bun.sh) and Python 3 with Pillow
(`python -m pip install pillow`).

```
# 1. Build tool textures + per-example configs from the shipped normalised records
#    and source sprites (verifies every sprite sha256 pin):
python scripts/import-examples.py

# 2. Render all ten (deterministic; seeds baked into the configs):
bun scripts/render-examples.mjs

# subset / unknown ids (unknown ids exit 2):
bun scripts/render-examples.mjs fire smoke

# 3. Derive the 16x16 / 32x32 / 64x64 comparison cells from the native renders
#    (Windows; area/coverage-preserving box downsample, no re-simulation):
bun scripts/render-resolution-gifs.mjs

# subset of ids:
bun scripts/render-resolution-gifs.mjs fire smoke
```

Outputs: `examples/out/<id>_sheet.png`, `examples/out/<id>_preview.gif`,
`examples/out/<id>_render.json` (receipt incl. a `presentation` block) and
`examples/out/render-summary.json` (per-id exit codes).
`bun scripts/render-resolution-gifs.mjs` then writes the same three artifacts per size
as `examples/out/<id>_<size>_sheet.png`, `<id>_<size>_preview.gif` and
`<id>_<size>_render.json`; each of those receipts carries a `derivation` block naming
the method, the integer downsample factor, the source sheet and GIF sha256, and the
inherited timing and palette settings. To re-derive
`examples/prefabs/*.json` from the original pack instead of the shipped records, run
`python scripts/extract-unity-prefab.py` on the pack zip (URL + sha256 pinned in the
manifest) and pass its output directory: `python scripts/import-examples.py
--extract-dir <dir>`.

### Constraints

- The renderer is a converted, approximate implementation; it does **not** claim pixel
  parity with Unity or native vendor rendering.
- Presentation overrides are explicit and labelled, never presented as source values:
  `view.startSize` presentation overrides
  cover legibility and degenerate sources alike: Magic, Magic swirl and Hearts scale
  their source size ranges up for gallery legibility, and Electricity and Glow orb use
  `1.0` because the source prefab serialises a degenerate constant size `0.0`. Every
  override is recorded in its receipt as `presentation.startSizeOverride` with the
  original value, and labelled in the manifest `notes`. Original records stay untouched
  in `examples/<id>.json` and `examples/prefabs/*.json`.
- Prefab root translation is sample-scene placement and is ignored by the renderer; the
  per-example origin carries framing (`presentation.rootTranslationIgnored` in every
  receipt).
- The 16x16 / 32x32 / 64x64 comparison cells are **derived by
  area/coverage-preserving downsample** of the native renders, as documented in the
  resolution comparison section — conversion, not re-simulation. The native 128x128 /
  192x192 gallery GIFs and sheets are untouched and byte-identical to what this repo
  already shipped; no renderer code changed for them.
- Deterministic: baked seeds, fixed frame count/fps/palette — a regeneration from the
  same inputs yields the same bytes.
- No Unity editor is required for the default flow; no vendor demo data or paid pack
  content is included (CC0 pack, pinned download).
- `examples/textures/` and the machine-specific render receipts
  (`examples/out/*_render.json`, `examples/out/render-summary.json` — Windows absolute
  paths) are generated locally and excluded from the public set; the published gallery
  outputs are the preview GIFs and contact-sheet PNGs linked above (regenerable
  byte-identically from this repository).

## Tests

Unit tests run with bun:

```bash
bun test
```

## Layout

- `src/` — Core editor pipeline, procedural particle engine, 3D math and color grading
- `clone/` — Independent runtime and contract test suites (`clone/src/`, `clone/test/`). The headless
  renderer is `clone/render-standalone.mjs` (Electron) driving `clone/dist/runner.html` +
  `clone/dist/standalone-bundle.js`; `clone/electron-runner.cjs` is the Electron entry point and
  `clone/qa/` holds the Windows QA harness. `clone/render.mjs` is the earlier reference-app launcher
  and requires the vendor app tree, which is not part of this repository.

  The clone reads an H0PK data pack through the original loader in `clone/src/wire-pak.js`. The vendor
  pack itself (`clone/hun0fx.pak`) is excluded from this repository by the root `.gitignore` `*.pak`
  rule, so the standalone renderer runs only where that pack is supplied locally.
- `examples/` — Sourced Unity prefab configs and converted sprite outputs (`examples/out/`)
- `scripts/` — Batch rendering and resolution GIF derivation scripts
