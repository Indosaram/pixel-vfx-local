#!/usr/bin/env node
// verify-fixture-freeze.mjs — implementation-blind fixture-freeze verifier.
//
// Scope (as declared): the byte-helper rescale formula only, NOT the full image
// pipeline. Derived solely from spec/fixtures/alpha-rescale.json:
//   thresholdByte = 30, levels = 3
//   alpha <= threshold ? 0
//          : ceil((alpha - threshold) * levels / (255 - threshold)) * 255 / levels
//   result assigned to a Uint8ClampedArray byte (clamped byte assignment).
//
// Contract:
//   - Reads every *.json in the sibling fixtures/ directory (discovered via
//     import.meta.url), expected count 16.
//   - alpha-rescale.json: recomputes the full output vector independently from
//     the input vector and asserts vector lengths + every element. Any mismatch
//     throws (node exits nonzero).
//   - The other 15 fixtures: reported BLOCKED with reason
//     "independent checks pending" (no independent checks run yet).
//   - Emits one JSONL line per file on stdout:
//     {file, status, [reason], checks, sha256}
//   - Node builtins only (fs / assert / crypto / url / path); no production
//     imports, no imports from clone/src or clone/test.

import { readdirSync, readFileSync } from "node:fs";
import assert from "node:assert";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ALPHA_FIXTURE = "alpha-rescale.json";
const EXPECTED_FIXTURE_COUNT = 16;
const BLOCKED_STATUS = "BLOCKED";
const BLOCKED_REASON = "independent checks pending";
const PASS_STATUS = "PASS_ELIGIBLE";

const fixturesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
);

// Independent, fixture-derived reference implementation of the declared
// byte-helper formula. No production code consulted.
function rescaleAlphaByte(alpha, thresholdByte, levels) {
  const scaled =
    alpha <= thresholdByte
      ? 0
      : (Math.ceil(((alpha - thresholdByte) * levels) / (255 - thresholdByte)) *
          255) /
        levels;
  const cell = new Uint8ClampedArray(1);
  cell[0] = scaled; // clamped byte assignment
  return cell[0];
}

function makeChecker() {
  let count = 0;
  return {
    get count() {
      return count;
    },
    ok(condition, message) {
      count += 1;
      assert.ok(condition, message);
    },
    equal(actual, expected, message) {
      count += 1;
      assert.strictEqual(actual, expected, message);
    },
  };
}

function emit(record) {
  process.stdout.write(`${JSON.stringify(record)}\n`);
}

function verifyAlphaFixture(fixture, source) {
  const c = makeChecker();
  c.ok(
    fixture !== null && typeof fixture === "object" && !Array.isArray(fixture),
    `${ALPHA_FIXTURE}: fixture must be a JSON object`,
  );

  const { thresholdByte, levels, inputAlphaBytes, expectedAlphaBytes } = fixture;

  c.ok(Number.isInteger(thresholdByte), `${ALPHA_FIXTURE}: thresholdByte must be an integer`);
  c.ok(
    thresholdByte >= 0 && thresholdByte < 255,
    `${ALPHA_FIXTURE}: thresholdByte must satisfy 0 <= thresholdByte < 255 (got ${thresholdByte})`,
  );
  c.ok(
    Number.isInteger(levels) && levels >= 1,
    `${ALPHA_FIXTURE}: levels must be an integer >= 1 (got ${levels})`,
  );
  c.ok(Array.isArray(inputAlphaBytes), `${ALPHA_FIXTURE}: inputAlphaBytes must be an array`);
  c.ok(Array.isArray(expectedAlphaBytes), `${ALPHA_FIXTURE}: expectedAlphaBytes must be an array`);

  c.equal(
    inputAlphaBytes.length,
    expectedAlphaBytes.length,
    `${ALPHA_FIXTURE}: vector length mismatch — inputAlphaBytes.length=${inputAlphaBytes.length}, expectedAlphaBytes.length=${expectedAlphaBytes.length}`,
  );

  const recomputed = inputAlphaBytes.map((alpha) =>
    rescaleAlphaByte(alpha, thresholdByte, levels),
  );
  c.equal(
    recomputed.length,
    inputAlphaBytes.length,
    `${ALPHA_FIXTURE}: recomputed vector length differs from input vector length`,
  );

  for (let i = 0; i < inputAlphaBytes.length; i += 1) {
    const alpha = inputAlphaBytes[i];
    c.ok(
      Number.isInteger(alpha) && alpha >= 0 && alpha <= 255,
      `${ALPHA_FIXTURE}: inputAlphaBytes[${i}] must be a byte (got ${alpha})`,
    );
    c.equal(
      recomputed[i],
      expectedAlphaBytes[i],
      `${ALPHA_FIXTURE}: element mismatch at index ${i} — fixture expects ${expectedAlphaBytes[i]}, independent formula produced ${recomputed[i]} (alpha=${alpha}, thresholdByte=${thresholdByte}, levels=${levels}); source=${source}`,
    );
  }

  return c.count;
}

function main() {
  const names = readdirSync(fixturesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  assert.strictEqual(
    names.length,
    EXPECTED_FIXTURE_COUNT,
    `fixture set freeze violation: expected ${EXPECTED_FIXTURE_COUNT} JSON fixtures in ${fixturesDir}, found ${names.length}: ${names.join(", ")}`,
  );
  assert.ok(
    names.includes(ALPHA_FIXTURE),
    `fixture set freeze violation: ${ALPHA_FIXTURE} is missing from ${fixturesDir}`,
  );

  for (const name of names) {
    const fullPath = path.join(fixturesDir, name);
    const bytes = readFileSync(fullPath);
    const sha256 = createHash("sha256").update(bytes).digest("hex");

    if (name !== ALPHA_FIXTURE) {
      emit({
        file: name,
        status: BLOCKED_STATUS,
        reason: BLOCKED_REASON,
        checks: 0,
        sha256,
      });
      continue;
    }

    const fixture = JSON.parse(bytes.toString("utf8"));
    const checks = verifyAlphaFixture(fixture, fullPath);
    emit({
      file: name,
      status: PASS_STATUS,
      checks,
      sha256,
    });
  }
}

main();
