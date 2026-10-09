import {chromium} from 'playwright-core';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const evidence=resolve(root,'clone/evidence/smoke');fs.mkdirSync(evidence,{recursive:true});
const browserPath=process.env.CLONE_CHROME;
if(!browserPath) throw new Error('Set CLONE_CHROME to a locally installed Chrome/Chromium executable');
(async()=>{
 const server=spawn(process.env.CLONE_PYTHON || 'python',['-u','-m','http.server','8124','--bind','127.0.0.1','--directory',root]);
 let browser;
 const checks=[]; const check=(name,pass)=>{checks.push({name,pass});if(!pass)throw new Error(name);};
 try {
 await new Promise((done,fail)=>{
   const timer=setTimeout(()=>fail(new Error('Local QA server did not become ready')),10000);
   server.once('error',error=>{clearTimeout(timer);fail(error);});
   server.once('exit',code=>{clearTimeout(timer);fail(new Error(`Local QA server exited ${code}`));});
   let ready='';const receive=chunk=>{ready+=chunk;if(ready.includes('Serving HTTP')){clearTimeout(timer);done();}};
   server.stderr.on('data',receive);server.stdout.on('data',receive);
 });
 browser=await chromium.launch({executablePath:browserPath,headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});

 const page=await browser.newPage({viewport:{width:1280,height:900},acceptDownloads:true});let errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8124/clone/');await page.waitForFunction(()=>window.cloneOutput);
 for(const id of ['Original Burst','Original Ring','Original Fountain']){
 await page.selectOption('#effect',id);await page.click('#render');await page.waitForFunction(()=>!document.querySelector('#render').disabled);
 check(id+' finite/colorful',await page.evaluate(()=>window.cloneOutput&&window.cloneOutput.palette.every(c=>c.every(Number.isFinite))&&window.cloneOutput.frames.some(f=>f.data.some((v,i)=>i%4!==3&&v>0))));
 for(const [button,name] of [['#gif',id+'-64.gif'],['#sheet',id+'-sheet.png']]){const [download]=await Promise.all([page.waitForEvent('download'),page.click(button)]);await download.saveAs(resolve(evidence,name));}
 await page.evaluate(()=>{document.querySelector('#scrub').value=5;document.querySelector('#scrub').dispatchEvent(new Event('input'));});
 await page.screenshot({path:resolve(evidence,id.replaceAll(' ','-')+'.png')});
 }
 await page.click('#play');await page.waitForFunction(()=>Number(document.querySelector('#scrub').value)!==5);check('playback advances',true);await page.click('#play');
 const before=await page.evaluate(()=>Array.from(window.cloneOutput.frames[4].data).join(','));await page.fill('#seed','2');await page.click('#render');await page.waitForFunction(()=>!document.querySelector('#render').disabled);const after=await page.evaluate(()=>Array.from(window.cloneOutput.frames[4].data).join(','));check('seed changes output',before!==after);
 await page.selectOption('#size','32');await page.click('#render');await page.waitForFunction(()=>!document.querySelector('#render').disabled);check('resolution applies',await page.evaluate(()=>window.cloneOutput.frames[0].width===32));
 await page.fill('#fps','51');await page.click('#render');await page.waitForFunction(()=>!document.querySelector('#render').disabled);check('invalid input shows error and disables export',await page.evaluate(()=>document.querySelector('#status').textContent.includes('fps must')&&document.querySelector('#gif').disabled));
 await page.fill('#fps','15');await page.click('#samples');await page.waitForFunction(()=>!document.querySelector('#render').disabled);check('recovery renders',await page.evaluate(()=>!!window.cloneOutput&&!document.querySelector('#gif').disabled));
 await page.setInputFiles('#pack',{name:'bad.pak',mimeType:'application/octet-stream',buffer:Buffer.from('bad')});await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Import failed'));check('invalid pack rejected',true);
 await page.click('#samples');await page.waitForFunction(()=>!document.querySelector('#render').disabled);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:resolve(evidence,'clone-mobile.png'),fullPage:true});check('mobile no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 check('no page errors',errors.length===0);
 fs.writeFileSync(resolve(evidence,'ui-results.json'),JSON.stringify({checks,errors},null,2));console.log(JSON.stringify(checks));
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
