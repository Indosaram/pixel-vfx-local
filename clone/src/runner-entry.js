import * as THREE from 'three';
import {openPak} from './wire-pak.js';
import {renderEffectClone} from './standalone-renderer.js';
window.run = async (effectId,size,packBase64) => {
  const renderer = new THREE.WebGLRenderer({canvas:document.querySelector('canvas'),alpha:true,antialias:true,preserveDrawingBuffer:true});
  try {
    const pack = packBase64 ? await openPak(Uint8Array.from(atob(packBase64),c=>c.charCodeAt(0))) : undefined;
    const result = await renderEffectClone({effectId,size,duration:1.2,renderer,pack});
    let binary=''; for(const byte of result.gifBytes) binary+=String.fromCharCode(byte);
    return {ok:true,b64:btoa(binary),frames:result.frameCount};
  } finally {renderer.dispose();}
};
