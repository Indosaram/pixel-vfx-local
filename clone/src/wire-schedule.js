import { scalarWire } from './wire-curves.js';

export function advanceEmission(definition, state, dt, systemTime, random, spawn) {
  const dur = definition.dur;
  const elapsed = systemTime - state.delay;
  if (!(!state.stopped && elapsed >= 0 && (definition.loop || elapsed <= dur))) return;
  const localTime = definition.loop ? elapsed % dur : elapsed;
  const cycle = definition.loop ? Math.floor(elapsed / dur) : 0;
  if (state.cycle !== cycle) {
    state.cycle = cycle;
    state.burstDone = definition.bursts.map(() => 0);
  }
  definition.bursts.forEach(([time, curve, reps, gap], i) => {
    const max = Math.max(1, reps || 1);
    const step = gap || 0.01;
    while (state.burstDone[i] < max && localTime >= time + state.burstDone[i] * step) {
      state.burstDone[i]++;
      spawn(Math.round(scalarWire(curve, 0, random())), localTime);
    }
  });
  const rate = scalarWire(definition.rate, localTime / dur, random());
  if (rate > 0) {
    state.rateAcc += rate * dt;
    const emit = Math.floor(state.rateAcc);
    if (emit > 0) {
      state.rateAcc -= emit;
      spawn(emit, localTime);
    }
  }
}
