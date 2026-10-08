import { expect, test } from 'bun:test';
import { captureFrames } from '../src/wire-capture.js';

function probe(empty = false) {
  const events = [];
  let clock = 0, intensity = 1;
  const driver = {
    async load() { events.push(['load']); },
    start() { events.push(['start', clock]); },
    update(dt) { clock += dt; events.push(['update', dt]); },
    resize(w, h) { events.push(['resize', w, h]); },
    setIntensity(value) { intensity = value; events.push(['intensity', value]); },
    read(w, h, bg) {
      events.push(['read', w, h, bg, intensity, clock]);
      const bytes = new Uint8Array(w * h * 4).fill(bg === 0xffffff ? 255 : 0);
      if (!empty) {
        const i = (Math.floor(h / 2) * w + Math.floor(w / 2)) * 4;
        bytes.set(intensity === 0.5 ? [31, 62, 93, 255]
          : bg === 0xffffff ? [160, 120, 230, 255] : [10, 20, 30, 255], i);
      }
      return bytes;
    },
  };
  return { driver, events };
}

const options = { duration: 0.5, fps: 4, start: 0.025, loop: true, warmup: 0.025,
  elevation: 30, size: 16, srcRes: 32, aspect: 'square', padding: 0 };

test('two passes restart simulation but retain shared time and sample after stepping', async () => {
  const { driver, events } = probe();
  const result = await captureFrames(driver, options, () => {}, async () => {});
  expect(events.filter(e => e[0] === 'load')).toHaveLength(1);
  expect(events.filter(e => e[0] === 'start')).toHaveLength(2);
  expect(events.filter(e => e[0] === 'update')).toHaveLength(66);
  expect(events.filter(e => e[0] === 'resize')).toEqual([['resize', 256, 256], ['resize', 32, 32]]);
  const reads = events.filter(e => e[0] === 'read');
  expect(reads.map(e => [e[3], e[4]])).toEqual([
    [0, 1], [0xffffff, 1], [0, 1], [0xffffff, 1],
    [0, 1], [0xffffff, 1], [0, 0.5], [0, 1], [0xffffff, 1], [0, 0.5],
  ]);
  [0.3, 0.3, 0.55, 0.55, 0.85, 0.85, 0.85, 1.1, 1.1, 1.1]
    .forEach((time, i) => expect(reads[i][5]).toBeCloseTo(time, 12));
  expect(events.filter(e => e[0] === 'intensity')).toEqual([
    ['intensity', 0.5], ['intensity', 1], ['intensity', 0.5], ['intensity', 1],
  ]);
  expect(result.frames).toHaveLength(2);
  expect(result.shape).toEqual([1, 1]);
  expect(result.k).toBe(2);
  const index = (15 * 32 + 16) * 4;
  expect(Array.from(result.frames[0].data.slice(index, index + 4))).toEqual([51, 102, 153, 155]);
});

test('empty bounds stop after search and nonloop captures ignore warmup', async () => {
  const { driver, events } = probe(true);
  const result = await captureFrames(driver, { ...options, loop: false, duration: 0 }, () => {}, async () => {});
  expect(result).toEqual({ frames: [], empty: true });
  expect(events.filter(e => e[0] === 'start')).toHaveLength(1);
  expect(events.filter(e => e[0] === 'update')).toHaveLength(17);
  expect(events.filter(e => e[0] === 'read')).toHaveLength(2);
  expect(events.filter(e => e[0] === 'intensity')).toEqual([]);
});

test('progress yields at source cadence and awaits each yield before advancing', async () => {
  const { driver, events } = probe();
  const observed = [];
  let yielded = 0;
  const result = await captureFrames(driver, { ...options, duration: 1.25 },
    value => observed.push(['progress', value]),
    async () => {
      const count = events.length;
      await Promise.resolve();
      expect(events.length).toBe(count);
      observed.push(['yield', ++yielded]);
    });
  expect(result.frames).toHaveLength(5);
  expect(observed).toEqual([
    ['progress', 0], ['yield', 1], ['progress', 0.32], ['yield', 2],
    ['progress', 0.4], ['yield', 3], ['progress', 0.64], ['yield', 4],
    ['progress', 0.88], ['yield', 5], ['progress', 1],
  ]);
});
