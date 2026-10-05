// Original 3D camera math: column-major mat4, orbit camera, perspective.
// All trig routed through mathx so output is engine-independent (V8 == JSC).

import { clamp, fcos, fsin } from "./mathx.js";

export function mat4Identity() {
	const m = new Float64Array(16);
	m[0] = 1;
	m[5] = 1;
	m[10] = 1;
	m[15] = 1;
	return m;
}

export function mat4Mul(a, b) {
	const o = new Float64Array(16);
	for (let c = 0; c < 4; c++) {
		for (let r = 0; r < 4; r++) {
			let s = 0;
			for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
			o[c * 4 + r] = s;
		}
	}
	return o;
}

export function mat4Translate(x, y, z) {
	const m = mat4Identity();
	m[12] = x;
	m[13] = y;
	m[14] = z;
	return m;
}

export function mat4Scale(x, y, z) {
	const m = mat4Identity();
	m[0] = x;
	m[5] = y;
	m[10] = z;
	return m;
}

export function mat4RotX(a) {
	const m = mat4Identity();
	const c = fcos(a);
	const s = fsin(a);
	m[5] = c;
	m[6] = s;
	m[9] = -s;
	m[10] = c;
	return m;
}

export function mat4RotY(a) {
	const m = mat4Identity();
	const c = fcos(a);
	const s = fsin(a);
	m[0] = c;
	m[2] = -s;
	m[8] = s;
	m[10] = c;
	return m;
}

export function mat4RotZ(a) {
	const m = mat4Identity();
	const c = fcos(a);
	const s = fsin(a);
	m[0] = c;
	m[1] = s;
	m[4] = -s;
	m[5] = c;
	return m;
}

// T * Ry * Rx * Rz * S — deterministic composition for scene meshes
export function composeTRS(pos, rot, scale) {
	let m = mat4Translate(pos[0], pos[1], pos[2]);
	m = mat4Mul(m, mat4RotY(rot[1]));
	m = mat4Mul(m, mat4RotX(rot[0]));
	m = mat4Mul(m, mat4RotZ(rot[2]));
	m = mat4Mul(m, mat4Scale(scale[0], scale[1], scale[2]));
	return m;
}

export function mat4Perspective(fovY, aspect, near, far) {
	const m = new Float64Array(16);
	const f = 1 / (fsin(fovY / 2) / fcos(fovY / 2)); // tan via sin/cos
	m[0] = f / aspect;
	m[5] = f;
	m[10] = (far + near) / (near - far);
	m[11] = -1;
	m[14] = (2 * far * near) / (near - far);
	return m;
}

function norm3(v) {
	const l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
	return [v[0] / l, v[1] / l, v[2] / l];
}

function cross3(a, b) {
	return [
		a[1] * b[2] - a[2] * b[1],
		a[2] * b[0] - a[0] * b[2],
		a[0] * b[1] - a[1] * b[0],
	];
}

function dot3(a, b) {
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

// Look-at view matrix (right-handed, camera looks down -z)
export function lookAt(eye, center, up) {
	const z = norm3([eye[0] - center[0], eye[1] - center[1], eye[2] - center[2]]);
	const x = norm3(cross3(up, z));
	const y = cross3(z, x);
	const m = new Float64Array(16);
	m[0] = x[0];
	m[4] = x[1];
	m[8] = x[2];
	m[1] = y[0];
	m[5] = y[1];
	m[9] = y[2];
	m[2] = z[0];
	m[6] = z[1];
	m[10] = z[2];
	m[12] = -dot3(x, eye);
	m[13] = -dot3(y, eye);
	m[14] = -dot3(z, eye);
	m[15] = 1;
	return m;
}

// Orbit camera: yaw around Y, pitch elevation, distance from target.
export function orbitView(yaw, pitch, dist, target = [0, 0, 0]) {
	const cp = fcos(pitch);
	const sp = fsin(pitch);
	const cy = fcos(yaw);
	const sy = fsin(yaw);
	const eye = [
		target[0] + dist * cp * sy,
		target[1] + dist * sp,
		target[2] + dist * cp * cy,
	];
	return { view: lookAt(eye, target, [0, 1, 0]), eye };
}

// Clip-space transform of one point. Returns null when behind the camera.
export function projectPoint(view, proj, x, y, z) {
	const vx = view[0] * x + view[4] * y + view[8] * z + view[12];
	const vy = view[1] * x + view[5] * y + view[9] * z + view[13];
	const vz = view[2] * x + view[6] * y + view[10] * z + view[14];
	const cx = proj[0] * vx;
	const cy = proj[5] * vy;
	const cw = -vz; // proj m[11] = -1
	if (cw <= 1e-6) return null;
	return {
		x: cx / cw,
		y: cy / cw,
		viewZ: vz,
		w: cw,
	};
}

export function screenFromNdc(ndcX, ndcY, W, H) {
	return [(ndcX * 0.5 + 0.5) * W, (1 - (ndcY * 0.5 + 0.5)) * H];
}

export function clampPitch(v) {
	return clamp(v, -1.45, 1.45);
}
