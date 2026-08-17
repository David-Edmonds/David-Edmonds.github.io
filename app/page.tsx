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
      <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#services">Services</a><a href="#skills">Skills</a><a href="#experience">Experience</a><a href="/david-edmonds-resume.pdf" download>Resume</a></nav>
      <a className="header-cta" href="mailto:davidedmondsc@gmail.com?subject=Analytics%20project%20inquiry">Let’s talk <span>↗</span></a>
    </div></header>

    <section className="hero shell" id="top">
      <div className="hero-text"><div className="status"><i/> OPEN TO REMOTE CONSULTING &amp; ANALYTICS ROLES</div><h1>Complex data.<br/><em>Clear direction.</em></h1><p>I’m David, a data analytics and BI consultant. I build dashboards, reporting systems, and analysis that help teams see what matters and decide what to do next.</p><div className="hero-actions"><a className="button blue" href="#work">See my work <span>↓</span></a><a className="underlink" href="mailto:davidedmondsc@gmail.com?subject=Analytics%20project%20inquiry">Start a conversation ↗</a></div></div>
      <div className="hero-side"><div className="portrait-wrap"><img src="/david-edmonds.jpg" alt="David Edmonds, Data Analytics and BI Consultant"/><div className="portrait-accent"/></div><div className="hero-facts"><div><strong>10+</strong><span>years across public &amp; private sectors</span></div><div><strong>100+</strong><span>dashboards and reporting products built</span></div></div></div>
    </section>

    <section className="statement"><div className="shell"><span>WHAT I DO</span><h2>I turn operational data into <em>useful answers</em>—through focused analysis, clear reporting, and dashboards people actually use.</h2></div></section>

    <section className="consulting section" id="services"><div className="shell"><SectionTitle eyebrow="01 · CONSULTING" title="Practical support for" accent="better decisions." />
      <div className="offer-grid">
        <article><span className="offer-index">01</span><small>DASHBOARDS</small><h3>BI dashboard sprint</h3><p>Turn an important business question into a focused Power BI or Tableau dashboard—with clear KPIs, thoughtful UX, and a clean handoff.</p><div className="offer-outcome"><b>Typical outcome</b><span>Executive-ready dashboard and measurement plan</span></div></article>
        <article><span className="offer-index">02</span><small>EFFICIENCY</small><h3>Reporting automation</h3><p>Review a recurring reporting process, reduce repetitive Excel and SQL work, and build checks that make the result faster and more reliable.</p><div className="offer-outcome"><b>Typical outcome</b><span>Repeatable reporting with fewer manual errors</span></div></article>
        <article><span className="offer-index">03</span><small>ADVISORY</small><h3>Analytics &amp; KPI support</h3><p>Define trusted metrics, assess data quality, investigate performance, and translate the findings into practical next steps for the team.</p><div className="offer-outcome"><b>Typical outcome</b><span>Clear KPI framework and actionable readout</span></div></article>
      </div>
      <div className="fit-note"><div><span>BEST FIT</span><p>Small teams and operations leaders who need senior, hands-on analytics support without the overhead of a large consulting firm.</p></div><a className="button dark" href="mailto:davidedmondsc@gmail.com?subject=Analytics%20project%20inquiry">Discuss a project <span>↗</span></a></div>
    </div></section>

    <section className="section shell" id="work"><SectionTitle eyebrow="02 · FEATURED WORK" title="Selected work," accent="shown properly." />
      <article className="feature">
        <div className="feature-visual"><div className="browser-bar"><i/><i/><i/><span>WASHINGTON EV MARKET OVERVIEW</span></div><img src="/washington-ev-dashboard.png" alt="Washington EV Market Overview dashboard in Tableau"/></div>
        <div className="feature-copy"><span className="pill">TABLEAU CASE STUDY</span><h3>Washington EV Market Overview</h3><p className="lead">An executive dashboard that makes a large public dataset easy to explore—without losing the important patterns.</p><div className="case-row"><b>Question</b><p>How is EV adoption changing across Washington’s counties, manufacturers, and vehicle types?</p></div><div className="case-row"><b>My work</b><p>KPI hierarchy, dynamic filtering, geographic analysis, dashboard UX, and data-quality controls.</p></div><div className="case-row"><b>Outcome</b><p>A decision-ready market view that reveals adoption trends, leading brands, and regional differences.</p></div><div className="chips"><span>Tableau</span><span>Market analysis</span><span>Data quality</span><span>Data storytelling</span></div><div className="project-actions"><a className="button blue" href="/work/washington-ev-market">View full case study <span>→</span></a><a className="secondary-action" href="https://public.tableau.com/app/profile/david.edmonds5066/viz/WashingtonEVMarketOverview/Dashboard1#1" target="_blank" rel="noreferrer">Open in Tableau ↗</a><a className="secondary-action" href="https://github.com/David-Edmonds/washington-ev-analytics" target="_blank" rel="noreferrer">Project files ↗</a></div></div>
      </article>
      <article className="feature feature-federal">
        <div className="feature-visual federal-visual"><div className="browser-bar"><i/><i/><i/><span>FEDERAL CONTRACTING PERFORMANCE</span></div><img src="/federal-contracting-dashboard.jpg" alt="Federal Contracting Performance dashboard in Power BI"/></div>
        <div className="feature-copy"><span className="pill">POWER BI PORTFOLIO BUILD</span><h3>Federal Contracting Performance</h3><p className="lead">An executive view of federal award activity, small-business participation, and socioeconomic goal performance.</p><div className="case-row"><b>Question</b><p>Where is federal contract spending concentrated, and how are agencies performing against small-business goals?</p></div><div className="case-row"><b>My work</b><p>Power BI modeling, DAX measures, agency and fiscal-year filters, KPI design, and visual theme refinement.</p></div><div className="case-row"><b>Outcome</b><p>A focused monitoring view for award volume, goal attainment, quarterly movement, and agency-level performance.</p></div><div className="chips"><span>Power BI</span><span>DAX</span><span>Data modeling</span><span>Executive reporting</span></div><div className="project-actions"><a className="button dark" href="mailto:davidedmondsc@gmail.com?subject=Federal%20contracting%20dashboard">Discuss this project <span>↗</span></a><span className="safe-project-note">Public federal-award data · PBIX and source files are not published.</span></div></div>
      </article>
      <div className="portfolio-strip"><span>PORTFOLIO NOTE</span><p><b>Built with real work, shared responsibly.</b> New case studies are added as public or sanitized projects are completed.</p><a href="https://github.com/David-Edmonds" target="_blank" rel="noreferrer">Browse GitHub ↗</a></div>
      <div className="case-study-grid">
        <article><div className="case-index"><span>02</span><b>CURRENT ROLE · CONFIA SOLUTIONS</b></div><div className="case-badge blue-badge">POWER BI + EXCEL</div><h3>Recruiting &amp; Operational Analytics</h3><p>Bi-weekly analysis and leadership reporting across headcount, pipeline stages, time-to-fill, conversion rates, applicant volume, placements, and revenue pipeline metrics.</p><dl><div><dt>Focus</dt><dd>Hiring performance and workforce trends</dd></div><div><dt>Contribution</dt><dd>Dashboard design, KPI tracking, source consolidation, and validation</dd></div></dl><div className="skill-chips static-chips"><span>Power BI</span><span>Excel</span><span>KPI reporting</span><span>Data quality</span></div></article>
        <article><div className="case-index"><span>03</span><b>SANITIZED EXPERIENCE</b></div><div className="case-badge coral-badge">DEFENSE ANALYTICS</div><h3>Metrics &amp; Visualization Portfolio</h3><p>A high-volume reporting portfolio created as the sole data analyst on a 12-person team, spanning executive dashboards, analytical models, reports, and process maps.</p><div className="case-stats"><div><strong>50+</strong><span>visualization products</span></div><div><strong>20+</strong><span>projects supported</span></div></div><div className="skill-chips static-chips"><span>Power BI</span><span>Excel</span><span>Requirements</span><span>Executive reporting</span></div></article>
      </div>
    </section>

    <section className="skills section" id="skills"><div className="shell"><SectionTitle eyebrow="03 · CAPABILITIES" title="The skills behind" accent="the work." />
      <div className="skill-grid">{skillGroups.map((group,index)=><article key={group.label}><div className="skill-number">0{index+1}</div><span className="skill-label">{group.label}</span><h3>{group.title}</h3><p>{group.text}</p><div className="skill-chips">{group.skills.map(skill=><span key={skill}>{skill}</span>)}</div></article>)}</div>
      <div className="toolbelt"><span>TOOLBELT</span><div>Power BI <i/> Tableau <i/> SQL <i/> Excel <i/> PostgreSQL <i/> Python <i/> SharePoint <i/> ArcGIS</div></div>
    </div></section>

    <section className="section shell" id="experience"><SectionTitle eyebrow="04 · EXPERIENCE" title="A career built around" accent="decision support." />
      <div className="experience-grid"><div className="experience-intro"><p>I bring more than a decade of experience in operational reporting, dashboard development, data quality, large-scale analysis, defense, intelligence, recruiting, and business operations.</p><div className="sector-list"><span>DEFENSE</span><span>INTELLIGENCE</span><span>GOVERNMENT</span><span>OPERATIONS</span><span>RECRUITING</span><span>BUSINESS INTELLIGENCE</span></div><a className="button dark" href="/david-edmonds-resume.pdf" download>Download resume <span>↓</span></a></div><div className="role-list">{roles.map((role,index)=><article key={role[0]}><span>0{index+1}</span><div><h3>{role[0]}</h3><p>{role[1]}</p></div></article>)}</div></div>
      <div className="credential-grid"><div><span>EXPERIENCE</span><strong>10+ years</strong><small>Analytics, reporting &amp; decision support</small></div><div><span>EDUCATION</span><strong>B.S. Analytics</strong><small>Purdue Global · 2024</small></div><div><span>FOUNDATION</span><strong>A.S. Computer Technology</strong><small>Midlands Technical College · 2019</small></div><div><span>AVAILABILITY</span><strong>Remote · U.S.</strong><small>Consulting and analytics opportunities</small></div></div>
    </section>

    <section className="lab section" id="lab"><div className="shell"><SectionTitle eyebrow="05 · ANALYTICS LAB" title="Try a couple of" accent="working demos." />
      <div className="lab-grid"><article className="lab-card"><div className="lab-head"><span>01</span><div><h3>Reporting savings calculator</h3><p>Build a quick business case for automation.</p></div></div><div className="calculator"><div className="inputs"><label>Weekly reporting hours <b>{hours}</b><input type="range" min="1" max="40" value={hours} onChange={e=>setHours(+e.target.value)}/></label><label>People involved<input type="number" min="1" value={people} onChange={e=>setPeople(+e.target.value||1)}/></label><label>Hourly cost ($)<input type="number" min="1" value={rate} onChange={e=>setRate(+e.target.value||1)}/></label><label>Automatable work <b>{automation}%</b><input type="range" min="10" max="95" step="5" value={automation} onChange={e=>setAutomation(+e.target.value)}/></label></div><div className="result"><span>POTENTIAL ANNUAL IMPACT</span><strong>{savings.hours.toLocaleString()}</strong><small>hours recovered</small><hr/><b>${savings.value.toLocaleString()}</b><small>capacity value</small></div></div></article>
      <article className="lab-card"><div className="lab-head"><span>02</span><div><h3>CSV quality checker</h3><p>Run a private, browser-only first pass.</p></div></div><label className="upload"><input type="file" accept=".csv,text/csv" onChange={inspect}/><i>↑</i><b>{file||"Choose a sanitized CSV"}</b><small>Never uploaded · stays in your browser</small></label>{check?<div className="check-results"><div><strong>{check.score}</strong><span>QUALITY<br/>SCORE</span></div><p><b>{check.rows}</b> rows</p><p><b>{check.columns}</b> columns</p><p><b>{check.missing}</b> empty cells</p><p><b>{check.duplicates}</b> duplicates</p></div>:<div className="safe-note">✓ Use only public, synthetic, or properly sanitized data.</div>}</article></div>
    </div></section>

    <section className="contact" id="contact"><div className="shell contact-grid"><div><span>LET’S WORK TOGETHER</span><h2>Have a reporting challenge worth <em>solving?</em></h2></div><div><p>Tell me what is slow, unclear, or unreliable. I’ll help you find the most practical next step.</p><a className="contact-email" href="mailto:davidedmondsc@gmail.com?subject=Analytics%20project%20inquiry">davidedmondsc@gmail.com <span>↗</span></a><div className="contact-links"><a href="tel:+18438192435">+1 (843) 819-2435</a><a href="https://www.linkedin.com/in/david-c-edmonds/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/David-Edmonds" target="_blank" rel="noreferrer">GitHub ↗</a></div></div></div></section>

    <footer className="footer shell"><a className="brand" href="#top"><span>DE</span><div><b>David Edmonds</b><small>DATA ANALYTICS &amp; BI</small></div></a><p>Remote · United States<br/>Consulting &amp; analytics opportunities</p><div><a href="#work">Work</a><a href="#skills">Skills</a><a href="#top">Back to top ↑</a></div><small>© {new Date().getFullYear()} David Edmonds · Client-confidential data is never published.</small></footer>
  </main>
}

function SectionTitle({eyebrow,title,accent}:{eyebrow:string;title:string;accent:string}){return <div className="section-title"><span>{eyebrow}</span><h2>{title}<br/><em>{accent}</em></h2></div>}
