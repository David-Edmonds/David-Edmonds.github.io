import { KeyFindings } from "../../components/KeyFindings";
import { salesFindings } from "../findings";
import { ProjectContact } from "../../components/ProjectContact";
import Walkthrough from "./Walkthrough";
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
        <a className="button blue" href={`${base}/sales-profitability-package.zip`} download>Download project <span>↓</span></a>
        <a className="secondary-action" href={`${base}/sales-profitability-dashboard.xlsx`} download>Excel workbook only ↓</a>
        <a className="secondary-action" href="#demo">Watch the 72-second demo ↓</a>
        <a className="secondary-action" href="https://github.com/David-Edmonds/David-Edmonds.github.io/tree/main/public/sales-profitability">View on GitHub ↗</a>
      </div>
      <p className="safe-project-note">Independent portfolio example · fictional Northstar Supply data · no client information.</p>
    </section>
    <section className="case-summary"><div className="shell case-summary-grid">
      <div><span>THE QUESTION</span><p>Are higher sales translating into stronger profit—and where is performance falling short?</p></div>
      <div><span>THE APPROACH</span><p>Compare matching periods, separate growth and margin effects, and reconcile every contribution to the underlying totals.</p></div>
      <div><span>THE DELIVERABLE</span><p>A one-page Excel dashboard with four filters, three editable charts, supporting calculations and a fictional source table.</p></div>
    </div></section>
<KeyFindings scope="Fictional Northstar Supply data · full-year 2025 vs 2024 · all regions and channels. These findings describe the sample, not client outcomes." findings={salesFindings} />

    <section className="dashboard-section shell" id="dashboard">
      <div className="dashboard-heading"><div><span>WORKBOOK PREVIEW</span><h2>See the story at a glance.</h2></div><p>This is the default 2025 view. Download the workbook to change year, quarter, region and channel in Excel.</p></div>
      <a href={`${base}/dashboard.png`} aria-label="Open full-size sales dashboard preview"><img src={`${base}/dashboard.png`} width="1684" height="1191" alt="2025 fictional sample: $8.24M net revenue, $2.57M gross profit, 31.2% margin, 97.5% plan attainment; revenue growth adds $302K in profit while lower margins offset $115K." style={{ width: "100%", height: "auto", display: "block", borderRadius: "12px", border: "1px solid #dce4ee" }}/></a>
      <div className="case-page-actions"><a className="secondary-action" href={`${base}/dashboard.pdf`}>Open one-page PDF ↗</a><a className="secondary-action" href={`${base}/README.md`}>Read the workbook guide ↗</a></div>
    </section>
    <section className="demo-section shell" id="demo" aria-labelledby="demo-title">
      <div className="dashboard-heading"><div><span>72-SECOND DASHBOARD DEMO</span><h2 id="demo-title">See how to read the result.</h2></div><p>A captioned video using actual workbook views: start with the question, narrow the filters, then inspect the profit drivers. No audio; all explanations appear on screen.</p></div>
      <video controls playsInline preload="none" poster="/sales-profitability/demo-poster.jpg" width="1280" height="720" aria-label="Sales and profitability dashboard demo">
        <source src="/sales-profitability/dashboard-demo.mp4" type="video/mp4"/>
        <track kind="captions" src="/sales-profitability/dashboard-demo.vtt" srcLang="en" label="English"/>
        Your browser does not support embedded video. Use the download link below.
      </video>
      <div className="case-page-actions"><a className="secondary-action" href="/sales-profitability/dashboard-demo.mp4" download>Download demo ↓</a><a className="secondary-action" href="/sales-profitability/demo-transcript.md">Read the full transcript ↗</a><a className="secondary-action" href="#walkthrough">Explore at your own pace ↓</a></div>
    </section>
    <Walkthrough />
    <section className="section shell">
      <div className="dashboard-heading"><div><span>TRANSPARENT BY DESIGN</span><h2>Useful detail, visible limits.</h2></div></div>
      <div className="method-grid">
        <article><h3>Trace the answer</h3><p>Dashboard shows the results; Analysis contains the formulas and driver checks; Data holds 576 fictional monthly records for 2024–2025. Gross profit excludes overhead, interest and tax.</p></article>
        <article><h3>Compare like with like</h3><p>Prior-year comparisons use matching months and filters. There is no 2023 data, so 2024 comparisons are unavailable. The revenue trend retains full-year context when a quarter is selected.</p></article>
        <article><h3>Open and explore</h3><p>Verified in desktop Excel, including filters, recalculation and reconciliation. No macros or external connections. The guide explains the fixed source ranges and how to extend them.</p></article>
      </div>
    </section>
  <ProjectContact source="sales" topic="analysis" title="Need a clearer view of sales and profit?" description="Discuss a dashboard that connects your revenue, margins and performance questions." />
 </main>;
}
