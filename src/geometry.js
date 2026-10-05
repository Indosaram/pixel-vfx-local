// Original procedural geometry: flat-shaded triangle soups in world units.
// positions: Float64Array xyz triplets; indices: Uint16Array triangle triples.

function mesh(positions, indices) {
	return {
		positions: Float64Array.from(positions),
		indices: Uint16Array.from(indices),
	};
}

export function boxMesh(sx = 1, sy = 1, sz = 1) {
	const x = sx / 2;
	const y = sy / 2;
	const z = sz / 2;
	const p = [
		-x,
		-y,
		-z,
		x,
		-y,
		-z,
		x,
		y,
		-z,
		-x,
		y,
		-z, // back
		-x,
		-y,
		z,
		x,
		-y,
		z,
		x,
		y,
		z,
		-x,
		y,
		z, // front
	];
	const i = [
		0,
		1,
		2,
		0,
		2,
		3, // back
		5,
		4,
		6,
		4,
		7,
		6, // front
		4,
		0,
		7,
		0,
		3,
		7, // left
		1,
		5,
		2,
		5,
		6,
		2, // right
		3,
		2,
		7,
		2,
		6,
		7, // top
		4,
		5,
		0,
		5,
		1,
		0, // bottom
	];
	return mesh(p, i);
}

export function sphereMesh(r = 0.5, seg = 8, rings = 6) {
	const p = [];
	const i = [];
	for (let ring = 0; ring <= rings; ring++) {
		const v = ring / rings;
		const phi = v * Math.PI;
		const sp = Math.sin(phi);
		const cp = Math.cos(phi);
		for (let s = 0; s <= seg; s++) {
			const u = s / seg;
			const th = u * Math.PI * 2;
			p.push(r * sp * Math.cos(th), r * cp, r * sp * Math.sin(th));
		}
	}
	const stride = seg + 1;
	for (let ring = 0; ring < rings; ring++) {
		for (let s = 0; s < seg; s++) {
			const a = ring * stride + s;
			const b = a + stride;
			i.push(a, b, a + 1, a + 1, b, b + 1);
		}
	}
	return mesh(p, i);
}

export function torusMesh(R = 0.8, r = 0.22, segMaj = 14, segMin = 8) {
	const p = [];
	const i = [];
	for (let a = 0; a <= segMaj; a++) {
		const u = (a / segMaj) * Math.PI * 2;
		const cu = Math.cos(u);
		const su = Math.sin(u);
		for (let b = 0; b <= segMin; b++) {
			const v = (b / segMin) * Math.PI * 2;
			const cv = Math.cos(v);
			const sv = Math.sin(v);
			p.push((R + r * cv) * cu, r * sv, (R + r * cv) * su);
		}
	}
	const stride = segMin + 1;
	for (let a = 0; a < segMaj; a++) {
		for (let b = 0; b < segMin; b++) {
			const x = a * stride + b;
			const y = x + stride;
			i.push(x, y, x + 1, x + 1, y, y + 1);
		}
	}
	return mesh(p, i);
}

export function coneMesh(r = 0.5, h = 1, seg = 8) {
	const p = [0, h, 0, 0, 0, 0]; // apex, base center
	const i = [];
	for (let s = 0; s <= seg; s++) {
		const th = (s / seg) * Math.PI * 2;
		p.push(r * Math.cos(th), 0, r * Math.sin(th));
	}
	for (let s = 0; s < seg; s++) {
		const a = 2 + s;
		const b = 2 + s + 1;
		i.push(a, b, 0); // side
		i.push(b, a, 1); // base
	}
	return mesh(p, i);
}

export function planeMesh(w = 2, d = 2) {
	const x = w / 2;
	const z = d / 2;
	return mesh([-x, 0, -z, x, 0, -z, x, 0, z, -x, 0, z], [0, 2, 1, 0, 3, 2]);
}

const CACHE = new Map();

export function getGeometry(name) {
	if (!CACHE.has(name)) {
		switch (name) {
			case "box":
				CACHE.set(name, boxMesh());
				break;
			case "sphere":
				CACHE.set(name, sphereMesh());
				break;
			case "torus":
				CACHE.set(name, torusMesh());
				break;
			case "cone":
				CACHE.set(name, coneMesh());
				break;
			case "plane":
				CACHE.set(name, planeMesh());
				break;
			default:
				throw new Error(`unknown geometry "${name}"`);
		}
	}
	return CACHE.get(name);
}
