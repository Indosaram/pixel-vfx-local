import {chromium} from 'playwright-core';import {spawn} from 'node:child_process';import {readFileSync,writeFileSync} from 'node:fs';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..'),gallery=resolve(root,'clone/gallery');
const manifest=JSON.parse(readFileSync(resolve(gallery,'manifest.json')));
const server=spawn(process.env.CLONE_PYTHON||'python',['-u','-m','http.server','8124','--bind','127.0.0.1','--directory',root]);let browser;
try{
 await new Promise((done,fail)=>{const t=setTimeout(()=>fail(new Error('server timeout')),10000);const data=b=>{if(b.toString().includes('Serving HTTP')){clearTimeout(t);done();}};server.stdout.on('data',data);server.stderr.on('data',data);server.once('error',fail);});
 browser=await chromium.launch({executablePath:process.env.CLONE_CHROME,headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const page=await browser.newPage({acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());await page.goto('http://127.0.0.1:8124/clone/author.html');await page.waitForFunction(()=>window.authorOutput).catch(async e=>{console.error('INITIAL STATUS',await page.locator('#status').textContent(),errors);throw e;});await page.locator('#auto').uncheck();const results=[];
 for(const item of manifest.effects) {
  await page.setInputFiles('#load',resolve(gallery,item.project));await page.waitForFunction(id=>window.authorOutput&&window.authorProject.id===id&&!document.querySelector('#render').disabled,item.id).catch(async e=>{console.error('LOAD STATUS',item.id,await page.locator('#status').textContent(),errors);throw e;});
  for(const size of ['64','32']){
   await page.selectOption('#size',size);await page.click('#render');await page.waitForFunction(()=>window.authorOutput&&!document.querySelector('#render').disabled);
   const summary=await page.evaluate(()=>({frames:window.authorOutput.frameCount,colored:window.authorOutput.frames.reduce((n,f)=>n+f.data.filter((v,i)=>i%4===3&&v>0).length,0)}));if(!summary.colored)throw new Error(item.id+' blank');
   for(const [button,ext]of [['#gif','gif'],['#sheet','png']]){const[download]=await Promise.all([page.waitForEvent('download'),page.click(button)]);await download.saveAs(resolve(gallery,`out/${item.id}_${size}.${ext}`));}
   results.push({id:item.id,size,...summary});
  }
 }
 if(errors.length)throw new Error(errors.join(';'));writeFileSync(resolve(gallery,'render-receipts.json'),JSON.stringify({renderer:'clone',host:'Linux Chrome software WebGL',fps:15,duration:1.4,results},null,2)+'\n');console.log(JSON.stringify(results));
}finally{await browser?.close();server.kill();}
