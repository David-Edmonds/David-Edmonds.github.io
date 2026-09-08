const projects = [
  { id: 'excel', title: 'See what happened', tool: 'EXCEL DASHBOARD', text: 'Read sales performance, margin pressure and the gap to plan.', href: '/work/sales-profitability' },
  { id: 'sql', title: 'Trace the drivers', tool: 'SQL INVESTIGATION', text: 'Follow the same source records through queries and reconciled results.', href: '/work/sql-sales-investigation' },
  { id: 'planner', title: 'Test a possible next step', tool: 'PROFIT SCENARIO PLANNER', text: 'Explore how new price, volume and cost assumptions could change profit.', href: '/work/profit-scenario-planner' },
];
export function SalesJourney({ current }: { current?: 'excel' | 'sql' | 'planner' }) {
  return <section className="sales-journey shell" aria-label="Connected sales projects"><div className="sales-journey-heading"><span>CONNECTED SALES PROJECTS</span><h2>From results to a decision.</h2><p>Choose the question you need to answer next.</p></div><div className="sales-journey-grid">{projects.map(p=><a href={p.href} key={p.id} aria-current={current===p.id?'page':undefined}><span>{p.tool}{current===p.id?' · CURRENT PROJECT':''}</span><h3>{p.title}</h3><p>{p.text}</p><b>{current===p.id?'Project overview':'Explore the project'} →</b></a>)}</div><p className="sales-journey-note">Excel and SQL share a fictional annual dataset and report gross profit. The planner uses a separate monthly example and includes fixed costs to calculate operating profit. It does not import or forecast the dashboard results.</p></section>;
}
