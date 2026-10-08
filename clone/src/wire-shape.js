const DEG = Math.PI / 180;

function rotEuler(v, e) {
  let [x, y, z] = v;
  let a = e.z * DEG, c = Math.cos(a), s = Math.sin(a); [x, y] = [x * c - y * s, x * s + y * c];
  a = e.x * DEG; c = Math.cos(a); s = Math.sin(a); [y, z] = [y * c - z * s, y * s + z * c];
  a = e.y * DEG; c = Math.cos(a); s = Math.sin(a); [x, z] = [x * c + z * s, -x * s + z * c];
  return [x, y, z];
}

export function sampleShape(shape, random) {
  let pos = [0, 0, 0], dir = [0, 0, 1];
  if (shape) {
    const t = shape.type;
    if (t === 0 || t === 1 || t === 2 || t === 3) {
      const u = random() * 2 - 1, th = random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      dir = [s * Math.cos(th), u, s * Math.sin(th)];
      if (t >= 2 && dir[2] < 0) dir[2] = -dir[2];
      const rr = shape.radius * (1 - shape.thick * (1 - Math.cbrt(random())));
      pos = [dir[0] * rr, dir[1] * rr, dir[2] * rr];
    } else if (t === 4 || t === 7 || t === 8 || t === 9) {
      const th = random() * shape.arc * DEG;
      const rn = 1 - shape.thick * (1 - Math.sqrt(random()));
      const px = Math.cos(th) * rn, py = Math.sin(th) * rn, sa = Math.sin(shape.angle * DEG);
      pos = [px * shape.radius, py * shape.radius, 0];
      dir = [px * sa, py * sa, Math.cos(shape.angle * DEG)];
      const l = Math.hypot(dir[0], dir[1], dir[2]);
      dir = [dir[0] / l, dir[1] / l, dir[2] / l];
      if (t === 8 || t === 9) {
        const k = random() * (shape.len || 0) / Math.max(1e-4, dir[2]);
        pos = [pos[0] + dir[0] * k, pos[1] + dir[1] * k, pos[2] + dir[2] * k];
      }
    } else if (t === 10 || t === 11) {
      const th = random() * shape.arc * DEG;
      const rn = t === 11 ? 1 : 1 - shape.thick * (1 - Math.sqrt(random()));
      dir = [Math.cos(th), Math.sin(th), 0];
      pos = [dir[0] * rn * shape.radius, dir[1] * rn * shape.radius, 0];
    } else if (t === 5) {
      pos = [random() - 0.5, random() - 0.5, random() - 0.5];
      dir = [0, 0, 1];
    }
    pos = [pos[0] * shape.scale.x, pos[1] * shape.scale.y, pos[2] * shape.scale.z];
    pos = rotEuler(pos, shape.rot);
    dir = rotEuler(dir, shape.rot);
    pos = [pos[0] + shape.pos.x, pos[1] + shape.pos.y, pos[2] + shape.pos.z];
  }
  return { pos, dir };
}
