// Sixteen original authored-data projects. Generated sprites are original analytic masks.
import {createProject,createLayer,bytesToBase64,projectDocuments,exportProjectPak} from '../src/author-project.js';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../gallery');
const scalar=(a,b=a)=>a===b?{t:'c',v:a}:{t:'r',a,b};
function layer(name,texture,color,count=30,speed=[1,3],size=[.2,.4],life=[.4,.9],shape=0) {
 const e=createLayer(name);e.bursts=[[0,scalar(count),1,.01]];e.life=scalar(...life);e.speed=scalar(...speed);e.size=scalar(...size);e.color={t:'col',v:color};e.shape.type=shape;e.shape.radius=.08;
 e.render.mat.tex={_MainTexture:texture};e.sizeOL={sep:false,x:{t:'k',s:1,k:[[0,.4,0,0],[.2,1,0,0],[1,.05,0,0]]}};
 e.colorOL={t:'grad',g:{m:0,c:[[0,1,1,1],[1,.5,.4,.3]],a:[[0,1],[1,0]]}};return e;
}
const orange=[1,.25,.03,1],blue=[.15,.55,1,1],green=[.2,1,.35,1],purple=[.65,.2,1,1],yellow=[1,.85,.25,1];
const specs=[
 ['ember_impact','Ember Impact',[layer('flash','glow',yellow,1,[0,0],[1,1.5],[.2,.35]),layer('embers','flame',orange,42,[1,4],[.15,.35],[.3,.9])]],
 ['frost_burst','Frost Burst',[layer('ice shards','spark',blue,44,[2,4],[.15,.35],[.4,1]),layer('cold haze','smoke',[.4,.8,1,1],12,[.3,1],[.4,.8],[.5,1])]],
 ['arcane_nova','Arcane Nova',[layer('stars','star',purple,30,[1,3],[.2,.5],[.4,1]),layer('core','glow',[1,.4,1,1],1,[0,0],[1,1],[.25,.4])]],
 ['toxic_splash','Toxic Splash',[layer('droplets','glow',green,40,[1,4],[.1,.3],[.4,1]),layer('mist','smoke',[.4,.8,.1,1],10,[.5,1.5],[.4,.7],[.5,1])]],
 ['holy_spark','Holy Spark',[layer('rays','spark',yellow,24,[1,3],[.15,.35],[.4,.8]),layer('cross stars','star',[1,1,.7,1],12,[.3,1],[.2,.5],[.5,1])]],
 ['void_collapse','Void Collapse',[layer('dark stars','star',purple,30,[-0+1,2],[.2,.4],[.5,1]),layer('void halo','ring',[.5,.15,.8,1],1,[0,0],[2,2],[.6,1])]],
 ['electric_pop','Electric Pop',[layer('electric sparks','spark',[.15,1,1,1],45,[1,4],[.1,.25],[.2,.6]),layer('ion glow','glow',blue,1,[0,0],[1,1],[.2,.35])]],
 ['dust_impact','Dust Impact',[layer('dust cloud','smoke',[.7,.5,.3,1],25,[.5,2],[.4,.9],[.5,1.2]),layer('debris','spark',[.9,.7,.4,1],18,[1,3],[.1,.2],[.4,.8])]],
 ['water_ring','Water Ring',[layer('ripple','ring',[.2,.6,1,1],1,[0,0],[2,2],[.6,1]),layer('water drops','glow',[.3,.8,1,1],28,[1,2],[.08,.2],[.3,.8])]],
 ['healing_wisp','Healing Wisp',[layer('healing stars','star',green,20,[.5,1.5],[.15,.3],[.5,1]),layer('soft aura','glow',[.3,1,.7,1],5,[.2,.5],[.5,.8],[.6,1.2])]],
 ['flame_jet','Flame Jet',[layer('jet','flame',orange,0,[2,4],[.2,.5],[.3,.6],4),layer('smoke','smoke',[.35,.25,.2,1],0,[1,2],[.4,.7],[.6,1],4)]],
 ['snowfall','Snowfall',[layer('flakes','star',[.6,.85,1,1],0,[.3,1],[.25,.4],[.8,1.4],5)]],
 ['meteor_trail','Meteor Trail',[layer('meteor head','glow',yellow,0,[1,2],[.3,.5],[.3,.5],4),layer('trail','flame',orange,0,[.8,2],[.15,.3],[.4,.7],4)]],
 ['petal_swirl','Petal Swirl',[layer('petals','flame',[1,.25,.55,1],28,[.5,2],[.15,.3],[.7,1.2]),layer('pollen','glow',yellow,12,[.3,1],[.04,.08],[.8,1.3])]],
 ['smoke_plume','Smoke Plume',[layer('plume','smoke',[.6,.65,.75,1],0,[.5,1.2],[.4,.9],[.6,1.2],4)]],
 ['comet_burst','Comet Burst',[layer('comets','spark',[.3,.7,1,1],32,[2,5],[.15,.4],[.4,1]),layer('star heart','star',[.8,.9,1,1],1,[0,0],[1,1],[.3,.5])]]
];
const entries=[];
for(const [i,[id,name,layers]]of specs.entries()) {
 const p=createProject();p.id=id;p.name=name;p.capture.duration=1.4;p.capture.seed=100+i;p.definition.emitters=layers;
 for(const e of layers) {
  const texture=e.render.mat.tex._MainTexture,path=`textures/${texture}.png`;
  if(!p.textureMeta[texture]){p.textureMeta[texture]={file:path,srgb:true,clamp:true,w:64,h:64};p.assets.push({path,base64:bytesToBase64(readFileSync(resolve(root,path)))});}
  if(!e.bursts[0][1].v){e.bursts=[];e.rate=scalar(id==='snowfall'?28:35);e.dur=1.2;e.shape.rot.x=-90;}
  if(id==='toxic_splash'||id==='dust_impact')e.grav=scalar(.4);
  if(id==='healing_wisp'||id==='petal_swirl')e.grav=scalar(-.15);
  if(id==='snowfall'){e.shape.scale={x:2,y:2,z:1};e.grav=scalar(.15);e.pos.y=1;}
  if(id==='smoke_plume'){e.sizeOL.x.k=[[0,.5,0,0],[.5,1.5,0,0],[1,2,0,0]];e.grav=scalar(-.1);}
  if(id==='water_ring'||id==='arcane_nova'){if(e.name.includes('ripple'))e.sizeOL.x.k=[[0,.1,0,0],[.3,.8,0,0],[1,1.5,0,0]];}
  if(id==='void_collapse')e.sizeOL.x.k=[[0,1.5,0,0],[.5,.9,0,0],[1,.01,0,0]];
 }
 writeFileSync(resolve(root,`projects/${id}.project.json`),JSON.stringify(p,null,2)+'\n');
 writeFileSync(resolve(root,`fx/${id}.json`),JSON.stringify(projectDocuments(p).get(`fx/${id}.json`),null,2)+'\n');
 entries.push({id,name,project:`projects/${id}.project.json`,json:`fx/${id}.json`,seed:p.capture.seed,duration:p.capture.duration});
}
writeFileSync(resolve(root,'manifest.json'),JSON.stringify({format:'original-author-gallery',license:'CC0-1.0',textureOrigin:'Original analytic masks generated for this project',effects:entries},null,2)+'\n');console.log('Authored '+entries.length+' original projects');
