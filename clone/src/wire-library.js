import { applyWireVariant, appendWireMix } from './wire-library-mix.js';

export function createWireLibrary({ readJson, loadTexture, loadMesh }) {
  let manifest = null;
  let variants = null;
  const defs = new Map();
  const pending = new Map();
  const info = id => manifest?.effects?.find(e => e.id === id) || null;

  async function init() {
    if (!manifest) manifest = readJson('manifest.json');
    manifest = await manifest;
    return api;
  }

  function list(filter = {}) {
    if (!manifest || manifest instanceof Promise) throw new Error('call await init() or load() first');
    return manifest.effects
      .filter(e => Object.entries(filter).every(([k, v]) => e[k] === v))
      .map(e => e.id);
  }

  function loadOne(id) {
    if (defs.has(id)) return Promise.resolve(defs.get(id));
    if (pending.has(id)) return pending.get(id);
    const entry = info(id);
    if (!entry) return Promise.reject(new Error(`unknown effect "${id}"`));
    const p = (async () => {
      let def;
      if (entry.base) {
        variants ??= readJson(entry.file);
        const [bundle, baseDef] = await Promise.all([variants, readJson(info(entry.base).file)]);
        def = applyWireVariant(baseDef, bundle[id]);
      } else def = await readJson(entry.file);
      if (entry.mix) {
        def = {
          ...def,
          emitters: [...def.emitters],
          roles: [...(def.roles || def.emitters.map(() => null))],
          textures: [...def.textures],
          meshes: [...def.meshes],
        };
        for (const m of entry.mix) {
          const src = info(m.from);
          const d = src.base ? await loadOne(m.from) : await readJson(src.file);
          def = appendWireMix(def, d, m);
        }
      }
      await Promise.all([
        ...def.textures.map(t => loadTexture(t)),
        ...def.meshes.map(m => loadMesh(m)),
      ]);
      defs.set(id, def);
      pending.delete(id);
      return def;
    })();
    pending.set(id, p);
    return p;
  }

  async function load(ids) {
    await init();
    const wanted = Array.isArray(ids) ? ids : [ids];
    await Promise.all(wanted.map(id => loadOne(id)));
    return api;
  }

  const api = { init, load, info, list, getDefinition: id => defs.get(id) };
  return api;
}
