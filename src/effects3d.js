// Original 3D effect presets. Every scene() call is pure: particle/mesh
// base states are drawn from a fresh seeded RNG in fixed order, then
// advanced in closed form by t — so any frame is seek-safe and the output
// is engine-independent (deterministic float ops only).

import { clamp01, fcos, fsin } from "./mathx.js";
import { makeRng } from "./rng.js";

function _fade(t, a, b) {
	return clamp01((t - a) / (b - a));
}

function mix(a, b, t) {
	return a + (b - a) * t;
}

function sceneShardBurst(t, seed) {
	const rng = makeRng(`${seed}:shard`);
	const meshes = [];
	const particles = [];
	const N = 18;
	const burst = 1 - (1 - clamp01(t)) ** 2;
	for (let i = 0; i < N; i++) {
		const yaw = rng.range(0, Math.PI * 2);
		const pitch = rng.range(-1.1, 1.1);
		const speed = rng.range(1.4, 3.0);
		const dx = fcos(yaw) * fcos(pitch);
		const dy = fsin(pitch);
		const dz = fsin(yaw) * fcos(pitch);
		const rv = [rng.range(-5, 5), rng.range(-5, 5), rng.range(-5, 5)];
		const size = rng.range(0.1, 0.26);
		const hue = rng.range(0, 1);
		const drag = 1 - burst * 0.35;
		const shrink = 1 - clamp01((t - 0.55) / 0.45) * 0.9;
		meshes.push({
			geo: "box",
			pos: [
				dx * speed * burst * drag,
				dy * speed * burst * drag - 2.2 * t * t,
				dz * speed * burst * drag,
			],
			rot: [rv[0] * t, rv[1] * t, rv[2] * t],
			scale: [size * shrink, size * shrink, size * shrink],
			color: [mix(1, 0.85, hue), mix(0.55, 0.2, hue), mix(0.15, 0.3, hue)],
			emissive: 0.25 * (1 - clamp01(t)),
		});
	}
	const flashLife = 0.16;
	if (t < flashLife) {
		const k = 1 - t / flashLife;
		meshes.push({
			geo: "sphere",
			pos: [0, 0, 0],
			rot: [0, 0, 0],
			scale: [0.55 * k + 0.1, 0.55 * k + 0.1, 0.55 * k + 0.1],
			color: [1, 0.92, 0.7],
			emissive: 1.4 * k,
		});
	}
	const M = 46;
	for (let i = 0; i < M; i++) {
		const yaw = rng.range(0, Math.PI * 2);
		const pitch = rng.range(-1.3, 1.3);
		const speed = rng.range(2.2, 4.4);
		const life = rng.range(0.35, 0.9);
		const born = rng.range(0, 0.12);
		const age = t - born;
		if (age < 0 || age > life) continue;
		const u = age / life;
		const dx = fcos(yaw) * fcos(pitch);
		const dy = fsin(pitch);
		const dz = fsin(yaw) * fcos(pitch);
		const s = speed * age * (1 - u * 0.4);
		particles.push({
			x: dx * s,
			y: dy * s - 1.8 * age * age,
			z: dz * s,
			color: [1, mix(0.85, 0.35, u), 0.2],
			size: mix(0.05, 0.012, u),
			alpha: 1 - u * u,
			glow: 1.2 * (1 - u),
		});
	}
	return { meshes, particles };
}

function sceneOrbitalRing(t, seed) {
	const rng = makeRng(`${seed}:orbit`);
	const meshes = [
		{
			geo: "torus",
			pos: [0, 0, 0],
			rot: [0.5, t * 0.8, 0],
			scale: [1, 1, 1],
			color: [0.35, 0.6, 1],
			emissive: 0.5,
		},
	];
	const particles = [];
	const MOONS = 7;
	for (let i = 0; i < MOONS; i++) {
		const phase = rng.range(0, Math.PI * 2);
		const w = rng.range(1.6, 2.6);
		const ang = phase + w * t;
		const rad = 1.35 + 0.18 * fsin(t * 2 + phase);
		const y = 0.35 * fsin(ang * 2 + phase);
		meshes.push({
			geo: "sphere",
			pos: [fcos(ang) * rad, y, fsin(ang) * rad],
			rot: [0, ang, 0],
			scale: [0.16, 0.16, 0.16],
			color: [1, 0.8, 0.3],
			emissive: 0.9,
		});
	}
	const M = 64;
	for (let i = 0; i < M; i++) {
		const phase = rng.range(0, Math.PI * 2);
		const w = rng.range(1.4, 2.8);
		const rad = rng.range(1.1, 1.7);
		const ang = phase + w * t;
		particles.push({
			x: fcos(ang) * rad,
			y: 0.4 * fsin(ang * 2 + phase),
			z: fsin(ang) * rad,
			color: [0.5, 0.8, 1],
			size: rng.range(0.02, 0.05),
			alpha: 0.85,
			glow: 0.8,
		});
	}
	return { meshes, particles };
}

function sceneCrystalGrowth(t, seed) {
	const rng = makeRng(`${seed}:crystal`);
	const meshes = [];
	const particles = [];
	const N = 6;
	for (let i = 0; i < N; i++) {
		const ang = rng.range(0, Math.PI * 2);
		const rad = rng.range(0.1, 0.75);
		const h = rng.range(0.8, 1.7);
		const delay = i * 0.12;
		const g = clamp01((t - delay) / (1.1 - delay * 0.5));
		const ease = g * g * (3 - 2 * g);
		if (ease <= 0.001) continue;
		meshes.push({
			geo: "cone",
			pos: [fcos(ang) * rad, 0, fsin(ang) * rad],
			rot: [rng.range(-0.25, 0.25), ang, rng.range(-0.25, 0.25)],
			scale: [0.22, h * ease, 0.22],
			color: [0.4, mix(0.9, 1, ease), 0.95],
			emissive: 0.35 + 0.4 * ease,
		});
	}
	const M = 40;
	for (let i = 0; i < M; i++) {
		const ang = rng.range(0, Math.PI * 2);
		const rad = rng.range(0.15, 0.9);
		const rise = rng.range(0.4, 1.9);
		const phase = rng.range(0, Math.PI * 2);
		const u = (t * 0.6 + phase) % 1;
		particles.push({
			x: fcos(ang) * rad + 0.06 * fsin(u * 6.28 + phase),
			y: u * rise,
			z: fsin(ang) * rad + 0.06 * fcos(u * 6.28 + phase),
			color: [0.6, 1, 1],
			size: 0.028,
			alpha: (1 - u) * 0.9,
			glow: 1.1,
		});
	}
	return { meshes, particles };
}

function sceneNebulaSwarm(t, seed) {
	const rng = makeRng(`${seed}:nebula`);
	const meshes = [
		{
			geo: "sphere",
			pos: [0, 0, 0],
			rot: [0, t, 0],
			scale: [0.5, 0.5, 0.5],
			color: [1, 0.35, 0.8],
			emissive: 1.1,
		},
	];
	const particles = [];
	const M = 96;
	for (let i = 0; i < M; i++) {
		const orbitR = rng.range(0.5, 1.9);
		const w = rng.range(0.5, 1.6);
		const phase = rng.range(0, Math.PI * 2);
		const tilt = rng.range(-0.9, 0.9);
		const ang = phase + w * t;
		particles.push({
			x: fcos(ang) * orbitR,
			y: fsin(ang * 1.7 + phase) * 0.5 * (1 + tilt),
			z: fsin(ang) * orbitR,
			color: mix(0, 1, (i % 3) / 2) > 0.5 ? [1, 0.5, 0.9] : [0.5, 0.4, 1],
			size: rng.range(0.02, 0.06),
			alpha: 0.55 + 0.45 * fsin(ang * 3),
			glow: 1.3,
		});
	}
	return { meshes, particles };
}

function sceneWarpTunnel(t, seed) {
	const rng = makeRng(`${seed}:warp`);
	const meshes = [];
	const RINGS = 7;
	for (let i = 0; i < RINGS; i++) {
		const z = ((((i / RINGS) * 7 + t * 4.5) % 7) - 3.5) * 1.15;
		const fadeK = clamp01((3.8 - Math.abs(z)) / 1.4);
		meshes.push({
			geo: "torus",
			pos: [0, 0, z],
			rot: [0, 0, 0],
			scale: [1, 1, 1],
			color: [0.3, 0.9, mix(1, 0.4, (i % 2) / 1)],
			emissive: 0.25 + 0.65 * fadeK,
		});
	}
	const particles = [];
	const M = 72;
	for (let i = 0; i < M; i++) {
		const ang = rng.range(0, Math.PI * 2);
		const rad = rng.range(1.15, 1.75);
		const speed = rng.range(3.5, 6);
		const z = (((rng.range(0, 7) + t * speed) % 7) - 3.5) * 1.15;
		particles.push({
			x: fcos(ang) * rad,
			y: fsin(ang) * rad,
			z,
			color: [0.7, 1, 1],
			size: 0.03,
			alpha: clamp01((3.8 - Math.abs(z)) / 1.6),
			glow: 1.4,
		});
	}
	return { meshes, particles };
}

function sceneGemSpin(t, seed) {
	const rng = makeRng(`${seed}:gem`);
	const bob = 0.15 * fsin(t * 3.1);
	const meshes = [
		{
			geo: "sphere",
			pos: [0, bob, 0],
			rot: [0.3, t * 2.2, 0.15],
			scale: [0.55, 0.55, 0.55],
			color: [0.85, 0.3, 1],
			emissive: 0.55,
		},
		{
			geo: "torus",
			pos: [0, bob, 0],
			rot: [1.1, t * 1.4, 0],
			scale: [1.25, 1.25, 1.25],
			color: [1, 0.85, 0.3],
			emissive: 0.75,
		},
		{
			geo: "torus",
			pos: [0, bob, 0],
			rot: [-0.6, -t * 1.1, 0.9],
			scale: [1.05, 1.05, 1.05],
			color: [0.3, 0.95, 1],
			emissive: 0.65,
		},
	];
	const particles = [];
	const M = 52;
	for (let i = 0; i < M; i++) {
		const phase = rng.range(0, Math.PI * 2);
		const w = rng.range(1.2, 2.2);
		const rad = rng.range(0.9, 1.5);
		const ang = phase + w * t;
		particles.push({
			x: fcos(ang) * rad,
			y: fsin(ang * 2 + phase) * 0.6 + bob,
			z: fsin(ang) * rad,
			color: [1, 0.7, 1],
			size: rng.range(0.018, 0.045),
			alpha: 0.8,
			glow: 1.0,
		});
	}
	return { meshes, particles };
}

export const PRESETS3D = [
	{
		id: "shard_burst3d",
		name: "Shard Burst (3D)",
		kind: "3d",
		duration: 1.0,
		loop: false,
		scene: sceneShardBurst,
	},
	{
		id: "orbital_ring3d",
		name: "Orbital Ring (3D)",
		kind: "3d",
		duration: 2.0,
		loop: true,
		scene: sceneOrbitalRing,
	},
	{
		id: "crystal_growth3d",
		name: "Crystal Growth (3D)",
		kind: "3d",
		duration: 1.6,
		loop: false,
		scene: sceneCrystalGrowth,
	},
	{
		id: "nebula_swarm3d",
		name: "Nebula Swarm (3D)",
		kind: "3d",
		duration: 2.0,
		loop: true,
		scene: sceneNebulaSwarm,
	},
	{
		id: "warp_tunnel3d",
		name: "Warp Tunnel (3D)",
		kind: "3d",
		duration: 1.4,
		loop: true,
		scene: sceneWarpTunnel,
	},
	{
		id: "gem_spin3d",
		name: "Gem Spin (3D)",
		kind: "3d",
		duration: 2.0,
		loop: true,
		scene: sceneGemSpin,
	},
];
