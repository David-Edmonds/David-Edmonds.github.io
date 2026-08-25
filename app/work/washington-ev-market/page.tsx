import type { Metadata } from "next";

const title = "Washington EV Market Overview | David Edmonds";
const description = "A Tableau case study exploring electric vehicle adoption across Washington State, including market leaders, regional patterns, vehicle types, and data-quality decisions.";
const image = "https://david-edmonds.github.io/washington-ev-dashboard.png";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [{ url: image, width: 1382, height: 827, alt: "Washington EV Market Overview dashboard" }] },
  twitter: { card: "summary_large_image", title, description, images: [image] },
};

export default function WashingtonEVCaseStudy() {
  return <main className="case-page" id="top">
    <section className="case-hero shell"><a className="back-link" href="/work">← Back to portfolio</a><span>TABLEAU · MARKET ANALYSIS · DATA STORYTELLING</span><h1>Washington EV<br/><em>Market Overview</em></h1><p>An interactive executive dashboard designed to make Washington State electric-vehicle registration data understandable, explorable, and useful.</p><div className="case-page-actions"><a className="button blue" href="#dashboard">Explore dashboard <span>↓</span></a><a className="secondary-action" href="https://public.tableau.com/app/profile/david.edmonds5066/viz/WashingtonEVMarketOverview/Dashboard1#1" target="_blank" rel="noreferrer">Open on Tableau Public ↗</a><a className="secondary-action" href="https://github.com/David-Edmonds/washington-ev-analytics" target="_blank" rel="noreferrer">View project files ↗</a></div></section>

    <section className="case-summary"><div className="shell case-summary-grid"><div><span>THE QUESTION</span><p>How is electric-vehicle adoption changing across Washington’s counties, manufacturers, vehicle types, and model years?</p></div><div><span>THE APPROACH</span><p>Structure the analysis around a clear KPI hierarchy, responsive filters, geographic context, market share, and explicit data-quality controls.</p></div><div><span>THE RESULT</span><p>A decision-ready view that makes regional differences, adoption patterns, and market leaders visible without overwhelming the user.</p></div></div></section>

    <section className="dashboard-section shell" id="dashboard"><div className="dashboard-heading"><div><span>INTERACTIVE DASHBOARD</span><h2>Explore the data.</h2></div><p>Use the Tableau controls to filter by county, make, model year, and vehicle type. For the best small-screen experience, open the dashboard directly in Tableau.</p></div><div className="tableau-frame"><iframe src="https://public.tableau.com/views/WashingtonEVMarketOverview/Dashboard1?:showVizHome=no&:embed=true" title="Interactive Washington EV Market Overview Tableau dashboard" loading="lazy" allowFullScreen /></div><a className="mobile-tableau-link button blue" href="https://public.tableau.com/app/profile/david.edmonds5066/viz/WashingtonEVMarketOverview/Dashboard1#1" target="_blank" rel="noreferrer">Open full dashboard <span>↗</span></a></section>

    <section className="case-method"><div className="shell"><div className="section-title"><span>DESIGN DECISIONS</span><h2>Built for clarity,<br/><em>not decoration.</em></h2></div><div className="method-grid"><article><span>01</span><h3>Lead with the market</h3><p>Top-level KPIs answer the first questions quickly before the user moves into detailed exploration.</p></article><article><span>02</span><h3>Make filters purposeful</h3><p>Controls align with meaningful business dimensions rather than exposing every available field.</p></article><article><span>03</span><h3>Protect interpretation</h3><p>Data-quality checks and clear labels reduce the risk of drawing conclusions from incomplete or inconsistent values.</p></article></div></div></section>

    <section className="contact"><div className="shell contact-grid"><div><span>HAVE A SIMILAR NEED?</span><h2>Turn your data into<br/><em>a useful view.</em></h2></div><div><p>If your team has a reporting process that is slow, unclear, or difficult to trust, let’s talk about the practical next step.</p><a className="contact-email" href="mailto:davidedmondsc@gmail.com?subject=Dashboard%20project%20inquiry">davidedmondsc@gmail.com <span>↗</span></a></div></div></section>

  </main>
}
