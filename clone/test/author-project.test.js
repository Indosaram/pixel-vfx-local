import {expect,test} from 'bun:test';
import {createProject,createLayer,validateProject,projectDocuments,projectPack,exportProjectPak,bytesToBase64} from '../src/author-project.js';
import {openPak,transformPakBytes} from '../src/wire-pak.js';
import {writePak} from '../src/pak-writer.js';

test('authored project defaults and layers contain no vendor assets',()=>{const p=createProject();expect(validateProject(p)).toBe(p);expect(p.assets).toEqual([]);expect(p.definition.emitters.length).toBe(1);expect(projectDocuments(p).get('manifest.json').effects[0].id).toBe(p.id);expect(createLayer('smoke').name).toBe('smoke');});
test('pack transform is symmetric; arbitrary authored bytes round-trip',async()=>{const bytes=new Uint8Array(9000).map((_,i)=>i%251);expect(transformPakBytes(transformPakBytes(bytes,'textures/a.bin'),'textures/a.bin')).toEqual(bytes);const manifest=new TextEncoder().encode('{"effects":[]}');const files=new Map([['manifest.json',manifest],['textures/a.bin',bytes]]);const pak=await openPak(await writePak(files));expect(await pak.readFile('textures/a.bin')).toEqual(bytes);expect(await pak.readJson('manifest.json')).toEqual({effects:[]});});
test('authored pack export is deterministic and matches direct project read',async()=>{const p=createProject();p.definition.emitters.push(createLayer('sparks'));const a=await exportProjectPak(p),b=await exportProjectPak(p);expect(a).toEqual(b);const pak=await openPak(a),direct=projectPack(p);expect(await pak.readJson('manifest.json')).toEqual(await direct.readJson('manifest.json'));expect(await pak.readJson('fx/my_effect.json')).toEqual(await direct.readJson('fx/my_effect.json'));});
test('owned texture and mesh assets export/read intact',async()=>{const p=createProject(),png=new Uint8Array([137,80,78,71]);const mesh={pos:[0,0,0,1,0,0,0,1,0],uv:[0,0,1,0,0,1],idx:[0,1,2]};p.assets=[{path:'textures/a.png',base64:bytesToBase64(png)},{path:'meshes/a.json',base64:bytesToBase64(new TextEncoder().encode(JSON.stringify(mesh)))}];p.textureMeta={a:{file:'textures/a.png',srgb:true,clamp:true}};p.meshMeta={tri:{file:'meshes/a.json'}};p.definition.emitters[0].render.mat.tex={_MainTexture:'a'};const pak=await openPak(await exportProjectPak(p));expect(await pak.readFile('textures/a.png')).toEqual(png);expect(await pak.readJson('meshes/a.json')).toEqual(mesh);expect((await pak.readJson('fx/my_effect.json')).textures).toEqual(['a']);});
test('scalar and color lifetime curves survive project and pack round-trip',async()=>{const p=createProject();p.definition.emitters[0].sizeOL={sep:false,x:{t:'k',s:1,k:[[0,1,0,0],[.5,2,0,0],[1,0,0,0]]}};p.definition.emitters[0].colorOL={t:'grad',g:{m:0,c:[[0,1,1,1],[1,1,0,0]],a:[[0,1],[1,0]]}};validateProject(p);const pak=await openPak(await exportProjectPak(p));expect((await pak.readJson('fx/my_effect.json')).emitters[0].sizeOL.x.k.length).toBe(3);});
test('invalid project boundaries reject before pack creation',()=>{for(const edit of [p=>p.id='../bad',p=>p.version=2,p=>p.definition.emitters=[],p=>p.definition.emitters[0].life={t:'r',a:2,b:1},p=>p.definition.emitters[0].sizeOL={x:{t:'k',s:1,k:[[1,1,0,0],[0,0,0,0]]}},p=>p.assets=[{path:'../a',base64:''}],p=>p.definition.emitters[0].render.mat.tex={_MainTexture:'missing'},p=>p.definition.emitters[0].render.mode=9,p=>p.definition.emitters[0].max=2.5,p=>p.definition.emitters[0].color={t:'col',v:[NaN,0,0,1]}]){const p=createProject();edit(p);expect(()=>validateProject(p)).toThrow();}});
test('pack writer refuses missing manifest, invalid paths and non-byte payload',async()=>{await expect(writePak(new Map())).rejects.toThrow('manifest');await expect(writePak(new Map([['manifest.json',new Uint8Array()],['../bad',new Uint8Array()]]))).rejects.toThrow('path');await expect(writePak(new Map([['manifest.json','text']]))).rejects.toThrow('Uint8Array');});

test('project validates capture, asset conflicts and lifetime color alignment',()=>{
 for(const edit of [p=>p.capture.fps=51,p=>p.capture.duration=NaN,p=>p.assets=[{path:'manifest.json',base64:''}],p=>p.definition.emitters[0].rate={t:'c',v:-1},p=>p.definition.emitters[0].loop='yes',p=>p.definition.emitters[0].colorOL={t:'grad',g:{m:0,c:[[0,1,1,1],[1,0,0,0]],a:[[0,1],[.5,0]]}}]){const p=createProject();edit(p);expect(()=>validateProject(p)).toThrow();}
});
test('mesh import rejects invalid topology and preserves optional normals',async()=>{
 const {validateMesh}=await import('../src/author-project.js');
 const mesh={pos:[0,0,0,1,0,0,0,1,0],uv:[0,0,1,0,0,1],idx:[0,1,2],nrm:[0,0,1,0,0,1,0,0,1]};
 expect(validateMesh(mesh)).toBe(mesh);
 for(const edit of [m=>m.idx=[0,1,9],m=>m.pos[0]=NaN,m=>m.nrm=[1],m=>m.uv=[0,0],m=>m.idx=[0,1]]){const next=structuredClone(mesh);edit(next);expect(()=>validateMesh(next)).toThrow();}
});
test('project preserves supported random curves and safe project JSON round-trip',async()=>{
 const p=createProject();p.definition.emitters[0].speed={t:'rk',s:1,a:[[0,1,0,0],[1,2,0,0]],b:[[0,2,0,0],[1,3,0,0]]};
 expect(validateProject(JSON.parse(JSON.stringify(p)))).toEqual(p);
 await expect(projectPack(p).readFile('absent')).rejects.toThrow('Missing authored');
});


test('authored pack stores capture settings for nondefault round-trip',async()=>{
 const p=createProject();p.capture={size:32,fps:12,duration:1,seed:9,elevation:45,facing:60,colors:8};
 const pak=await openPak(await exportProjectPak(p));expect((await pak.readJson('manifest.json')).effects[0].capture).toEqual(p.capture);
});
