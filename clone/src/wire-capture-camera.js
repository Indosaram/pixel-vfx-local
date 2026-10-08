import * as THREE from 'three';

export function createCaptureCamera(options, left, right, bottom, top) {
  const cam = new THREE.OrthographicCamera(left, right, top, bottom, -300, 300);
  const e = Math.max(0.01, Math.min(89.99, options.elevation)) * Math.PI / 180;
  cam.position.set(0, Math.sin(e), Math.cos(e));
  cam.up.set(0, 1, 0);
  cam.lookAt(0, 0, 0);
  cam.updateMatrixWorld();
  return cam;
}
