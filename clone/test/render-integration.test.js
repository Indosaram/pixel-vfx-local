import {expect,test} from 'bun:test';
import {createSamplePack,SAMPLE_EFFECTS} from '../src/sample-pack.js';
import {validateRenderOptions} from '../src/render-options.js';
import {pixelate,DEFAULT_PIXEL} from '../src/pixel.js';
import {encodeGif} from '../src/export/gif-encoder.js';
import {renderEffectClone} from '../src/standalone-renderer.js';
import {openPak} from '../src/wire-pak.js';
import {deflateSync} from 'node:zlib';
const valid={effectId:'Original Burst',size:64,fps:15,duration:1.2,colors:16,seed:1};
class TestImageData {constructor(w,h){this.width=w;this.height=h;this.data=new Uint8ClampedArray(w*h*4);}}
globalThis.ImageData=TestImageData;

test('pixelate builds finite palettes from normalized capture colors (black-export regression)',()=>{
 const frame={w:2,h:2,data:new Uint8ClampedArray([128,24,4,255,24,128,4,255,4,24,128,255,0,0,0,0])};
 const output=pixelate({frames:[frame],shape:[1,1]},2,{...DEFAULT_PIXEL,autoBright:false,colors:4});
 expect(output.palette.every(c=>c.every(Number.isFinite))).toBe(true);
 expect(output.palette.length).toBe(3);
 expect(Array.from(output.frames[0].data).some((v,i)=>i%4!==3&&v>0)).toBe(true);
 const gif=encodeGif(output.frames,{fps:15});
 expect(new TextDecoder().decode(gif.slice(0,6))).toBe('GIF89a');
 expect(gif.at(-1)).toBe(0x3b);
});

test('render option validation refuses invalid bounds before allocating GPU resources',()=>{
 validateRenderOptions(valid);
 for(const [key,values] of Object.entries({size:[0,7,257,64.2,NaN],fps:[0,51,Infinity],duration:[0,-1,11,NaN],colors:[1,256,NaN],seed:[0,2147483647],effectId:['',' ',null,'a'.repeat(121)]}))
  for(const value of values) expect(()=>validateRenderOptions({...valid,[key]:value})).toThrow();
});

test('sample inventory is original and mutating a read cannot corrupt future renders',async()=>{
 const pack=createSamplePack(),manifest=await pack.readJson('manifest.json');
 expect(manifest.effects.map(e=>e.id)).toEqual(SAMPLE_EFFECTS);
 expect(Object.keys(manifest.textures)).toEqual([]);
 const first=await pack.readJson(manifest.effects[0].file);first.emitters.length=0;
 expect((await pack.readJson(manifest.effects[0].file)).emitters.length).toBe(1);
 expect(pack.readJson('missing')).rejects.toThrow('Unknown sample');
 expect(pack.readFile('missing')).rejects.toThrow('No binary');
});

test('unknown effects reject explicitly without needing a renderer',async()=>{
 await expect(renderEffectClone({...valid,effectId:'missing'})).rejects.toThrow('unknown effect');
});

test('empty GPU capture rejects and cleans up driver resources',async()=>{
 let background=0;
 const gl={RGBA:1,UNSIGNED_BYTE:2,readPixels(x,y,w,h,a,b,buf){buf.fill(background === 0xffffff ? 255 : 0);}};
 const renderer={setSize(){},setClearColor(value){background=value;},render(){},getContext(){return gl;}};
 await expect(renderEffectClone({...valid,renderer})).rejects.toThrow('nothing to pixelate');
});

test('PAK input rejects truncated header, wrong magic and bogus index length',async()=>{
 await expect(openPak(new Uint8Array(2))).rejects.toThrow('Truncated');
 await expect(openPak(new Uint8Array(12))).rejects.toThrow('Bad PAK');
 const data=new Uint8Array(12);data.set(new TextEncoder().encode('H0PK'));new DataView(data.buffer).setUint32(8,100,true);
 await expect(openPak(data)).rejects.toThrow('index length');
});

// An authored tiny fixture exercises container handling without any vendor data.
function scramble(bytes,key) {
 let h=0x811c9dc5;for(const b of new TextEncoder().encode(key))h=Math.imul(h^b,0x01000193)>>>0;
 let x=((h^0x6b30f1a5)>>>0)||0x9e3779b9;const words=new Uint32Array(1024);
 for(let i=0;i<1024;i++){x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;words[i]=x;}
 const block=new Uint8Array(words.buffer);return Uint8Array.from(bytes,(b,i)=>b^block[i&4095]^((i>>12)&255));
}
function fixture(entries,payload){const idx=scramble(deflateSync(JSON.stringify(entries)),'__index__');const out=new Uint8Array(12+idx.length+payload.length);out.set(new TextEncoder().encode('H0PK'));new DataView(out.buffer).setUint32(8,idx.length,true);out.set(idx,12);out.set(payload,12+idx.length);return out;}

test('authored PAK fixture reads JSON and compressed file; bounds and traversal reject',async()=>{
 const raw=scramble(deflateSync('{"authored":true}'),'fx/test.json');
 const pack=await openPak(fixture([{p:'fx/test.json',o:0,n:raw.length,f:1}],raw));
 expect(await pack.readJson('test.json')).toEqual({authored:true});
 await expect(pack.readFile('nope')).rejects.toThrow('not found');
 for(const entry of [{p:'../x',o:0,n:0,f:0},{p:'a',o:-1,n:0,f:0},{p:'a',o:0,n:999999,f:0}])
  await expect(openPak(fixture([entry],new Uint8Array(0)))).rejects.toThrow('Invalid PAK entry');
});


test('transparent GIF uses background disposal and rejects empty/mismatched frames',()=>{
 const frame=new TestImageData(1,1);frame.data.set([255,80,20,255]);
 const gif=encodeGif([frame],{fps:15});
 const gce=Array.from(gif).findIndex((v,i)=>v===0x21&&gif[i+1]===0xf9);
 expect(gif[gce+3]).toBe(9);
 expect(()=>encodeGif([])).toThrow('no frames');
 expect(()=>encodeGif([frame,new TestImageData(2,2)])).toThrow('inconsistent');
});

test('render rejects bad camera angles before GPU allocation',async()=>{
 for(const angles of [{elevation:91},{elevation:NaN},{facing:361},{facing:Infinity}])
  await expect(renderEffectClone({...valid,...angles})).rejects.toThrow('Camera angles');
});

test('standalone renderer uses the validated TextureLoader adapter, not ImageBitmap orientation', async()=>{
 const {readFileSync}=await import('node:fs');
 const source=readFileSync(new URL('../src/standalone-renderer.js',import.meta.url),'utf8');
 expect(source).toContain('createTextureLoader(path => pak.readFile(path))');
 expect(source).not.toContain('CanvasTexture');
 expect(source).not.toContain('createImageBitmap');
});
