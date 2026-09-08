import InquiryDraft from "./InquiryDraft";
import type { Metadata } from "next";
const title = "Contact David Edmonds | Analytics Consulting";
const description = "Discuss a dashboard, reporting automation, KPI, data quality, or operational analytics project with David Edmonds.";
export const metadata: Metadata = { title, description, openGraph:{title,description,images:[]}, twitter:{card:"summary",title,description,images:[]} };

export default function ContactPage() {
  return <main id="top" className="contact-page"><section className="contact contact-hero"><div className="shell contact-grid"><div><span>LET’S WORK TOGETHER</span><h1>Have a reporting challenge worth <em>solving?</em></h1></div><div><p>Tell me what is slow, unclear, or unreliable. I’ll help you identify the most practical next step.</p><a className="contact-email" href="mailto:davidedmondsc@gmail.com?subject=Analytics%20project%20inquiry">davidedmondsc@gmail.com <span>↗</span></a><div className="contact-links"><a href="tel:+18438192435">+1 (843) 819-2435</a><a href="https://www.linkedin.com/in/david-c-edmonds/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/David-Edmonds" target="_blank" rel="noreferrer">GitHub ↗</a></div></div></div></section><InquiryDraft /></main>;
}
