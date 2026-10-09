# Clone completion candidate QA

Starting revision: 87e1c8458873c59e59fab6386c491db92c2d9556.
Run date: 2026-10-09. Environment: Linux x86_64, Bun 1.4.0,
Electron 44.6.0, Three.js 0.170.0. Browser/WebGL verification uses the explicit
SwiftShader software fallback. This does not pass the physical Windows gate.

| Check | Result |
|---|---|
| Root full test run | 600 pass, 0 fail, 150773 assertions, 74 files |
| Clone test run | 334 pass, 0 fail, 2019 assertions, 48 files |
| Root executed-file coverage | 97.72% lines, 97.11% functions |
| Clone executed-file coverage | 98.67% lines, 98.33% functions |
| Browser bundles | Both build successfully |
| Frozen clone dependency install | Pass |
| Browser workflow | 11 checks pass |
| Independent Pillow decode | All three GIFs match their PNG-sheet cells, including alpha |
| GIF dimensions/count/duration | All three: 64x64, 18 frames, 1200ms |
| PNG sheet dimensions | All three: 320x256 |
| CLI Electron render | Original Ring, 64x64, 18 frames, exit 0 |
| CLI malformed size / unknown effect / missing pack | Explicit errors, exit 1 |
| Desktop/mobile visual inspection | 1280x900 and 390px-wide UI inspected; no horizontal overflow |
| Main (initial QA) | Initial run was local only; current publication scope is below |

Coverage is measured on files loaded by the unit test suite, not every file in
the tree. UI and Electron main/launcher code are covered by separate browser/CLI
checks, not those percentages. The real texture-loading branch was exercised by the uploaded-pack follow-up below;
full catalog compatibility remains untested. Pixel pipeline line coverage is 86.72%, standalone
renderer 92.77%, pack reader 82.54%. GIF encoder line coverage is 100%, which
still does not establish arbitrary encoder compatibility.

Browser cases: colored renders for all three original effects, playback advances,
seed change changes pixels, resolution applies, invalid FPS reports an error and
disables exports, recovery works, malformed pack rejection, narrow viewport
without overflow, and no page errors. Desktop/narrow screenshots show readable
controls and a colored preview. Decoded GIF pixels match every corresponding
sheet frame, proving transparency disposal removes expired particles.

## Remaining acceptance boundaries

- Exact hun0fx visuals, original numerical oracles and proprietary content parity
  are not established. The three samples are functional development assets.
- Physical Windows, packaged desktop, Aseprite/Godot/Unity importer certification
  and a real owned/licensed pack render remain unverified.
- Older `spec/` fidelity gates are not closed or rewritten by these tests.
- The initial PR-only publication scope was superseded for this repository by the owner
  on 2026-10-09: direct publication and pack-history cleanup were requested.

Reproduce browser results with `bun run smoke` (set CLONE_CHROME), then run
`python clone/qa/decode-smoke.py clone/evidence/smoke` from the repository root.
Raw local evidence is intentionally ignored rather than claiming portable host paths.

## Uploaded pack follow-up (2026-10-09)

Privately tested the uploaded 2,074,216-byte H0PK file from upstream revision
8ef46e0. The work branch does not include that pack or extracted assets.
Catalog parsed as 312 effects / 104 textures / 14 meshes; this is an inventory,
not verification of all 312 effect renders.

Rendered Hit_01_Fire, Slash_fire and Blast_Electricity_01 at 32 and 64 pixels,
15fps, duration 0.77, seed 1, elevation 35 and facing 0. All six browser renders
succeed with finite colored palettes, 12 frames and 800ms GIF timing. Their decoded
GIF pixels/alpha match each exported PNG-sheet cell. The isolated Electron path
also successfully rendered an actual-pack Hit_01_Fire GIF.

The real-pack test exposed a texture-orientation defect: ImageBitmap passed to
CanvasTexture does not apply the usual texture flipY on upload. Reusing the
existing tested TextureLoader adapter fixed that, with blob URLs revoked afterward.
Original samples never loaded textures, so they could not expose this failure.

Compared to the pre-existing repository PIXEL_64 GIFs, inspected captures now have
recognizably similar motion and shapes. Alpha-mask intersection-over-union averaged
across all 12 frames: Hit 0.512, Slash 0.666, Electricity 0.913. Blank/blank frames
count zero in that descriptive metric. It is not an art-fidelity score, and no
pixel-exact claim follows. Original reference capture seed/clock/GPU/receipt and
native provenance remain unverified. Fire placement/color details still differ.
Physical Windows and all-catalog compatibility remain unverified.

Repeat privately with HUN0FX_PAK, CLONE_CHROME and optionally CLONE_PYTHON set:
`node clone/qa/vendor-pack-smoke.mjs`. Outputs stay in ignored local evidence.
No permission to publicly redistribute a vendor pack is inferred from this test.

## Author Studio and original pack builder

Author Studio at `clone/author.html` adds from-scratch particle layers, burst/rate,
duration/delay/loop, life/speed/size/color, gravity/position/shape, lifetime size
and color/alpha curves, owned texture/mesh binding, captured preview, JSON project
save/load and .pak export. The pack writer shares the reader's reversible byte
transform and writes sorted deterministic manifests, effect JSON and asset bytes.
It does not use or embed vendor content. Original vendor-app compatibility is not
claimed; our-clone compatibility is required and checked.

Final full suite: 611 pass, 0 fail, 150816 assertions (75 files); root executed-file
line coverage 97.77%, functions 97.15%. Clone: 345 pass, 0 fail, 2062 assertions,
98.70% line coverage, 98.34% functions. Author project core 98.75% lines / 96.77%
functions; pack writer 100% lines/functions. UI remains excluded from those unit
coverage percentages and has separate browser tests.

Ten repeatable author browser checks pass. The authored fixture combines a burst
layer with a rate layer, size/color curves, a task-authored transparent image and
triangle mesh. Nondefault capture is 32x32, 12fps, duration1, seed9. Save/load project
preserves every RGBA byte of all 12 frames. Export/reimport of our .pak into Clone
Lab preserves those frames exactly, including imported asset bytes and capture
settings. Independent Pillow decoding matches exported GIF pixels/alpha to PNG
sheet cells: 12 frames, 1000ms, sheet128x96, colored pixels present. Unit tests
also check pack bytes deterministic, independent original byte/JSON assets,
curves, invalid paths, capture limits, topology and malicious project fields.

Desktop and 390px narrow layout screenshots were inspected, including the actual
preview. Original sample browser regression remains 11/11, GIF/sheet decode still
passes, and the prior six uploaded-pack renders still work. Frozen install and
all three generated browser bundles pass.

Scope: this is a particle authoring MVP, not frame painting/node graphs or a general
mesh modeler. Save downloads a file; no automatic persistence is promised. Some
advanced emitter branches require JSON and remain unverified. Empty or invalid
renders report errors. Publication status is reported separately; the owner requested direct main publication.

## Original 16-effect gallery follow-up

Reconciled against upstream 8ef46e0, preserving its typed-array palette correction
and non-pack work. Root suite: 612 pass / 0 fail / 150817 assertions, 75 files.
Clone suite: 346 pass / 0 fail / 2063 assertions, 49 files. Author browser 10/10;
original-sample UI 11/11. Simple-material default UV now samples the full texture
instead of its transparent corner, with a regression test.

All 16 original projects render independently at 64px and 32px (21 frames each).
Analytic masks and authored emitter data are original, not pack derivatives.
Actual-pixel multi-frame contact sheets were inspected for shape, color and fade.
GIFs decoded independently against every PNG cell at both sizes.

The vendor pack and 10 derived comparison/output files are removed from the
published tree and selected publication history. Third-party clones, forks,
caches and provider-retained unreachable objects cannot be erased by a git rewrite.
No original-app parity or physical Windows certification is claimed.
