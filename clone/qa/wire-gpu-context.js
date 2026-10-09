const ATTRS = {
  alpha: true, depth: true, stencil: false, antialias: false, premultipliedAlpha: true,
  preserveDrawingBuffer: false, powerPreference: 'default', failIfMajorPerformanceCaveat: false,
};

export async function run() {
  const milestones = [], errors = [];
  const mark = name => milestones.push({ name, at: performance.timeOrigin + performance.now() });
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  canvas.addEventListener('webglcontextcreationerror', event => {
    errors.push({ name: 'creation-error', at: performance.timeOrigin + performance.now(), detail: event.statusMessage });
  });
  canvas.addEventListener('webglcontextlost', () => {
    errors.push({ name: 'context-lost', at: performance.timeOrigin + performance.now() });
  });
  mark('context-request');
  let gl;
  try { gl = canvas.getContext('webgl2', ATTRS); }
  catch (error) { errors.push({ name: 'context-exception', detail: String(error) }); }
  mark('context-result');
  if (!gl) return { pass: false, attrs: ATTRS, milestones, errors, pixel: null };
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const pixel = new Uint8Array(4);
  gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
  mark('readback');
  const glError = gl.getError();
  return { pass: errors.length === 0 && !gl.isContextLost() && glError === gl.NO_ERROR
    && pixel.every((v, i) => v === [255, 0, 0, 255][i]),
    attrs: ATTRS, actualAttrs: gl.getContextAttributes(), milestones, errors, renderer,
    pixel: Array.from(pixel), glError };
}
