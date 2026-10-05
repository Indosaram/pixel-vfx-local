# Feature parity checklist — pixel-vfx-local vs hun0fx Pixel Studio demo (v2.0)

Written BEFORE implementation from evidence, updated after the wave-2 review:
- internal code survey (report-ko.md; local working evidence, not shipped)
- internal datapack survey (report-v3-datapack-ko.md; local working evidence, not shipped)

Rules for this project: original code and original procedural/sample assets only. No vendor
source (sim.js / shaders.js / capture.js / formats.js bodies), no demo.pak data (textures,
meshes, fx definitions), no shader ports. Concept-level equivalence only; no pixel-exact
equivalence is ever claimed.

Legend: [C] complete = implemented + verified on Windows · [P] partial = narrower scope,
declared · [O] omitted = deliberately not built, declared

**Numbering correction (wave-2 review):** the "312 effects" figure is the datapack
CATALOG listing (312 catalog entries with 104 textures / 14 meshes). The demo itself
exercises only **16 actual effects**. This tool ships **16 original presets** (10 2D +
6 3D) — a coincidentally equal count, entirely original content.

---

## A. Unavailable proprietary content — parity NOT claimed (unavailable by design)

These items require vendor content or a paid entitlement that is legitimately unavailable.
They are listed here so that "unavailable" is never conflated with "not implemented":

| Item | Why unavailable |
|------|-----------------|
| Vendor source bodies (sim.js / shaders.js / capture.js / formats.js) | Inspected for survey only; copying prohibited by task rules |
| demo.pak data: textures (104), meshes (14), fx definitions (312 catalog entries) | Vendor data, not present as usable assets; no vendor assets in deliverable |
| User-supplied Unity library assets | Not present on this machine → no vendor-library content parity is pretended |
| H0PK data pack loader (report §8) | Loads the vendor data pack; pointless without vendor pack |
| Hand-drawn flipbook sprite recolor (spritefx.js) | Requires the vendor's hand-drawn sprite sheets |
| Electron shell / contextBridge packaging (report §3) | Vendor app shell; replaced by an ORIGINAL token-gated server + app-window launcher (implemented, see B-30) |
| Paid Aseprite/Godot/Unity licenses | No purchases or entitlement bypass; exporters written from PUBLIC documented formats |

## B. Implemented equivalent tool functions (original code, Windows-verified)

| # | Feature | Demo evidence | Target | Status (verified) |
|---|---------|---------------|--------|--------|
| 1 | Effect preview: live particle effect rendered in editor canvas | report §5 effect.js/capture.js | [C] | [C] shot 01, playback advances frames |
| 2 | Playback: play / pause / loop at fps | report §5 (play/seek/update) | [C] | [C] "play button advances frame 2 -> 10" |
| 3 | Scrubbing: frame slider + step buttons, seek anywhere | report §5 (seek) | [C] | [C] "scrub jumps to frame 4" |
| 4 | Reproducible seeds: same seed ⇒ byte-identical output | report §5 sim.js makeRng(seed) | [C] | [C] golden hashes + repeat-export SHA equality |
| 5 | Camera/view (2D): zoom, pan, background | report §7 bridge.js group `view` | [C] | [C] "camera zoom+pan changes pixels" |
| 6 | Output resolution: width × height control | report §6 formats | [C] | [C] canvas 192px + sheet/GIF dims track resolution |
| 7 | Output fps: 1–60, drives playback + GIF delay | report §6 GIF `fps` | [C] | [C] fps8→frameCount 8; GIF delay 13cs @ fps8 |
| 8 | Frame range: from/to included in export | report §6 export_one(frame_from, frame_to) | [C] | [C] range 0..9 → 10 cells; reversed input repaired 2..9 |
| 9 | Palette quantization: median-cut, N colors (default 16) | report §5 pixel.js medianCut | [C] | [C] UI applied 8/16; 3D sheet ≤ palette colors (checks) |
| 10 | Dither: ordered bayer 2×2 / 4×4, off | report §5 pixel.js dither | [C] | [C] unit test (boundary inputs) + UI bayer2/bayer4 applied |
| 11 | Outline: silhouette dilation, configurable color | report §5 pixel.js outline | [C] | [C] outline on in golden + export config; opaque pixels present |
| 12 | Recolor: gradient-map LUT presets by luminance | report §5 pixel.js 12 LUT presets | [P] 10 original LUTs | [P] verified: recolor=ember applied in UI + exports |
| 13 | Alpha threshold: hard alpha cut | report §5 pixel.js alphaThreshold 0.28 | [C] | [C] sheet alpha strictly {0,255} (other=0 check) |
| 14 | Sprite-sheet export: near-square grid PNG with transparency | report §6 sheetLayout/makeSheet, PNG | [C] | [C] 512x384 parsed (sig+CRC32+inflate+unfilter); System.Drawing agrees |
| 15 | GIF export: own LZW encoder, fps, holds, transparency, loop | report §6 formats.js GIF | [C] | [C] 128x128, 10 frames, 8cs (800ms), NETSCAPE loop=0; System.Drawing decodes identically |
| 16 | Timing holds: per-frame count, 0 = drop frame | report §5 timing.js holds | [C] | [C] "output frames: 11 / source 10 · 0.917s @ 12fps" |
| 17 | Timing markers: suggestion + **editable markers** (add/label/remove, sorted, exported) | report §5 timing.js suggestMarkers | [C] | [C] UI edits + atlas `meta.userMarkers` (109/109 checks, shot 15) |
| 18 | Reusable effect presets: named preset list | report §5 library.js preset() | [P] 16 original presets (10 2D + 6 3D) | [P] verified: select switch, "(3D)" labels, frameCount per preset |
| 19 | Ambient looping environment presets | report §5 env2d.js (blizzard/rain/embers) | [P] original loop presets inside the preset list | [P] verified: loop respawn unit tests |
| 20 | Camera-independent vs camera-bound export parity | report §6 export_one(id, view, ...) | [C] camera applies to export | [C] 2D camera + 3D camera in sanitized export params |
| 21 | JSON texture-atlas export (frames/meta) | report §6 formats.js JSON atlas | [C] | [C] "atlas JSON parses with all frames 10" + userMarkers |
| 22 | Single-frame PNG export | report §6 PNG | [C] | [C] 128x128, visible pixels 1104, sha matches UI lastExport |
| 23 | Aseprite .aseprite export | report §6 0xA5E0 | [C] | [C] written from the documented format: magic 0xA5E0/0xF1FA, 10-frame header, type-2 zlib cels; node:zlib + independent parser round-trip (unit + Windows checks) |
| 24 | Godot .tres / Unity .meta export | report §6 formats.js | [C] | [C] SpriteFrames .tres (10 Rect2 regions, loop, speed) + TextureImporter .meta (32-hex deterministic guid, y-flipped rects) |
| 25 | Hand-drawn sprite flipbook recolor (spritefx.js) | report §5 | [O] | [O] requires vendor hand-drawn sprites → section A |
| 26 | 3D pipeline: real orbit camera + geometry, **3-pass alpha matting, HDR bloom post** | report §4/§5 capture.js/post.js | [C] | [C] original software renderer (column-major mat4, box/sphere/torus/cone/plane, z-buffer, flat shading); bloom bright-pass + box blur, coverage→dilate→edge-composite 3-pass matte; unit-tested (render3d/post3d) + UI orbit/wheel checks, shots 11–14 |
| 27 | Effect library (vendor catalog: 312 entries / 104 textures / 14 meshes) | report-v3 §5-§7 | [O] | [O] vendor CONTENT unavailable (section A); catalog≠demo: the demo exercises 16 actual effects. Original equivalents: 16 original presets incl. 6 3D presets wired into preview/sheet/GIF |
| 28 | MCP control server / scripting bridge | report §7 | [C] | [C] `scripts/mcp-server.mjs`: JSON-RPC stdio, initialize/tools/list/tools/call; live handshake on Windows (initialize, tools/list=4, render_sheet non-blank PNG, golden_hashes == fixture); `window.PixelVFX` surface retained |
| 29 | H0PK data pack loader | report §8 | [O] | [O] loads vendor pack → section A |
| 30 | Desktop shell (token-gated local server + app-window launcher) | report §3 Electron shell | [C] | [C] ORIGINAL: `scripts/serve.py` token gate (403 w/o token, 200 + HttpOnly cookie, dir-listing off) + `launch-desktop.cmd/.ps1` (server + `--app=` window); verified live on Windows through the real launcher (`-NoWindow` mode), checks 109/109 |
| 31 | 3D capture → sheet/GIF export path | report §6 (3D frames into export_one) | [C] | [C] `render3dFrame` feeds buildSequence: 3D sheet dims/quantization + 3D GIF (10 frames, 8cs) verified through real buttons |
| 32 | Original 3D effect presets (vendor has its own; ours are original) | report §4 presets | [C] | [C] 6 presets (shard/orbital/crystal/nebula/warp/gem), pure scene(t,seed), seeded RNG, determinism tests + live UI |

## Verification evidence (Windows, 2026-10-05 · wave 2)

- Tests: `bun test` → **117 pass / 0 fail / 17618 expects** on BOTH engines
  (macOS Bun/JSC and Windows Bun/Node — byte-identical golden regenerated independently).
- UI drive (headless Chrome 154 + CDP): **109/109 checks PASS** (`evidence/results.json`,
  16 screenshots `01..16`, 15 real exported files under `evidence/exports/`).
- Cross-engine golden: Chrome V8 `PixelVFX.hashes()` == fixture for all 5 values
  (frame0 2a0bfad5, allFrames dd629e1b, sheet bff42cf8, gif 3f73c145, frameCount 12) —
  re-verified at the start of every win-verify run.
- 3D workflow checks: section toggle, "(3D)" label, yaw slider + hash change,
  real pointer orbit (yaw +0.6/pitch +0.1, pixels change), wheel zoom (+0.2),
  two presets screenshotted (shots 11–14).
- Exporters: Aseprite structure + `node:zlib` inflate round-trip on Windows; .tres region
  geometry; .meta guid/sprites; markers round-trip into atlas.
- MCP live: initialize / tools/list / render_sheet / golden_hashes over real stdio.
- Desktop shell live: `launch-desktop.ps1 -Port 8799` → token URL + server pid →
  403 without token, 200 with token, cookie gate, listing 403, server killed after.
- Independent decoder cross-check (wave 1): Windows System.Drawing sheet 512x384 ARGB,
  GIF128 10×8cs, GIF96 8×13cs — identical to our parsers.
- Fixture history & honesty ledger: `evidence/fixture-history.md`.
- Lint/static: `biome check .` clean (45 files); `bun build --target=browser` 91.9 KB OK;
  `lsp_diagnostics` src+tests 0 errors (typescript pinned 5.9.3); `node --check` driver OK.
- Cleanup receipts: 0 download leftovers, 0 `._*` AppleDouble files, no verify chrome/python
  processes alive (user's own `pythonw` shorts_factory service untouched), `.token` removed.

## Declared limitations (fixed text for the final report)

- This is an ORIGINAL implementation. No vendor source, shaders, textures, meshes, or effect
  definitions were copied. The demo's vendor catalog (312 catalog entries; the demo itself
  exercises 16 actual effects) is NOT available here as content; this tool ships 16 original
  presets (10 2D + 6 3D) built from original procedural code.
- No pixel-exact equivalence with the demo is claimed; no side-by-side outputs exist.
- Visual pipeline now mirrors the demo's SHAPE (software 3D scene → 3-pass alpha matting +
  HDR bloom → quantize/outline → sheet/GIF), but all math, geometry, particles and post
  effects are original; output is stylistically similar (chunky pixel-art VFX sheets), not
  numerically identical.
