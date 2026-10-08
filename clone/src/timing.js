// U10 increment: timing helpers only (clampHold, applyHolds, bakeHolds,
// totalTime). No rendering and no original-app code in this file.

const MAX_HOLD = 8;

function validTimeline(count, fps) {
  if (!Number.isInteger(count) || count < 0 || !Number.isFinite(fps) || fps <= 0) {
    throw { code: 'INVALID_TIMING', stage: 'timing', message: 'Expected nonnegative frame count and positive finite fps', context: { count, fps } };
  }
}

export function holdsFromMarkers(markers, count, fps) {
  validTimeline(count, fps);
  const holds = Array(count).fill(1);
  for (const marker of markers ?? []) {
    if (!Number.isFinite(marker.t) || !Number.isFinite(marker.x)) {
      throw { code: 'INVALID_TIMING', stage: 'timing', message: 'Expected finite marker time and hold', context: { marker } };
    }
    const index = Math.round(marker.t * fps);
    if (index >= 0 && index < count) holds[index] = clampHold(marker.x);
  }
  if (count && holds.every(hold => hold === 0)) holds[0] = 1;
  return holds;
}

export function markersFromHolds(holds, fps) {
  validTimeline(holds.length, fps);
  return holds.flatMap((hold, index) => {
    return hold === 1 ? [] : [{ t: Number((index / fps).toFixed(3)), x: hold }];
  });
}

export function steppedHolds(count, step) {
  validTimeline(count, 1);
  if (!Number.isInteger(step) || step < 1 || step > MAX_HOLD) {
    throw { code: 'INVALID_TIMING', stage: 'timing', message: 'Expected integer step in [1,8]', context: { step } };
  }
  return Array.from({ length: count }, (_, i) => i % step === 0 ? Math.min(step, count - i) : 0);
}

export function coverage(frames) {
  return frames.map(({ data }) => {
    let count = 0;
    for (let offset = 3; offset < data.length; offset += 4) if (data[offset] !== 0) count++;
    return count;
  });
}

export function suggestMarkers(frames, fps, loop) {
  validTimeline(frames.length, fps);
  if (loop || frames.length < 4) return [];
  const counts = coverage(frames);
  const maximum = Math.max(...counts);
  if (!maximum) return [];
  const peak = counts.indexOf(maximum);
  const impact = counts.findIndex(count => count >= maximum * 0.55);
  const holds = Array(frames.length).fill(1);
  holds[impact] = fps >= 20 ? 4 : fps >= 12 ? 3 : 2;
  if (impact + 1 < holds.length) holds[impact + 1] = Math.max(2, holds[impact] - 1);
  const tail = counts.findIndex((count, index) => index >= Math.max(peak, impact + 2) && count < maximum * 0.4);
  if (tail > 0) {
    for (let index = tail; index < holds.length - 1; index++) holds[index] = (index - tail) % 2 === 0 ? 2 : 0;
  }
  return markersFromHolds(holds, fps);
}

export function recommendStep(count, sourceFps, targetFps) {
  validTimeline(count, sourceFps);
  if (!Number.isFinite(targetFps) || targetFps <= 0) {
    throw { code: 'INVALID_TIMING', stage: 'timing', message: 'Expected positive finite target fps', context: { targetFps } };
  }
  return Math.max(1, Math.min(MAX_HOLD, Math.round(sourceFps / targetFps)));
}

/**
 * Apply signed 32-bit coercion before clamping to [0, 8].
 *
 * @param {number} v
 * @returns {number} integer 0..8
 */
export function clampHold(v) {
  return Math.min(MAX_HOLD, Math.max(0, v | 0));
}

/**
 * Drop frames with nonpositive holds and return the surviving parallel
 * arrays. A nonempty input whose holds are all zero keeps the first frame
 * with hold 1 instead of collapsing to an empty result.
 *
 * CLONE-OWNED BOUNDARY: empty frames return { frames: [], holds: [] }. This
 * empty-input contract is owned by the clone; it is not a claim about the
 * upstream reference behaviour.
 *
 * @param {unknown[]} frames
 * @param {number[]} holds
 * @returns {{frames: unknown[], holds: number[]}}
 */
export function applyHolds(frames, holds) {
  if (!frames || frames.length === 0) return { frames: [], holds: [] };
  const keptFrames = [];
  const keptHolds = [];
  for (let i = 0; i < frames.length; i++) {
    const hold = holds?.[i] ?? 1;
    if (!(hold > 0)) continue;
    keptFrames.push(frames[i]);
    keptHolds.push(hold);
  }
  if (keptHolds.length === 0) return { frames: [frames[0]], holds: [1] };
  return { frames: keptFrames, holds: keptHolds };
}

/**
 * Expand each frame by its supplied hold: repeat frame i while repeat < hold,
 * hold 0 drops the frame. CLONE-OWNED BOUNDARY: empty frames bake to [].
 *
 * @param {unknown[]} frames
 * @param {number[]} holds
 * @returns {unknown[]}
 */
export function bakeHolds(frames, holds) {
  if (!frames || frames.length === 0) return [];
  const baked = [];
  for (let i = 0; i < frames.length; i++) {
    const hold = holds[i] || 0;
    for (let repeat = 0; repeat < hold; repeat++) baked.push(frames[i]);
  }
  return baked;
}

/**
 * Total playback time in seconds: sum of holds divided by fps.
 *
 * @param {number[]} holds
 * @param {number} fps
 * @returns {number}
 */
export function totalTime(holds, fps) {
  validTimeline(holds?.length ?? 0, fps);
  let sum = 0;
  if (holds) for (const hold of holds) sum += hold;
  return sum / fps;
}
