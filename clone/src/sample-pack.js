// Original procedural definitions. No vendor content or pack is required.
const c = v => ({t:'c',v});
export const SAMPLE_EFFECTS = ['Original Burst', 'Original Ring', 'Original Fountain'];
export function createSamplePack() {
  const emitter = (id, color) => ({name:id, max:80, dur:1, delay:c(0), loop:false,
    bursts: id === 'Original Fountain' ? [] : [[0,c(36),1,0.01]],
    rate:c(id === 'Original Fountain' ? 36 : 0), life:{t:'r',a:0.45,b:0.95},
    speed:{t:'r',a:1,b:3}, size:{t:'r',a:0.12,b:0.35}, rotZ:c(0),
    color:{t:'col',v:color},
    shape:{type:id === 'Original Ring' ? 10 : id === 'Original Fountain' ? 4 : 0,
      radius:0.08, thick:1, arc:360, angle:18, scale:{x:1,y:1,z:1},
      rot:{x:id === 'Original Fountain' ? -90 : 0,y:0,z:0}, pos:{x:0,y:0,z:0}},
    render:{mat:{shader:'SH_HunFX_simple',kw:['_USECOLOR_ON']},mode:0,align:0,len:1},
    pos:{x:0,y:0,z:0},rot:{x:0,y:0,z:0,w:1},scale:{x:1,y:1,z:1}});
  const palette = [[1,0.25,0.03,1],[0.12,0.7,1,1],[0.55,0.3,1,1]];
  const docs = new Map([['manifest.json',{textures:{},meshes:{},effects:SAMPLE_EFFECTS.map((id,i)=>({id,file:`fx/sample-${i}.json`}))}]]);
  SAMPLE_EFFECTS.forEach((id,i)=>docs.set(`fx/sample-${i}.json`,{textures:[],meshes:[],emitters:[emitter(id,palette[i])]}));
  return {async readJson(path) {if(!docs.has(path)) throw new Error(`Unknown sample resource: ${path}`); return structuredClone(docs.get(path));},
    async readFile(path) {throw new Error(`No binary resource in original samples: ${path}`);}};
}
