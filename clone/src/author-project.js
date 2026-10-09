import {writePak,validatePackPath} from './pak-writer.js';
import {validateRenderOptions} from './render-options.js';
import {validateShape} from './wire-shape-validation.js';
export const PROJECT_VERSION=1;
const c=v=>({t:'c',v});
export function createLayer(name='Layer 1') {
 return {name,max:128,dur:1,delay:c(0),loop:false,bursts:[[0,c(36),1,0.01]],rate:c(0),
 life:{t:'r',a:0.45,b:0.95},speed:{t:'r',a:1,b:3},size:{t:'r',a:0.12,b:0.35},rotZ:c(0),color:{t:'col',v:[1,0.25,0.03,1]},
 shape:{type:0,radius:0.08,thick:1,arc:360,angle:18,scale:{x:1,y:1,z:1},rot:{x:0,y:0,z:0},pos:{x:0,y:0,z:0}},
 render:{mat:{shader:'SH_HunFX_simple',kw:['_USECOLOR_ON'],c:{_uv:[1,1,0,0]}},mode:0,align:0,len:1},
 pos:{x:0,y:0,z:0},rot:{x:0,y:0,z:0,w:1},scale:{x:1,y:1,z:1}};
}
export function createProject() {
 return {format:'clone-author-project',version:1,id:'my_effect',name:'My Effect',
 capture:{size:64,fps:15,duration:1.2,seed:1,elevation:35,facing:0,colors:16},
 definition:{textures:[],meshes:[],roles:[],emitters:[createLayer()]},assets:[],textureMeta:{},meshMeta:{}};
}
function finite(value,label,lo=-1e6,hi=1e6) {if(!Number.isFinite(value)||value<lo||value>hi)throw new Error(`${label} must be a finite number in [${lo},${hi}]`);}
function scalar(value,label) {
 if(!value || typeof value!=='object')throw new Error(`${label}: missing scalar`);
 if(value.t==='c'){finite(value.v,label);return;}
 if(value.t==='r'){finite(value.a,label);finite(value.b,label);if(value.a>value.b)throw new Error(`${label}: range reversed`);return;}
 if(value.t==='k') {finite(value.s,label);curve(value.k,label);return;}
 if(value.t==='rk'){finite(value.s,label);curve(value.a,label);curve(value.b,label);return;}
 throw new Error(`${label}: unsupported scalar type`);
}
function curve(keys,label) {
 if(!Array.isArray(keys)||keys.length<2||keys.length>32)throw new Error(`${label}: use 2-32 curve keys`);
 let previous=-Infinity;
 for(const key of keys){if(!Array.isArray(key)||key.length!==4)throw new Error(`${label}: curve keys are [time,value,in,out]`);key.forEach(v=>finite(v,label));if(key[0]<0||key[0]>1||key[0]<=previous)throw new Error(`${label}: curve times must increase within [0,1]`);previous=key[0];}
}
function color(value,label) {
 if(value?.t==='col'){if(!Array.isArray(value.v)||value.v.length!==4)throw new Error(`${label}: expected RGBA`);value.v.forEach(v=>finite(v,label,0,16));return;}
 if(value?.t==='grad') {const g=value.g;if(!g||!Array.isArray(g.c)||!Array.isArray(g.a)||g.c.length<2||g.a.length<2||g.c.length>32||g.a.length>32)throw new Error(`${label}: invalid gradient`);for(const [keys,width]of [[g.c,4],[g.a,2]]){let last=-1;for(const k of keys){if(k.length!==width||k[0]<=last)throw new Error(`${label}: gradient times must increase`);finite(k[0],label,0,1);k.slice(1).forEach(v=>finite(v,label,0,16));last=k[0];}}return;}
 throw new Error(`${label}: use constant color or gradient`);
}
export function validateProject(project) {
 if(!project||project.format!=='clone-author-project'||project.version!==1)throw new Error('Unsupported project format/version');
 if(!/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(project.id))throw new Error('Effect ID must start with a letter and contain only letters, digits, _ or - (max64)');
 if(typeof project.name!=='string'||!project.name.trim()||project.name.length>120)throw new Error('Project name required (max120)');
 validateRenderOptions({...project.capture,effectId:project.id});
 const d=project.definition;
 if(!d||!Array.isArray(d.emitters)||d.emitters.length<1||d.emitters.length>16)throw new Error('Project requires 1-16 layers');
 if(!Array.isArray(project.assets)||project.assets.length>100)throw new Error('Project assets must be an array (max100)');
 const paths=new Set();let total=0;const files=new Map();
 for(const asset of project.assets){validatePackPath(asset.path);if(paths.has(asset.path)||typeof asset.base64!=='string'||!/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(asset.base64))throw new Error('Duplicate or invalid asset');if(asset.path==='manifest.json'||asset.path===`fx/${project.id}.json`)throw new Error('Asset conflicts with project file');paths.add(asset.path);files.set(asset.path,asset.base64);total+=asset.base64.length;if(total>32*1024*1024)throw new Error('Project assets exceed 24 MiB');}
 for(const [id,meta]of Object.entries(project.textureMeta||{})){if(!/^[\w-]+$/.test(id)||!paths.has(meta.file))throw new Error('Missing texture asset: '+id);}
 for(const [id,meta]of Object.entries(project.meshMeta||{})){if(!/^[\w-]+$/.test(id)||!paths.has(meta.file))throw new Error('Missing mesh asset: '+id);let mesh;try{mesh=JSON.parse(new TextDecoder().decode(base64ToBytes(files.get(meta.file))));}catch{throw new Error('Invalid mesh JSON');}validateMesh(mesh);}
 for(const [i,e]of d.emitters.entries()) {
  const label=`Layer ${i+1}`;
  if(typeof e.name!=='string'||!e.name.trim()||e.name.length>80)throw new Error(label+': name required');
  finite(e.max,label+' max',1,256);if(!Number.isInteger(e.max))throw new Error('Particle limit must be integer');finite(e.dur,label+' duration',0.01,10);if(![true,false,0,1].includes(e.loop))throw new Error('Layer loop must be boolean');
  for(const key of ['delay','life','speed','size','rotZ','rate'])scalar(e[key],label+' '+key);
  for(const [key,lo,hi]of [['life',.01,10],['size',.001,100],['rate',0,256],['delay',0,10],['speed',0,100]]){const val=e[key];if(val.t==='c')finite(val.v,label+' '+key,lo,hi);if(val.t==='r'){finite(val.a,label+' '+key,lo,hi);finite(val.b,label+' '+key,lo,hi);}}
  if(e.grav)scalar(e.grav,label+' gravity');
  color(e.color,label+' color');if(e.colorOL){color(e.colorOL,label+' lifetime color');if(e.colorOL.t==='grad'&&(e.colorOL.g.c.length!==e.colorOL.g.a.length||e.colorOL.g.c.some((k,i)=>k[0]!==e.colorOL.g.a[i][0])))throw new Error('Lifetime color and alpha keys need matching times');}if(e.sizeOL)scalar(e.sizeOL.x,label+' lifetime size');
  for(const key of ['pos','scale'])for(const axis of ['x','y','z'])finite(e[key]?.[axis],label+' '+key+'.'+axis);
  for(const axis of ['x','y','z','w'])finite(e.rot?.[axis],label+' rotation.'+axis);
  validateShape(e.shape,label+'.shape');
  if(!Array.isArray(e.bursts)||e.bursts.length>16)throw new Error(label+': invalid bursts');for(const b of e.bursts){if(!Array.isArray(b)||b.length!==4)throw new Error(label+': burst tuple required');finite(b[0],label,0,10);scalar(b[1],label+' burst count');if(b[1].t==='c')finite(b[1].v,label+' burst count',0,256);finite(b[2],label,1,100);finite(b[3],label,0.001,10);}
  if(![0,1,4].includes(e.render?.mode)||!e.render.mat)throw new Error(label+': invalid render mode/material');
  for(const texture of Object.values(e.render.mat.tex||{}))if(!project.textureMeta?.[texture])throw new Error(label+': missing texture '+texture);
  if(e.render.mode===4&&!project.meshMeta?.[e.render.mesh])throw new Error(label+': missing mesh');
 }
 // Prevent prototype-related properties from being persisted/merged.
 const walk=v=>{if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(k))throw new Error('Unsafe project property');walk(x);}};walk(project);
 return project;
}
export function validateMesh(mesh) {
 if(!mesh||!Array.isArray(mesh.pos)||!Array.isArray(mesh.uv)||!Array.isArray(mesh.idx)||!mesh.pos.length||mesh.pos.length%3||mesh.pos.length>300000||mesh.uv.length!==mesh.pos.length/3*2||mesh.idx.length%3||mesh.idx.length>900000||mesh.pos.some(v=>!Number.isFinite(v))||mesh.uv.some(v=>!Number.isFinite(v))||mesh.idx.some(v=>!Number.isInteger(v)||v<0||v>=mesh.pos.length/3)|| (mesh.nrm && (!Array.isArray(mesh.nrm)||mesh.nrm.length!==mesh.pos.length||mesh.nrm.some(v=>!Number.isFinite(v)))))throw new Error('Invalid mesh: finite pos/uv/nrm and triangle indices required');
 return mesh;
}
export function projectDocuments(project) {
 validateProject(project);const p=structuredClone(project),d=p.definition;
 const textures=new Set(),meshes=new Set();for(const e of d.emitters){Object.values(e.render.mat.tex||{}).forEach(t=>textures.add(t));if(e.render.mode===4)meshes.add(e.render.mesh);}
 d.id=p.id;d.duration=p.capture.duration;d.loop=false;d.textures=[...textures];d.meshes=[...meshes];d.roles=d.emitters.map(e=>e.name);
 const manifest={format:'clone-authored-pack-v1',effects:[{id:p.id,file:`fx/${p.id}.json`,name:p.name,capture:structuredClone(p.capture)}],textures:p.textureMeta||{},meshes:p.meshMeta||{}};
 return new Map([['manifest.json',manifest],[`fx/${p.id}.json`,d]]);
}
export function bytesToBase64(bytes){let out='';for(const byte of bytes)out+=String.fromCharCode(byte);return btoa(out);}
export function base64ToBytes(value){return Uint8Array.from(atob(value),c=>c.charCodeAt(0));}
export function projectPack(project) {
 const docs=projectDocuments(project),assets=new Map(project.assets.map(a=>[a.path,base64ToBytes(a.base64)]));
 return {async readJson(path){if(docs.has(path))return structuredClone(docs.get(path));return JSON.parse(new TextDecoder().decode(await this.readFile(path)));},
 async readFile(path){if(assets.has(path))return assets.get(path);throw new Error('Missing authored file: '+path);}};
}
export async function exportProjectPak(project) {
 const files=new Map([...projectDocuments(project)].map(([path,doc])=>[path,new TextEncoder().encode(JSON.stringify(doc))]));
 for(const asset of project.assets) {if(files.has(asset.path))throw new Error('Asset conflicts with project file');files.set(asset.path,base64ToBytes(asset.base64));}
 return writePak(files);
}
