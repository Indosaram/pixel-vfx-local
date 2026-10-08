#!/usr/bin/env node
// Implementation-blind verifier for clone/spec/fixtures/sheet-layout.json.
//
// Reads ONLY the sibling fixture JSON resolved from import.meta.url and
// recomputes every expected grid independently from the static sheet-layout
// addendum rules (enumerate columns 1..count; exact preference, else
// aspect+0.35*empty scoring; explicit columns clamp). Imports no product
// code and no test code.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const FIXTURE_NAME = "sheet-layout.json";
const TIE_EPSILON = 1e-12;
const METHOD =
  "independent recomputation: enumerate columns 1..count with rows=ceil(count/columns), " +
  "exclude (rows-1)*columns>=count, exact preference empty==0 && aspect<=2 minimizing aspect, " +
  "otherwise minimize aspect+0.35*empty, equal scores prefer width>=height then enumeration " +
  "order; falsy columns use automatic selection, truthy columns clamp to " +
  "max(1,min(count,columns)) with rows=ceil(count/columns); no product imports";

const FIXTURE_FIELDS = ["status", "authority", "cases", "derivations", "provenance"];
const CASE_FIELDS = ["id", "count", "w", "h", "columns", "expectedColumns", "expectedRows"];
const REQUIRED_CASE_FIELDS = ["id", "count", "w", "h", "expectedColumns", "expectedRows"];

let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) {
    throw new Error(`sheet-layout fixture verification failed: ${message}`);
  }
}

function ceilDiv(numerator, denominator) {
  return Math.ceil(numerator / denominator);
}

function enumerateLayouts(count, w, h) {
  const layouts = [];
  for (let columns = 1; columns <= count; columns += 1) {
    const rows = ceilDiv(count, columns);
    if ((rows - 1) * columns >= count) continue;
    const width = columns * w;
    const height = rows * h;
    const aspect = Math.max(width, height) / Math.min(width, height);
    layouts.push({ columns, rows, width, height, aspect, empty: columns * rows - count });
  }
  return layouts;
}

function pickAutomatic(count, w, h) {
  const candidates = enumerateLayouts(count, w, h);
  assert(candidates.length > 0, `count=${count} produced no candidate layouts`);
  const feasible = candidates.filter((entry) => entry.empty === 0 && entry.aspect <= 2);
  const useExact = feasible.length > 0;
  const pool = useExact ? feasible : candidates;
  const score = (entry) => (useExact ? entry.aspect : entry.aspect + 0.35 * entry.empty);
  let best = pool[0];
  for (const candidate of pool) {
    const candidateScore = score(candidate);
    const bestScore = score(best);
    if (candidateScore < bestScore - TIE_EPSILON) {
      best = candidate;
    } else if (Math.abs(candidateScore - bestScore) <= TIE_EPSILON) {
      if (candidate.width >= candidate.height && best.width < best.height) {
        best = candidate;
      }
    }
  }
  return {
    columns: best.columns,
    rows: best.rows,
    rule: useExact ? "exact" : "score",
    candidates: candidates.length,
    feasible: feasible.length,
  };
}

function pickExplicit(count, columns) {
  const clamped = Math.max(1, Math.min(count, columns));
  return { columns: clamped, rows: ceilDiv(count, clamped), rule: "explicit" };
}

function verifyCase(fixtureCase, index) {
  assert(
    fixtureCase !== null && typeof fixtureCase === "object" && !Array.isArray(fixtureCase),
    `case #${index} must be an object`
  );
  const label = typeof fixtureCase.id === "string" ? fixtureCase.id : `case #${index}`;
  const present = Object.keys(fixtureCase);
  for (const field of present) {
    assert(CASE_FIELDS.includes(field), `${label}: field "${field}" is present but unverified`);
  }
  for (const field of REQUIRED_CASE_FIELDS) {
    assert(present.includes(field), `${label}: required field "${field}" is missing`);
  }
  const count = fixtureCase.count;
  assert(
    Number.isInteger(count) && count >= 1,
    `${label}: count must be a positive integer, got ${JSON.stringify(count)}`
  );
  const w = fixtureCase.w || 1;
  const h = fixtureCase.h || 1;
  assert(w > 0 && h > 0, `${label}: frame dimensions must be positive, got w=${w} h=${h}`);
  const selection = fixtureCase.columns
    ? pickExplicit(count, fixtureCase.columns)
    : pickAutomatic(count, w, h);
  assert(
    selection.columns === fixtureCase.expectedColumns,
    `${label}: expectedColumns fixture=${fixtureCase.expectedColumns} recomputed=${selection.columns}`
  );
  assert(
    selection.rows === fixtureCase.expectedRows,
    `${label}: expectedRows fixture=${fixtureCase.expectedRows} recomputed=${selection.rows}`
  );
  return {
    id: label,
    rule: selection.rule,
    candidates: selection.candidates ?? null,
    feasible: selection.feasible ?? null,
    columns: selection.columns,
    rows: selection.rows,
  };
}

export function verifySheetLayout(directory = new URL("./fixtures/", import.meta.url)) {
  checks = 0;
  const base =
    directory instanceof URL
      ? directory
      : pathToFileURL(`${directory}${directory.endsWith("/") ? "" : "/"}`);
  const fixtureUrl = new URL(FIXTURE_NAME, base);
  const fixture = JSON.parse(readFileSync(fixtureUrl, "utf8"));
  assert(
    fixture !== null && typeof fixture === "object" && !Array.isArray(fixture),
    "fixture root must be an object"
  );
  for (const field of FIXTURE_FIELDS) {
    assert(Object.prototype.hasOwnProperty.call(fixture, field), `fixture field "${field}" is missing`);
  }
  assert(Array.isArray(fixture.cases), "fixture cases must be an array");
  assert(fixture.cases.length > 0, "fixture must contain at least one case");
  const grids = fixture.cases.map((entry, index) => verifyCase(entry, index));
  return { name: "sheet-layout", checks, method: METHOD, grids };
}

function main() {
  try {
    const result = verifySheetLayout();
    console.log(JSON.stringify(result));
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

const invokedDirectly =
  typeof process.argv[1] === "string" &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  process.exitCode = main();
}
