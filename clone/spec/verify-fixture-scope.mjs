import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Coordinator-authored scope check, NOT an implementation-blind arithmetic oracle.
// These explicit unresolved fields prevent freeze regardless of subset arithmetic.
const requirements = [
  ['f01-input.json', 'unresolved', 'particle-state and image oracles at declared fps/cameras'],
  ['f01-expected.json', 'unknown', 'camera images'],
  ['f01-wire-input.json', 'limitations', 'Full capture settings and particle/image expectations remain missing'],
  ['f02-input.json', 'unresolved', 'transform matrices and camera cases'],
  ['f02-expected.json', 'unknown', 'local/world conversion'],
  ['f03-input.json', 'unresolved', 'full capture settings'],
  ['f03-expected.json', 'unknown', 'all ambient family outputs'],
  ['p01-input.json', 'unresolved', 'encoded output bytes and independent decoders'],
  ['p01-expected.json', 'unknown', 'PNG/GIF/ZIP/Aseprite encoded bytes'],
];
for (const [file, field, missing] of requirements) {
  const bytes = readFileSync(new URL(`./fixtures/${file}`, import.meta.url));
  const fixture = JSON.parse(bytes);
  assert.equal(fixture.status, 'candidate-not-frozen', `${file}: incomplete scope must not be frozen`);
  assert.ok(Array.isArray(fixture[field]) && fixture[field].includes(missing), `${file}: scope changed; reassess recorded blocker`);
  assert.ok(typeof fixture.freezeBlocker === 'string' && fixture.freezeBlocker.length > 0);
  if (file === 'f03-input.json') assert.equal(fixture.ambientLayerParameters, null);
  console.log(JSON.stringify({
    file, status: 'BLOCKED_SCOPE', method: 'Coordinator inspection of explicit unresolved fixture fields; not independent arithmetic',
    field, missing, reason: fixture.freezeBlocker,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  }));
}
