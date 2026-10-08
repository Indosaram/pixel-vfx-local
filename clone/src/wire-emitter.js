import { scalarWire } from './wire-curves.js';
import { advanceEmission } from './wire-schedule.js';
import { spawnParticles } from './wire-spawn.js';
import { advanceParticles } from './wire-motion.js';

function xfPoint(m, v) {
  return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3],
          m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7],
          m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11]];
}

export class WireEmitter {
  constructor(definition, random) {
    this.d = definition;
    this.rng = random;
    this.p = [];
    this.world = definition.space === 1;
    this.wm = null;
    this.wmInv = null;
    this.tr = definition.trail || null;
  }

  play() {
    const d = this.d;
    this.p.length = 0;
    this.t = 0;
    this.delay = scalarWire(d.delay, 0, this.rng());
    this.rateAcc = 0;
    this.burstDone = d.bursts.map(() => 0);
    this.cycle = -1;
    this.stopped = false;
    if (d.loop && d.prewarm) {
      const DT = 1 / 60;
      let tt = 0;
      const keep = this.delay;
      this.delay = 0;
      while (tt < d.dur) { tt += DT; this.update(DT, tt); }
      this.preT = d.dur;
      this.delay = keep - d.dur;
    } else this.preT = 0;
  }

  update(dt, systemTime) {
    advanceEmission(this.d, this, dt, systemTime, this.rng, (count, lt) => {
      spawnParticles(this.d, this.p, count, lt, this.rng, this.wm);
    });
    advanceParticles(this.d, this.p, dt, systemTime, (p) => this._trailPos(p));
  }

  _trailPos(p) {
    const w = this.tr.world, pw = this.world;
    if (w === 1 && !pw && this.wm) return xfPoint(this.wm, p.pos);
    if (w !== 1 && pw && this.wmInv) return xfPoint(this.wmInv, p.pos);
    return [p.pos[0], p.pos[1], p.pos[2]];
  }

  emitting(sysT) {
    if (this.stopped) return false;
    return this.d.loop ? true : sysT - this.delay <= this.d.dur;
  }

  stop() {
    this.stopped = true;
  }
}
