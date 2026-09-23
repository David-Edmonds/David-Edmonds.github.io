import type { Metadata } from "next";

const title = "Analytics Portfolio | David Edmonds";
const description = "Explore six analytics projects in Tableau, Power BI, Excel and SQL.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/work" }, openGraph: { title, description, url: "/work", images: [{ url: "/federal-contracting-dashboard.jpg", alt: "Federal Contracting Performance dashboard" }] } };

const projects = [
  { id: "startup", tool: "Tableau", title: "Startup Operations Dashboards", type: "TABLEAU · INDEPENDENT PORTFOLIO PROJECT", image: "/startup-operations/Expanded-Screenshots/05-Revenue.jpg", alt: "Startup revenue dashboard", summary: "Seven dashboards for revenue, growth and service health.", href: "/work/startup-operations", download: "/startup-operations/Startup-Operations-Expanded.twbx" },
  { id: "sales", tool: "Excel", title: "Sales & Profitability", type: "EXCEL · INDEPENDENT PORTFOLIO EXAMPLE", image: "/sales-profitability/dashboard.png", alt: "Excel sales and profitability dashboard", summary: "See what drives revenue growth and changing margins.", href: "/work/sales-profitability", download: "/sales-profitability/sales-profitability-package.zip" },
  { id: "sql", tool: "SQL", title: "Sales Growth, Profit Pressure", type: "SQL · INDEPENDENT PORTFOLIO EXAMPLE", summary: "Five SQL investigations trace performance back to source records.", href: "/work/sql-sales-investigation", download: "/sql-sales/sql-sales-project.zip" },
  { id: "federal", tool: "Power BI", title: "Federal Contracting Performance", type: "POWER BI PUBLIC-DATA CASE STUDY", image: "/federal-contracting-dashboard.jpg", alt: "Power BI federal contracting dashboard", summary: "Explore federal awards, agency activity and small-business participation.", href: "/work/federal-contracting-performance" },
  { id: "ev", tool: "Tableau", title: "Washington EV Market Overview", type: "TABLEAU CASE STUDY", image: "/washington-ev-dashboard.png", alt: "Washington electric vehicle market dashboard", summary: "Compare the registered EV fleet across counties and manufacturers.", href: "/work/washington-ev-market" },
  { id: "planner", tool: "Interactive", title: "Profit Scenario Planner", type: "INTERACTIVE · INDEPENDENT PORTFOLIO EXAMPLE", summary: "Test how price, volume and costs change operating profit.", href: "/work/profit-scenario-planner" },
];

export default function WorkPage() {
  return <main id="top" className="work-overview">
    <section className="shell work-overview-intro"><span className="work-eyebrow">SELECTED WORK</span><h1>Data. <em>Clear answers.</em></h1><p>Six independent projects. Explore the dashboards and the thinking behind them.</p></section>
    <nav className="shell work-switch" aria-label="Browse my work"><a href="/work" aria-current="page">Analytics</a><a href="/apps">AI &amp; Apps</a><a href="#experience">Experience</a></nav>
    <section className="shell work-overview-projects" aria-label="Portfolio projects"><div className="work-card-grid">
      {projects.map((project, index) => <article className="work-card" id={project.id} key={project.id}>
        <a className={`work-card-visual ${project.id === "startup" ? "work-card-startup" : ""} ${!project.image ? "work-card-diagram" : ""}`} href={project.href} aria-label={`View ${project.title}`}>
          {project.id === "startup" ? <svg width="1200" height="820" viewBox="120 25 1200 820" role="img" aria-label={project.alt}><image href={project.image} width="1440" height="900"/></svg> : project.image ? <img src={project.image} alt={project.alt} loading={index < 2 ? "eager" : "lazy"}/> : project.id === "sql" ? <div><span>SQL / FIVE INVESTIGATIONS</span><pre><code>{"SELECT year, revenue, profit\nFROM annual\nORDER BY year;"}</code></pre><small>Source data → checked results</small></div> : <div><span>MONTHLY OPERATING PROFIT</span><strong>$15,000 <span>→</span> $17,512.50</strong><small>Sample: price +5% · volume −5%</small></div>}
        </a>
        <div className="work-card-copy"><span className="work-card-tool" title={project.type}>{project.tool}</span><h2><a href={project.href}>{project.title}</a></h2><p>{project.summary}</p><div className="work-card-actions"><a className="work-card-primary" href={project.href}>View project <span aria-hidden="true">↗</span></a>{project.download ? <a href={project.download} download>Download</a> : project.id === "planner" ? <a href="/tools/profit-planner">Try the planner</a> : project.id === "ev" ? <a href="https://public.tableau.com/app/profile/david.edmonds5066/viz/WashingtonEVMarketOverview/Dashboard1#1" target="_blank" rel="noreferrer">Open Tableau</a> : null}</div></div>
      </article>)}
    </div></section>
    <section className="shell work-experience" id="experience" aria-labelledby="experience-title"><div className="work-experience-heading"><h2 id="experience-title">Professional experience</h2><a href="/about">More about my work ↗</a></div><div className="work-experience-grid"><article><span className="work-eyebrow">CURRENT ROLE · CONFIA SOLUTIONS, LLC</span><h3>Recruiting &amp; Operational Analytics</h3><p>Power BI and Excel reporting on hiring performance, recruiting pipelines and workforce trends.</p></article><article><span className="work-eyebrow">DEFENSE ANALYTICS · SANITIZED SUMMARY</span><h3>Reporting &amp; Analysis</h3><p>50+ visualization products across more than 20 projects.</p></article></div><p className="work-privacy">Independent projects above. Client-confidential data is never published.</p></section>
  </main>;
}
