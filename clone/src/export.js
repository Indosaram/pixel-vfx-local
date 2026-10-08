// Bounded U11 export metadata increment: a pure-data frame manifest only.
// Evidence: state/sprite-decomposition-report.md section 7 (holds are integers
// 0-8 where 0 drops a frame; totalTime sums holds/fps) and section 9 (the JSON
// export carries frame durations plus dimensions, fps, loop, origin and caller
// metadata; formats.js:159-165). Anchors are reproduced from the report, not
// re-derived from source.
// No bytes, no rendering, no GIF/ZIP/Aseprite/PNG encoding: binary encoder
// field details remain blocked (clone/spec/spec-gaps.md G10), so the frozen
// encode(request) byte surface (clone/spec/contracts.md section 2) is
// intentionally NOT implemented in this increment.
// Excluded as not decomposed in the report: frame rectangles (sheet layout
// algorithm), GIF centisecond delay rounding, and GIF repeat/loop byte
// semantics. Export-range slicing stays caller-owned: the report orders range
// selection before hold processing (section 9), so frames/holds arrive here
// already sliced.

const MAX_HOLD = 8;

function fail(message, context) {
  throw { code: 'INVALID_EXPORT', stage: 'export', message, context };
}

/**
 * Build the bounded export frame manifest: dimensions, fps, frame count,
 * holds, total duration, per-frame hold-derived durations, loop, origin and
 * caller metadata. Pure data: no bytes, no canvas, no filesystem access.
 *
 * EVIDENCED (report sections 7 and 9): holds are integers 0-8 with 0 dropping
 * a frame; duration is sum(holds)/fps; per-frame durations are hold-derived;
 * dimensions, fps, loop, origin and caller metadata are JSON export fields.
 *
 * CLONE-OWNED API SHAPE (assumption, not reference behaviour): the flat
 * `request` field names, required `loop` and `origin`, optional `meta`
 * defaulting to {}, opaque `frames` entries (only their count is consumed),
 * the output key set, and the structured rejection
 * { code: 'INVALID_EXPORT', stage: 'export', message, context }.
 *
 * @param {{
 *   w: number,
 *   h: number,
 *   fps: number,
 *   frames: unknown[],
 *   holds: number[],
 *   loop: boolean,
 *   origin: { x: number, y: number },
 *   meta?: object
 * }} request
 * @returns {{
 *   w: number,
 *   h: number,
 *   fps: number,
 *   loop: boolean,
 *   origin: { x: number, y: number },
 *   meta: object,
 *   frameCount: number,
 *   holds: number[],
 *   duration: number,
 *   frames: { index: number, hold: number, duration: number }[]
 * }}
 * @throws {{ code: string, stage: string, message: string, context: object }}
 */
export function metadataManifest(request) {
  if (request === null || typeof request !== 'object' || Array.isArray(request)) {
    fail('Expected an export metadata request object', { received: request === null ? 'null' : typeof request });
  }

  const { w, h, fps, frames, holds, loop, origin, meta } = request;

  if (!Number.isInteger(w) || w <= 0 || !Number.isInteger(h) || h <= 0) {
    fail('Expected positive integer dimensions', { w, h });
  }
  if (typeof fps !== 'number' || !Number.isFinite(fps) || fps <= 0) {
    fail('Expected positive finite fps', { fps });
  }
  if (!Array.isArray(frames)) {
    fail('Expected frames to be an array', { frames: typeof frames });
  }
  if (!Array.isArray(holds)) {
    fail('Expected holds to be an array', { holds: typeof holds });
  }
  if (frames.length !== holds.length) {
    fail('Expected frames and holds to have equal length', { frameCount: frames.length, holdCount: holds.length });
  }
  if (typeof loop !== 'boolean') {
    fail('Expected loop to be a boolean', { loop });
  }
  if (origin === null || typeof origin !== 'object' ||
      typeof origin.x !== 'number' || !Number.isFinite(origin.x) ||
      typeof origin.y !== 'number' || !Number.isFinite(origin.y)) {
    fail('Expected origin with finite x and y', { origin });
  }
  if (meta !== undefined && (meta === null || typeof meta !== 'object' || Array.isArray(meta))) {
    fail('Expected meta to be a plain object when provided', { meta: typeof meta });
  }

  const entries = [];
  let holdSum = 0;
  for (let index = 0; index < holds.length; index += 1) {
    const hold = holds[index];
    if (!Number.isInteger(hold) || hold < 0 || hold > MAX_HOLD) {
      fail('Expected integer holds in [0,8]', { index, hold });
    }
    holdSum += hold;
    entries.push({ index, hold, duration: hold / fps });
  }

  return {
    w,
    h,
    fps,
    loop,
    origin: { x: origin.x, y: origin.y },
    meta: meta === undefined ? {} : { ...meta },
    frameCount: frames.length,
    holds: [...holds],
    duration: holdSum / fps,
    frames: entries,
  };
}

export { encodeGif } from './export/gif-encoder.js';

