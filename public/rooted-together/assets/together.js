(function(){
'use strict';
const connection=window.RootedConnection,names={husband:'David',wife:'Becca'},key='rooted.together-drafts.v1';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let drafts={},records={},loading=false,answerSending=false,commentSending=false,error='',checked=null;
try{const raw=JSON.parse(localStorage.getItem(key)||'{}');if(raw&&typeof raw==='object')for(const [id,d] of Object.entries(raw)){if(!/^(husband|wife):[1-7]$/.test(id)||!d||typeof d!=='object')continue;drafts[id]={answer:typeof d.answer==='string'?d.answer.slice(0,4000):'',dirty:d.dirty===true,baseVersion:Number.isInteger(d.baseVersion)?d.baseVersion:null,comment:typeof d.comment==='string'?d.comment.slice(0,2000):'',commentId:typeof d.commentId==='string'?d.commentId:'',postPending:d.postPending===true,legacyImported:d.legacyImported===true};}}catch{/* Reading remains available without storage. */}
function persist(){try{localStorage.setItem(key,JSON.stringify(drafts));}catch{error='This browser cannot save drafts. Keep this page open until your writing is shared.';}}
function node(){return document.querySelector('[data-together-day]');}
function day(){return Number(node()?.dataset.togetherDay);}
function role(){return connection.role||window.RootedSync?.data?.viewer.role||document.body.dataset.selectedRole;}
function connected(){return !connection.enabled||connection.connected;}
function draft(n=day(),r=role()){const id=r+':'+n;const d=drafts[id]||(drafts[id]={answer:'',dirty:false,baseVersion:null,comment:'',commentId:'',postPending:false});if(!d.legacyImported){d.legacyImported=true;try{const earlier=JSON.parse(localStorage.getItem('rooted-together.v1')||'{}').notes?.[r]?.[n]?.sharedAnswer;if(typeof earlier==='string'&&earlier.trim()&&!d.answer.trim()){d.answer=earlier.slice(0,4000);d.dirty=true;d.baseVersion=null;}}catch{/* Existing notes remain available in Your week. */}}return d;}
function mirrorDraft(n,r,d){document.dispatchEvent(new CustomEvent('rooted:question-draft',{detail:{day:n,role:r,answer:d.answer}}));}
function time(iso){return iso?new Date(iso).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';}
async function request(path,body){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);try{const response=await fetch(connection.api(path),{method:body?'POST':'GET',cache:'no-store',credentials:connection.enabled?'omit':'same-origin',headers:{...connection.headers(),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});const result=await response.json();if(!response.ok){const e=new Error(result.error||'Your shared writing could not be saved.');e.status=response.status;e.together=result.together;throw e;}return result;}finally{clearTimeout(timeout);}}
function accept(next){const old=records[next.day];if(old){for(const r of ['husband','wife'])if(next.answers[r].version<old.answers[r].version)next.answers[r]=old.answers[r];const comments=new Map([...old.comments,...next.comments].map(c=>[c.id,c]));next.comments=[...comments.values()].sort((a,b)=>a.createdAt.localeCompare(b.createdAt)||a.id.localeCompare(b.id));}records[next.day]=next;checked=Date.now();}
function render(){
 const el=node();if(!el)return;const n=day(),r=role(),partner=r==='husband'?'wife':'husband',d=draft(),record=records[n],own=record?.answers[r],conflict=!!(d.dirty&&own&&d.baseVersion!==null&&d.baseVersion!==own.version);
 const answerPane=el.querySelector('[data-answer-pane]'),discussionPane=el.querySelector('[data-discussion-pane]');if(!answerPane||!discussionPane)return;
 if(!answerPane.querySelector('[data-live-answer]')||el.dataset.writer!==r){
  el.dataset.writer=r;
  answerPane.innerHTML=`<p class="small muted">Write freely. Your draft saves on this device and stays here until you choose <strong>Share my answer</strong>.</p><label class="note-label" for="live-answer-${n}">${names[r]}’s answer</label><textarea id="live-answer-${n}" class="journal-field" data-live-answer maxlength="4000" rows="5" placeholder="What comes to mind? Take your time before sharing." aria-describedby="live-answer-status"></textarea><p class="save-status" id="live-answer-status" role="status" data-answer-status></p><div class="answer-conflict" data-answer-conflict hidden><p>A shared answer changed on another device. Your draft is still here.</p><button class="text-button" data-keep-answer>Keep my draft</button><button class="text-button" data-use-answer>Use the shared version</button></div><button class="button" data-save-shared-answer>Share my answer</button><p class="small muted">Shared answers are visible to anyone with this site’s address.</p><p class="small muted" data-existing-share-note></p>`;
  discussionPane.innerHTML=`<p class="shared-writing-notice"><strong>What you’ve chosen to share.</strong> Drafts stay on your device. Shared answers and posted comments are visible to anyone with this website’s address.</p><div class="together-answer-grid"><article class="partner-answer"><h3>${names[r]}’s shared answer</h3><p data-own-published class="shared-writing-text"></p><p class="small muted" data-own-published-time></p><button class="text-button" data-unshare-answer hidden>Remove my shared answer</button></article><article class="partner-answer"><h3>${names[partner]}’s shared answer</h3><p data-partner-answer class="shared-writing-text"></p><p class="small muted" data-partner-time></p></article></div><h3 class="comments-heading">Our conversation</h3><p class="small muted">Read each other’s answers, then take turns explaining what stood out. Ask a question before offering advice.</p><details class="details"><summary>Need a way to begin?</summary><div class="details-content"><p>Share one thing you’re thankful for, one thing that has been hard, and one way you could help each other. If you’re too tired to listen well, choose a time to come back.</p></div></details><div class="shared-comments" data-shared-comments role="log" aria-label="Shared comments"></div><form data-comment-form><label class="note-label" for="live-comment-${n}">Add a comment as ${names[r]}</label><textarea id="live-comment-${n}" class="journal-field" data-live-comment maxlength="2000" rows="3" placeholder="A thought, a question, or a response." aria-describedby="live-comment-status"></textarea><p class="save-status" id="live-comment-status" role="status" data-comment-status></p><button class="button secondary" type="submit" data-post-comment>Post comment</button></form><p class="small muted" data-together-status role="status"></p><button class="text-button" data-refresh-together>Refresh conversation</button>`;
  answerPane.querySelector('[data-live-answer]').value=d.answer;discussionPane.querySelector('[data-live-comment]').value=d.comment;
 }

 const answer=el.querySelector('[data-live-answer]');
 if(own&&!d.dirty&&!answerSending&&document.activeElement!==answer){d.answer=own.answer;d.baseVersion=own.version;if(answer.value!==own.answer)answer.value=own.answer;}
 
 el.querySelector('[data-answer-status]').textContent=conflict?'Draft saved here. Choose which version to keep before sharing.':answerSending?'Updating your shared answer…':d.dirty?'Draft saved on this device · not shared yet.':own?.answer?'This version is shared · '+time(own.updatedAt):'Your answer stays here until you choose Share my answer.';

 el.querySelector('[data-answer-conflict]').hidden=!conflict;
 el.querySelector('[data-save-shared-answer]').disabled=answerSending||conflict||!record||!d.answer.trim()||(!d.dirty&&own?.answer===d.answer);
 el.querySelector('[data-save-shared-answer]').textContent=own?.answer?'Share updated answer':'Share my answer';
 el.querySelector('[data-existing-share-note]').textContent=own?.answer?'Your last shared version stays visible in Talk it through until you update or remove it.':'';
 el.querySelector('[data-own-published]').textContent=own?.answer||'You haven’t shared an answer yet.';
 el.querySelector('[data-own-published-time]').textContent=own?.answer?'Shared '+time(own.updatedAt):'';
 el.querySelector('[data-unshare-answer]').hidden=!own?.answer;el.querySelector('[data-unshare-answer]').disabled=answerSending;
 el.querySelector('[data-partner-answer]').textContent=record?.answers[partner].answer||'Their answer will appear here when they share it.';
 el.querySelector('[data-partner-time]').textContent=record?.answers[partner].updatedAt?'Shared '+time(record.answers[partner].updatedAt):'';
 const comments=record?.comments||[],fingerprint=JSON.stringify(comments),list=el.querySelector('[data-shared-comments]');
 if(list.dataset.fingerprint!==fingerprint){const atBottom=list.scrollHeight-list.scrollTop-list.clientHeight<60;list.innerHTML=comments.length?comments.map(c=>`<article class="shared-comment"><p class="comment-byline"><strong>${names[c.role]}</strong> <time datetime="${esc(c.createdAt)}">${esc(time(c.createdAt))}</time></p><p class="shared-writing-text">${esc(c.body)}</p></article>`).join(''):'<p class="small muted">No comments yet. Start with what stood out to you.</p>';list.dataset.fingerprint=fingerprint;if(atBottom)list.scrollTop=list.scrollHeight;}
 el.querySelector('[data-live-comment]').readOnly=commentSending;
 el.querySelector('[data-post-comment]').disabled=commentSending;
 el.querySelector('[data-post-comment]').textContent=commentSending?'Posting…':d.postPending?'Retry comment':'Post comment';
 el.querySelector('[data-comment-status]').textContent=d.postPending?'Comment saved here and waiting to post.':d.comment?'Draft saved on this device. It is shared when you choose Post comment.':'';
 el.querySelector('[data-together-status]').textContent=error||(!connected()?'Not shared yet. Choose a section to reconnect.':checked?'Last checked '+new Date(checked).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}):'Connecting to your shared conversation…');
}
async function refresh(){
 if(!node()||document.hidden||loading)return;render();if(!connected())return;
 const n=day(),r=role();loading=true;
 try{const next=await request('/api/together?day='+n);accept(next);error='';const d=draft(n,r);if(d.postPending&&next.comments.some(c=>c.id===d.commentId)){d.comment='';d.commentId='';d.postPending=false;if(day()===n){const input=node()?.querySelector('[data-live-comment]');if(input)input.value='';}}if(d.baseVersion===null)d.baseVersion=next.answers[r].version;persist();}
 catch(e){error=e.status===401||e.status===403?'Choose David or Becca again to reconnect this section.':'The conversation could not refresh. Your draft is safe here. Try again when you’re connected.';}
 finally{loading=false;render();const d=draft(n,r);if(day()===n&&d.postPending)postComment();}
}
async function shareAnswer(){
 if(!node()||answerSending)return;const n=day(),r=role(),d=draft(),record=records[n];
 if(!connected()){connection.open();return;}if(!record){refresh();return;}if(!d.dirty||!d.answer.trim())return;
 if(d.baseVersion!==record.answers[r].version){render();return;}
 const value=d.answer;answerSending=true;render();
 try{const next=await request('/api/answers',{day:n,answer:value,expectedVersion:d.baseVersion,publishIntent:'share'});accept(next);d.baseVersion=next.answers[r].version;if(d.answer===value)d.dirty=false;error='';persist();const discussion=node()?.querySelector('[data-discussion-pane]')?.closest('details');if(discussion&&day()===n)discussion.open=true;}
 catch(e){if(e.together)accept(e.together);error=e.status?e.message:'Your draft is saved on this device. Reconnect, then choose Share again.';}
 finally{answerSending=false;render();}
}
async function removeSharedAnswer(){
 if(!node()||answerSending)return;const n=day(),r=role(),d=draft(),own=records[n]?.answers[r];if(!own?.answer)return;
 if(!d.answer.trim()){d.answer=own.answer;d.dirty=true;node().querySelector('[data-live-answer]').value=d.answer;}mirrorDraft(n,r,d);persist();answerSending=true;render();
 try{const next=await request('/api/answers',{day:n,answer:'',expectedVersion:own.version,publishIntent:'unshare'});accept(next);d.baseVersion=next.answers[r].version;d.dirty=!!d.answer;error='';persist();}
 catch(e){if(e.together)accept(e.together);error='The shared answer could not be removed. It is still visible; your draft is safe here.';}
 finally{answerSending=false;render();}
}

async function postComment(){
 if(!node()||commentSending)return;const n=day(),d=draft();if(!d.comment.trim())return;
 if(!connected()){persist();connection.open();return;}if(!records[n]){refresh();return;}
 if(!d.commentId)d.commentId=crypto.randomUUID();d.postPending=true;persist();const id=d.commentId,body=d.comment;
 commentSending=true;render();
 try{const next=await request('/api/comments',{day:n,id,body});accept(next);if(d.commentId===id&&d.comment===body){d.comment='';d.commentId='';d.postPending=false;if(day()===n){const input=node()?.querySelector('[data-live-comment]');if(input)input.value='';}}error='';persist();}
 catch(e){error=e.status?e.message:'Your comment is saved on this device. Reconnect to post it.';if(e.status&&e.status<500&&e.status!==401&&e.status!==403)d.postPending=false;persist();}
 finally{commentSending=false;render();}
}
document.addEventListener('input',e=>{
 if(!e.target.matches('[data-live-answer],[data-live-comment]'))return;const d=draft();
 if(e.target.matches('[data-live-answer]')){if(!d.dirty&&d.baseVersion===null)d.baseVersion=records[day()]?.answers[role()].version??null;d.answer=e.target.value;d.dirty=true;mirrorDraft(day(),role(),d);}
 else{d.comment=e.target.value;if(!d.postPending)d.commentId='';}
 persist();render();
});
document.addEventListener('submit',e=>{if(e.target.hasAttribute('data-comment-form')){e.preventDefault();postComment();}});
document.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;if(button.hasAttribute('data-refresh-together'))refresh();if(button.hasAttribute('data-save-shared-answer'))shareAnswer();if(button.hasAttribute('data-unshare-answer'))removeSharedAnswer();if(button.hasAttribute('data-keep-answer')){draft().baseVersion=records[day()].answers[role()].version;persist();render();}if(button.hasAttribute('data-use-answer')){const d=draft(),saved=records[day()].answers[role()];d.answer=saved.answer;d.baseVersion=saved.version;d.dirty=false;node().querySelector('[data-live-answer]').value=saved.answer;mirrorDraft(day(),role(),d);persist();render();}});
window.RootedTogether={importDrafts(r,notes){for(const [n,note] of Object.entries(notes)){if(typeof note.sharedAnswer!=='string')continue;const d=draft(Number(n),r);d.answer=note.sharedAnswer.slice(0,4000);d.dirty=true;d.baseVersion=records[n]?.answers[r]?.version??null;d.legacyImported=true;}persist();},mount(){render();refresh();},refresh};
setInterval(()=>{if(node()&&!document.hidden)refresh();},3000);
window.addEventListener('online',refresh);window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
