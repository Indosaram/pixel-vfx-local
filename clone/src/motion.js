// Clone-owned integration boundary: the caller supplies the ordered motion
// operations. This does not supply the report's omitted orbit/noise formulas.
export function stepParticle(particle, dt, integrate) {
  particle.age += dt;
  if (particle.age >= particle.life) return false;
  const previous = [...particle.position];
  integrate(particle, dt);
  if (dt > 1e-6) {
    particle.totalVelocity = particle.position.map((value, axis) => (value - previous[axis]) / dt);
  }
  return true;
}

export function advanceTrail(history, point, time, { minimumDistance, lifetime }) {
  const last = history[history.length - 1];
  if (!last || Math.hypot(...point.map((value, axis) => value - last.position[axis])) >= minimumDistance) {
    history.push({ position: [...point], time });
  }
  let expired = 0;
  while (expired < history.length && time - history[expired].time > lifetime) expired++;
  if (expired) history.splice(0, expired);
  return history;
}
