"use client";

import { ChangeEvent, useMemo, useState } from "react";

const skillGroups = [
  { label:"Visualize", title:"Dashboards & storytelling", text:"I structure dashboards around the decision—not the available fields—so the story stays clear.", skills:["Power BI","Tableau","Excel","Dashboard UX"] },
  { label:"Analyze", title:"Data & performance analysis", text:"I explore operational data, test assumptions, and turn findings into practical recommendations.", skills:["SQL","PostgreSQL","Python","Data Quality"] },
  { label:"Improve", title:"Reporting systems", text:"I streamline recurring reports, define useful KPIs, and reduce manual steps that create risk.", skills:["KPI Design","Automation","SharePoint","GitHub"] },
];

const roles = [
  ["Data Analytics Consultant","Recruiting analytics, KPI tracking, and Power BI reporting for business operations."],
  ["Data Analyst","Tableau dashboards, SQL analysis, and operational performance reporting."],
  ["Sr. Metrics & Data Analyst","50+ visualization products across 20+ defense-related projects."],
  ["Intelligence Analyst","Research and reporting supporting mission-critical decisions."],
];

function parseLine(line:string){const out:string[]=[];let value="",quoted=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(quoted&&line[i+1]==='"'){value+='"';i++}else quoted=!quoted}else if(c===","&&!quoted){out.push(value.trim());value=""}else value+=c}out.push(value.trim());return out}
type Check={rows:number;columns:number;missing:number;duplicates:number;score:number};

export default function Home(){
  const [hours,setHours]=useState(10),[people,setPeople]=useState(2),[rate,setRate]=useState(45),[automation,setAutomation]=useState(70);
  const [check,setCheck]=useState<Check|null>(null),[file,setFile]=useState("");
  const savings=useMemo(()=>{const h=hours*people*52*automation/100;return {hours:Math.round(h),value:Math.round(h*rate)}},[hours,people,rate,automation]);

  function inspect(event:ChangeEvent<HTMLInputElement>){const selected=event.target.files?.[0];if(!selected)return;setFile(selected.name);const reader=new FileReader();reader.onload=()=>{const lines=String(reader.result||"").replace(/^\uFEFF/,"").trim().split(/\r?\n/).filter(Boolean);const headers=parseLine(lines[0]||"");const rows=lines.slice(1).map(parseLine);const missing=rows.flat().filter(x=>!x).length;const duplicates=rows.length-new Set(rows.map(x=>JSON.stringify(x))).size;const total=Math.max(rows.length*headers.length,1);const score=Math.max(0,Math.round(100-(missing/total*65+duplicates/Math.max(rows.length,1)*35)));setCheck({rows:rows.length,columns:headers.length,missing,duplicates,score})};reader.readAsText(selected)}

  return <main>
    <header className="site-header"><div className="shell nav">
      <a className="brand" href="#top"><span>DE</span><div><b>David Edmonds</b><small>DATA ANALYTICS &amp; BI</small></div></a>
      <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#skills">Skills</a><a href="#experience">Experience</a><a href="#lab">Lab</a></nav>
      <a className="header-cta" href="mailto:davidedmondsc@gmail.com?subject=Analytics%20project%20inquiry">Let’s talk <span>↗</span></a>
    </div></header>

    <section className="hero shell" id="top">
      <div className="hero-text"><div className="status"><i/> OPEN TO REMOTE CONSULTING &amp; ANALYTICS ROLES</div><h1>Complex data.<br/><em>Clear direction.</em></h1><p>I’m David, a data analytics and BI consultant. I build dashboards, reporting systems, and analysis that help teams see what matters and decide what to do next.</p><div className="hero-actions"><a className="button blue" href="#work">See my work <span>↓</span></a><a className="underlink" href="mailto:davidedmondsc@gmail.com?subject=Analytics%20project%20inquiry">Start a conversation ↗</a></div></div>
      <div className="hero-side"><div className="portrait-wrap"><img src="/david-edmonds.jpg" alt="David Edmonds, Data Analytics and BI Consultant"/><div className="portrait-accent"/></div><div className="hero-facts"><div><strong>10+</strong><span>years across public &amp; private sectors</span></div><div><strong>100+</strong><span>dashboards and reporting products built</span></div></div></div>
    </section>

    <section className="statement"><div className="shell"><span>WHAT I DO</span><h2>I turn operational data into <em>useful answers</em>—through focused analysis, clear reporting, and dashboards people actually use.</h2></div></section>

    <section className="section shell" id="work"><SectionTitle eyebrow="01 · FEATURED WORK" title="One project," accent="shown properly." />
      <article className="feature">
        <div className="feature-visual"><div className="browser-bar"><i/><i/><i/><span>WASHINGTON EV MARKET OVERVIEW</span></div><img src="/washington-ev-dashboard.png" alt="Washington EV Market Overview dashboard in Tableau"/></div>
        <div className="feature-copy"><span className="pill">TABLEAU CASE STUDY</span><h3>Washington EV Market Overview</h3><p className="lead">An executive dashboard that makes a large public dataset easy to explore—without losing the important patterns.</p><div className="case-row"><b>Question</b><p>How is EV adoption changing across Washington’s counties, manufacturers, and vehicle types?</p></div><div className="case-row"><b>My work</b><p>KPI hierarchy, dynamic filtering, geographic analysis, dashboard UX, and data-quality controls.</p></div><div className="case-row"><b>Outcome</b><p>A decision-ready market view that reveals adoption trends, leading brands, and regional differences.</p></div><div className="chips"><span>Tableau</span><span>Market analysis</span><span>Data quality</span><span>Data storytelling</span></div><a className="button dark" href="https://github.com/David-Edmonds/washington-ev-analytics" target="_blank" rel="noreferrer">Explore the project <span>↗</span></a></div>
      </article>
      <div className="portfolio-strip"><span>PORTFOLIO IN PROGRESS</span><p>This portfolio grows with every public or sanitized project. No client-confidential information is published.</p><a href="https://github.com/David-Edmonds" target="_blank" rel="noreferrer">View GitHub ↗</a></div>
    </section>

    <section className="skills section" id="skills"><div className="shell"><SectionTitle eyebrow="02 · CAPABILITIES" title="The skills behind" accent="the work." />
      <div className="skill-grid">{skillGroups.map((group,index)=><article key={group.label}><div className="skill-number">0{index+1}</div><span className="skill-label">{group.label}</span><h3>{group.title}</h3><p>{group.text}</p><div className="skill-chips">{group.skills.map(skill=><span key={skill}>{skill}</span>)}</div></article>)}</div>
      <div className="toolbelt"><span>TOOLBELT</span><div>Power BI <i/> Tableau <i/> SQL <i/> Excel <i/> PostgreSQL <i/> Python <i/> SharePoint <i/> ArcGIS</div></div>
    </div></section>

    <section className="section shell" id="experience"><SectionTitle eyebrow="03 · EXPERIENCE" title="A career built around" accent="decision support." />
      <div className="experience-grid"><div className="experience-intro"><p>I bring more than a decade of experience in operational reporting, dashboard development, data quality, large-scale analysis, defense, intelligence, recruiting, and business operations.</p><div className="sector-list"><span>DEFENSE</span><span>INTELLIGENCE</span><span>GOVERNMENT</span><span>OPERATIONS</span><span>RECRUITING</span><span>BUSINESS INTELLIGENCE</span></div><a className="underlink" href="mailto:davidedmondsc@gmail.com?subject=Resume%20request">Request my full resume ↗</a></div><div className="role-list">{roles.map((role,index)=><article key={role[0]}><span>0{index+1}</span><div><h3>{role[0]}</h3><p>{role[1]}</p></div></article>)}</div></div>
    </section>

    <section className="lab section" id="lab"><div className="shell"><SectionTitle eyebrow="04 · ANALYTICS LAB" title="Try a couple of" accent="working demos." />
      <div className="lab-grid"><article className="lab-card"><div className="lab-head"><span>01</span><div><h3>Reporting savings calculator</h3><p>Build a quick business case for automation.</p></div></div><div className="calculator"><div className="inputs"><label>Weekly reporting hours <b>{hours}</b><input type="range" min="1" max="40" value={hours} onChange={e=>setHours(+e.target.value)}/></label><label>People involved<input type="number" min="1" value={people} onChange={e=>setPeople(+e.target.value||1)}/></label><label>Hourly cost ($)<input type="number" min="1" value={rate} onChange={e=>setRate(+e.target.value||1)}/></label><label>Automatable work <b>{automation}%</b><input type="range" min="10" max="95" step="5" value={automation} onChange={e=>setAutomation(+e.target.value)}/></label></div><div className="result"><span>POTENTIAL ANNUAL IMPACT</span><strong>{savings.hours.toLocaleString()}</strong><small>hours recovered</small><hr/><b>${savings.value.toLocaleString()}</b><small>capacity value</small></div></div></article>
      <article className="lab-card"><div className="lab-head"><span>02</span><div><h3>CSV quality checker</h3><p>Run a private, browser-only first pass.</p></div></div><label className="upload"><input type="file" accept=".csv,text/csv" onChange={inspect}/><i>↑</i><b>{file||"Choose a sanitized CSV"}</b><small>Never uploaded · stays in your browser</small></label>{check?<div className="check-results"><div><strong>{check.score}</strong><span>QUALITY<br/>SCORE</span></div><p><b>{check.rows}</b> rows</p><p><b>{check.columns}</b> columns</p><p><b>{check.missing}</b> empty cells</p><p><b>{check.duplicates}</b> duplicates</p></div>:<div className="safe-note">✓ Use only public, synthetic, or properly sanitized data.</div>}</article></div>
    </div></section>

    <section className="contact" id="contact"><div className="shell contact-grid"><div><span>LET’S WORK TOGETHER</span><h2>Have a reporting challenge worth <em>solving?</em></h2></div><div><p>Tell me what is slow, unclear, or unreliable. I’ll help you find the most practical next step.</p><a className="contact-email" href="mailto:davidedmondsc@gmail.com?subject=Analytics%20project%20inquiry">davidedmondsc@gmail.com <span>↗</span></a><div className="contact-links"><a href="tel:+18438192435">+1 (843) 819-2435</a><a href="https://www.linkedin.com/in/david-c-edmonds/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/David-Edmonds" target="_blank" rel="noreferrer">GitHub ↗</a></div></div></div></section>

    <footer className="footer shell"><a className="brand" href="#top"><span>DE</span><div><b>David Edmonds</b><small>DATA ANALYTICS &amp; BI</small></div></a><p>Remote · United States<br/>Consulting &amp; analytics opportunities</p><div><a href="#work">Work</a><a href="#skills">Skills</a><a href="#top">Back to top ↑</a></div><small>© {new Date().getFullYear()} David Edmonds · Client-confidential data is never published.</small></footer>
  </main>
}

function SectionTitle({eyebrow,title,accent}:{eyebrow:string;title:string;accent:string}){return <div className="section-title"><span>{eyebrow}</span><h2>{title}<br/><em>{accent}</em></h2></div>}
