import * as THREE from 'three';
import {renderEffectClone} from './standalone-renderer.js';
import {createSamplePack,SAMPLE_EFFECTS} from './sample-pack.js';
import {openPak} from './wire-pak.js';
const $ = id => document.getElementById(id);
let sourceLabel = 'Original sample content';
let pack = createSamplePack(), output = null, playing = false, raf = 0, last=0, index=0;
const context=$('preview').getContext('2d');
let renderer;
try {renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});}
catch(error) {$('status').textContent='WebGL2 unavailable. Use a browser/GPU with WebGL2 support.';$('render').disabled=true;throw error;}
function showFrame(n) {if(!output) return; index=(n+output.frames.length)%output.frames.length; context.putImageData(output.frames[index],0,0); $('scrub').value=index; $('frame').textContent=`${index+1} / ${output.frames.length}`;}
function animate(t) {if(!playing)return; if(t-last>=1000/(output?.captured.fps || Number($('fps').value))){showFrame(index+1);last=t;}raf=requestAnimationFrame(animate);}
function stop(){playing=false;cancelAnimationFrame(raf);$('play').textContent='Play';}
function fillEffects(ids) {$('effect').replaceChildren(...ids.map(id=>new Option(id,id)));}
fillEffects(SAMPLE_EFFECTS);
$('play').onclick=()=>{if(!output)return;if(playing)stop();else{playing=true;last=0;$('play').textContent='Pause';raf=requestAnimationFrame(animate);}};
$('scrub').oninput=()=>{stop();showFrame(Number($('scrub').value));};
async function render() {
  stop(); window.cloneOutput=null; $('render').disabled=true; $('gif').disabled=true;$('sheet').disabled=true;
  for(const control of document.querySelectorAll('aside input,aside select,aside button'))control.disabled=true;
  $('status').textContent='Capturing and converting frames...';
  try {
    output=await renderEffectClone({pack,effectId:$('effect').value,size:Number($('size').value),fps:Number($('fps').value),duration:Number($('duration').value),colors:Number($('colors').value),seed:Number($('seed').value),elevation:Number($('elevation').value),facing:Number($('facing').value),renderer});
    $('preview').width=output.frames[0].width; $('preview').height=output.frames[0].height;
    $('scrub').max=output.frames.length-1; showFrame(0);
    $('status').textContent=`${output.frameCount} frames, ${$('size').value} x ${$('size').value}, GIF ready. ${sourceLabel}; vendor parity unverified.`;
    $('gif').disabled=false;$('sheet').disabled=false;
    window.cloneOutput=output;
  } catch(error) {output=null;context.clearRect(0,0,$('preview').width,$('preview').height);$('status').textContent=`Render failed: ${error.message || String(error)}`;}
  finally {for(const control of document.querySelectorAll('aside input,aside select,aside button'))control.disabled=false;}
}
$('render').onclick=render;
function download(blob,name) {const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('gif').onclick=()=>download(new Blob([output.gifBytes],{type:'image/gif'}),'clone-effect.gif');
$('sheet').onclick=()=>{const cols=Math.ceil(Math.sqrt(output.frames.length)),rows=Math.ceil(output.frames.length/cols),w=output.frames[0].width,h=output.frames[0].height;const canvas=document.createElement('canvas');canvas.width=cols*w;canvas.height=rows*h;const c=canvas.getContext('2d');output.frames.forEach((f,i)=>c.putImageData(f,(i%cols)*w,Math.floor(i/cols)*h));canvas.toBlob(blob=>download(blob,'clone-effect-sheet.png'),'image/png');};
$('pack').onchange=async()=>{const file=$('pack').files[0];if(!file)return;stop();if(file.size>128*1024*1024){$('status').textContent='Import failed: maximum pack size is 128 MiB';return;}try{const candidate=await openPak(new Uint8Array(await file.arrayBuffer()));const manifest=await candidate.readJson('manifest.json');if(!Array.isArray(manifest.effects)||!manifest.effects.length)throw new Error('Pack contains no effect catalog');pack=candidate;sourceLabel='Local imported pack';fillEffects(manifest.effects.map(e=>e.id));if(manifest.format==='clone-authored-pack-v1'){const settings=manifest.effects[0].capture;for(const key of ['size','fps','duration','seed','colors','elevation','facing'])if(settings?.[key]!==undefined)$(key).value=String(settings[key]);}$('source').textContent=`Local pack: ${file.name}. Confirm you have permission to use its content.`;await render();}catch(e){$('status').textContent=`Import failed: ${e.message}`;}};
$('samples').onclick=()=>{pack=createSamplePack();sourceLabel='Original sample content';fillEffects(SAMPLE_EFFECTS);$('source').textContent='Three original procedural samples. No vendor pack required.';render();};
window.addEventListener('beforeunload',()=>{stop();renderer.dispose();});
render();
