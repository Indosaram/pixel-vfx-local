import { writeFileSync } from "node:fs";
import { GOLDEN_PARAMS, goldenHashes } from "../src/pipeline.js";

const hashes = goldenHashes();
const doc = {
	params: GOLDEN_PARAMS,
	...hashes,
	generatedBy: "scripts/gen-golden.mjs",
};
writeFileSync(
	new URL("../tests/golden.json", import.meta.url),
	`${JSON.stringify(doc, null, "\t")}\n`,
);
console.log(JSON.stringify(doc, null, 2));
