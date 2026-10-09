# Make your own particle effect

Serve the repository on loopback as described in README.md and open
`http://127.0.0.1:8123/clone/author.html`. Clone Lab's "Create an effect" link
opens this page. No vendor pack or code editing is required for the basic workflow.

1. Press New effect, name the project and choose its ID. The ID becomes the name
   used by the clone's effect catalog.
2. Start with one particle layer. Choose burst count or emission rate, lifetime,
   speed, size, color and spawn shape. Set layer position, delay, gravity,
   emission duration and whether emission loops. Add or duplicate layers for
   smoke, sparks or another part of the effect. Up to 16 layers are supported.
3. Enable Size curve to change size over particle lifetime. Times run from 0
   (birth) to 1 (death); values are size multipliers. Add/remove intermediate
   keys. Curve tangents default to zero; Advanced layer JSON exposes tangents.
4. Enable Color curve for lifetime colors and alpha fade. Add/remove keys and
   edit their times, colors and opacity. These colors multiply the particle's
   base color. A white starting color preserves the base; alpha zero makes it
   invisible. Key times must increase.
5. Auto preview captures after a short debounce. Render now captures immediately.
   Pause/play or scrub to inspect the sequence. Empty/invalid captures report an
   error rather than inventing a valid result. This previews captured frames,
   not a permanent live simulation.
6. Save project downloads editable JSON, including owned asset bytes. Load project
   restores it. Save the download somewhere safe: no implicit browser persistence
   or server storage. Destructive replace/new asks about unsaved edits.
7. Export .pak writes manifest.json, effect JSON and asset files into a validated
   H0PK container. Select that downloaded .pak in Clone Lab to render it again.
   Our-clone compatibility is tested; original vendor-app compatibility is not.

GIF and PNG-sheet export use the same captured frames. The pack contains editable
runtime data/assets, not those pre-rendered GIFs. It is your source, not just an
animation export.

## Your images and meshes

Import a PNG/WebP/JPEG transparent texture, then select it in a layer's Texture
control. White/no texture is enough for simple solid particles. A layer may select
an imported triangle mesh instead of the built-in billboard. Mesh JSON fields:
`pos` xyz floats, `uv` uv floats, `idx` triangle vertex indices and optional `nrm`
xyz normals. Invalid dimensions/indices reject. This does not import arbitrary
FBX/OBJ models. Image limit is 4096 pixels per side, file limit 8 MiB. Project asset
budget is 24 MiB, mesh size is bounded. Assets stay in browser memory/downloads;
there is no upload. Use only assets you own or have permission to use.

Advanced layer JSON exposes the supported emitter schema. Basic controls replace
only the fields they edit. Some advanced scalar branches lack a graphical editor;
the panel notes that and preserves them until that field is edited. Unsupported
shader/parameter combinations are not certified by saving a JSON object.

## Scope

This is a particle/emitter authoring interface, not frame-by-frame painting,
node graphs or a general 3D modeling tool. Full arbitrary vendor-project import,
original-app compatibility and physical Windows/GPU certification are separate.
The project format is `clone-author-project` version 1. Validation errors show
without overwriting a successfully loaded project.

Reproducible QA: `bun run author-smoke` from clone/ with CLONE_CHROME pointing to
local Chrome/Chromium and optional CLONE_PYTHON. QA uses software WebGL and loopback
port 8124; its own authored texture/mesh fixture never reads a vendor pack.
