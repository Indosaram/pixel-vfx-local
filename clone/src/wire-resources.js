import * as THREE from 'three';

export function createWireResources({ textures, meshes, readJson, loadTexture: loadFile, anisotropy = 4 }) {
  const texCache = new Map();
  const geoCache = new Map();
  const white = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat);
  white.needsUpdate = true;
  const quad = new THREE.PlaneGeometry(1, 1);
  const timeU = { value: 0 };
  let disposed = false;

  function loadTexture(name) {
    if (texCache.has(name)) return texCache.get(name).promise;
    const meta = textures[name];
    const rec = { tex: null, promise: null };
    rec.promise = loadFile(meta.file).then(t => {
      t.wrapS = t.wrapT = meta.clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
      t.anisotropy = anisotropy;
      t.colorSpace = THREE.NoColorSpace;
      rec.tex = t;
      if (disposed) t.dispose();
      return t;
    });
    texCache.set(name, rec);
    return rec.promise;
  }

  async function loadMesh(name) {
    if (geoCache.has(name)) return geoCache.get(name);
    const pending = readJson(meshes[name].file).then(m => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(m.pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(m.uv, 2));
      g.setIndex(m.idx);
      if (m.nrm) g.setAttribute('normal', new THREE.Float32BufferAttribute(m.nrm, 3));
      else g.computeVertexNormals();
      geoCache.set(name, g);
      if (disposed) g.dispose();
      return g;
    });
    geoCache.set(name, pending);
    return pending;
  }

  const texture = name => texCache.get(name)?.tex || null;
  const srgb = name => !!textures[name]?.srgb;
  const geometry = name => geoCache.get(name);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    for (const rec of texCache.values()) if (rec.tex) rec.tex.dispose();
    for (const value of geoCache.values()) if (value.isBufferGeometry) value.dispose();
    quad.dispose();
    white.dispose();
  };
  return { loadTexture, loadMesh, texture, srgb, geometry, white, quad, timeU, dispose };
}
