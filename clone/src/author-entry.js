import * as THREE from 'three';
import {createProject,createLayer,validateProject,projectPack,exportProjectPak,bytesToBase64,validateMesh} from './author-project.js';
import {renderEffectClone} from './standalone-renderer.js';
const $=id=>document.getElementById(id);
let project=createProject(),selected=0,result=null,playing=false,raf=0,index=0,last=0,timer,dirty=false,revision=0,running=false;
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true}),ctx=$('preview').getContext('2d');
function status(text){$('status').textContent=text;}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function stop(){playing=false;cancelAnimationFrame(raf);$('play').textContent='Play';}
function showFrame(n){if(!result)return;index=(n+result.frames.length)%result.frames.length;ctx.putImageData(result.frames[index],0,0);$('scrub').value=index;$('frame').textContent=`${index+1} / ${result.frames.length}`;}
function animate(t){if(!playing)return;if(t-last>=1000/result.captured.fps){showFrame(index+1);last=t;}raf=requestAnimationFrame(animate);}
$('play').onclick=()=>{if(!result)return;if(playing)stop();else{playing=true;last=0;$('play').textContent='Pause';raf=requestAnimationFrame(animate);}};
$('scrub').oninput=()=>{stop();showFrame(Number($('scrub').value));};
function changed(){dirty=true;revision++;$('gif').disabled=true;$('sheet').disabled=true;$('advanced').value=JSON.stringify(project.definition.emitters[selected],null,2);if($('auto').checked){clearTimeout(timer);timer=setTimeout(render,350);}else status('Changes pending. Press Render now.');}
async function render(){clearTimeout(timer);if(running)return;running=true;const version=revision;stop();$('render').disabled=true;status('Rendering authored effect...');window.authorOutput=null;
 try{validateProject(project);const copy=structuredClone(project);const output=await renderEffectClone({...copy.capture,effectId:copy.id,pack:projectPack(copy),renderer});if(version===revision){result=output;$('preview').width=output.frames[0].width;$('preview').height=output.frames[0].height;$('scrub').max=output.frameCount-1;showFrame(0);$('gif').disabled=false;$('sheet').disabled=false;status(`${output.frameCount} frames rendered. ${project.definition.emitters.length} authored layers. Project ${dirty?'not saved':'ready'}.`);window.authorOutput=output;window.authorProject=structuredClone(project);}}
 catch(error){result=null;ctx.clearRect(0,0,$('preview').width,$('preview').height);$('gif').disabled=true;$('sheet').disabled=true;status('Validation/render failed: '+(error.message||String(error)));}
 finally{running=false;$('render').disabled=false;if(version!==revision&&$('auto').checked)timer=setTimeout(render,100);}}
$('render').onclick=render;
function refreshLayers(){const layers=project.definition.emitters;$('layers').replaceChildren(...layers.map((e,i)=>new Option(e.name,String(i))));$('layers').value=String(selected);$('delete').disabled=layers.length===1;$('add').disabled=layers.length>=16;$('duplicate').disabled=layers.length>=16;}
function row(label,element){const l=document.createElement('label'),span=document.createElement('span');span.textContent=label;l.append(span,element);return l;}
function number(label,value,change,min=-1000,max=1000,step=.01){const input=document.createElement('input');input.type='number';input.value=value;input.min=min;input.max=max;input.step=step;input.setAttribute('aria-label',label);input.oninput=()=>{change(Number(input.value));changed();};return row(label,input);}
function pair(label,value,change,min=0,max=1000){const div=document.createElement('div');div.className='pair';for(const key of ['a','b']){const input=document.createElement('input');input.type='number';input.value=value.t==='r'?value[key]:value.v||0;input.min=min;input.max=max;input.step=.01;input.setAttribute('aria-label',`${label} ${key==='a'?'min':'max'}`);div.append(input);input.oninput=()=>{const values=[...div.children].map(el=>Number(el.value));change({t:'r',a:values[0],b:values[1]});changed();};}return row(label,div);}
function select(label,options,current,change){const input=document.createElement('select');input.setAttribute('aria-label',label);for(const [value,name]of options)input.append(new Option(name,value));input.value=String(current);input.onchange=()=>{change(input.value);changed();};return row(label,input);}
function hex(color){return '#'+color.slice(0,3).map(v=>Math.round(Math.min(1,Math.max(0,v))*255).toString(16).padStart(2,'0')).join('');}
function rgba(value){return [1,3,5].map(i=>parseInt(value.slice(i,i+2),16)/255).concat(1);}
function curveEditor(container,emitter){
 const title=document.createElement('div');title.className='curve-title';title.textContent='Size over lifetime (time 0-1 / multiplier)';container.append(title);
 const check=document.createElement('input');check.type='checkbox';check.checked=!!emitter.sizeOL;check.setAttribute('aria-label','Enable size curve');container.append(row('Size curve',check));
 check.onchange=()=>{if(check.checked)emitter.sizeOL={sep:false,x:{t:'k',s:1,k:[[0,1,0,0],[1,0,0,0]]}};else delete emitter.sizeOL;form();changed();};
 if(emitter.sizeOL){const keys=emitter.sizeOL.x.k;if(!keys){const text=document.createElement('p');text.textContent='Advanced scalar curve: edit JSON.';container.append(text);return;}
 for(const [i,key]of keys.entries()){const div=document.createElement('div');div.className='curve-keys';for(const j of [0,1]){const input=document.createElement('input');input.type='number';input.min=0;input.max=j===0?1:10;input.step=.01;input.value=key[j];input.setAttribute('aria-label',`Size curve ${i} ${j===0?'time':'value'}`);input.oninput=()=>{key[j]=Number(input.value);changed();};div.append(input);}const del=document.createElement('button');del.textContent='×';del.disabled=keys.length<=2;del.onclick=()=>{keys.splice(i,1);form();changed();};div.append(del);container.append(div);}
 const add=document.createElement('button');add.textContent='Add size key';add.disabled=keys.length>=32;add.onclick=()=>{let largest=0,at=0;for(let i=0;i<keys.length-1;i++){const gap=keys[i+1][0]-keys[i][0];if(gap>largest){largest=gap;at=i;}}keys.splice(at+1,0,[(keys[at][0]+keys[at+1][0])/2,(keys[at][1]+keys[at+1][1])/2,0,0]);form();changed();};container.append(add);}
 const colorTitle=document.createElement('div');colorTitle.className='curve-title';colorTitle.textContent='Color / fade over lifetime';container.append(colorTitle);
 const fade=document.createElement('input');fade.type='checkbox';fade.checked=!!emitter.colorOL;fade.setAttribute('aria-label','Enable color curve');container.append(row('Color curve',fade));fade.onchange=()=>{if(fade.checked)emitter.colorOL={t:'grad',g:{m:0,c:[[0,1,1,1],[1,1,.1,0]],a:[[0,1],[1,0]]}};else delete emitter.colorOL;form();changed();};
 if(emitter.colorOL?.t==='grad') {
  const gradient=emitter.colorOL.g;
  for(const [i,key]of gradient.c.entries()) {
   const div=document.createElement('div');div.className='curve-keys';
   const time=document.createElement('input');time.type='number';time.min=0;time.max=1;time.step=.01;time.value=key[0];time.setAttribute('aria-label',`Color curve ${i} time`);time.oninput=()=>{key[0]=Number(time.value);gradient.a[i][0]=key[0];changed();};
   const color=document.createElement('input');color.type='color';color.value=hex(key.slice(1).concat(1));color.setAttribute('aria-label',`Lifetime color ${i}`);color.oninput=()=>{key.splice(1,3,...rgba(color.value).slice(0,3));changed();};
   const del=document.createElement('button');del.textContent='×';del.disabled=gradient.c.length<=2;del.onclick=()=>{gradient.c.splice(i,1);gradient.a.splice(i,1);form();changed();};
   div.append(time,color,del);container.append(div);
   container.append(number(`Alpha key ${i}`,gradient.a[i]?.[1]??1,v=>{gradient.a[i][1]=v;},0,1));
  }
  const add=document.createElement('button');add.textContent='Add color key';add.disabled=gradient.c.length>=32;add.onclick=()=>{let at=0,gap=0;for(let i=0;i<gradient.c.length-1;i++)if(gradient.c[i+1][0]-gradient.c[i][0]>gap){gap=gradient.c[i+1][0]-gradient.c[i][0];at=i;}const l=gradient.c[at],r=gradient.c[at+1],t=(l[0]+r[0])/2;gradient.c.splice(at+1,0,[t,...[1,2,3].map(j=>(l[j]+r[j])/2)]);gradient.a.splice(at+1,0,[t,(gradient.a[at][1]+gradient.a[at+1][1])/2]);form();changed();};container.append(add);
 }

}
function form(){refreshLayers();const e=project.definition.emitters[selected],container=$('layer-form');container.replaceChildren();const name=document.createElement('input');name.value=e.name;name.maxLength=80;name.setAttribute('aria-label','Layer name');name.oninput=()=>{e.name=name.value;refreshLayers();changed();};container.append(row('Layer name',name));
 container.append(number('Burst particles',e.bursts[0]?.[1]?.v||0,v=>{e.bursts=v?[[0,{t:'c',v},1,.01]]:[];},0,256,1));
 const loop=document.createElement('input');loop.type='checkbox';loop.checked=!!e.loop;loop.setAttribute('aria-label','Loop emission');loop.onchange=()=>{e.loop=loop.checked;changed();};container.append(row('Loop emission',loop));
 container.append(number('Emission duration',e.dur,v=>{e.dur=v;},.01,10),number('Delay (sec)',e.delay.v||0,v=>{e.delay={t:'c',v};},0,10),number('Rate / sec',e.rate.v||0,v=>{e.rate={t:'c',v};},0,256,1));
 container.append(pair('Life (sec)',e.life,v=>{e.life=v;},.01,10),pair('Speed',e.speed,v=>{e.speed=v;},0,100),pair('Size',e.size,v=>{e.size=v;},.001,100));
 const color=document.createElement('input');color.type='color';color.value=hex(e.color.v||[1,1,1,1]);color.setAttribute('aria-label','Particle color');color.oninput=()=>{e.color={t:'col',v:rgba(color.value)};changed();};container.append(row('Color',color));
 container.append(select('Shape',[[0,'Sphere'],[4,'Cone'],[10,'Ring'],[5,'Box']],e.shape.type,v=>{e.shape.type=Number(v);}));
 container.append(number('Spawn radius',e.shape.radius,v=>{e.shape.radius=v;},0,100),number('Cone angle',e.shape.angle,v=>{e.shape.angle=v;},0,180));
 for(const axis of ['x','y','z'])container.append(number('Position '+axis.toUpperCase(),e.pos[axis],v=>{e.pos[axis]=v;},-100,100));
 container.append(number('Gravity',e.grav?.v||0,v=>{e.grav={t:'c',v};},-20,20));
 container.append(select('Texture', [['','White / none'],...Object.keys(project.textureMeta).map(k=>[k,k])],e.render.mat.tex?._MainTexture||'',v=>{e.render.mat={shader:'SH_HunFX_simple',kw:['_USECOLOR_ON'],c:{_uv:[1,1,0,0]},tex:v?{_MainTexture:v}:{}};}));
 container.append(select('Geometry',[['','Billboard'],...Object.keys(project.meshMeta).map(k=>[k,k])],e.render.mode===4?e.render.mesh:'',v=>{e.render.mode=v?4:0;e.render.mesh=v||null;}));
 curveEditor(container,e);$('advanced').value=JSON.stringify(e,null,2);
}
function projectForm(){for(const key of ['name','id'])$(key).value=project[key];for(const key of ['size','fps','duration','seed','colors','elevation','facing'])$(key).value=project.capture[key];form();}
for(const key of ['name','id'])$(key).oninput=()=>{project[key]=$(key).value;changed();};
for(const key of ['size','fps','duration','seed','colors','elevation','facing'])$(key).oninput=()=>{project.capture[key]=Number($(key).value);changed();};
$('layers').onchange=()=>{selected=Number($('layers').value);form();};
$('add').onclick=()=>{project.definition.emitters.push(createLayer('Layer '+(project.definition.emitters.length+1)));selected=project.definition.emitters.length-1;form();changed();};
$('duplicate').onclick=()=>{const e=structuredClone(project.definition.emitters[selected]);e.name+=' copy';project.definition.emitters.push(e);selected=project.definition.emitters.length-1;form();changed();};
$('delete').onclick=()=>{if(project.definition.emitters.length>1){project.definition.emitters.splice(selected,1);selected=Math.min(selected,project.definition.emitters.length-1);form();changed();}};
$('new').onclick=()=>{if(dirty&&!confirm('Discard unsaved changes?'))return;project=createProject();selected=0;dirty=false;revision++;projectForm();render();};
$('save').onclick=()=>{try{validateProject(project);download(new Blob([JSON.stringify(project,null,2)],{type:'application/json'}),project.id+'.project.json');dirty=false;status('Project downloaded. Store it to keep editing later.');}catch(e){status(e.message);}};
$('load').onchange=async()=>{const file=$('load').files[0];if(!file)return;if(dirty&&!confirm('Replace unsaved project?'))return;try{if(file.size>40*1024*1024)throw new Error('Project file too large');const next=validateProject(JSON.parse(await file.text()));project=next;selected=0;dirty=false;revision++;projectForm();await render();}catch(e){status('Load failed: '+e.message);}finally{$('load').value='';}};
$('pak').onclick=async()=>{try{const bytes=await exportProjectPak(project);download(new Blob([bytes],{type:'application/octet-stream'}),project.id+'.pak');status('Authored .pak downloaded. Our-clone compatible; original app unverified.');}catch(e){status('Pack export failed: '+e.message);}};
$('apply-json').onclick=()=>{try{const candidate=JSON.parse($('advanced').value),copy=structuredClone(project);copy.definition.emitters[selected]=candidate;validateProject(copy);project=copy;form();changed();}catch(e){status('Layer JSON rejected: '+e.message);}};
$('gif').onclick=()=>download(new Blob([result.gifBytes],{type:'image/gif'}),project.id+'.gif');
$('sheet').onclick=()=>{const cols=Math.ceil(Math.sqrt(result.frameCount)),rows=Math.ceil(result.frameCount/cols),w=result.frames[0].width,h=result.frames[0].height;const canvas=document.createElement('canvas');canvas.width=cols*w;canvas.height=rows*h;const context=canvas.getContext('2d');result.frames.forEach((f,i)=>context.putImageData(f,(i%cols)*w,Math.floor(i/cols)*h));canvas.toBlob(blob=>download(blob,project.id+'.png'));};
async function importAsset(input,kind){const file=input.files[0];if(!file)return;const owner=project;try{if(file.size>8*1024*1024)throw new Error('Asset limit:8 MiB');if(owner!==project)throw new Error('Project changed during asset import');const id=kind+'_'+Date.now().toString(36),bytes=new Uint8Array(await file.arrayBuffer());let path;if(kind==='texture'){const bitmap=await createImageBitmap(new Blob([bytes]));if(bitmap.width>4096||bitmap.height>4096){bitmap.close();throw new Error('Image limit:4096px');}path=`textures/${id}.img`;project.textureMeta[id]={file:path,srgb:true,clamp:true,w:bitmap.width,h:bitmap.height};bitmap.close();}else{const mesh=JSON.parse(new TextDecoder().decode(bytes));validateMesh(mesh);path=`meshes/${id}.json`;project.meshMeta[id]={file:path};}project.assets.push({path,base64:bytesToBase64(bytes)});form();changed();status('Asset added. Select it in the layer Texture / Geometry control.');}catch(e){status('Asset rejected: '+e.message);}finally{input.value='';}}
$('texture-import').onchange=()=>importAsset($('texture-import'),'texture');$('mesh-import').onchange=()=>importAsset($('mesh-import'),'mesh');
window.addEventListener('beforeunload',e=>{stop();if(dirty){e.preventDefault();e.returnValue='';}});
projectForm();render();
