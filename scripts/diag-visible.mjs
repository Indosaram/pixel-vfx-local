import { PRESETS } from "../src/effects.js";
import { rasterFrame } from "../src/raster.js";
import { Sim } from "../src/sim.js";

for (const fx of PRESETS) {
	const sim = new Sim(fx, "smoke");
	const fc = Math.max(2, Math.ceil(fx.duration * 12));
	for (let f = 0; f < fc; f++) {
		sim.frame(f, 12);
		const buf = rasterFrame(sim, fx, 96, 96, { zoom: 1, panX: 0, panY: 0 });
		let vis = 0;
		for (let i = 3; i < buf.length; i += 4) if (buf[i] > 0) vis++;
		if (f <= 3 || vis === 0) {
			const alive = sim.particles.filter(
				(p) => !p.dead && sim.time >= p.spawnTime && p.age < p.life,
			).length;
			console.log(
				`${fx.id} f=${f} t=${sim.time.toFixed(4)} visible=${vis} alive=${alive}`,
			);
		}
	}
}
