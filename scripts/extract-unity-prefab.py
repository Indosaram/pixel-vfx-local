#!/usr/bin/env python3
import argparse
import hashlib
import json
import struct
import sys
import zlib
from pathlib import Path

try:
    import UnityPy
except ImportError:
    sys.exit("UnityPy is required: python -m pip install UnityPy")

SHAPE_TYPES_56 = {
    0: "Sphere", 1: "SphereShell", 2: "Hemisphere", 3: "HemisphereShell",
    4: "Cone", 5: "Box", 6: "Mesh", 7: "ConeShell", 8: "ConeVolume",
    9: "ConeVolumeShell", 10: "Circle", 11: "CircleEdge", 12: "SingleSidedEdge",
    13: "MeshRenderer", 14: "SkinnedMeshRenderer", 15: "BoxShell", 16: "BoxEdge",
}


def nibble_guid(raw):
    if isinstance(raw, str):
        return raw
    return bytes(((b & 0x0F) << 4) | (b >> 4) for b in bytes(raw)).hex()


def pairs(v):
    if isinstance(v, dict):
        return list(v.items())
    if isinstance(v, list):
        out = []
        for item in v:
            if isinstance(item, (list, tuple)) and len(item) == 2:
                out.append((item[0], item[1]))
            elif isinstance(item, dict) and "first" in item:
                out.append((item.get("first"), item.get("second")))
        return out
    return []


def curve_keys(mc):
    if not isinstance(mc, dict):
        return []
    return [
        {"t": k.get("time"), "v": k.get("value"),
         "inSlope": k.get("inSlope"), "outSlope": k.get("outSlope")}
        for k in mc.get("m_Curve", [])
    ]


def minmax(mc):
    if not isinstance(mc, dict):
        return None
    return {"state": mc.get("minMaxState"), "min": mc.get("minScalar"),
            "max": mc.get("scalar")}


def gradient_keys(mg):
    if not isinstance(mg, dict):
        return {"colorKeys": [], "alphaKeys": []}
    n = mg.get("m_NumColorKeys", 0)
    na = mg.get("m_NumAlphaKeys", 0)
    colors = []
    for i in range(n):
        k = mg.get(f"key{i}") or {}
        t = mg.get(f"ctime{i}", 0)
        colors.append({"t": t / 65535.0, "rgb": [k.get("r"), k.get("g"), k.get("b")]})
    alphas = []
    for i in range(na):
        k = mg.get(f"key{i}") or {}
        t = mg.get(f"atime{i}", 0)
        alphas.append({"t": t / 65535.0, "a": k.get("a")})
    return {"colorKeys": colors, "alphaKeys": alphas, "mode": mg.get("m_Mode")}


def encode_tool_png(rgba, width, height):
    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    stride = width * 4
    raw = b"".join(b"\x00" + bytes(rgba[y * stride:(y + 1) * stride]) for y in range(height))
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr)
            + chunk(b"IDAT", zlib.compress(raw, 0)) + chunk(b"IEND", b""))


def load_objects(path):
    env = UnityPy.load(str(path))
    out = {}
    for obj in env.objects:
        out.setdefault(obj.type.name, []).append(obj)
    return env, out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--assets", required=True, help="extracted Assets root")
    ap.add_argument("--prefab", required=True, help="prefab path relative to --assets")
    ap.add_argument("--manifest", required=True, help="unitypackage manifest.json")
    ap.add_argument("--source-url", default="https://kenney.nl/assets/particle-pack")
    ap.add_argument("--source-license", default="CC0-1.0")
    ap.add_argument("--out", required=True)
    ap.add_argument("--texture-out", default=None,
                    help="lossless tool-readable copy of the material main texture")
    args = ap.parse_args()

    assets = Path(args.assets)
    prefab_path = assets / args.prefab
    manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
    guid2path = {e["guid"]: e["path"] for e in manifest}

    env, objs = load_objects(prefab_path)
    ps_obj = objs["ParticleSystem"][0]
    unity_version = getattr(ps_obj.assets_file, "unity_version", None)

    ps = ps_obj.read_typetree()
    ren = objs["ParticleSystemRenderer"][0].read_typetree()
    go = objs["GameObject"][0].read_typetree()
    tr = objs["Transform"][0].read_typetree()

    init = ps["InitialModule"]
    shape = ps["ShapeModule"]
    emis = ps["EmissionModule"]
    colmod = ps["ColorModule"]
    sizemod = ps["SizeModule"]
    rotmod = ps["RotationModule"]
    noise = ps["NoiseModule"]

    disabled = []
    for name, mod in ps.items():
        if name.endswith("Module") and isinstance(mod, dict) and "enabled" in mod:
            if not mod["enabled"]:
                disabled.append(name)

    start_color = init["startColor"]
    exts = [e.guid for e in ps_obj.assets_file.externals]
    materials = []
    for m in ren.get("m_Materials") or []:
        fid = m.get("m_FileID", 0)
        if not fid or fid > len(exts):
            continue
        mat_guid = nibble_guid(exts[fid - 1])
        mat_rel = guid2path.get(mat_guid)
        entry = {"fileID": fid, "guid": mat_guid, "path": mat_rel}
        if mat_rel:
            mpath = assets.parent / mat_rel if not mat_rel.startswith("Assets") else assets / mat_rel[len("Assets/"):]
            if not mpath.exists():
                mpath = Path(args.assets).parent / mat_rel
            menv, mobjs = load_objects(mpath)
            mat_obj = mobjs["Material"][0]
            mt = mat_obj.read_typetree()
            mexts = [e.guid for e in mat_obj.assets_file.externals]
            props = mt.get("m_SavedProperties", {})
            tex = dict(pairs(props.get("m_TexEnvs", [])))
            main = (tex.get("_MainTex") or {}).get("m_Texture", {})
            tfid = main.get("m_FileID", 0)
            tex_rel = None
            tex_guid = None
            if tfid and tfid <= len(mexts):
                tex_guid = nibble_guid(mexts[tfid - 1])
                tex_rel = guid2path.get(tex_guid)
            floats = dict(pairs(props.get("m_Floats", [])))
            colors = dict(pairs(props.get("m_Colors", [])))
            shader = mt.get("m_Shader", {})
            entry.update({
                "materialName": mt.get("m_Name"),
                "shaderBuiltinFileID": shader.get("m_FileID"),
                "shaderBuiltinPathID": shader.get("m_PathID"),
                "mainTexture": {"guid": tex_guid, "path": tex_rel},
                "blend": {"srcBlend": floats.get("_SrcBlend"),
                          "dstBlend": floats.get("_DstBlend"),
                          "zWrite": floats.get("_ZWrite"),
                          "mode": floats.get("_Mode")},
                "tint": colors.get("_TintColor"),
            })
        materials.append(entry)

    texture_path = None
    texture_sha256 = None
    texture_size = None
    texture_rgba_sha256 = None
    texture_copy = None
    texture_copy_sha256 = None
    if materials and materials[0].get("mainTexture", {}).get("path"):
        rel = materials[0]["mainTexture"]["path"]
        texture_path = assets / rel
        if not texture_path.exists():
            texture_path = Path(args.assets).parent / rel
        if texture_path.exists():
            blob = texture_path.read_bytes()
            texture_sha256 = hashlib.sha256(blob).hexdigest()
            texture_size = list(struct.unpack(">II", blob[16:24]))
            from PIL import Image
            img = Image.open(texture_path).convert("RGBA")
            rgba = img.tobytes()
            texture_rgba_sha256 = hashlib.sha256(rgba).hexdigest()
            if args.texture_out:
                copy = Path(args.texture_out)
                copy.parent.mkdir(parents=True, exist_ok=True)
                copy.write_bytes(encode_tool_png(rgba, img.width, img.height))
                texture_copy = str(copy).replace("\\", "/")
                texture_copy_sha256 = hashlib.sha256(copy.read_bytes()).hexdigest()
                back = Image.open(copy)
                if back.tobytes() != rgba:
                    sys.exit("texture copy is not pixel-identical to the original")

    size_curve = sizemod.get("size", {})
    if not isinstance(size_curve, dict) or "maxCurve" not in size_curve:
        size_curve = sizemod.get("y", {})

    report = {
        "source": {
            "asset": "Kenney Particle Pack",
            "url": args.source_url,
            "license": args.source_license,
            "downloadedOn": "owner-local kenney_particle-pack.zip archive (pack URL + zipSha256 pinned in examples/manifest.json)",
            "unitypackage": "Unity samples/particlePack_samples.unitypackage",
            "prefab": str(prefab_path).replace("\\", "/"),
            "unitySerializedVersion": unity_version,
        },
        "gameObject": go.get("m_Name"),
        "transform": {
            "position": tr.get("m_LocalPosition"),
            "rotation": tr.get("m_LocalRotation"),
            "eulerAngles": tr.get("m_LocalEulerAnglesHint"),
            "scale": tr.get("m_LocalScale"),
        },
        "system": {
            "lengthInSec": ps.get("lengthInSec"),
            "simulationSpeed": ps.get("simulationSpeed"),
            "looping": ps.get("looping"),
            "prewarm": ps.get("prewarm"),
            "playOnAwake": ps.get("playOnAwake"),
            "randomSeed": ps.get("randomSeed"),
            "autoRandomSeed": ps.get("autoRandomSeed"),
            "moveWithTransform": ps.get("moveWithTransform"),
            "scalingMode": ps.get("scalingMode"),
            "startDelay": minmax(ps.get("startDelay")),
        },
        "initial": {
            "startLifetime": minmax(init.get("startLifetime")),
            "startSpeed": minmax(init.get("startSpeed")),
            "startSize": minmax(init.get("startSize")),
            "startRotation": minmax(init.get("startRotation")),
            "startColor": {
                "state": start_color.get("minMaxState"),
                "min": start_color.get("minColor"),
                "max": start_color.get("maxColor"),
            },
            "gravityModifier": minmax(init.get("gravityModifier")),
            "maxNumParticles": init.get("maxNumParticles"),
            "rotation3D": init.get("rotation3D"),
            "size3D": init.get("size3D"),
        },
        "shape": {
            "type": shape.get("type"),
            "typeMeaning": SHAPE_TYPES_56.get(shape.get("type"), "unknown"),
            "radius": shape.get("radius", {}).get("value") if isinstance(shape.get("radius"), dict) else shape.get("radius"),
            "angle": shape.get("angle"),
            "arc": shape.get("arc", {}).get("value") if isinstance(shape.get("arc"), dict) else shape.get("arc"),
            "length": shape.get("length"),
            "alignToDirection": shape.get("alignToDirection"),
            "randomDirectionAmount": shape.get("randomDirectionAmount"),
            "sphericalDirectionAmount": shape.get("sphericalDirectionAmount"),
            "placementMode": shape.get("placementMode"),
        },
        "emission": {
            "enabled": emis.get("enabled"),
            "rateOverTime": minmax(emis.get("rateOverTime")),
            "rateOverDistance": minmax(emis.get("rateOverDistance")),
            "bursts": emis.get("m_Bursts"),
            "burstCount": emis.get("m_BurstCount"),
        },
        "colorOverLifetime": {
            "enabled": colmod.get("enabled"),
            **gradient_keys((colmod.get("gradient") or {}).get("maxGradient")),
        },
        "sizeOverLifetime": {
            "enabled": sizemod.get("enabled"),
            "curve": curve_keys(size_curve.get("maxCurve")),
            "state": size_curve.get("minMaxState"),
        },
        "rotationOverLifetime": {
            "enabled": rotmod.get("enabled"),
            "angularVelocityX": minmax(rotmod.get("x")),
            "angularVelocityY": minmax(rotmod.get("y")),
        },
        "noise": {
            "enabled": noise.get("enabled"),
            "strength": (noise.get("strength") or {}).get("scalar"),
            "frequency": noise.get("frequency"),
            "octaves": noise.get("octaves"),
            "octaveScale": noise.get("octaveScale"),
            "octaveMultiplier": noise.get("octaveMultiplier"),
            "damping": noise.get("damping"),
            "scrollSpeed": (noise.get("scrollSpeed") or {}).get("scalar"),
            "quality": noise.get("quality"),
            "separateAxes": noise.get("separateAxes"),
        },
        "disabledModules": sorted(set(disabled)),
        "renderer": {
            "renderMode": ren.get("m_RenderMode"),
            "sortMode": ren.get("m_SortMode"),
            "minParticleSize": ren.get("m_MinParticleSize"),
            "maxParticleSize": ren.get("m_MaxParticleSize"),
            "pivot": ren.get("m_Pivot"),
        },
        "materials": materials,
        "texture": {
            "path": str(texture_path).replace("\\", "/") if texture_path else None,
            "sha256": texture_sha256,
            "sha256Rgba": texture_rgba_sha256,
            "size": texture_size,
            "convertedPath": texture_copy,
            "convertedSha256": texture_copy_sha256,
        },
    }

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=1) + "\n", encoding="utf-8")
    print("WROTE", out)


if __name__ == "__main__":
    main()
