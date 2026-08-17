"use client";

import { ChangeEvent, useMemo, useState } from "react";

const services = [
  ["01", "Executive dashboards", "Power BI and Tableau dashboards that give leaders a clear view of performance, trends, and priorities."],
  ["02", "Reporting automation", "Streamlined Excel, SQL, and BI workflows that reduce repetitive work and make reporting more dependable."],
  ["03", "KPI & data quality", "Practical metric definitions and validation checks that help teams trust the numbers they use."],
  ["04", "Operational analytics", "Focused analysis for recruiting, operations, performance management, and decision support."],
];

const experience = [
  ["Data Analytics Consultant", "Business operations", "Recruiting analytics, KPI tracking, and Power BI reporting for operational teams."],
  ["Data Analyst", "Operational performance", "Tableau dashboards, SQL analysis, and recurring performance reporting."],
  ["Sr. Metrics & Data Analyst", "Defense programs", "50+ visualization products across 20+ defense-related projects."],
  ["Intelligence Analyst", "Mission support", "Research, reporting, and analysis supporting time-sensitive decisions."],
];

function parseLine(line: string) {
  const values: string[] = []; let current = "", quoted = false;
  for (let i = 0; i < line.length; i++) { const char = line[i]; if (char === '"') { if (quoted && line[i + 1] === '"') { current += '"'; i++; } else quoted = !quoted; } else if (char === "," && !quoted) { values.push(current.trim()); current = ""; } else current += char; }
  values.push(current.trim()); return values;
}

type Check = { rows:number; columns:number; missing:number; duplicates:number; irregular:number; score:number; fields:string };

export default function Home() {
  const [hours,setHours]=useState(10), [people,setPeople]=useState(2), [rate,setRate]=useState(45), [automation,setAutomation]=useState(70);
  const [check,setCheck]=useState<Check|null>(null), [file,setFile]=useState("");
  const savings=useMemo(()=>{const h=hours*people*52*automation/100;return {hours:Math.round(h),value:Math.round(h*rate)}},[hours,people,rate,automation]);

  function inspect(event:ChangeEvent<HTMLInputElement>) {
    const selected=event.target.files?.[0]; if(!selected)return; setFile(selected.name); const reader=new FileReader();
    reader.onload=()=>{const lines=String(reader.result||"").replace(/^\uFEFF/,"").trim().split(/\r?\n/).filter(Boolean);const headers=parseLine(lines[0]||"");const rows=lines.slice(1).map(parseLine);const missing=rows.flat().filter(x=>!x).length;const duplicates=rows.length-new Set(rows.map(x=>JSON.stringify(x))).size;const irregular=rows.filter(x=>x.length!==headers.length).length;const total=Math.max(rows.length*headers.length,1);const penalty=missing/total*55+duplicates/Math.max(rows.length,1)*30+irregular/Math.max(rows.length,1)*35;setCheck({rows:rows.length,columns:headers.length,missing,duplicates,irregular,score:Math.max(0,Math.round(100-penalty)),fields:headers.slice(0,3).join(", ")})};
    reader.readAsText(selected);
  }

  return <main>
    <nav className="nav shell">
      <a className="brand" href="#top"><span>DE</span><b>David Edmonds</b><small>DATA ANALYTICS CONSULTANT</small></a>
      <div className="navlinks"><a href="#work">Work</a><a href="#services">Services</a><a href="#about">About</a><a href="#tools">Tools</a></div>
      <a className="nav-cta" href="mailto:davidedmondsc@gmail.com?subject=Analytics%20project%20inquiry">Start a conversation ↗</a>
    </nav>

    <section className="hero shell" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><i/> Available for remote consulting &amp; analytics opportunities</div>
        <h1>Making data<br/><em>useful.</em></h1>
        <p>I help teams turn complex data and manual reporting into clear dashboards, reliable KPIs, and decisions they can act on.</p>
        <div className="actions"><a className="button primary" href="#work">View selected work ↓</a><a className="plain-link" href="mailto:davidedmondsc@gmail.com?subject=Analytics%20project%20inquiry">Discuss your reporting challenge ↗</a></div>
      </div>
      <div className="hero-portrait"><img src="/david-edmonds.jpg" alt="David Edmonds, Data Analytics and BI Consultant"/><div className="portrait-card"><b>10+ years</b><span>Turning complex information into decision-ready reporting</span></div></div>
    </section>

    <section className="proof"><div className="shell proof-grid"><div><strong>500M+</strong><span>data points analyzed</span></div><div><strong>100+</strong><span>dashboards built</span></div><div><strong>10+</strong><span>years in analytics</span></div><div><strong>30+</strong><span>projects supported</span></div></div></section>

    <section className="section shell" id="work">
      <SectionHead number="01 / SELECTED WORK" title="Work that shows" accent="how I think." />
      <article className="featured-case">
        <div className="case-image"><img src="/washington-ev-dashboard.png" alt="Washington EV Market Overview Tableau dashboard"/></div>
        <div className="case-copy"><small>FEATURED CASE STUDY · TABLEAU</small><h3>Washington EV Market Overview</h3><p>An executive dashboard analyzing Washington State EV registrations across counties, manufacturers, vehicle types, and model years.</p><dl><div><dt>Challenge</dt><dd>Make a large public dataset useful for market exploration without overwhelming the user.</dd></div><div><dt>Approach</dt><dd>Built a focused KPI hierarchy, dynamic filters, geographic context, and data-quality controls.</dd></div><div><dt>Result</dt><dd>A decision-ready view that reveals adoption patterns, market leaders, and regional differences.</dd></div></dl><div className="tagrow"><span>Tableau</span><span>Data Quality</span><span>Market Analysis</span><span>Dashboard UX</span></div><a className="case-link" href="https://github.com/David-Edmonds/washington-ev-analytics" target="_blank" rel="noreferrer">View project on GitHub ↗</a></div>
      </article>
      <div className="project-note"><b>More work is coming.</b><span>New case studies will be added as sanitized portfolio projects are completed.</span></div>
    </section>

    <section className="work section" id="services"><div className="shell">
      <SectionHead number="02 / CONSULTING SERVICES" title="Useful analytics," accent="not more noise." />
      <div className="servicegrid">{services.map(service=><article key={service[0]}><small>{service[0]}</small><h3>{service[1]}</h3><p>{service[2]}</p><b>↗</b></article>)}</div>
      <div className="process"><small>HOW I WORK</small><div><b>01</b><span>Understand the decision</span></div><div><b>02</b><span>Audit the data and process</span></div><div><b>03</b><span>Build the clearest useful solution</span></div><div><b>04</b><span>Document, hand off, and improve</span></div></div>
    </div></section>

    <section className="about section" id="about"><div className="shell about-grid">
      <div className="about-intro"><small>03 / ABOUT &amp; EXPERIENCE</small><h2>Business-first analytics,<br/><em>grounded in experience.</em></h2><p>I’m David Edmonds, a data analyst and BI consultant with 10+ years of experience across public and private sectors.</p><p>My background spans operational reporting, dashboard development, data quality, large-scale analysis, defense, intelligence, recruiting, and business operations.</p><div className="links"><a href="https://www.linkedin.com/in/david-c-edmonds/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/David-Edmonds" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:davidedmondsc@gmail.com?subject=Resume%20request">Request resume ↗</a></div></div>
      <div className="timeline">{experience.map((item,index)=><article key={item[0]}><span>0{index+1}</span><div><small>{item[1]}</small><h3>{item[0]}</h3><p>{item[2]}</p></div></article>)}</div>
    </div></section>

    <section className="capabilities"><div className="shell capability-grid"><div><small>TOOLS</small><h3>Power BI · Tableau · Excel · SQL · PostgreSQL · Python · SharePoint · ArcGIS</h3></div><div><small>INDUSTRIES</small><h3>Defense · Intelligence · Operations · Recruiting · Government · Business Intelligence</h3></div></div></section>

    <section className="section shell" id="tools">
      <SectionHead number="04 / TRY THE TOOLS" title="A small sample of" accent="practical analytics." />
      <div className="tools">
        <article className="tool"><small className="green">BUSINESS CASE</small><h3>Reporting savings calculator</h3><p>Estimate the capacity your team could recover through reporting automation.</p><div className="calc"><div className="inputs"><label>Weekly reporting hours <b>{hours}</b><input type="range" min="1" max="40" value={hours} onChange={e=>setHours(+e.target.value)}/></label><label>People involved<input type="number" min="1" value={people} onChange={e=>setPeople(+e.target.value||1)}/></label><label>Hourly cost ($)<input type="number" min="1" value={rate} onChange={e=>setRate(+e.target.value||1)}/></label><label>Automatable work <b>{automation}%</b><input type="range" min="10" max="95" step="5" value={automation} onChange={e=>setAutomation(+e.target.value)}/></label></div><div className="result"><small>ESTIMATED ANNUAL IMPACT</small><strong>{savings.hours.toLocaleString()}</strong><span>hours recovered</span><hr/><b>${savings.value.toLocaleString()}</b><span>annual capacity value</span></div></div></article>
        <article className="tool"><small className="green">PRIVATE · BROWSER ONLY</small><h3>Data quality checker</h3><p>Run a quick first-pass check on a sanitized CSV. Your file never leaves this browser.</p><label className="drop"><input type="file" accept=".csv,text/csv" onChange={inspect}/><i>↑</i><b>{file||"Choose a sanitized CSV"}</b><span>CSV only · never uploaded</span></label>{check?<div className="quality"><div><small>QUALITY SCORE</small><strong>{check.score}</strong><span>/100</span></div><ul><li><b>{check.rows}</b> rows</li><li><b>{check.columns}</b> columns</li><li><b>{check.missing}</b> empty cells</li><li><b>{check.duplicates}</b> duplicates</li><li><b>{check.irregular}</b> irregular rows</li><li><b>{check.fields||"—"}</b> sampled fields</li></ul></div>:<div className="privacy">✓ <b>Client-data safe by design.</b> Only use public, synthetic, or sanitized data.</div>}</article>
      </div>
    </section>

    <section className="contact" id="contact"><div className="shell contact-grid"><div><small>05 / LET’S CONNECT</small><h2>Need clearer reporting<br/>or a better <em>dashboard?</em></h2><p>Tell me what is slow, unclear, or unreliable. I’ll help you identify the most practical next step.</p></div><div className="contact-card"><span>REMOTE · UNITED STATES</span><a href="mailto:davidedmondsc@gmail.com?subject=Analytics%20project%20inquiry">davidedmondsc@gmail.com ↗</a><a href="tel:+18438192435">+1 (843) 819-2435 ↗</a><a href="https://www.linkedin.com/in/david-c-edmonds/" target="_blank" rel="noreferrer">Connect on LinkedIn ↗</a><small>For project inquiries, include your current process, the decision you need to support, and your ideal timeline.</small></div></div></section>

    <footer className="footer shell"><a className="brand" href="#top"><span>DE</span><b>David Edmonds</b></a><p>Data Analytics &amp; BI Consultant<br/>Making complex data useful.</p><div><a href="#work">Work</a><a href="https://github.com/David-Edmonds">GitHub</a><a href="https://www.linkedin.com/in/david-c-edmonds/">LinkedIn</a><a href="#top">Top ↑</a></div><small>© {new Date().getFullYear()} David Edmonds · Portfolio work uses public, synthetic, or sanitized data.</small></footer>
  </main>
}

function SectionHead({number,title,accent}:{number:string;title:string;accent:string}) { return <div className="heading"><small>{number}</small><h2>{title}<br/><em>{accent}</em></h2></div> }
