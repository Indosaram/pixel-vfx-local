import { Group } from 'three';
import { WireEffect } from './wire-effect.js';
import { createRenderParts } from './wire-geometry.js';
import { syncWorld } from './wire-world.js';
import { writeInstances } from './wire-instances.js';
import { writeTrails } from './wire-trails.js';

export function createWireScene(definition, resources, uniforms, makeMaterial, onFinished) {
  const parent = new Group();
  let parts = [];
  const hasMat = (ed) => ed.render.mat;
  const filtered = definition.emitters.filter(hasMat);
  const clock = new WireEffect(filtered, {
    syncWorld: () => syncWorld(parent, parts),
    write: (_, camera) => {
      for (const part of parts) {
        writeInstances(part, camera);
        if (part.trail) writeTrails(part);
      }
    },
    finished: () => onFinished(scene),
  });
  const simulations = [];
  let k = 0;
  definition.emitters.forEach((ed, idx) => {
    if (hasMat(ed)) simulations[idx] = clock.parts[k++];
  });
  parts = createRenderParts(definition, simulations, resources, uniforms, makeMaterial, parent);
  const scene = { group: parent, clock, parts };
  return scene;
}
