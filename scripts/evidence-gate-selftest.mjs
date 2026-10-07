#!/usr/bin/env bun
// Negative-control proof for the M3 evidence gates (Astra slash direction R1).
// Machine-consumed: PASS/FAIL lines from value comparisons, exit 0 only if all
// controls behave — no prose assertions. Run on physical Windows alongside
// render packets; output captured to receipts.
import { QUALITY_PRESETS } from "../src/quality-effects.js";
import {
	impactEarlyLumaOk,
	slashRevealCheck,
	oneShotDurationLabels,
	durationLabels,
	transparentFinalRequired,
	loopSeamEvidence,
} from "./evidence-gates.mjs";

let fails = 0;
const check = (name, actual, expected) => {
	const ok = JSON.stringify(actual) === JSON.stringify(expected);
	if (!ok) fails += 1;
	console.log(
		`${ok ? "PASS" : "FAIL"} ${name}: got=${JSON.stringify(actual)} want=${JSON.stringify(expected)}`,
	);
};

// 1) impact gate: rejects a luminance peak after frame 2 (negative control)
check("impact accepts peak f2", impactEarlyLumaOk(2), true);
check("impact REJECTS peak f3 (negative control)", impactEarlyLumaOk(3), false);

// 2) slash reveal from SOURCE layers of the live preset (accent-free)
const slashPreset = QUALITY_PRESETS.find((p) => p.id === "quality_slash");
if (!slashPreset) {
	console.log("FAIL slash preset present: got=false want=true");
	process.exit(1);
}
const primaryLayers = slashPreset.layers.filter((l) => l.role !== "accent");
const live = slashRevealCheck(primaryLayers, 12);
check("slash live primary reveal accepted", live.completeByDeadline, true);
check("slash live support frame (image ref)", live.primarySupportFrame, 2);
check(
	"slash live latest support seconds",
	Math.round(live.latestPrimarySupportSeconds * 1000),
	120, // 0.12s: last primary activation (edge 0.10, cap 0.12, fin 0)
);
check("slash live unrounded support sample within deadline", live.sampleWithinDeadline, true);

// 3) slash reveal negative controls: late activation, late fade-in, and the
//    0.168s boundary (source within deadline, but first supported sample f3)
const lateActivation = slashRevealCheck([{ t0: 0.2, t1: 0.5, fade: [0, 0.5] }], 12);
check("slash REJECTS late activation 0.20s (negative control)", lateActivation.completeByDeadline, false);
// fin 0.25 => completion 0.1 + 0.25*(0.5-0.1) = 0.20s exactly. The previous
// fixture used fin 0.5 (actual completion 0.30s) while labeled 0.20s —
// mislabeled control, corrected per Astra slash R1 verdict.
const lateFadeIn = slashRevealCheck([{ t0: 0.1, t1: 0.5, fade: [0.25, 0.5] }], 12);
check("slash REJECTS fade-in completing 0.20s (negative control)", lateFadeIn.completeByDeadline, false);
check(
	"slash fade fixture completion is truly 0.20s",
	Math.round(lateFadeIn.latestPrimarySupportSeconds * 1000),
	200,
);
// Boundary negative (independently exercised false acceptance before R2):
// {t0:0.168} source support is within 0.17s, but the layer first exists at
// f3=0.25s — the sampled-support check must reject it.
const boundary = slashRevealCheck([{ t0: 0.168, t1: 5 / 12, fade: [0, 0.5] }], 12);
check(
	"slash REJECTS 0.168s source-ok but f3-sample (negative control)",
	boundary.completeByDeadline,
	false,
);
check(
	"slash boundary support sample f3 / unrounded 0.25s",
	[boundary.primarySupportFrame, boundary.primarySupportFrameSecondsUnrounded],
	[3, 0.25],
);
check("slash boundary source within deadline (why dual check needed)", boundary.sourceWithinDeadline, true);
check("slash boundary sample NOT within deadline", boundary.sampleWithinDeadline, false);

// 4) duration labels are machine-derived values, not prose constants
const l050 = oneShotDurationLabels(0.5);
const l075 = oneShotDurationLabels(0.75);
check("label 0.50s / 500ms", [l050.secondsLabel, l050.ms], ["0.50", 500]);
check("label 0.75s / 750ms", [l075.secondsLabel, l075.ms], ["0.75", 750]);
check("slash label carries 0.50s", oneShotDurationLabels(slashPreset.duration).secondsLabel, "0.50");
const impactPreset = QUALITY_PRESETS.find((p) => p.id === "quality_impact");
check("impact label carries 0.75s", oneShotDurationLabels(impactPreset.duration).secondsLabel, "0.75");

// 5) loop-aware exporter semantics (flame increment): one-shot vs loop
//    final-frame rule, periodic2000ms labels, seam-vs-regular controls.
//    The 17 controls above are retained unchanged.
const loopPreset = { duration: 2, loop: true };
const loopLabels = durationLabels(loopPreset, 12);
check("loop label seconds 2.00", loopLabels.secondsLabel, "2.00");
check(
	"loop gif label carries2000ms and no one-shot wording",
	[loopLabels.gifLoopLabel.includes("2000ms"), loopLabels.gifLoopLabel.includes("one-shot")],
	[true, false],
);
check(
	"loop preview label carries 24 samples i/12 and no one-shot wording",
	[loopLabels.previewReplayLabel.includes("24 samples i/12"), loopLabels.previewReplayLabel.includes("one-shot")],
	[true, false],
);
check(
	"durationLabels keeps one-shot labels for loop:false",
	durationLabels({ duration: 0.5, loop: false }, 12),
	oneShotDurationLabels(0.5),
);
check(
	"transparent final required: one-shot yes, loop no",
	[transparentFinalRequired({ loop: false }), transparentFinalRequired({ loop: true })],
	[true, false],
);
const smooth = loopSeamEvidence([
	Uint8Array.of(0, 0, 0, 0),
	Uint8Array.of(1, 1, 1, 1),
	Uint8Array.of(0, 0, 0, 0),
	Uint8Array.of(1, 1, 1, 1),
]);
check(
	"seam within regular range when equal to regular step",
	[smooth.seamWithinRegularRange, smooth.bodyStatic],
	[true, false],
);
// Spike fixture: a monotonic ramp — every regular consecutive step is 1,
// but the last→first seam step is 3, so the seam is the unique outlier and
// must be rejected (a single big jump inside a cyclic list would otherwise
// be part of the regular range too).
const spike = loopSeamEvidence([
	Uint8Array.of(0, 0, 0, 0),
	Uint8Array.of(1, 1, 1, 1),
	Uint8Array.of(2, 2, 2, 2),
	Uint8Array.of(3, 3, 3, 3),
]);
check(
	"seam SPIKE beyond regular range REJECTS (negative control)",
	[spike.seamWithinRegularRange, spike.bodyStatic],
	[false, false],
);
const staticCase = loopSeamEvidence([
	Uint8Array.of(5, 5, 5, 5),
	Uint8Array.of(5, 5, 5, 5),
]);
check(
	"static body exposed as bodyStatic flag (disclosure, not approval)",
	[staticCase.bodyStatic, staticCase.seamWithinRegularRange],
	[true, true],
);

console.log(fails === 0 ? "SELFTEST ALL PASS" : `SELFTEST ${fails} FAIL`);
process.exit(fails === 0 ? 0 : 1);
