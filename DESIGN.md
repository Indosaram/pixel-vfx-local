# Design — Pixel VFX Local

Operational creative tool, desktop-first. Dark neutral canvas so sprite colors read
true; single cyan accent for focus/active states; monospace for all numeric readouts.

## Tokens

- Background `#17171b`, panel `#1e1e24`, raised `#24242c`, line `#33333d`
- Text `#e7e7ee`, muted `#8d8d9c`, accent `#38c8ff`, danger `#ff6a5e`
- Radius: 6px controls. Focus: 2px accent outline, 1px offset
- Type: system sans 13px/1.45; numbers in `ui-monospace`
- No gradients except the preview checkerboard; icon-free text buttons (few, clear)

## Layout

- Header: title + export actions + last-export readout
- Left rail (300px): Effect → Output → Pixel pipeline → Camera → Timing
- Stage: centered canvas, integer-scaled with `image-rendering: pixelated`
- Bottom: transport (play/step/scrub/loop + frame readout + markers), holds table, status log

## Interaction

- Every control maps to one pipeline parameter; sanitized values write back on blur
- Playback is a rAF accumulator at the output fps; scrubbing pauses playback
- Exports are synchronous and report name/dims/frames/duration in the header and log
- Status log surfaces every clamp/repair message so malformed input is visible, not silent
