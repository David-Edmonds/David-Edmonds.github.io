import type { Metadata } from "next";
import { SectionTitle } from "../components/SectionTitle";

const title = "Analytics Consulting Services | David Edmonds";
const description = "Power BI and Tableau dashboards, reporting automation, KPI design, data quality, and practical analytics support for small teams and operations leaders.";
export const metadata: Metadata = { title, description, openGraph:{title,description,images:[]}, twitter:{card:"summary",title,description,images:[]} };

export default function ServicesPage() {
  return <main id="top">
    <section className="page-intro shell"><span>CONSULTING SERVICES</span><h1>Focused analytics support.<br/><em>Useful outcomes.</em></h1><p>Senior, hands-on help for teams that need clearer reporting, better dashboards, and reliable performance information—without the overhead of a large consulting firm.</p></section>

    <section className="consulting section"><div className="shell"><SectionTitle eyebrow="01 · SERVICES" title="Choose the support" accent="your team needs." />
      <div className="offer-grid">
        <article><span className="offer-index">01</span><small>DASHBOARDS</small><h3>BI dashboard sprint</h3><p>Turn an important business question into a focused Power BI or Tableau dashboard with clear KPIs, thoughtful UX, and a clean handoff.</p><div className="offer-outcome"><b>Typical outcome</b><span>Executive-ready dashboard and measurement plan</span></div></article>
        <article><span className="offer-index">02</span><small>EFFICIENCY</small><h3>Reporting automation</h3><p>Review a recurring reporting process, reduce repetitive Excel and SQL work, and build checks that make the result faster and more reliable.</p><div className="offer-outcome"><b>Typical outcome</b><span>Repeatable reporting with fewer manual errors</span></div></article>
        <article><span className="offer-index">03</span><small>ADVISORY</small><h3>Analytics &amp; KPI support</h3><p>Define trusted metrics, assess data quality, investigate performance, and translate findings into practical next steps for the team.</p><div className="offer-outcome"><b>Typical outcome</b><span>Clear KPI framework and actionable readout</span></div></article>
      </div>
    </div></section>

    <section className="process-section section"><div className="shell"><SectionTitle eyebrow="02 · HOW IT WORKS" title="A practical path from" accent="question to answer." /><div className="process-grid"><article><span>01</span><h3>Define the decision</h3><p>Clarify the audience, business question, measures, and what a useful answer needs to support.</p></article><article><span>02</span><h3>Build and validate</h3><p>Shape the data, create the analysis, and test the measures before presentation.</p></article><article><span>03</span><h3>Deliver and improve</h3><p>Provide a clear handoff, document the logic, and identify the next worthwhile improvement.</p></article></div><div className="fit-note"><div><span>BEST FIT</span><p>Small teams and operations leaders who need senior, hands-on analytics support and straightforward communication.</p></div><a className="button dark" href="/contact">Discuss a project <span>↗</span></a></div></div></section>
  </main>;
}
