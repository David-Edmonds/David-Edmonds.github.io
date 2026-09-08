"use client";
import { useState } from "react";

const steps = [
  { title: "Read the headline", filter: "2025 · Full year · All regions · All channels", image: "dashboard.png", alt: "Full-year Excel view with $8.24M revenue and $2.57M gross profit", takeaway: "Sales grew faster than profit.", text: "Revenue is up 12.7%, while gross profit is up 7.9%. The 1.4 percentage-point margin decline explains why growth alone does not tell the whole story.", action: "In Excel: start with the four headline metrics, then compare their changes against the prior year." },
  { title: "Narrow the question", filter: "2025 · Q3 · West · Online", image: "walkthrough-filtered.png", alt: "Filtered Excel view for Q3 West Online: $313K revenue, $91K gross profit and 88.6% plan attainment", takeaway: "Focus on one segment.", text: "This selection has $313K in net revenue, $91K in gross profit and 88.6% plan attainment. The full-year trend stays visible; the headline metrics and profit breakdown use Q3.", action: "In Excel: choose Q3, West and Online in the blue drop-downs. This preview shows the resulting workbook view." },
  { title: "Explain the profit change", filter: "Reset to 2025 · Full year · All regions · All channels", image: "dashboard.png", alt: "Profit contribution chart: revenue growth adds $302K, margin change offsets $115K", takeaway: "Separate growth from margin pressure.", text: "In the full-year view, revenue growth contributes about $302K to profit and margin change offsets $115K. That reconciles to the $187K profit increase. The SQL investigation then reveals where category margins deteriorated.", action: "In Excel: restore Full year, All and All, then open Analysis to inspect the driver formulas and reconciliation checks." },
];

export default function Walkthrough() {
  const [step,setStep]=useState(0);
  const current=steps[step];
  return <section className="walkthrough shell" id="walkthrough" aria-labelledby="walkthrough-title">
    <div className="dashboard-heading"><div><span>ONE-MINUTE GUIDED TOUR</span><h2 id="walkthrough-title">From a number<br/>to a useful question.</h2></div><p>Three short steps using actual workbook views. These are guided previews; download the project to operate the filters in Excel.</p></div>
    <div className="walkthrough-controls" aria-label="Walkthrough steps">{steps.map((item,i)=><button key={item.title} type="button" aria-pressed={step===i} aria-controls="walkthrough-panel" onClick={()=>setStep(i)}>{item.title}</button>)}</div>
    <div id="walkthrough-panel" className="walkthrough-panel">
      <div className="walkthrough-copy" aria-live="polite"><span className="walkthrough-filter">{current.filter}</span><h3>{current.takeaway}</h3><p>{current.text}</p><p className="walkthrough-action">{current.action}</p><div className="walkthrough-navigation"><button type="button" disabled={step===0} onClick={()=>setStep(step-1)}>← Previous</button><span>Step {step+1} of 3</span><button type="button" disabled={step===2} onClick={()=>setStep(step+1)}>Next →</button></div></div>
      <a href={`/sales-profitability/${current.image}`} aria-label="Open the current workbook preview at full size"><img src={`/sales-profitability/${current.image}`} alt={current.alt} width="1684" height="1191"/></a>
    </div>
    <div className="case-page-actions"><a className="button blue" href="/sales-profitability/sales-profitability-package.zip" download>Download project <span>↓</span></a><a className="secondary-action" href="/work/sql-sales-investigation">Follow the SQL investigation →</a></div>
  </section>;
}
