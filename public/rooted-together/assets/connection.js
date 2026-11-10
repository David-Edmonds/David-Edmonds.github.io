(function(){
'use strict';
const config=window.ROOTED_DEPLOY||{},enabled=config.auth==='personal-link',key='rooted.personal-connection.v1';
const names={husband:'David',wife:'Becca'},valid=t=>typeof t==='string'&&/^rt_(husband|wife)_[A-Za-z0-9_-]{43}$/.test(t);
let token='';
try{const stored=localStorage.getItem(key);if(valid(stored))token=stored;}catch{/* Reading still works when storage is unavailable. */}
function remember(next){if(!valid(next))return false;token=next;try{localStorage.setItem(key,next);localStorage.removeItem('rooted.shared-cache');return true;}catch{return false;}}
function consumeLink(){const incoming=new URLSearchParams(location.hash.slice(1)).get('connect');if(!enabled||!valid(incoming))return false;remember(incoming);const url=new URL(location.href);url.searchParams.set('view',role());url.hash='';history.replaceState({},'',url.pathname+url.search);return true;}
if(enabled)consumeLink();
window.addEventListener('hashchange',()=>{if(consumeLink())location.reload();});
function role(){return valid(token)?token.split('_')[1]:null;}
function markup(){if(!enabled)return '';return `<span>${role()?'Shared progress connected as '+names[role()]: 'Read anytime. Connect your shared progress with your personal link.'}</span><button class="text-button" data-connect>${role()?'Connection options':'Connect personal link'}</button>`;}
function open(){
 let dialog=document.getElementById('connection');if(!dialog){dialog=document.createElement('dialog');dialog.id='connection';document.body.append(dialog);}
 dialog.setAttribute('aria-labelledby','connection-title');
 dialog.innerHTML=`<div class="dialog-head"><div><p class="eyebrow">Your shared space</p><h2 id="connection-title">Connect your progress</h2></div><button class="icon-button" data-close-connection aria-label="Close connection options">✕</button></div><div class="dialog-content"><p>Open the personal David or Becca link sent by email. You can also paste that link below. No ChatGPT or GitHub account is needed to use this devotional.</p><p class="small muted">Keep your personal link between the two of you. It connects completion times, availability, meeting plans, and the shared Together answers and comments. Your journal notes stay on this device.</p><form data-connection-form><label class="note-label" for="connection-link">Your personal connection link</label><input class="journal-field" id="connection-link" name="link" type="text" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" required placeholder="Paste your personal link"><p class="small" data-connection-error role="status"></p><button class="button" type="submit">Connect this device</button></form>${role()?'<p class="small muted">Currently connected as '+names[role()]+'.</p><button class="text-button" data-disconnect>Disconnect this device</button>':''}</div>`;
 if(!dialog.open)dialog.showModal();
}
document.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;if(button.hasAttribute('data-connect'))open();if(button.hasAttribute('data-close-connection'))document.getElementById('connection').close();if(button.hasAttribute('data-disconnect')){token='';try{localStorage.removeItem(key);localStorage.removeItem('rooted.shared-cache');}catch{/* The connection is cleared from memory. */}location.reload();}});
document.addEventListener('submit',e=>{if(!e.target.hasAttribute('data-connection-form'))return;e.preventDefault();const raw=String(new FormData(e.target).get('link')||'').trim();let incoming=raw;if(!valid(incoming)){try{incoming=new URLSearchParams(new URL(raw).hash.slice(1)).get('connect');}catch{/* Invalid input receives a message below. */}}const message=e.target.querySelector('[data-connection-error]');if(!valid(incoming)){message.textContent='That link could not be read. Copy the complete personal link from your email.';return;}if(!remember(incoming)){message.textContent='This browser cannot save the connection. Open your personal link directly to connect for this visit.';return;}const url=new URL(location.href);url.searchParams.set('view',role());url.hash='';location.assign(url.href);});
window.RootedConnection={enabled,get connected(){return valid(token);},get role(){return role();},markup,open,api:path=>(enabled?config.apiOrigin:'')+path,headers:()=>enabled&&valid(token)?{Authorization:'Bearer '+token}:{}};
})();
