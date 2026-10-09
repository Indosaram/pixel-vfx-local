// Private pack QA: never copy the pack or extracted assets into the repository.
import {chromium} from 'playwright-core';
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const pack=process.env.HUN0FX_PAK,chrome=process.env.CLONE_CHROME;
if(!pack||!chrome)throw new Error('Set HUN0FX_PAK and CLONE_CHROME');
const output=resolve(root,'clone/evidence/vendor-pack');mkdirSync(output,{recursive:true});
const server=spawn(process.env.CLONE_PYTHON||'python',['-u','-m','http.server','8124','--bind','127.0.0.1','--directory',root]);
let browser;
try {
 await new Promise((done,fail)=>{const timer=setTimeout(()=>fail(new Error('Server timeout')),10000);server.once('error',e=>{clearTimeout(timer);fail(e);});server.once('exit',code=>{clearTimeout(timer);fail(new Error(`Server exited ${code}`));});const data=chunk=>{if(chunk.toString().includes('Serving HTTP')){clearTimeout(timer);done();}};server.stdout.on('data',data);server.stderr.on('data',data);});
 browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1280,height:900},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8124/clone/');await page.waitForFunction(()=>window.cloneOutput);
 await page.fill('#duration','0.77');await page.setInputFiles('#pack',pack);
 await page.waitForFunction(()=>document.querySelector('#source').textContent.includes('Local pack')&&!document.querySelector('#render').disabled);
 const catalogCount=await page.locator('#effect option').count(),results=[];
 for(const id of ['Hit_01_Fire','Slash_fire','Blast_Electricity_01'])for(const size of ['64','32']) {
  await page.selectOption('#effect',id);await page.selectOption('#size',size);await page.click('#render');await page.waitForFunction(()=>!document.querySelector('#render').disabled);
  const result=await page.evaluate(()=>({status:document.querySelector('#status').textContent,frames:window.cloneOutput?.frameCount,palette:window.cloneOutput?.palette}));
  if(!result.frames||!result.palette.every(c=>c.every(Number.isFinite)))throw new Error(JSON.stringify(result));
  for(const [button,ext]of [['#gif','gif'],['#sheet','png']]){const [download]=await Promise.all([page.waitForEvent('download'),page.click(button)]);await download.saveAs(resolve(output,`${id}-${size}.${ext}`));}
  await page.evaluate(()=>{document.querySelector('#scrub').value=3;document.querySelector('#scrub').dispatchEvent(new Event('input'));});
  if(size==='64')await page.screenshot({path:resolve(output,`${id}.png`)});
  results.push({id,size,...result});
 }
 if(errors.length)throw new Error(errors.join('; '));
 writeFileSync(resolve(output,'results.json'),JSON.stringify({catalogCount,errors,results},null,2));console.log(JSON.stringify({catalogCount,renders:results.length,errors}));
} finally {await browser?.close();server.kill();}
