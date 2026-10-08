// Bounded U11 sheet-layout increment: a pure grid/rectangle calculation only.
// Evidence: state/sprite-decomposition-report.md section 9 ("Layout picks a
// grid or fixed columns; draws ImageData frames into a sheet", formats.js:5-33).
// Automatic layout now follows state/sprite-static-sheet-layout-addendum.md.
// No image encoding, no canvas,
// no renderer and no filesystem access: byte-producing encoders remain
// blocked (clone/spec/spec-gaps.md G10), so the frozen encode(request) byte
// surface (clone/spec/contracts.md section 2) is intentionally NOT
// implemented in this increment.
//
// Automatic selection uses reviewed dimension-sensitive exact-fit preference
// and aspect/empty-cell scoring; clamping columns to count is source-backed too.
// Clone boundary choices: positive integers and automatic selection only when
// columns are omitted, rather than for every falsy value.
// - count 0 (an empty export) is REJECTED: a sheet with no frames has no
//   positive dimensions to return. Callers decide what an empty selection
//   means before layout. This rejection is a clone boundary decision, not
//   reference behaviour; the metadata manifest's separate zero-count
//   acceptance (clone/src/export.js) is unchanged by this module.
// - Structured rejection: { code: 'INVALID_SHEET_LAYOUT', stage: 'export',
//   message, context } per clone/spec/contracts.md section 1.8.

function fail(message, context) {
  throw { code: 'INVALID_SHEET_LAYOUT', stage: 'export', message, context };
}

function positiveInteger(value, field) {
  if (!Number.isInteger(value) || value <= 0) {
    fail('Expected positive integer ' + field, { [field]: value });
  }
}

/**
 * Compute sprite-sheet dimensions and the ordered per-frame rectangles for
 * row-major packing. Pure calculation: positive integer inputs, plain-data
 * output, no encoding and no rendering.
 *
 * CLONE-OWNED API SHAPE (not reference behaviour): the flat request fields
 * {w, h, count, columns?} and output keys {sheet, columns, rows, rects}.
 * Automatic layout, column clamping and row-major placement are source-backed.
 *
 * @param {{
 *   w: number,
 *   h: number,
 *   count: number,
 *   columns?: number
 * }} request frame size in pixels, number of frames, optional fixed columns
 * @returns {{
 *   sheet: { w: number, h: number },
 *   columns: number,
 *   rows: number,
 *   rects: { index: number, x: number, y: number, w: number, h: number }[]
 * }} sheet dimensions and nonoverlapping row-major rectangles in frame order
 * @throws {{ code: string, stage: string, message: string, context: object }}
 */
export function layoutSheet(request) {
  if (request === null || typeof request !== 'object' || Array.isArray(request)) {
    fail('Expected a sheet layout request object', { received: request === null ? 'null' : typeof request });
  }

  const { w, h, count, columns } = request;
  positiveInteger(w, 'w');
  positiveInteger(h, 'h');
  positiveInteger(count, 'count');
  if (columns !== undefined) positiveInteger(columns, 'columns');

  let gridColumns = Math.min(columns ?? 1, count);
  if (columns === undefined) {
    const candidates = [];
    for (let cols = 1; cols <= count; cols++) {
      const rows = Math.ceil(count / cols);
      if ((rows - 1) * cols >= count) continue;
      const width = cols * w, height = rows * h;
      candidates.push({ cols, aspect: Math.max(width, height) / Math.min(width, height), empty: cols * rows - count, wide: width >= height });
    }
    const exact = candidates.filter(candidate => candidate.empty === 0 && candidate.aspect <= 2);
    const choices = exact.length ? exact : candidates;
    const score = candidate => candidate.aspect + (exact.length ? 0 : candidate.empty * 0.35);
    choices.sort((a, b) => score(a) - score(b) || Number(b.wide) - Number(a.wide));
    gridColumns = choices[0].cols;
  }
  const rows = Math.ceil(count / gridColumns);

  const rects = [];
  for (let index = 0; index < count; index += 1) {
    rects.push({
      index,
      x: (index % gridColumns) * w,
      y: Math.floor(index / gridColumns) * h,
      w,
      h,
    });
  }

  return {
    sheet: { w: gridColumns * w, h: rows * h },
    columns: gridColumns,
    rows,
    rects,
  };
}
