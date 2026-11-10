(function(){
'use strict';
const config=window.ROOTED_DEPLOY||{},names={husband:'David',wife:'Becca'};
let selected='husband';
try{const saved=JSON.parse(localStorage.getItem('rooted-together.v1')||'{}');if(names[saved.role])selected=saved.role;localStorage.removeItem('rooted.personal-connection.v1');}catch{/* Reading works without browser storage. */}
const view=new URLSearchParams(location.search).get('view');if(names[view])selected=view;
if(new URLSearchParams(location.hash.slice(1)).has('connect'))history.replaceState({},'',location.pathname+location.search);
try{const cache=JSON.parse(localStorage.getItem('rooted.shared-cache')||'null');if(cache&&cache.viewer?.role!==selected)localStorage.removeItem('rooted.shared-cache');}catch{/* A fresh server read follows. */}
function select(role){if(!names[role])return;selected=role;try{localStorage.removeItem('rooted.shared-cache');}catch{/* Selection is retained for this visit. */}}
function markup(){return '<span>'+names[selected]+'’s section · Shared progress syncs automatically.</span>';}
function open(){window.RootedSync?.refresh();}
window.RootedConnection={enabled:true,sectionMode:true,get connected(){return true;},get role(){return selected;},select,markup,open,api:path=>(config.apiOrigin||'')+path,headers:()=>({'X-Rooted-Role':selected})};
})();
