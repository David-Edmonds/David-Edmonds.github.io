import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const storage=new Map([['rooted-together.v1',JSON.stringify({notes:{wife:{1:{sharedAnswer:'My earlier saved preparation.'}}}})]]),listeners={},intervals=[],posts=[],events=[];
const elements=new Map();
function element(selector){if(!elements.has(selector))elements.set(selector,{value:'',dataset:{},textContent:'',innerHTML:'',hidden:false,disabled:false,scrollHeight:100,scrollTop:0,clientHeight:100,querySelector:element,closest:()=>({open:false}),matches:pattern=>pattern.includes(selector),hasAttribute:name=>selector==='['+name+']'});return elements.get(selector);}
const container={dataset:{togetherDay:'1'},querySelector:element};
const state={day:1,viewer:{role:'wife',name:'Becca'},answers:{husband:{answer:'',version:0,updatedAt:null},wife:{answer:'',version:0,updatedAt:null}},comments:[]};
let offline=false;
const context={window:{RootedConnection:{enabled:true,connected:true,role:'wife',api:p=>'https://fixture.example'+p,headers:()=>({'X-Rooted-Role':'wife'}),open(){}},addEventListener(name,fn){(listeners[name]??=[]).push(fn);}},document:{hidden:false,body:{dataset:{selectedRole:'wife'}},activeElement:null,querySelector:()=>container,addEventListener(name,fn){(listeners[name]??=[]).push(fn);},dispatchEvent:e=>events.push(e)},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},AbortController,crypto:{randomUUID:()=> '11111111-1111-4111-8111-111111111111'},setTimeout:()=>1,clearTimeout(){},setInterval:fn=>intervals.push(fn),console,fetch:async(_url,options)=>{if(options.method==='POST'){const body=JSON.parse(options.body);posts.push(body);if(offline)throw new TypeError('Offline');assert(['share','unshare'].includes(body.publishIntent));state.answers.wife={answer:body.answer,version:state.answers.wife.version+1,updatedAt:'2026-11-10T23:00:00Z'};}return Response.json(state);}};
vm.runInNewContext(fs.readFileSync('public/rooted-together/assets/together.js','utf8'),context);
const settle=()=>new Promise(resolve=>setTimeout(resolve,0));
context.window.RootedTogether.mount();await settle();
assert.equal(element('[data-live-answer]').value,'My earlier saved preparation.');assert.equal(posts.length,0,'Opening the page must not publish existing preparation.');
function type(value){const input=element('[data-live-answer]');input.value=value;context.document.activeElement=input;listeners.input[0]({target:input});}
function click(attribute){const button=element('['+attribute+']');listeners.click[0]({target:{closest:()=>button}});}
type('A draft I am still thinking about.');for(const tick of intervals)tick();for(const focus of listeners.focus||[])focus();await settle();
assert.equal(posts.length,0,'Typing, polling and focus must never publish a question draft.');assert.equal(state.answers.wife.answer,'');assert(storage.get('rooted.together-drafts.v1').includes('A draft I am still thinking about.'));assert(events.some(e=>e.type==='rooted:question-draft'));
click('data-save-shared-answer');await settle();assert.equal(posts.length,1);assert.equal(posts[0].publishIntent,'share');assert.equal(state.answers.wife.answer,'A draft I am still thinking about.');
type('New edits should stay here.');await context.window.RootedTogether.refresh();await settle();assert.equal(posts.length,1);assert.equal(state.answers.wife.answer,'A draft I am still thinking about.');
offline=true;click('data-save-shared-answer');await settle();const attempts=posts.length;type('More private edits after a failed share.');offline=false;await context.window.RootedTogether.refresh();await settle();assert.equal(posts.length,attempts,'Reconnect must not share an edited question without another click.');
click('data-unshare-answer');await settle();assert.equal(posts.at(-1).publishIntent,'unshare');assert.equal(state.answers.wife.answer,'');assert.equal(element('[data-live-answer]').value,'More private edits after a failed share.');
await context.window.RootedTogether.refresh();assert.equal(state.answers.wife.answer,'');
console.log('Draft sharing passed: saved preparation preserved, no publication from typing/polling/reconnect, explicit sharing only, later edits stay local, and unsharing retains the draft.');
