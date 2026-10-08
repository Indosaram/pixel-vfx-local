import { scalar } from './curves.js';

const CAPACITY = 256;

export class EmitterScheduler {
  constructor(definition, random) {
    this.definition = definition;
    this.random = random;
    this.capacity = Math.min(definition.max || 1000, CAPACITY);
    this.liveCount = 0;
    this.play();
  }

  play() {
    this.time = 0;
    this.rateRemainder = 0;
    this.nextBurst = 0;
    this.burstCycles = (this.definition.bursts ?? []).map(() => 0);
    this.stopped = false;
    this.liveCount = 0;
  }

  stop() { this.stopped = true; }

  advance(dt) {
    if (!Number.isFinite(dt) || dt < 0) throw { code: 'INVALID_DT', stage: 'emission', message: 'Expected finite nonnegative dt', context: { dt } };
    const oldTime = this.time;
    const newTime = oldTime + dt;
    this.time = newTime;
    if (this.stopped || newTime < (this.definition.delay ?? 0)) return 0;
    const start = this.definition.delay ?? 0;
    const duration = this.definition.duration ?? Infinity;
    if (!this.definition.loop && oldTime >= start + duration) return 0;
    const activeStart = Math.max(oldTime, start);
    const activeEnd = this.definition.loop ? newTime : Math.min(newTime, start + duration);
    if (activeEnd < activeStart) return 0;
    let requested = 0;
    const cycleDuration = duration > 0 ? duration : Infinity;
    if (this.definition.loop && Number.isFinite(cycleDuration)) {
      for (const [index, burst] of (this.definition.bursts ?? []).entries()) {
        while (start + this.burstCycles[index] * cycleDuration + burst.time <= activeEnd) {
          requested += burst.count;
          this.burstCycles[index]++;
        }
      }
      requested += this.rateCount(activeEnd - activeStart);
    } else {
      const from = activeStart - start, to = activeEnd - start;
      requested += this.burstCount(from, to);
      requested += this.rateCount(activeEnd - activeStart);
    }
    const emitted = Math.max(0, Math.min(Math.floor(requested), this.capacity - this.liveCount));
    for (let i = 0; i < emitted; i++) this.random.next();
    this.liveCount += emitted;
    return emitted;
  }

  rateCount(dt) {
    const rate = typeof this.definition.rate === 'number'
      ? this.definition.rate
      : scalar(this.definition.rate, 0, this.random.next());
    const total = this.rateRemainder + rate * dt;
    const count = Math.floor(total);
    this.rateRemainder = total - count;
    return count;
  }

  burstCount(from, to) {
    const bursts = this.definition.bursts ?? [];
    let count = 0;
    while (this.nextBurst < bursts.length && bursts[this.nextBurst].time <= to) {
      const burst = bursts[this.nextBurst++];
      if (burst.time >= from) count += burst.count;
    }
    return count;
  }

}
