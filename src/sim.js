import { fcos, fsin } from "./mathx.js";
import { makeRng } from "./rng.js";

const DT = 1 / 120;
const NORM = 1 / 128;
const TAU = 6.283185307179586;

function spawnAreaPos(rng, area, origin) {
	if (area.type === "circle") {
		const a = rng.range(0, TAU);
		const r = Math.sqrt(rng.next()) * area.r;
		return [origin[0] + fcos(a) * r, origin[1] + fsin(a) * r];
	}
	if (area.type === "box") {
		return [
			origin[0] + (rng.next() - 0.5) * area.w,
			origin[1] + (rng.next() - 0.5) * area.h,
		];
	}
	return [origin[0], origin[1]];
}

function velocity(rng, fx) {
	const speed = rng.range(fx.speed[0], fx.speed[1]);
	const deg = fx.angle[0] + rng.next() * (fx.angle[1] - fx.angle[0]);
	const ang = (deg * Math.PI) / 180;
	return [fcos(ang) * speed, fsin(ang) * speed];
}

export class Sim {
	constructor(effect, seed) {
		this.effect = effect;
		this.seed = seed;
		this.reset();
	}

	reset() {
		const fx = this.effect;
		const rng = makeRng(`${String(this.seed)}:${fx.id}`);
		this.particles = [];
		this.time = 0;
		this.bolts = this.buildBolts(rng);
		const sp = fx.spawn;
		for (let i = 0; i < sp.count; i++) {
			this.particles.push(this.makeParticle(rng, sp, i));
		}
		this.rngRespawn = makeRng(`${String(this.seed)}:${fx.id}:respawn`);
	}

	makeParticle(rng, sp, i) {
		const fx = this.effect;
		let spawnTime;
		if (sp.mode === "burst") {
			spawnTime = (sp.at || 0) + rng.range(0, 0.08) - 0.1;
		} else {
			spawnTime =
				(i / sp.count) * fx.duration +
				rng.range(0, (1 / sp.count) * fx.duration * 0.5) -
				0.1;
		}
		const [x, y] = spawnAreaPos(rng, sp.area, sp.origin);
		const [vx, vy] = velocity(rng, fx);
		return {
			x,
			y,
			vx,
			vy,
			spawnTime,
			life: rng.range(fx.life[0], fx.life[1]),
			age: spawnTime < 0 ? -spawnTime : 0,
			size0: rng.range(fx.size[0], fx.size[1]),
			phase: rng.range(0, TAU),
			dead: false,
			respawn: !!sp.respawn,
		};
	}

	respawnParticle(p) {
		const rng = this.rngRespawn;
		const fx = this.effect;
		const sp = fx.spawn;
		const [x, y] = spawnAreaPos(rng, sp.area, sp.origin);
		const [vx, vy] = velocity(rng, fx);
		p.x = x;
		p.y = y;
		p.vx = vx;
		p.vy = vy;
		p.age = 0;
		p.life = rng.range(fx.life[0], fx.life[1]);
		p.size0 = rng.range(fx.size[0], fx.size[1]);
		p.phase = rng.range(0, TAU);
		p.spawnTime = this.time;
		p.dead = false;
	}

	buildBolts(rng) {
		const fx = this.effect;
		if (!fx.bolts) return [];
		const bolts = [];
		for (let b = 0; b < fx.bolts; b++) {
			const segs = [];
			const n = 7;
			let px = 0.15 + rng.next() * 0.1;
			let py = 0.3 + rng.next() * 0.4;
			for (let s = 0; s < n; s++) {
				segs.push([px, py]);
				px += 0.7 / n + rng.range(-0.03, 0.03);
				py += rng.range(-0.16, 0.16);
			}
			segs.push([px, py]);
			bolts.push({
				at: rng.range(0, fx.duration * 0.5),
				life: rng.range(0.1, 0.3),
				segs,
			});
		}
		return bolts;
	}

	step() {
		const fx = this.effect;
		const t = this.time + DT;
		const dragF = 1 / (1 + fx.drag * DT);
		for (const p of this.particles) {
			if (t < p.spawnTime) continue;
			if (p.dead) {
				if (p.respawn && fx.loop) this.respawnParticle(p);
				else continue;
			}
			p.age += DT;
			if (p.age >= p.life) {
				if (p.respawn && fx.loop) this.respawnParticle(p);
				else {
					p.dead = true;
					continue;
				}
			}
			p.vy += fx.gravity * DT;
			p.vx *= dragF;
			p.vy *= dragF;
			if (fx.sway) p.vx = fsin(p.age * 2.6 + p.phase) * fx.sway;
			p.x += p.vx * DT * NORM;
			p.y += p.vy * DT * NORM;
			if (p.respawn && fx.loop && (p.y > 1.15 || p.x < -0.25 || p.x > 1.25))
				this.respawnParticle(p);
		}
		this.time = t;
	}

	stepTo(time) {
		if (time < this.time - 1e-9) this.reset();
		let guard = 0;
		while (this.time < time - 1e-9 && guard < 4000) {
			this.step();
			guard++;
		}
	}

	frame(frameIndex, fps) {
		this.stepTo(frameIndex / fps);
	}
}
