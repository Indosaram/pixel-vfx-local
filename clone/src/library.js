function invalid(code, message, context) {
  return { code, stage: 'library', message, context };
}

function safePath(path) {
  if (typeof path !== 'string' || !path || /[\\:]/.test(path)
      || path.split('/').some(part => !part || part === '.' || part === '..')) {
    throw invalid('INVALID_PATH', 'Expected a confined relative path', { path });
  }
  return path;
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Clone-owned patch/mix schema; reference JSON compatibility remains unspecified.
export function resolveVariant(base, variant) {
  const result = structuredClone(base);
  result.id = variant.id;
  for (const { index, patch } of variant.layers) {
    if (!Number.isInteger(index) || index < 0 || index >= result.emitters.length) {
      throw invalid('INVALID_LAYER', 'Variant layer index is outside the definition', { index });
    }
    result.emitters[index] = { ...result.emitters[index], ...structuredClone(patch) };
  }
  result.assets = [...new Set([...base.assets, ...(variant.assets ?? [])])];
  return result;
}

export function resolveMix(id, layers) {
  const emitters = [], assets = new Set();
  for (const layer of layers) {
    const indexes = layer.indices ?? layer.definition.emitters.map((_, index) => index);
    for (const index of indexes) {
      if (!Number.isInteger(index) || index < 0 || index >= layer.definition.emitters.length) {
        throw invalid('INVALID_LAYER', 'Mix layer index is outside the definition', { index });
      }
      const emitter = structuredClone(layer.definition.emitters[index]);
      const scale = layer.scale ?? 1;
      emitter.delay = (emitter.delay ?? 0) + (layer.delay ?? 0);
      emitter.position = (emitter.position ?? [0, 0, 0]).map((value, axis) => value * scale + (layer.position?.[axis] ?? 0));
      emitter.scale = (emitter.scale ?? [1, 1, 1]).map(value => value * scale);
      emitters.push(emitter);
    }
    for (const asset of layer.definition.assets) assets.add(asset);
  }
  return { id, emitters, assets: [...assets] };
}

export function createLibrary(resolver) {
  const definitions = new Map();
  const pending = new Map();
  function loadDefinition(id) {
    if (typeof id !== 'string' || !/^[A-Za-z0-9_-]+$/.test(id)) {
      return Promise.reject(invalid('INVALID_ID', 'Invalid definition identifier', { id }));
    }
    if (definitions.has(id)) return Promise.resolve(definitions.get(id));
    if (pending.has(id)) return pending.get(id);
    const operation = Promise.resolve().then(() => resolver.read(`definitions/${id}.json`)).then(bytes => {
      let definition;
      try { definition = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
      catch { throw invalid('INVALID_DEFINITION', 'Definition is not valid UTF-8 JSON', { id }); }
      if (!isObject(definition) || definition.id !== id
          || typeof definition.duration !== 'number' || !Number.isFinite(definition.duration)
          || typeof definition.loop !== 'boolean'
          || !Array.isArray(definition.emitters)
          || definition.emitters.some(emitter => !isObject(emitter))
          || !Array.isArray(definition.assets)
          || !isObject(definition.placement)) {
        throw invalid('INVALID_DEFINITION', 'Definition requires matching id, duration, loop, emitters, assets and placement', { id });
      }
      definitions.set(id, definition);
      return definition;
    }).catch(error => {
      if (error?.stage === 'library') throw error;
      throw invalid('ASSET_READ_FAILED', String(error?.message ?? error), { id });
    }).finally(() => pending.delete(id));
    pending.set(id, operation);
    return operation;
  }
  async function loadAssets(paths) {
    const checked = paths.map(safePath);
    return Promise.all(checked.map(async path => {
      try { return await resolver.read(path); }
      catch (error) { throw invalid('ASSET_READ_FAILED', String(error?.message ?? error), { path }); }
    }));
  }
  return { loadDefinition, loadAssets };
}
