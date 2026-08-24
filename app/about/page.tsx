import type { Metadata } from "next";
import { SectionTitle } from "../components/SectionTitle";

const title = "About David Edmonds | Senior Data Analyst & BI Professional";
const description = "David Edmonds is a Data Analytics Consultant with Confia Solutions, LLC and brings more than a decade of experience in dashboards, operational reporting, data quality, defense, intelligence, government, recruiting, and business operations.";
export const metadata: Metadata = { title, description, alternates:{canonical:"/about"}, openGraph:{title,description,url:"/about",images:[]}, twitter:{card:"summary",title,description,images:[]} };

const skillGroups = [
  { label:"Visualize", title:"Dashboards & storytelling", text:"I structure dashboards around the decision—not the available fields—so the story stays clear.", skills:["Power BI","Tableau","Excel","Dashboard UX"] },
  { label:"Analyze", title:"Data & performance analysis", text:"I explore operational data, test assumptions, and turn findings into practical recommendations.", skills:["SQL","PostgreSQL","Python","Data Quality"] },
  { label:"Improve", title:"Reporting systems", text:"I streamline recurring reports, define useful KPIs, and reduce manual steps that create risk.", skills:["KPI Design","Automation","SharePoint","GitHub"] },
];
const roles = [
  ["Data Analytics Consultant | Confia Solutions, LLC","Recruiting and operational analytics, KPI tracking, source validation, and Power BI and Excel reporting for business operations."],
  ["Data Analyst","Tableau dashboards, SQL analysis, and operational performance reporting."],
  ["Sr. Metrics & Data Analyst","50+ visualization products across 20+ defense-related projects."],
  ["Intelligence Analyst","Research and reporting supporting mission-critical decisions."],
];

export default function AboutPage() {
  return <main id="top">
    <section className="page-intro shell about-intro"><span>ABOUT DAVID</span><h1>A career built around<br/><em>decision support.</em></h1><p>I currently work as a Data Analytics Consultant with Confia Solutions, LLC and bring more than a decade of experience in operational reporting, dashboard development, data quality, large-scale analysis, defense, intelligence, government, recruiting, and business operations.</p><a className="button dark" href="/david-edmonds-resume.pdf" download>Download resume <span>↓</span></a></section>

    <section className="skills section"><div className="shell"><SectionTitle eyebrow="01 · CAPABILITIES" title="The skills behind" accent="the work." /><div className="skill-grid">{skillGroups.map((group,index)=><article key={group.label}><div className="skill-number">0{index+1}</div><span className="skill-label">{group.label}</span><h3>{group.title}</h3><p>{group.text}</p><div className="skill-chips">{group.skills.map(skill=><span key={skill}>{skill}</span>)}</div></article>)}</div><div className="toolbelt"><span>TOOLBELT</span><div>Power BI <i/> Tableau <i/> SQL <i/> Excel <i/> PostgreSQL <i/> Python <i/> SharePoint <i/> ArcGIS</div></div></div></section>

    <section className="section shell"><SectionTitle eyebrow="02 · EXPERIENCE" title="Work across complex" accent="operating environments." /><div className="experience-grid"><div className="experience-intro"><p>My background combines technical analytics work with the operating context needed to make reporting useful.</p><div className="sector-list"><span>DEFENSE</span><span>INTELLIGENCE</span><span>GOVERNMENT</span><span>OPERATIONS</span><span>RECRUITING</span><span>BUSINESS INTELLIGENCE</span></div></div><div className="role-list">{roles.map((role,index)=><article key={role[0]}><span>0{index+1}</span><div><h3>{role[0]}</h3><p>{role[1]}</p></div></article>)}</div></div><div className="credential-grid"><div><span>EXPERIENCE</span><strong>10+ years</strong><small>Analytics, reporting &amp; decision support</small></div><div><span>EDUCATION</span><strong>B.S. Analytics</strong><small>Purdue Global · 2024</small></div><div><span>FOUNDATION</span><strong>A.S. Computer Technology</strong><small>Midlands Technical College · 2019</small></div><div><span>AVAILABILITY</span><strong>Remote · U.S.</strong><small>Roles and selected project work</small></div></div></section>
  </main>;
}
