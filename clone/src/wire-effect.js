import { createRandomStream } from './curves.js';
import { WireEmitter } from './wire-emitter.js';

const STEP = 1 / 120;
const MAX_FRAME = 0.25;

export class WireEffect {
  constructor(definitions, hooks) {
    this.hooks = hooks;
    this.rng = createRandomStream(1);
    this.parts = definitions.map((d) => new WireEmitter(d, () => this.rng.next()));
    this.seed = 1;
    this.t = 0;
    this.clock = 0;
    this.playing = false;
    this.finished = false;
    this.tempo = 1;
  }

  play(seed) {
    this.seed = seed ?? (1 + Math.floor(Math.random() * 2147483645));
    this.rng.reset(this.seed);
    this.t = 0;
    this.clock = 0;
    this.playing = true;
    this.finished = false;
    this.hooks.syncWorld(this);
    for (const part of this.parts) part.play();
    this.hooks.write(this, null);
    return this;
  }

  stop() {
    for (const part of this.parts) part.stop();
    return this;
  }

  seek(T, camera = null) {
    if (T < this.t - 1e-9) this.play(this.seed);
    this.clock = T;
    this.hooks.syncWorld(this);
    this._advance();
    this.hooks.write(this, camera);
    return this;
  }

  update(dt, camera = null) {
    if (!this.playing) return;
    this.clock += Math.min(dt, MAX_FRAME) * this.tempo;
    this.hooks.syncWorld(this);
    this._advance();
    this.hooks.write(this, camera);
    if (!this.finished && this._isDone()) {
      this.finished = true;
      this.playing = false;
      this.hooks.finished(this);
    }
  }

  _advance() {
    while (this.t + STEP <= this.clock + 1e-9) {
      this.t += STEP;
      for (const part of this.parts) part.update(STEP, this.t);
    }
  }

  _isDone() {
    for (const part of this.parts) {
      if (part.p.length || part.emitting(this.t)) return false;
    }
    return true;
  }
}
