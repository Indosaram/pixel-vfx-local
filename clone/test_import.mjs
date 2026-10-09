
import { readFileSync, existsSync } from 'node:fs';
import * as THREE from 'three';
import { createWireScene } from './src/wire-scene.js';
import { createWireEffect } from './src/wire-effect.js';
import { createWireDriver } from './src/wire-capture-driver.js';
import { captureFrames } from './src/wire-capture.js';
import { quantise } from './src/pixel.js';
import { makeSheet } from './src/export/sheet.js';
import { encodeGif } from './src/export/gif.js';

console.log('Imports succeeded!');
