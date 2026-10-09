import {transformPakBytes} from './wire-pak.js';
const LIMIT = 128 * 1024 * 1024;
export function validatePackPath(path) {
  if(typeof path !== 'string' || !path || path.length>240 || path.includes('..') || path.startsWith('/') || path.includes('\\') || path.includes(':') || /[\x00-\x1f]/.test(path)) throw new Error('Invalid pack file path');
  return path;
}
async function deflate(bytes) {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'))).arrayBuffer());
}
/** Original data only. files is a Map<string,Uint8Array>. Deterministic sorted output. */
export async function writePak(files) {
  if(!(files instanceof Map) || !files.has('manifest.json') || files.size>10000) throw new Error('Pack requires a manifest and at most 10000 files');
  const index=[],payload=[];let offset=0;
  for(const path of [...files.keys()].sort()) {
    validatePackPath(path);
    const bytes=files.get(path);
    if(!(bytes instanceof Uint8Array))throw new Error('Pack values must be Uint8Array');
    if(bytes.length>LIMIT || offset+bytes.length>LIMIT)throw new Error('Pack exceeds 128 MiB limit');
    const json=path.endsWith('.json'),data=json?await deflate(bytes):bytes;
    index.push({p:path,o:offset,n:data.length,f:json?1:0});
    payload.push(transformPakBytes(data,path));offset+=data.length;
  }
  const packedIndex=transformPakBytes(await deflate(new TextEncoder().encode(JSON.stringify(index))),'__index__');
  if(12+packedIndex.length+offset>LIMIT)throw new Error('Pack exceeds 128 MiB limit');
  const out=new Uint8Array(12+packedIndex.length+offset);
  out.set(new TextEncoder().encode('H0PK'));
  const view=new DataView(out.buffer);view.setUint32(4,1,true);view.setUint32(8,packedIndex.length,true);
  out.set(packedIndex,12);let pos=12+packedIndex.length;
  for(const bytes of payload){out.set(bytes,pos);pos+=bytes.length;}
  return out;
}
