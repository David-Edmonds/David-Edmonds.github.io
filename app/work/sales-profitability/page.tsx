import type { Metadata } from "next";

const title = "Sales & Profitability in Excel | David Edmonds";
const description = "An independent Excel portfolio example: explore sales, profit, margin pressure and growth drivers with a downloadable workbook and transparent calculations.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "/work/sales-profitability" },
  openGraph: { title, description, url: "/work/sales-profitability", images: [{ url: "/sales-profitability/dashboard.png", alt: "Sales and profitability Excel dashboard with revenue trends and profit contributions" }] },
};
const base = "/sales-profitability";

export default function SalesProfitability() {
  return <main id="top">
    <section className="case-hero shell">
      <a className="back-link" href="/work">← Back to Work</a>
      <span>EXCEL · PROFITABILITY · GROWTH DRIVERS</span>
      <h1>Growth is only<br/><em>half the story.</em></h1>
      <p>A compact sales dashboard that connects revenue growth to profit, makes margin pressure visible, and points to the next question worth asking.</p>
      <div className="case-page-actions">
        <a className="button blue" href={`${base}/sales-profitability-dashboard.xlsx`} download>Download Excel <span>↓</span></a>
        <a className="secondary-action" href={`${base}/sales-profitability-package.zip`} download>Complete package ↓</a>
        <a className="secondary-action" href="https://github.com/David-Edmonds/David-Edmonds.github.io/tree/main/public/sales-profitability">View on GitHub ↗</a>
      </div>
      <p className="safe-project-note">Independent portfolio example · fictional Northstar Supply data · no client information.</p>
    </section>
    <section className="case-summary"><div className="shell case-summary-grid">
      <div><span>THE QUESTION</span><p>Are higher sales translating into stronger profit—and where is performance falling short?</p></div>
      <div><span>THE APPROACH</span><p>Compare matching periods, separate growth and margin effects, and reconcile every contribution to the underlying totals.</p></div>
      <div><span>THE DELIVERABLE</span><p>A one-page Excel dashboard with four filters, three editable charts, supporting calculations and a fictional source table.</p></div>
    </div></section>
    <section className="dashboard-section shell" id="dashboard">
      <div className="dashboard-heading"><div><span>WORKBOOK PREVIEW</span><h2>See the story at a glance.</h2></div><p>This is the default 2025 view. Download the workbook to change year, quarter, region and channel in Excel.</p></div>
      <a href={`${base}/dashboard.png`} aria-label="Open full-size sales dashboard preview"><img src={`${base}/dashboard.png`} width="1684" height="1191" alt="2025 fictional sample: $8.24M net revenue, $2.57M gross profit, 31.2% margin, 97.5% plan attainment; revenue growth adds $302K in profit while lower margins offset $115K." style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px", border: "1px solid #dce4ee" }}/></a>
      <div className="case-page-actions"><a className="secondary-action" href={`${base}/dashboard.pdf`}>Open one-page PDF ↗</a><a className="secondary-action" href={`${base}/README.md`}>Read the workbook guide ↗</a></div>
    </section>
    <section className="case-method"><div className="shell">
      <div className="section-title"><span>WHAT THE SAMPLE REVEALS</span><h2>More sales.<br/><em>Less profit per dollar.</em></h2></div>
      <div className="method-grid">
        <article><h3>Growth has two components</h3><p>In the fictional 2025 sample, orders rise 10.7% and revenue per order rises 1.8%. The workbook separates their dollar contributions to the 12.7% revenue increase.</p></article>
        <article><h3>Margin changes the result</h3><p>Revenue growth contributes about $302K to gross profit, while lower margins offset about $115K. Together they explain the $187K profit increase.</p></article>
        <article><h3>A clear next investigation</h3><p>West has the largest revenue gap to plan, about $313K. That identifies where to investigate; it does not establish the business cause of the shortfall.</p></article>
      </div>
    </div></section>
    <section className="section shell">
      <div className="dashboard-heading"><div><span>TRANSPARENT BY DESIGN</span><h2>Useful detail, visible limits.</h2></div></div>
      <div className="method-grid">
        <article><h3>Trace the answer</h3><p>Dashboard shows the results; Analysis contains the formulas and driver checks; Data holds 576 fictional monthly records for 2024–2025. Gross profit excludes overhead, interest and tax.</p></article>
        <article><h3>Compare like with like</h3><p>Prior-year comparisons use matching months and filters. There is no 2023 data, so 2024 comparisons are unavailable. The revenue trend retains full-year context when a quarter is selected.</p></article>
        <article><h3>Open and explore</h3><p>Verified in desktop Excel, including filters, recalculation and reconciliation. No macros or external connections. The guide explains the fixed source ranges and how to extend them.</p></article>
      </div>
    </section>
  </main>;
}
