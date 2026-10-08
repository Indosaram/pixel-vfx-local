import { scalarWire } from './wire-curves.js';

export function advanceParticles(definition, particles, dt, systemTime, trailPoint) {
  const grav = -9.81 * scalarWire(definition.grav, 0, 0);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.age += dt;
    if (p.age >= p.life) { particles.splice(i, 1); continue; }
    const t = p.age / p.life, v = p.vel;
    v[1] += grav * dt;
    if (definition.forceOL) {
      v[0] += scalarWire(definition.forceOL.x, t, p.r[3]) * dt;
      v[1] += scalarWire(definition.forceOL.y, t, p.r[3]) * dt;
      v[2] += scalarWire(definition.forceOL.z, t, p.r[3]) * dt;
    }
    if (definition.clamp) {
      const sp = Math.hypot(v[0], v[1], v[2]);
      if (sp > 1e-6) {
        let ns = sp;
        const mag = scalarWire(definition.clamp.mag, t, p.r[4]);
        if (ns > mag) ns = mag + (ns - mag) * Math.pow(1 - definition.clamp.dampen, dt * 30);
        const drag = scalarWire(definition.clamp.drag, t, p.r[4]);
        if (drag > 0) ns *= Math.exp(-drag * dt);
        const k = ns / sp; v[0] *= k; v[1] *= k; v[2] *= k;
      }
    }
    const ox0 = p.pos[0], oy0 = p.pos[1], oz0 = p.pos[2];
    let ex = 0, ey = 0, ez = 0, sm = 1;
    const VO = definition.velOL;
    if (VO) {
      ex = scalarWire(VO.x, t, p.r[5]); ey = scalarWire(VO.y, t, p.r[5]);
      ez = scalarWire(VO.z, t, p.r[5]); sm = scalarWire(VO.speedModifier, t, p.r[5]);
    }
    p.pos[0] += (v[0] + ex) * sm * dt; p.pos[1] += (v[1] + ey) * sm * dt; p.pos[2] += (v[2] + ez) * sm * dt;
    if (VO) {
      const ox = scalarWire(VO.orbitalX, t, p.r[5]), oy = scalarWire(VO.orbitalY, t, p.r[5]);
      const oz = scalarWire(VO.orbitalZ, t, p.r[5]), rad = scalarWire(VO.radial, t, p.r[5]);
      const cx = scalarWire(VO.orbitalOffsetX, t, 0), cy = scalarWire(VO.orbitalOffsetY, t, 0);
      const cz = scalarWire(VO.orbitalOffsetZ, t, 0);
      if (ox || oy || oz || rad) {
        let x = p.pos[0] - cx, y = p.pos[1] - cy, z = p.pos[2] - cz, a, c, s;
        if (ox) { a = ox * sm * dt; c = Math.cos(a); s = Math.sin(a); [y, z] = [y * c - z * s, y * s + z * c]; }
        if (oy) { a = oy * sm * dt; c = Math.cos(a); s = Math.sin(a); [x, z] = [x * c + z * s, -x * s + z * c]; }
        if (oz) { a = oz * sm * dt; c = Math.cos(a); s = Math.sin(a); [x, y] = [x * c - y * s, x * s + y * c]; }
        if (rad) { const l = Math.hypot(x, y, z); if (l > 1e-5) { const k = 1 + rad * sm * dt / l; x *= k; y *= k; z *= k; } }
        p.pos[0] = x + cx; p.pos[1] = y + cy; p.pos[2] = z + cz;
      }
    }
    if (definition.noise) {
      const st = scalarWire(definition.noise.str, t, p.r[6]), f = definition.noise.freq;
      const q = p.pos, s = p.seed, T = p.age * 2;
      p.pos[0] += Math.sin(q[1] * f * 3.1 + s + T * 1.7) * st * dt;
      p.pos[1] += Math.sin(q[2] * f * 2.7 + s * 1.3 + T * 1.3) * st * dt;
      p.pos[2] += Math.sin(q[0] * f * 2.9 + s * 1.7 + T * 1.9) * st * dt;
    }
    if (dt > 1e-6) {
      const tv = p.tv || (p.tv = [0, 0, 0]);
      tv[0] = (p.pos[0] - ox0) / dt; tv[1] = (p.pos[1] - oy0) / dt; tv[2] = (p.pos[2] - oz0) / dt;
    }
    if (p.trail) {
      const q = trailPoint(p), L = p.trail, last = L[L.length - 1];
      if (!last || Math.hypot(q[0] - last[0], q[1] - last[1], q[2] - last[2]) >= (definition.trail.minDist || 0.01)) L.push([q[0], q[1], q[2], systemTime]);
      const tl = scalarWire(definition.trail.life, t, p.r[3]) * p.life;
      while (L.length && systemTime - L[0][3] > tl) L.shift();
    }
  }
}
