import { compare, parseCSV, sampleBefore, sampleAfter } from './compare';

export const workedBefore = parseCSV(sampleBefore, 'july-revenue.csv');
export const workedAfter = parseCSV(sampleAfter, 'august-revenue.csv');
export const workedResult = compare(workedBefore, workedAfter, 'Account ID', 'Revenue');
const money = (n: number) => `${n < 0 ? '−' : ''}$${Math.abs(n).toLocaleString('en-US')}`;
const signed = (n: number) => `${n > 0 ? '+' : ''}${money(n)}`;
const buckets = [
  {label:'Changed unique IDs',total:workedResult.entries.filter(e=>e.status==='Changed').reduce((sum,e)=>sum+e.delta,0)},
  {label:'Added IDs',total:workedResult.entries.filter(e=>e.status==='Added').reduce((sum,e)=>sum+e.delta,0)},
  {label:'Missing IDs',total:workedResult.entries.filter(e=>e.status==='Missing').reduce((sum,e)=>sum+e.delta,0)},
  {label:'Duplicate ID groups',total:workedResult.entries.filter(e=>e.status==='Duplicate ID').reduce((sum,e)=>sum+e.delta,0)},
];

type Props = {onLoad:()=>void; onInspect:(id:string)=>void; onDownload:(side:'before'|'after')=>void};
export default function WorkedExample({onLoad,onInspect,onDownload}:Props) {
  const duplicate=workedResult.entries.find(e=>e.id==='ACC-007')!;
  const missing=workedResult.entries.find(e=>e.id==='ACC-008')!;
  const added=workedResult.entries.find(e=>e.id==='ACC-009')!;
  return <section className="panel worked-example" id="worked-example" aria-labelledby="worked-title">
    <div className="example-heading"><span className="eyebrow">A WORKED EXAMPLE · FICTIONAL DATA</span><h3 id="worked-title">A higher total. One record worth checking.</h3><p>A July-to-August revenue comparison: {workedBefore.rows.length} before records and {workedAfter.rows.length} after records, matched by Account ID. This example always uses the built-in sample, independently of any files selected above.</p></div>
    <div className="example-actions"><button className="button" onClick={onLoad}>Load this sample in the analyzer →</button><button className="text-button" onClick={()=>onDownload('before')}>Download July CSV ↓</button><button className="text-button" onClick={()=>onDownload('after')}>Download August CSV ↓</button></div>
    <div className="example-total"><div><span>JULY</span><strong>{money(workedResult.before)}</strong></div><span aria-hidden="true">→</span><div><span>AUGUST</span><strong>{money(workedResult.after)}</strong></div><div><span>REPORTED CHANGE</span><strong>{signed(workedResult.delta)}</strong></div></div>
    <h4>Every contribution has a place.</h4><p>The four groups below reconcile to the reported change. Unchanged IDs contribute zero. Duplicate rows remain in the totals.</p>
    <div className="example-bridge">{buckets.map(b=><div key={b.label}><span>{b.label}</span><strong>{signed(b.total)}</strong></div>)}</div>
    <div className="example-lessons">
      <article><span className="eyebrow">THE ADDITION</span><h4>{added.id} adds {money(added.delta)}.</h4><p>Meridian Works appears only in August. An added ID describes the file difference; it does not prove a newly acquired customer.</p><button className="text-button" onClick={()=>onInspect(added.id)}>Load sample and inspect addition →</button></article>
      <article><span className="eyebrow">THE ABSENCE</span><h4>{missing.id} contributes {signed(missing.delta)}.</h4><p>Common Ground is absent from August. Check source scope and timing before describing the missing record as customer churn.</p><button className="text-button" onClick={()=>onInspect(missing.id)}>Load sample and inspect absence →</button></article>
      <article className="example-warning"><span className="eyebrow">THE DUPLICATE</span><h4>{duplicate.id} needs a second look.</h4><p>Cedar Group has one {money(duplicate.before)} row in July and two identical {money(duplicate.after/2)} rows in August. The summed contribution is {signed(duplicate.delta)}. The tool flags it and keeps both rows.</p><button className="text-button" onClick={()=>onInspect(duplicate.id)}>Load sample and inspect duplicate →</button></article>
    </div>
    <details className="example-evidence"><summary>See all {workedResult.entries.length} ID contributions and source record numbers</summary><div className="table-scroll"><table><caption>Fictional sample evidence · record numbers exclude the header</caption><thead><tr><th>ID</th><th>Status</th><th>July</th><th>August</th><th>Change</th><th>July rows</th><th>August rows</th></tr></thead><tbody>{workedResult.entries.map(e=><tr key={e.id}><th scope="row">{e.id}</th><td>{e.status}</td><td>{money(e.before)}</td><td>{money(e.after)}</td><td>{signed(e.delta)}</td><td>{e.oldRows.join(', ')||'Absent'}</td><td>{e.newRows.join(', ')||'Absent'}</td></tr>)}</tbody></table></div></details>
    <div className="example-readout"><span className="eyebrow">A SUMMARY YOU CAN DEFEND</span><p>Reported revenue increased {money(workedResult.delta)}, from {money(workedResult.before)} to {money(workedResult.after)}. One added ID, one missing ID and changes to existing IDs explain the movement. Of the increase, {money(duplicate.delta)} comes from a duplicate ID group that needs source review; the other contributions net to {money(workedResult.delta-duplicate.delta)}. Verify the repeated row before interpreting the increase as business growth.</p><small>Loading or inspecting this sample replaces the current comparison with fictional reports. Nothing is uploaded, deleted from your files or automatically corrected.</small></div>
  </section>;
}
