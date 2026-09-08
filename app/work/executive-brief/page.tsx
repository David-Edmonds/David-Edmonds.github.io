import type { Metadata } from "next";
import { ProjectContact } from "../../components/ProjectContact";
import { SalesJourney } from "../../components/SalesJourney";

const title = "Executive Brief Sample | David Edmonds";
const description = "A one-page example of turning sales and profitability analysis into a decision-ready executive brief.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/work/executive-brief" }, openGraph: { title, description, url: "/work/executive-brief", images: [] }, twitter: { card: "summary", title, description, images: [] } };

export default function ExecutiveBrief() {
  return <main id="top">
    <section className="case-hero shell">
      <a className="back-link" href="/work">← Back to Work</a>
      <span>EXECUTIVE BRIEF · SALES · DECISION SUPPORT</span>
      <h1>Make the finding<br/><em>easy to act on.</em></h1>
      <p>A short, evidence-backed readout for leaders who need the answer, the reason, and the next useful question without opening the workbook first.</p>
      <div className="case-page-actions"><a className="button blue" href="/executive-brief.pdf" download>Download the brief <span>↓</span></a><a className="secondary-action" href="/work/sales-profitability">See the supporting dashboard →</a></div>
      <p className="safe-project-note">Independent portfolio example · fictional Northstar Supply data · 2025 vs 2024 · gross profit before overhead.</p>
    </section>

    <section className="brief-sheet shell" aria-labelledby="brief-title">
      <div className="brief-sheet-head"><div><span>NORTHSTAR SUPPLY · FY2025 PERFORMANCE</span><h2 id="brief-title">Sales grew faster than profit.</h2></div><small>EXECUTIVE READOUT · SAMPLE</small></div>
      <div className="brief-callout"><strong>Decision signal</strong><p>Keep the growth plan under review while the team investigates margin pressure. More revenue is helping, but it is not converting into profit at the same rate.</p></div>
      <div className="brief-metrics"><div><span>NET REVENUE</span><strong>$8.24M</strong><small>+12.7% year over year</small></div><div><span>GROSS PROFIT</span><strong>$2.57M</strong><small>+7.9% year over year</small></div><div><span>GROSS MARGIN</span><strong>31.2%</strong><small>−1.4 percentage points</small></div></div>
      <div className="brief-columns"><article><span>WHAT DROVE THE CHANGE</span><h3>Growth added $302K to gross profit.</h3><p>Higher revenue contributed <b>$302,455.59</b>. The margin effect removed <b>$115,095.05</b>, leaving a reconciled <b>$187,360.54</b> increase in gross profit.</p></article><article><span>WHERE TO LOOK NEXT</span><h3>Start with the West region.</h3><p>West is <b>$312,710.96 below its annual revenue plan</b>, reaching 88.3% of target. Validate the plan assumptions and segment performance before choosing an intervention.</p></article></div>
      <div className="brief-footer"><div><span>LIMITATION</span><p>This sample identifies the size and location of the movement; it does not prove whether pricing, discounts, costs or mix caused the margin change.</p></div><div><span>NEXT STEP</span><p>Use the dashboard filters and the SQL investigation to isolate the segments worth discussing with the business.</p></div></div>
    </section>

    <section className="section shell"><div className="dashboard-heading"><div><span>WHY THIS FORMAT WORKS</span><h2>Decision first.<br/><em>Evidence close behind.</em></h2></div><p>The brief is deliberately compact: one signal, two supporting facts, one limitation and a next step. The workbook and SQL results remain available for anyone who needs to audit the numbers.</p></div><div className="method-grid"><article><h3>For leadership</h3><p>Open with the implication, then show only the measures needed to understand the direction.</p></article><article><h3>For the analyst</h3><p>Keep the calculation trail, definitions and supporting records one click away.</p></article><article><h3>For the next conversation</h3><p>End with a question the team can answer, rather than a generic recommendation.</p></article></div></section>
    <SalesJourney current="excel" />
    <ProjectContact source="sales" topic="analysis" title="Need a decision-ready readout?" description="Discuss a concise brief backed by a validated dashboard, clear definitions and an agreed next question." />
  </main>;
}
