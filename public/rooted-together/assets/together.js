(function(){
'use strict';
const connection=window.RootedConnection,names={husband:'David',wife:'Becca'},key='rooted.together-drafts.v1';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let drafts={},records={},loading=false,answerSending=false,commentSending=false,saveTimer,error='',checked=null;
try{const raw=JSON.parse(localStorage.getItem(key)||'{}');if(raw&&typeof raw==='object')for(const [id,d] of Object.entries(raw)){if(!/^(husband|wife):[1-7]$/.test(id)||!d||typeof d!=='object')continue;drafts[id]={answer:typeof d.answer==='string'?d.answer.slice(0,4000):'',dirty:d.dirty===true,baseVersion:Number.isInteger(d.baseVersion)?d.baseVersion:null,comment:typeof d.comment==='string'?d.comment.slice(0,2000):'',commentId:typeof d.commentId==='string'?d.commentId:'',postPending:d.postPending===true};}}catch{/* Reading remains available without storage. */}
function persist(){try{localStorage.setItem(key,JSON.stringify(drafts));}catch{error='This browser cannot save drafts. Keep this page open until your writing is shared.';}}
function node(){return document.querySelector('[data-together-day]');}
function day(){return Number(node()?.dataset.togetherDay);}
function role(){return connection.role||window.RootedSync?.data?.viewer.role||document.body.dataset.selectedRole;}
function connected(){return !connection.enabled||connection.connected;}
function draft(n=day(),r=role()){const id=r+':'+n;return drafts[id]||(drafts[id]={answer:'',dirty:false,baseVersion:null,comment:'',commentId:'',postPending:false});}
function time(iso){return iso?new Date(iso).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';}
async function request(path,body){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);try{const response=await fetch(connection.api(path),{method:body?'POST':'GET',cache:'no-store',credentials:connection.enabled?'omit':'same-origin',headers:{...connection.headers(),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});const result=await response.json();if(!response.ok){const e=new Error(result.error||'Your shared writing could not be saved.');e.status=response.status;e.together=result.together;throw e;}return result;}finally{clearTimeout(timeout);}}
function accept(next){const old=records[next.day];if(old){for(const r of ['husband','wife'])if(next.answers[r].version<old.answers[r].version)next.answers[r]=old.answers[r];const comments=new Map([...old.comments,...next.comments].map(c=>[c.id,c]));next.comments=[...comments.values()].sort((a,b)=>a.createdAt.localeCompare(b.createdAt)||a.id.localeCompare(b.id));}records[next.day]=next;checked=Date.now();}
function render(){
 const el=node();if(!el)return;const n=day(),r=role(),partner=r==='husband'?'wife':'husband',d=draft(),record=records[n],own=record?.answers[r],conflict=!!(d.dirty&&own&&d.baseVersion!==null&&d.baseVersion!==own.version);
 if(!el.querySelector('[data-live-answer]')||el.dataset.writer!==r){el.dataset.writer=r;el.innerHTML=`<p class="shared-writing-notice"><strong>Shared with both of you.</strong> These answers and comments are saved to your shared space. Personal notes stay on your device.</p><p class="small" data-live-connection></p><div class="together-answer-grid"><div><label class="note-label" for="live-answer-${n}">${names[r]}’s shared answer</label><textarea id="live-answer-${n}" class="journal-field" data-live-answer maxlength="4000" rows="5" placeholder="Write what you want to share with each other." aria-describedby="live-answer-status"></textarea><p class="save-status" id="live-answer-status" role="status" data-answer-status></p><div class="answer-conflict" data-answer-conflict hidden><p>Your answer changed on another device. Your draft is still here.</p><button class="text-button" data-keep-answer>Share my draft instead</button><button class="text-button" data-use-answer>Use the saved answer</button></div><button class="text-button" data-save-shared-answer>Save shared answer</button></div><div class="partner-answer"><h3>${names[partner]}’s shared answer</h3><p data-partner-answer class="shared-writing-text"></p><p class="small muted" data-partner-time></p></div></div><h3 class="comments-heading">Our conversation</h3><p class="small muted">Leave a thought, ask a question, or respond to each other. You can both write at the same time.</p><div class="shared-comments" data-shared-comments role="log" aria-label="Shared comments"></div><form data-comment-form><label class="note-label" for="live-comment-${n}">Add a comment as ${names[r]}</label><textarea id="live-comment-${n}" class="journal-field" data-live-comment maxlength="2000" rows="3" placeholder="What would you like to say?" aria-describedby="live-comment-status"></textarea><p class="save-status" id="live-comment-status" role="status" data-comment-status></p><button class="button secondary" type="submit" data-post-comment>Post comment</button></form><p class="small muted" data-together-status role="status"></p><button class="text-button" data-refresh-together>Refresh conversation</button>`;el.querySelector('[data-live-answer]').value=d.answer;el.querySelector('[data-live-comment]').value=d.comment;}
 const answer=el.querySelector('[data-live-answer]');
 if(own&&!d.dirty&&!answerSending&&document.activeElement!==answer){d.answer=own.answer;d.baseVersion=own.version;if(answer.value!==own.answer)answer.value=own.answer;}
 el.querySelector('[data-live-connection]').innerHTML=connected()?`Writing as <strong>${names[r]}</strong>. Updates appear every few seconds while this page is open.`:'Your draft saves on this device. <button class="text-button" data-connect>Connect your personal link to share it</button>';
 el.querySelector('[data-answer-status]').textContent=conflict?'Your draft is safe. Choose which version to keep below.':answerSending?'Saving your answer…':d.dirty?(connected()?'Draft saved on this device · waiting to share.':'Draft saved on this device · connect to share.'):(own?.updatedAt?'Saved and shared · '+time(own.updatedAt):'Write an answer to share with each other.');
 el.querySelector('[data-answer-conflict]').hidden=!conflict;
 el.querySelector('[data-save-shared-answer]').disabled=answerSending||conflict;
 el.querySelector('[data-partner-answer]').textContent=record?.answers[partner].answer||'Their answer will appear here when they share it.';
 el.querySelector('[data-partner-time]').textContent=record?.answers[partner].updatedAt?'Shared '+time(record.answers[partner].updatedAt):'';
 const comments=record?.comments||[],fingerprint=JSON.stringify(comments),list=el.querySelector('[data-shared-comments]');
 if(list.dataset.fingerprint!==fingerprint){const atBottom=list.scrollHeight-list.scrollTop-list.clientHeight<60;list.innerHTML=comments.length?comments.map(c=>`<article class="shared-comment"><p class="comment-byline"><strong>${names[c.role]}</strong> <time datetime="${esc(c.createdAt)}">${esc(time(c.createdAt))}</time></p><p class="shared-writing-text">${esc(c.body)}</p></article>`).join(''):'<p class="small muted">No comments yet. Start with what stood out to you.</p>';list.dataset.fingerprint=fingerprint;if(atBottom)list.scrollTop=list.scrollHeight;}
 el.querySelector('[data-live-comment]').readOnly=commentSending;
 el.querySelector('[data-post-comment]').disabled=commentSending;
 el.querySelector('[data-post-comment]').textContent=commentSending?'Posting…':d.postPending?'Retry comment':'Post comment';
 el.querySelector('[data-comment-status]').textContent=d.postPending?'Comment saved here and waiting to post.':d.comment?'Draft saved on this device. It is shared when you choose Post comment.':'';
 el.querySelector('[data-together-status]').textContent=error||(!connected()?'Not shared yet. Open your personal link to connect.':checked?'Last checked '+new Date(checked).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}):'Connecting to your shared conversation…');
}
async function refresh(){
 if(!node()||document.hidden||loading)return;render();if(!connected())return;
 const n=day(),r=role();loading=true;
 try{const next=await request('/api/together?day='+n);accept(next);error='';const d=draft(n,r);if(d.postPending&&next.comments.some(c=>c.id===d.commentId)){d.comment='';d.commentId='';d.postPending=false;if(day()===n){const input=node()?.querySelector('[data-live-comment]');if(input)input.value='';}}if(d.baseVersion===null)d.baseVersion=next.answers[r].version;persist();}
 catch(e){error=e.status===401||e.status===403?'Open your own personal connection link to share answers and comments.':'The conversation could not refresh. Your draft is safe here. Try again when you’re connected.';}
 finally{loading=false;render();const d=draft(n,r);if(day()===n&&records[n]&&d.dirty&&d.baseVersion===records[n].answers[r].version)saveAnswer();if(day()===n&&d.postPending)postComment();}
}
async function saveAnswer(){
 if(!node()||answerSending)return;const n=day(),r=role(),d=draft(),record=records[n];
 if(!connected()){connection.open();return;}if(!record){refresh();return;}if(!d.dirty)return;
 if(d.baseVersion!==record.answers[r].version){render();return;}
 const value=d.answer;answerSending=true;render();
 try{const next=await request('/api/answers',{day:n,answer:value,expectedVersion:d.baseVersion});accept(next);d.baseVersion=next.answers[r].version;if(d.answer===value)d.dirty=false;error='';persist();}
 catch(e){if(e.together)accept(e.together);error=e.status?e.message:'Your answer is saved on this device. Reconnect to share it.';}
 finally{answerSending=false;render();if(d.dirty&&d.answer!==value&&day()===n)saveTimer=setTimeout(saveAnswer,900);}
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
 if(e.target.matches('[data-live-answer]')){if(!d.dirty&&d.baseVersion===null)d.baseVersion=records[day()]?.answers[role()].version??null;d.answer=e.target.value;d.dirty=true;clearTimeout(saveTimer);if(connected())saveTimer=setTimeout(saveAnswer,900);}
 else{d.comment=e.target.value;if(!d.postPending)d.commentId='';}
 persist();render();
});
document.addEventListener('submit',e=>{if(e.target.hasAttribute('data-comment-form')){e.preventDefault();postComment();}});
document.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;if(button.hasAttribute('data-refresh-together'))refresh();if(button.hasAttribute('data-save-shared-answer'))saveAnswer();if(button.hasAttribute('data-keep-answer')){draft().baseVersion=records[day()].answers[role()].version;persist();saveAnswer();}if(button.hasAttribute('data-use-answer')){const d=draft(),saved=records[day()].answers[role()];d.answer=saved.answer;d.baseVersion=saved.version;d.dirty=false;node().querySelector('[data-live-answer]').value=saved.answer;persist();render();}});
window.RootedTogether={mount(){render();refresh();},refresh};
setInterval(()=>{if(node()&&!document.hidden)refresh();},3000);
window.addEventListener('online',refresh);window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
})();
