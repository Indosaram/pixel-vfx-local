export function applyWireVariant(base, patch) {
  return {
    ...base,
    ...patch.top,
    emitters: base.emitters.map((e, i) =>
      (patch.emitters[i] ? { ...e, ...patch.emitters[i] } : e)),
  };
}

export function appendWireMix(definition, source, mix) {
  const out = {
    ...definition,
    emitters: [...definition.emitters],
    roles: [...(definition.roles || definition.emitters.map(() => null))],
    textures: [...definition.textures],
    meshes: [...definition.meshes],
  };
  source.emitters.forEach((e, i) => {
    if (mix.layers && !mix.layers.includes(e.name)) return;
    const c = structuredClone(e);
    if (mix.delay) {
      const d = c.delay || { t: 'c', v: 0 };
      c.delay = d.t === 'r'
        ? { ...d, a: d.a + mix.delay, b: d.b + mix.delay }
        : { t: 'c', v: (d.v || 0) + mix.delay };
    }
    if (mix.scale && mix.scale !== 1) {
      const k = mix.scale;
      c.scale = { x: c.scale.x * k, y: c.scale.y * k, z: c.scale.z * k };
      c.pos = { x: c.pos.x * k, y: c.pos.y * k, z: c.pos.z * k };
    }
    if (mix.pos) c.pos = { x: c.pos.x + mix.pos[0], y: c.pos.y + mix.pos[1], z: c.pos.z + mix.pos[2] };
    if (mix.loop !== undefined) c.loop = !!mix.loop;
    out.emitters.push(c);
    out.roles.push((source.roles || [])[i] || null);
    for (const t of Object.values(c.render?.mat?.tex || {})) {
      if (t && !out.textures.includes(t)) out.textures.push(t);
    }
    if (c.render?.mode === 4 && c.render.mesh && !out.meshes.includes(c.render.mesh)) {
      out.meshes.push(c.render.mesh);
    }
  });
  return out;
}
