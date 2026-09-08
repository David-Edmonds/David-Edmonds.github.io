export type Finding = { metric: string; title: string; evidence: string; implication: string; href: string; source: string };

export function KeyFindings({ scope, findings }: { scope: string; findings: Finding[] }) {
  return <section className="key-findings shell" id="key-findings" aria-labelledby="findings-title">
    <div className="dashboard-heading"><div><span>KEY FINDINGS</span><h2 id="findings-title">What the evidence tells us.</h2></div><p>{scope}</p></div>
    <div className="finding-cards">{findings.map(f => <article key={f.title}>
      <strong className="finding-metric">{f.metric}</strong><h3>{f.title}</h3><p>{f.evidence}</p>
      <div className="finding-implication"><span>Decision to inform</span><p>{f.implication}</p></div>
      <a href={f.href}>{f.source} <span aria-hidden="true">↗</span></a>
    </article>)}</div>
  </section>;
}
