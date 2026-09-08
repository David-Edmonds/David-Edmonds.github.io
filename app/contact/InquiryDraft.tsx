"use client";
import { useState, useSyncExternalStore } from "react";
const topics: Record<string,string>={dashboards:"Dashboard project",reporting:"Reporting improvement",kpis:"KPI definition & review",analysis:"Sales or performance investigation",general:"General analytics inquiry"};
const sources: Record<string,string>={sales:"Sales & Profitability",sql:"SQL Sales Investigation",federal:"Federal Contracting Performance",ev:"Washington EV Market Overview"};
const subscribe=(notify:()=>void)=>{window.addEventListener('popstate',notify);return ()=>window.removeEventListener('popstate',notify);};
export default function InquiryDraft(){
 const search=useSyncExternalStore(subscribe,()=>window.location.search,()=>'');
 const params=new URLSearchParams(search);const requested=params.get('topic')||'';
 const [selected,setTopic]=useState('');const topic=selected||(Object.hasOwn(topics,requested)?requested:'general');
 const key=params.get('from')||'';const source=Object.hasOwn(sources,key)?sources[key]:'';
 const [goal,setGoal]=useState('');const [copied,setCopied]=useState(''); const body=`Hi David,\n\nI'd like to discuss ${topics[topic].toLowerCase()}.${source?` I was looking at your ${source} project.`:''}\n\n${goal||'The question or reporting challenge I want to solve: '}\n\nTools or data sources: \nDesired timing: \n\nThanks,`;
 const href=`mailto:boldproofanalytics@gmail.com?subject=${encodeURIComponent(topics[topic])}&body=${encodeURIComponent(body)}`;
 async function copy(){try{await navigator.clipboard.writeText('boldproofanalytics@gmail.com');setCopied('Email address copied.');}catch{setCopied('Copy the address shown below: boldproofanalytics@gmail.com');}}
 return <section className="inquiry shell" id="inquiry" aria-labelledby="inquiry-title"><div><span>CONSULTING · BOLD PROOF ANALYTICS</span><h2 id="inquiry-title">Tell me what<br/>needs to work better.</h2><p>A short description is enough to start. We can then discuss the data, audience, deliverables and scope before agreeing on the work.</p><ul><li>The decision or recurring report you need to improve.</li><li>Your current tools and the people who use the output.</li><li>Any timing or scope constraints.</li></ul><p>Keep the first message high-level; there’s no need to attach confidential data.</p></div>
 <div className="inquiry-card"><label htmlFor="inquiry-topic">What can I help with?</label><select id="inquiry-topic" value={topic} onChange={e=>setTopic(e.target.value)}>{Object.entries(topics).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select>{source&&<p className="inquiry-context">Project reference: {source}</p>}
 <label htmlFor="inquiry-goal">What would a useful result look like? <small>(optional)</small></label><textarea id="inquiry-goal" rows={4} maxLength={1000} value={goal} onChange={e=>setGoal(e.target.value)} placeholder="For example: a monthly sales report that explains margin changes by region."/>
 <a className="button blue" href={href}>Open email draft <span>↗</span></a><p className="inquiry-note">Opens your email app with an editable draft. Nothing is sent until you send it there. These fields are not saved or uploaded by this site.</p><div className="inquiry-fallback"><span>Prefer to write directly?</span><a href="mailto:boldproofanalytics@gmail.com">boldproofanalytics@gmail.com</a><button type="button" onClick={copy}>Copy email address</button><span role="status">{copied}</span></div></div></section>;
}
