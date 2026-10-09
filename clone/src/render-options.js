export function validateRenderOptions({effectId, size, fps, duration, colors, seed, elevation = 35, facing = 0}) {
  if (typeof effectId !== 'string' || !effectId.trim() || effectId.length > 120) throw new Error('Effect ID must be a nonempty string (max 120 characters)');
  for (const [name, value, lo, hi] of [['size',size,8,256], ['fps',fps,1,50], ['colors',colors,2,255], ['seed',seed,1,2147483646]]) {
    if (!Number.isInteger(value) || value < lo || value > hi) throw new Error(`${name} must be an integer in [${lo},${hi}]`);
  }
  if (!Number.isFinite(elevation) || Math.abs(elevation) > 90 || !Number.isFinite(facing) || Math.abs(facing) > 360) throw new Error('Camera angles out of range: elevation [-90,90], facing [-360,360]');
  if (!Number.isFinite(duration) || duration <= 0 || duration > 10) throw new Error('duration must be in (0,10] seconds');
}
