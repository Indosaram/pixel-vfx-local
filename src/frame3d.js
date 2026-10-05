import { mat4Perspective, orbitView } from "./camera3d.js";
import { hdrBloom, tonemapMatte3Pass } from "./post3d.js";
import { makeHdr, renderBillboards, renderMeshes } from "./render3d.js";

export function render3dFrame(effect, t, seed, camera3d, W, H) {
	const scene = effect.scene(t, seed);
	const cam = camera3d || { yaw: 0.7, pitch: 0.4, dist: 3.4, fov: 55 };
	const { view } = orbitView(cam.yaw, cam.pitch, cam.dist);
	const proj = mat4Perspective((cam.fov * Math.PI) / 180, W / H, 0.1, 60);
	const hdr = makeHdr(W, H);
	renderMeshes(hdr, W, H, view, proj, scene.meshes);
	renderBillboards(hdr, W, H, view, proj, scene.particles);
	hdrBloom(hdr, W, H, effect.bloom);
	return tonemapMatte3Pass(hdr, W, H);
}
