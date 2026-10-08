import { scalarWire } from './wire-curves.js';
import { colorWire } from './wire-color.js';
import { sampleShape } from './wire-shape.js';

export function spawnParticles(definition, particles, count, localTime, random, worldMatrix = null) {
  const cap = Math.min(definition.max || 1000, 256);
  const sysN = Math.min(1, localTime / Math.max(1e-4, definition.dur));
  const world = definition.space === 1 && worldMatrix;
  const tr = definition.trail;
  for (let i = 0; i < count && particles.length < cap; i++) {
    const S = definition.shape;
    let { pos, dir } = sampleShape(S, random);
    const life = Math.max(0.01, scalarWire(definition.life, sysN, random()));
    const spd = scalarWire(definition.speed, sysN, random());
    const s0 = scalarWire(definition.size, sysN, random());
    const sz = definition.size3D
      ? [s0, scalarWire(definition.sizeY, sysN, random()), scalarWire(definition.sizeZ, sysN, random())]
      : [s0, s0, s0];
    let rz = scalarWire(definition.rotZ, sysN, random());
    if (definition.flipRot && random() < definition.flipRot) rz = -rz;
    let rot = definition.rot3D
      ? [scalarWire(definition.rotX, sysN, random()), scalarWire(definition.rotY, sysN, random()), rz]
      : [0, 0, rz];
    if (S && S.align) {
      const yaw = Math.atan2(dir[0], dir[2]), pitch = -Math.asin(Math.max(-1, Math.min(1, dir[1])));
      rot = [rot[0] + pitch, rot[1] + yaw, rot[2]];
    }
    const col = colorWire(definition.color, sysN, random(), [1, 1, 1, 1]);
    const fl = definition.render.flip || { x: 0, y: 0 };
    let vel = [dir[0] * spd, dir[1] * spd, dir[2] * spd];
    if (world) {
      const m = worldMatrix;
      pos = [m[0] * pos[0] + m[1] * pos[1] + m[2] * pos[2] + m[3],
             m[4] * pos[0] + m[5] * pos[1] + m[6] * pos[2] + m[7],
             m[8] * pos[0] + m[9] * pos[1] + m[10] * pos[2] + m[11]];
      vel = [m[0] * vel[0] + m[1] * vel[1] + m[2] * vel[2],
             m[4] * vel[0] + m[5] * vel[1] + m[6] * vel[2],
             m[8] * vel[0] + m[9] * vel[1] + m[10] * vel[2]];
    }
    const np = {
      age: 0, life, pos, vel, sz, rot, col,
      r: [random(), random(), random(), random(), random(), random(), random(), random()],
      flip: [random() < fl.x ? 1 : 0, random() < fl.y ? 1 : 0],
      seed: random() * 100, rowR: random(),
    };
    if (tr && random() <= (tr.ratio ?? 1)) np.trail = [];
    particles.push(np);
  }
}
