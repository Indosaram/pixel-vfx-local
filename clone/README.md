## Author your own effects

Open `/clone/author.html` or press Create an effect in Clone Lab. Make particle
layers, edit parameters and lifetime curves, import owned images/mesh JSON,
preview, save/load project JSON and export your own .pak. See [authoring guide](AUTHORING.md).

# Clone Lab: functional local workflow

This is the newer Three.js rendering integration, separate from the original
procedural editor at `/index.html`. It reproduces the declared pipeline shape,
not certified pixel-exact hun0fx output. Open fidelity gaps in `spec/` stay open.

## Run the app

From the repository root, serve files locally:

```sh
python -m http.server 8123 --bind 127.0.0.1
```

Open `http://127.0.0.1:8123/clone/`. Checked-in bundles let the browser app run
without installing Electron or Bun. WebGL2 is required. Select an effect, change
resolution, camera, seed, FPS or palette size, then press Render. Play/pause and
scrub inspect the captured sequence. Export GIF and Export PNG sheet download the
same converted frames. Settings apply when Render is pressed.

Three authored procedural samples ship with the app: Original Burst, Original
Ring and Original Fountain. These are development samples, not copies of vendor
art. No vendor content, credentials or paid assets ship with them.

A licensed local H0PK pack can be selected through the file input. It is read
in browser memory, never uploaded or published. This is experimental input support,
not certification of arbitrary packs. Invalid headers, index bounds and paths
are rejected. License and ownership remain the user's responsibility.

## Rebuild, test and CLI

Install [Bun](https://bun.sh), then from `clone/`:

```sh
bun install --frozen-lockfile
bun run build
bun run test
bun run coverage
```

For CLI rendering, Electron's binary must be installed as well:

```sh
node node_modules/electron/install.js
node render-standalone.mjs "Original Burst" 64 out/burst.gif
```

Original samples are the default. For an owned/licensed pack, set `HUN0FX_PAK`
to an absolute local path and pass its effect ID. The Electron main process reads
that file; the renderer has no Node access, uses context isolation and sandboxing,
and receives only bytes. No shell command interpolates an effect ID or path.
No machine-specific binary fallback or unpinned `npx` download remains.

On a headless Linux host with Xvfb, software WebGL is an explicit fallback:

```sh
CLONE_SOFTWARE_GL=1 xvfb-run -a node render-standalone.mjs "Original Burst" 64 out/burst.gif
```

That fallback is not physical Windows/GPU certification. Production desktop
packaging, native importer certification and exact vendor art parity remain
unverified. The legacy `qa/run.mjs` Windows-only certification rule is preserved;
Linux checks do not pass that gate.

## Repeatable browser and decoder checks

After installing dependencies, set `CLONE_CHROME` to an installed Chrome or
Chromium executable and run `bun run smoke`. Set `CLONE_PYTHON` if your Python
command is not `python`. The test starts its own loopback server on port 8124,
uses an explicit software-WebGL fallback and records 11 browser checks, downloads
and screenshots in ignored `clone/evidence/smoke/`. Stop any existing listener
on 8124 before this test. This is clone-only fallback QA, not Windows parity.

For an independent export decode, install Pillow and run from the repository root:

```sh
python clone/qa/decode-smoke.py clone/evidence/smoke
```

## Resumed work and defects fixed

Starting revision: `87e1c8458873c59e59fab6386c491db92c2d9556`.

- Added an actual clone UI and lawful pack-free sample path.
- Fixed black output: `pixelate` fed float RGB triples into an RGBA-byte median-cut
  interface. A regression test now asserts finite palettes and nonblack output.
- Fixed GIF transparency disposal so vanished particles do not leave trails.
- Removed shell execution, unpinned downloads, hard-coded Windows paths and
  effect-ID JavaScript interpolation from the launcher.
- Startup failures and render timeout now return nonzero instead of hanging or
  reporting success on signal termination.
- Resource loading shares one texture/mesh cache; cleanup runs on failures too.
- Added bounded render-option validation and authored pack-input tests.

Passing self-tests establish clone correctness for their cases, not reference
numerical or visual parity. Vendor assets are intentionally absent. Root
`PARITY.md` describes the older original editor, not acceptance of this new app.

## Uploaded-pack QA

The follow-up actual-pack test uses `node clone/qa/vendor-pack-smoke.mjs` from
the repository root, with HUN0FX_PAK and CLONE_CHROME set. It checks three named
effects at two sizes, not the full catalog. The validated texture loader now
uses normal image upload so Three.js applies texture Y orientation correctly.
See QA-RESULTS.md for the measured comparison limits. Keep pack files private.
