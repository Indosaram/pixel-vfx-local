#!/usr/bin/env python3
"""Build per-example render configs and tool-readable textures.

Inputs
  examples/manifest.json         the ten examples (ids, source sprites, motion prefabs)
  examples/prefabs/*.json        shipped normalised conversion records (default motion
                                 source; machine-independent paths)
  --extract-dir/<Motion>.json    optional: UnityPy outputs of scripts/extract-unity-prefab.py
                                 to re-derive the normalised records from the pack
  examples/src-sprites/*.png     source sprites, byte-identical to the Kenney pack

Outputs (inside the repo)
  examples/prefabs/<Motion>.json normalised conversion records (machine-independent paths)
  examples/<id>.json             per-example render config for scripts/render-unity-asset.mjs
  examples/textures/<id>.png     tool-readable (filter-0, stored-deflate) texture copy

Every source sprite's sha256 must match the pin in the manifest; the converted
texture is verified to decode back to the exact RGBA of its source sprite.
Requires Pillow only: python -m pip install pillow
"""
import argparse
import copy
import hashlib
import json
import struct
import sys
import zlib
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required: python -m pip install pillow")

def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def png_chunk(tag: bytes, data: bytes) -> bytes:
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )

def encode_tool_png(rgba: bytes, width: int, height: int) -> bytes:
    """Lossless filter-0 stored-deflate PNG readable by src/pngenc.js decodePNG."""
    raw = bytearray()
    stride = width * 4
    for y in range(height):
        raw.append(0)
        raw += rgba[y * stride : (y + 1) * stride]
    comp = zlib.compress(bytes(raw), 0)
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    return (
        b"\x89PNG\r\n\x1a\n"
        + png_chunk(b"IHDR", ihdr)
        + png_chunk(b"IDAT", comp)
        + png_chunk(b"IEND", b"")
    )

def normalize_prefab_path(p: str) -> str:

    if p.startswith("Assets/"):
        return p
    idx = p.replace("\\", "/").rfind("/Assets/")
    if idx >= 0:
        return p.replace("\\", "/")[idx + 1 :]
    return p

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--manifest", default="examples/manifest.json")
    ap.add_argument("--extract-dir", default=None,
                    help="directory holding <Motion>.json outputs of extract-unity-prefab.py; "
                         "omit to build from the shipped normalised records in --prefabs-out")
    ap.add_argument("--sprites", default="examples/src-sprites")
    ap.add_argument("--prefabs-out", default="examples/prefabs")
    ap.add_argument("--textures-out", default="examples/textures")
    ap.add_argument("--configs-out", default="examples")
    args = ap.parse_args()

    manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
    failures = []

    motion_records = {}
    for m in sorted({e["motion"] for e in manifest["examples"]}):
        if args.extract_dir:
            src = Path(args.extract_dir) / f"{m}.json"
        else:
            src = Path(args.prefabs_out) / f"{m}.json"
        if not src.exists():
            failures.append(
                f"missing {'extract output' if args.extract_dir else 'shipped record'}: {src}"
                + ("" if args.extract_dir else " (pass --extract-dir to regenerate from the pack)")
            )
            continue
        rec = json.loads(src.read_text(encoding="utf-8"))
        if rec.get("texture", {}).get("path"):
            rec["texture"]["path"] = normalize_prefab_path(rec["texture"]["path"])
        rec["texture"].pop("convertedPath", None)
        if rec.get("source", {}).get("prefab"):
            rec["source"]["prefab"] = normalize_prefab_path(rec["source"]["prefab"])
        rec["source"]["extractedBy"] = "scripts/extract-unity-prefab.py"
        rec["source"].pop("downloadedOn", None)
        rec["source"]["download"] = manifest["pack"]["download"]
        out = Path(args.prefabs_out) / f"{m}.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(rec, indent="\t") + "\n", encoding="utf-8")
        motion_records[m] = rec
        print(f"RECORD {m:12s} -> {out}")

    for ex in manifest["examples"]:
        ex_id, motion = ex["id"], ex["motion"]
        sprite_path = Path(args.sprites) / ex["sprite"]
        if ex_id is None or not sprite_path.exists():
            failures.append(f"{ex_id}: missing sprite {sprite_path}")
            continue
        sprite_bytes = sprite_path.read_bytes()
        actual = sha256_hex(sprite_bytes)
        if actual != ex["spriteSha256"]:
            failures.append(
                f"{ex_id}: sprite sha256 mismatch pin={ex['spriteSha256']} actual={actual}"
            )
            continue

        with Image.open(sprite_path) as im:
            rgba_im = im.convert("RGBA")
            width, height = rgba_im.size
            rgba = rgba_im.tobytes()
        rgba_sha = sha256_hex(rgba)

        tex_bytes = encode_tool_png(rgba, width, height)
        tex_path = Path(args.textures_out) / f"{ex_id}.png"
        tex_path.parent.mkdir(parents=True, exist_ok=True)
        tex_path.write_bytes(tex_bytes)
        with Image.open(tex_path) as im2:
            if im2.convert("RGBA").tobytes() != rgba:
                failures.append(f"{ex_id}: converted texture is not RGBA-identical")
                continue

        rec = motion_records.get(motion)
        if rec is None:
            failures.append(f"{ex_id}: motion record {motion} unavailable")
            continue
        cfg = copy.deepcopy(rec)
        cfg["texture"] = {
            "path": f"examples/src-sprites/{ex['sprite']}",
            "packPath": ex["spritePackPath"],
            "sha256": actual,
            "sha256Rgba": rgba_sha,
            "convertedPath": f"examples/textures/{ex_id}.png",
            "size": [width, height],
        }
        src = dict(cfg.get("source", {}))
        src.update(
            {
                "kind": ex["kind"],
                "spriteFile": ex["sprite"],
                "spritePackPath": ex["spritePackPath"],
                "spriteSha256": actual,
                "conversionRecord": f"examples/prefabs/{motion}.json",
                "renderConfig": f"examples/{ex_id}.json",
                "renderer": "scripts/render-unity-asset.mjs (converted renderer; approximate, not Unity)",
                "notes": ex["notes"],
            }
        )
        src.pop("downloadedOn", None)
        src["download"] = manifest["pack"]["download"]
        cfg["source"] = src
        cfg_path = Path(args.configs_out) / f"{ex_id}.json"
        cfg_path.write_text(json.dumps(cfg, indent="\t") + "\n", encoding="utf-8")
        print(
            f"CONFIG {ex_id:12s} kind={ex['kind']:22s} motion={motion:12s} "
            f"sprite={ex['sprite']:24s} sha={actual[:12]} rgba={rgba_sha[:12]} "
            f"tex={tex_path} ({len(tex_bytes)} B)"
        )

    if failures:
        print("FAILED:", file=sys.stderr)
        for f in failures:
            print(" -", f, file=sys.stderr)
        return 1
    print(f"OK {len(manifest['examples'])} examples configured")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
