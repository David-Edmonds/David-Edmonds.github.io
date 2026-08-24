import { SectionTitle } from "./components/SectionTitle";

export default function Home() {
  return <main id="top">
    <section className="hero shell">
      <div className="hero-text"><div className="status"><i/> OPEN TO REMOTE ANALYTICS ROLES &amp; SELECT PROJECT WORK</div><h1>Complex data.<br/><em>Clear direction.</em></h1><p>I’m David, a senior data analyst and BI professional currently working as a Data Analytics Consultant with Confia Solutions, LLC. I build dashboards, reporting systems, and analysis that help teams see what matters and decide what to do next.</p><div className="hero-actions"><a className="button blue" href="/work">See my work <span>→</span></a><a className="underlink" href="/contact">Start a conversation ↗</a></div></div>
      <div className="hero-side"><div className="portrait-wrap"><img src="/david-edmonds.jpg" alt="David Edmonds, Senior Data Analyst and BI Professional"/><div className="portrait-accent"/></div><div className="hero-facts"><div><strong>10+</strong><span>years across public &amp; private sectors</span></div><div><strong>100+</strong><span>analytical and reporting products delivered</span></div></div></div>
    </section>

    <section className="statement"><div className="shell"><span>WHAT I DO</span><h2>I turn operational data into <em>useful answers</em>—through focused analysis, clear reporting, and dashboards people actually use.</h2></div></section>

    <section className="section shell home-section"><SectionTitle eyebrow="01 · ANALYTICS SUPPORT" title="Practical support for" accent="better decisions." />
      <div className="home-service-grid"><article><span>01</span><h3>BI dashboards</h3><p>Focused Power BI and Tableau dashboards built around the decision.</p></article><article><span>02</span><h3>Reporting automation</h3><p>Cleaner recurring reporting with fewer manual steps and errors.</p></article><article><span>03</span><h3>KPI &amp; analytics support</h3><p>Trusted metrics, performance analysis, and practical recommendations.</p></article></div>
      <a className="section-link" href="/services">Explore analytics services <span>→</span></a>
    </section>

    <section className="home-work section"><div className="shell"><SectionTitle eyebrow="02 · SELECTED WORK" title="Proof through" accent="real projects." />
      <div className="project-preview-grid">
        <article><div className="project-image"><img src="/washington-ev-dashboard.png" alt="Washington EV Market Overview Tableau dashboard"/></div><div><span>TABLEAU · PUBLIC CASE STUDY</span><h3>Washington EV Market Overview</h3><p>Market concentration, county patterns, leading brands, and clearly governed metrics.</p><a href="/work/washington-ev-market">View case study →</a></div></article>
        <article><div className="project-image federal"><img src="/federal-contracting-dashboard.jpg" alt="Federal Contracting Performance Power BI dashboard"/></div><div><span>POWER BI · PORTFOLIO BUILD</span><h3>Federal Contracting Performance</h3><p>Award activity, small-business participation, goal attainment, and agency performance.</p><a href="/work">View portfolio →</a></div></article>
      </div>
    </div></section>

    <section className="home-proof section shell"><div><span>EXPERIENCE</span><strong>10+ years</strong><small>Analytics, reporting, and decision support</small></div><div><span>TOOLS</span><strong>Power BI · Tableau · SQL</strong><small>Plus Excel, Python, PostgreSQL, and SharePoint</small></div><div><span>EDUCATION</span><strong>B.S. Analytics</strong><small>Purdue Global · 2024</small></div></section>

    <section className="calculator-teaser"><div className="shell"><div><span>ANALYTICS LAB</span><h2>Estimate reporting effort and check a CSV before it becomes a dashboard.</h2><p>Use two browser-based tools for a practical first pass—without uploading the file.</p></div><a className="button blue" href="/tools">Open the analytics lab <span>→</span></a></div></section>

    <section className="contact compact-contact"><div className="shell contact-grid"><div><span>LET’S WORK TOGETHER</span><h2>Have a reporting challenge worth <em>solving?</em></h2></div><div><p>Tell me what is slow, unclear, or unreliable. I’ll help you identify the most practical next step.</p><a className="button dark" href="/contact">Start a conversation <span>↗</span></a></div></div></section>
  </main>;
}
