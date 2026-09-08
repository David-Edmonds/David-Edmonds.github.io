import { KeyFindings } from "../../components/KeyFindings";
import { sqlFindings } from "../findings";
import { ProjectContact } from "../../components/ProjectContact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Sales Investigation | David Edmonds",
  description: "Five reproducible SQL investigations connecting sales growth, profit pressure, category margins and regional plan performance. Independent fictional-data portfolio work.",
  alternates: { canonical: "/work/sql-sales-investigation" },
  openGraph: { title: "SQL Sales Investigation | David Edmonds", description: "From source records to reconciled profit drivers.", images: [{ url: "/sales-profitability/dashboard.png", alt: "Sales and profitability dashboard backed by the SQL investigation" }] },
};
const findings=[
  {title:"Is growth reaching profit?",value:"12.7% → 7.9%",text:"Revenue grew 12.7%, but gross profit grew 7.9%. Start by separating business growth from profitability.",skill:"Aggregation · LAG · safe division",file:"01_performance"},
  {title:"What drove revenue growth?",value:"$783K + $144K",text:"Higher order count contributes about $783K and higher revenue per order contributes $144K to the $927K revenue increase.",skill:"CTEs · two-part decomposition",file:"02_revenue_drivers"},
  {title:"What held profit back?",value:"+$302K − $115K",text:"Revenue growth adds about $302K to gross profit. Margin pressure offsets $115K, leaving a $187K increase.",skill:"Matching periods · reconciled contributions",file:"03_profit_drivers"},
  {title:"Where did margins weaken?",value:"Furniture: −4.0 pp",text:"Furniture margin falls to 19.7%, the largest category decline. Category mix still matters: within-category effects are not the same as the aggregate margin effect.",skill:"PARTITION BY · weighted margins",file:"04_category_pressure"},
  {title:"Where should the review start?",value:"West: $313K below plan",text:"West has the largest revenue shortfall. Review assumptions, discounts, costs and product mix before assigning a business cause.",skill:"Grouped comparison · RANK",file:"05_regional_plan"},
];

export default function SQLSales() {
 return <main id="top">
  <section className="case-hero shell"><a className="back-link" href="/work">← Back to Work</a><span>SQL · SALES ANALYSIS · RECONCILIATION</span><h1>Five questions.<br/><em>Traceable answers.</em></h1><p>A reproducible SQL investigation into why stronger sales do not always produce equally strong profit. The same source records power the Excel dashboard.</p><div className="case-page-actions"><a className="button blue" href="/sql-sales/sql-sales-project.zip" download>Download project <span>↓</span></a><a className="secondary-action" href="https://github.com/David-Edmonds/David-Edmonds.github.io/tree/main/public/sql-sales">View SQL on GitHub ↗</a><a className="secondary-action" href="/work/sales-profitability#walkthrough">Take the dashboard tour →</a></div><p className="safe-project-note">Independent portfolio work · 576 fictional monthly records · complete 2024–2025 sample · USD.</p></section>
  <section className="case-summary"><div className="shell case-summary-grid"><div><span>THE QUESTION</span><p>Where does sales growth turn into profit, and where does it fall short?</p></div><div><span>THE APPROACH</span><p>Five readable queries, matching-year comparisons, integer-cent source amounts, and independent reconciliation checks.</p></div><div><span>TRY IT</span><p>Download the source CSV, SQLite schema, queries, Python runner and result tables. No database server or paid tools required.</p></div></div></section>
<KeyFindings scope="Full-year 2025 vs 2024 · 576 fictional monthly records. Download the linked results to inspect the exact figures." findings={sqlFindings} />

  <section className="section shell sql-findings" aria-label="Five SQL findings"><div className="dashboard-heading"><div><span>FINDINGS FROM THE FICTIONAL 2025 SAMPLE</span><h2>Follow the evidence.</h2></div><p>Each answer links to the exact query and its downloadable results. Growth comparisons use the same full-year scope.</p></div>
   {findings.map(f=><article className="sql-finding" key={f.file}><div><span className="sql-skill">{f.skill}</span><h3>{f.title}</h3><div className="case-page-actions"><a className="secondary-action" href={`/sql-sales/queries/${f.file}.sql`}>Read SQL ↗</a><a className="secondary-action" href={`/sql-sales/results/${f.file}.csv`} download>Download results ↓</a></div></div><div><strong>{f.value}</strong><p>{f.text}</p></div></article>)}
  </section>
  <section className="case-method"><div className="shell"><div className="section-title"><span>REPRODUCIBLE AND REVIEWABLE</span><h2>Show the work.<br/><em>Check the answer.</em></h2></div><div className="method-grid"><article><h3>One source, two tools</h3><p>The CSV is exported from the reviewed Excel source table. The SQL totals match its $8,242,432.31 revenue and $2,573,848.19 gross profit for 2025.</p></article><article><h3>Checks that can fail</h3><p>Validation covers the full monthly grain, duplicate rejection, impossible discounts, independent totals, missing prior-year handling and both driver reconciliations.</p></article><article><h3>Limits stay visible</h3><p>No customer or transaction-level conclusions are supported by these monthly records. The contributions explain arithmetic, not causality. 2024 comparisons stay unavailable because 2023 is absent.</p></article></div><div className="case-page-actions"><a className="secondary-action" href="/sql-sales/README.md">Read setup and methodology ↗</a><a className="secondary-action" href="/sql-sales/validate.py">Inspect validation ↗</a></div></div></section>
 <ProjectContact source="sql" topic="analysis" title="Need to explain a change in performance?" description="Discuss a SQL investigation with agreed measures, traceable calculations and a concise findings readout." />
 </main>;
}
