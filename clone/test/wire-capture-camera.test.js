import { expect, test } from 'bun:test';
import { Vector3 } from 'three';
import { createCaptureCamera } from '../src/wire-capture-camera.js';

test('uses final asymmetric bounds and signed depth planes', () => {
  const camera = createCaptureCamera({ elevation: 30 }, -2, 4, -3, 5);
  expect([camera.left, camera.right, camera.bottom, camera.top, camera.near, camera.far])
    .toEqual([-2, 4, -3, 5, -300, 300]);
  expect(camera.position.x).toBe(0);
  expect(camera.position.y).toBeCloseTo(0.5, 12);
  expect(camera.position.z).toBeCloseTo(Math.sqrt(3) / 2, 12);
  const direction = camera.getWorldDirection(new Vector3());
  expect(direction.y).toBeCloseTo(-0.5, 12);
  expect(direction.z).toBeCloseTo(-Math.sqrt(3) / 2, 12);
  const projected = new Vector3(0, 0, 0).project(camera);
  expect(projected.x).toBeCloseTo(-1 / 3, 12);
  expect(projected.y).toBeCloseTo(-1 / 4, 12);
});

test('clamps elevation away from both singular endpoints', () => {
  const low = createCaptureCamera({ elevation: -20 }, -1, 1, -1, 1);
  const high = createCaptureCamera({ elevation: 120 }, -1, 1, -1, 1);
  expect(low.position.y).toBeCloseTo(0.0001745329243133368, 12);
  expect(low.position.z).toBeCloseTo(0.9999999847691291, 12);
  expect(high.position.y).toBeCloseTo(0.9999999847691291, 12);
  expect(high.position.z).toBeCloseTo(0.0001745329243133872, 12);
});
