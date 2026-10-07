// M3 evidence gates — machine-consumed (drives render exit codes and manifest
// fields; proven by scripts/evidence-gate-selftest.mjs negative controls).
// Bounded harness fix per Astra slash direction R1:
//   - early-luma (peak in frames 0-2) applies to quality_impact ONLY
//   - slash reveal is checked from SOURCE layer times (activation + fade-in)
//     AND from the unrounded first supported sample (supportFrame/fps), never
//     from the occupied-peak image proxy — both must fall within 0.17s
//   - replay labels derive from the effect's actual duration (500 vs 750ms)

export const IMPACT_LUMA_DEADLINE_FRAME = 2; // impact brief: luminance peak <=0.17s @12fps
export const SLASH_REVEAL_DEADLINE_S = 0.17; // slash brief: primary support complete by 0.17s

export function impactEarlyLumaOk(lumaPeakFrame) {
	return lumaPeakFrame <= IMPACT_LUMA_DEADLINE_FRAME;
}

// Latest primary (non-accent) layer support time in SECONDS, counting fade-in:
// with fade [fin, fout], full alpha is reached at t0 + fin * (t1 - t0).
export function latestPrimarySupportSeconds(layers) {
	let latest = 0;
	for (const l of layers) {
		const fin = Array.isArray(l.fade) ? l.fade[0] : 0;
		const span = (l.t1 ?? 0) - (l.t0 ?? 0);
		const fullAt = l.t0 + Math.max(0, fin) * Math.max(0, span);
		if (fullAt > latest) latest = fullAt;
	}
	return latest;
}

export function slashRevealCheck(layers, fps, deadlineS = SLASH_REVEAL_DEADLINE_S) {
	const latestS = latestPrimarySupportSeconds(layers);
	const supportFrame = Math.ceil(latestS * fps - 1e-9);
	// R2 (Astra slash R1 verdict): enforce BOTH deadlines — continuous source
	// support and the first SUPPORTED SAMPLE, decision on the unrounded
	// supportFrame/fps (presentation field stays 3-decimal rounded).
	const supportFrameUnrounded = supportFrame / fps;
	const sourceWithinDeadline = latestS <= deadlineS + 1e-9;
	const sampleWithinDeadline = supportFrameUnrounded <= deadlineS + 1e-9;
	return {
		deadlineSeconds: deadlineS,
		latestPrimarySupportSeconds: latestS,
		primarySupportFrame: supportFrame,
		primarySupportFrameSeconds: Math.round(supportFrameUnrounded * 1000) / 1000,
		primarySupportFrameSecondsUnrounded: supportFrameUnrounded,
		sourceWithinDeadline,
		sampleWithinDeadline,
		completeByDeadline: sourceWithinDeadline && sampleWithinDeadline,
	};
}

export function oneShotDurationLabels(durationS) {
	const secondsLabel = durationS.toFixed(2);
	const ms = Math.round(durationS * 1000);
	return {
		secondsLabel,
		ms,
		gifLoopLabel: `NETSCAPE loop=0 = preview replay of a ${secondsLabel}s one-shot (continuous re-run of one-shot content); effect loop:false is manifest intent and does not change the GIF extension`,
		previewReplayLabel: `GIF loop=0 is a preview replay of a ${secondsLabel}s one-shot, not a looping effect; effect loop:false in this manifest does not change the GIF extension`,
	};
}

// Loop-aware dispatch (flame increment): one-shot presets keep the exact
// labels above; loop presets get PERIODIC labels with real duration/sample/
// encoded-total values and no one-shot wording anywhere.
export function durationLabels(preset, fps) {
	if (!preset.loop) return oneShotDurationLabels(preset.duration);
	const secondsLabel = preset.duration.toFixed(2);
	const ms = Math.round(preset.duration * 1000);
	const samples = Math.round(preset.duration * fps);
	return {
		secondsLabel,
		ms,
		gifLoopLabel: `NETSCAPE loop=0 = exact periodic replay of a ${secondsLabel}s loop (${samples} samples at i/${fps}, encoded total ${ms}ms from cumulative delays; last→first is a regular transition, endpoint not duplicated)`,
		previewReplayLabel: `GIF loop=0 replays the full ${secondsLabel}s period every cycle (${samples} samples i/${fps}, ${ms}ms encoded); periodic intent: final-frame transparency NOT required`,
	};
}

// Final-frame transparency is a ONE-SHOT acceptance rule only; loop effects
// keep the last frame opaque by design (shared decision for gate + manifest).
export function transparentFinalRequired(preset) {
	return !preset.loop;
}

// Loop seam evidence (flame increment): seam = mean |ΔRGBA| of the LAST→FIRST
// transition; regular = the 23 consecutive transitions. Compared against the
// ACTUAL regular range — never first==last equality, never a seam-zero
// acceptance (a zero seam only proves the static-body DISCLOSURE below).
// bodyStatic/framesWithMotion are exact machine facts for the visual
// reviewer, NOT an approval threshold.
export function loopSeamEvidence(frames) {
	const n = frames.length;
	const delta = (a, b) => {
		let s = 0;
		for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
		return a.length ? s / a.length : 0;
	};
	const regular = [];
	for (let i = 0; i + 1 < n; i++) regular.push(delta(frames[i], frames[i + 1]));
	const seam = n >= 2 ? delta(frames[n - 1], frames[0]) : 0;
	const regularMax = regular.length ? Math.max(...regular) : 0;
	const regularMin = regular.length ? Math.min(...regular) : 0;
	const regularMean = regular.length
		? regular.reduce((a, b) => a + b, 0) / regular.length
		: 0;
	const framesWithMotion = regular.filter((d) => d > 0).length;
	return {
		sampleCount: n,
		seamDelta: seam,
		regularMin,
		regularMax,
		regularMean,
		seamWithinRegularRange: seam <= regularMax + 1e-12,
		framesWithMotion,
		bodyStatic: framesWithMotion === 0,
	};
}
