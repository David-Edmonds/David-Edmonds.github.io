import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
const source=path.resolve('public/rooted-together'),published=path.resolve('docs/rooted-together');
async function files(dir){const all=[];for(const entry of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())all.push(...await files(p));else all.push(p);}return all;}
test('Rooted Together keeps all seven days and separate personal views',async()=>{
 const context={window:{}};vm.runInNewContext(await readFile(path.join(source,'assets/data.js'),'utf8'),context);const data=context.window.ROOTED_DATA;
 assert.equal(data.days.length,7);for(const d of data.days){assert.notEqual(d.roles.husband.reflection,d.roles.wife.reflection);assert.equal(d.roles.husband.questions.length,2);assert.equal(d.roles.wife.questions.length,2);const html=await readFile(path.join(published,'days/day-'+d.id+'.html'),'utf8');assert(html.includes('data-day="'+d.id+'"'));assert(html.includes('name="robots" content="noindex,nofollow"'));}
 const app=await readFile(path.join(source,'assets/app.js'),'utf8');assert(app.includes('day-view-switch'));assert(app.includes('data-role="husband"'));assert(app.includes('data-role="wife"'));assert(app.includes('record._savedAt'));assert(app.includes('readingFold'));assert(app.includes('https://www.esv.org/crossref/'));
});
test('Rooted Together exports exact assets without personal keys or emails',async()=>{
 for(const file of await files(source)){const relative=path.relative(source,file),body=await readFile(file);assert.deepEqual(await readFile(path.join(published,relative)),body,relative);const text=body.toString();assert(!/rt_(?:husband|wife)_[A-Za-z0-9_-]{43}/.test(text),'Personal key leaked into '+relative);assert(!/@gmail\.com/.test(text));}
 for(const name of ['app','shared','connection','config','data'])new vm.Script(await readFile(path.join(source,'assets',name+'.js'),'utf8'));
 const config={window:{}};vm.runInNewContext(await readFile(path.join(source,'assets/config.js'),'utf8'),config);assert.equal(config.window.ROOTED_DEPLOY.auth,'personal-link');
});
test('Rooted Together stays inside its own Pages folder',async()=>{
 for(const file of await files(published)){if(!file.endsWith('.html'))continue;const html=await readFile(file,'utf8');for(const [,url] of html.matchAll(/(?:src|href)="(\/[^"#?]+)(?:[^"]*)"/g)){assert(url.startsWith('/rooted-together/'),url);const target=url.slice('/rooted-together/'.length)||'index.html';assert(await readFile(path.join(published,target)),target);}}
 const manifest=JSON.parse(await readFile(path.join(source,'manifest.webmanifest'),'utf8'));assert.equal(manifest.scope,'/rooted-together/');assert.equal(manifest.start_url,'/rooted-together/');const sw=await readFile(path.join(source,'sw.js'),'utf8');assert(sw.includes("!u.pathname.startsWith(BASE)"));
});
