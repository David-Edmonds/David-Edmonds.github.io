import { type assessQuality, type QualityProfile } from './compare';

type Props = {
  quality: ReturnType<typeof assessQuality>;
  comparisonError: string;
  names: [string, string];
  expanded: boolean;
  onReview: () => void;
  onInspect: (id: string) => void;
  canInspect: boolean;
  onDownload: () => void;
};
const records = (values: number[]) => values.slice(0, 10).join(', ') + (values.length > 10 ? ` … (${values.length} total)` : '');

function ReportIssues({ profile, label, name, onInspect, canInspect }: {
  profile: QualityProfile; label: string; name: string; onInspect: Props['onInspect']; canInspect: boolean;
}) {
  return <article className="quality-report">
    <h4>{label} report</h4><p className="quality-filename">{name} · {profile.records.toLocaleString('en-US')} records</p>
    <dl className="quality-counts">
      <div><dt>Blank IDs</dt><dd>{profile.keyPresent ? profile.blankIDs.length : 'Not checked'}</dd></div>
      <div><dt>Invalid or blank measures</dt><dd>{profile.metricPresent ? profile.invalidMeasures.length : 'Not checked'}</dd></div>
      <div><dt>Duplicate ID groups</dt><dd>{profile.keyPresent ? profile.duplicateIDs.length : 'Not checked'}</dd></div>
      <div><dt>Exact duplicate extra rows</dt><dd>{profile.exactDuplicates}</dd></div>
      <div><dt>Missing cells across all columns</dt><dd>{profile.missingCells}</dd></div>
    </dl>
    {!profile.keyPresent && <p>Select an ID column present in this report.</p>}
    {!profile.metricPresent && <p>Select a measure present in this report.</p>}
    {profile.blankIDs.length > 0 && <p><b>Fill blank IDs:</b> records {records(profile.blankIDs)}.</p>}
    {profile.invalidMeasures.length > 0 && <p><b>Use plain numbers:</b> records {records(profile.invalidMeasures)}. Blank values are not treated as zero.</p>}
    {profile.missingByColumn.length > 0 && <p><b>Missing cells:</b> {profile.missingByColumn.map(item => `${item.column}: ${item.count}`).join('; ')}. Confirm whether these fields are required for your report.</p>}
    {profile.duplicateIDs.length > 0 && <div className="quality-id-list"><p><b>Review repeated IDs:</b></p><ul>{profile.duplicateIDs.slice(0, 10).map(item => <li key={item.id}>{canInspect ? <button className="text-button" onClick={() => onInspect(item.id)}>{item.id}</button> : <b>{item.id}</b>} — records {records(item.records)}</li>)}</ul>{profile.duplicateIDs.length > 10 && <p>First 10 groups shown. Resolve blocking inputs, then export evidence for all ID groups.</p>}</div>}
  </article>;
}

export default function QualitySummary({ quality, comparisonError, names, expanded, onReview, onInspect, canInspect, onDownload }: Props) {
  const blocked = quality.status === 'blocked' || !!comparisonError;
  const status = blocked ? 'blocked' : quality.status;
  const title = blocked ? 'Resolve inputs before comparing' : status === 'review' ? 'Review inputs before sharing' : 'No issues found in these checks';
  const missingColumns = [quality.before, quality.after].some(p => !p.keyPresent || !p.metricPresent);
  const blankIDs = quality.before.blankIDs.length + quality.after.blankIDs.length;
  const invalidMeasures = quality.before.invalidMeasures.length + quality.after.invalidMeasures.length;
  const nextStep = missingColumns ? 'Choose an ID and a numeric measure shared by both reports.' : blankIDs || invalidMeasures ? `Correct ${blankIDs} blank ID${blankIDs === 1 ? '' : 's'} and ${invalidMeasures} invalid or blank measure${invalidMeasures === 1 ? '' : 's'} in your source files, then choose the corrected CSVs above.` : comparisonError ? comparisonError : status === 'review' ? 'Review repeated records, missing fields and column changes against the source before sharing the totals.' : 'Open the overview to trace the change, then confirm the business explanation with the report owner.';
  return <section className={`panel input-quality ${status}`} aria-labelledby="input-quality-title">
    <div className="quality-heading"><div><span className="eyebrow">DATA QUALITY SUMMARY</span><h3 id="input-quality-title">{title}</h3></div><span className="quality-state">{blocked ? 'Comparison blocked' : status === 'review' ? 'Review needed' : 'Checks passed'}</span></div>
    <p>{blocked ? 'No comparison totals are shown until the inputs can be compared. The checks below remain available to help you resolve the problem.' : status === 'review' ? 'The totals can be calculated, but repeated IDs, missing values or column changes need a closer look.' : 'The selected IDs and measures passed these checks. This does not verify business accuracy or completeness.'}</p>
    <div className="quality-next-step"><b>{blocked ? 'Fix first' : 'Next step'}</b><p>{nextStep}</p></div>
    <div className="quality-overview">
      <div><strong>{quality.before.keyPresent && quality.after.keyPresent ? quality.before.blankIDs.length + quality.after.blankIDs.length : 'Not checked'}</strong><span>Blank IDs</span></div>
      <div><strong>{quality.before.metricPresent && quality.after.metricPresent ? quality.before.invalidMeasures.length + quality.after.invalidMeasures.length : 'Not checked'}</strong><span>Invalid or blank measures</span></div>
      <div><strong>{quality.before.keyPresent && quality.after.keyPresent ? `${quality.before.duplicateIDs.length} / ${quality.after.duplicateIDs.length}` : 'Not checked'}</strong><span>Duplicate ID groups · before / after</span></div>
      <div><strong>{quality.before.missingCells + quality.after.missingCells}</strong><span>Missing cells · both reports</span></div>
    </div>
    {(!quality.before.keyPresent || !quality.after.keyPresent || !quality.before.metricPresent || !quality.after.metricPresent) && <p>Selected columns are missing: ID or measure checks only cover reports where those columns exist.</p>}
    {expanded ? <>
      <div className="quality-report-grid"><ReportIssues profile={quality.before} label="Before" name={names[0]} onInspect={onInspect} canInspect={canInspect}/><ReportIssues profile={quality.after} label="After" name={names[1]} onInspect={onInspect} canInspect={canInspect}/></div>
      <h4>Column changes</h4><p>Added: {quality.addedColumns.join(', ') || 'None'}<br/>Removed: {quality.removedColumns.join(', ') || 'None'}</p>
      <p className="quality-footnote">Counts can overlap: a blank measure also counts as a missing cell. Duplicate IDs are trimmed and case-sensitive; exact duplicate extra rows match every cell. Record numbers start after the header and exclude empty lines. All rows, including duplicates, stay in totals; nothing is deleted or corrected automatically.</p>
    </> : <button className="text-button" onClick={onReview}>Review quality details →</button>}
    <div className="quality-download"><button className="button" onClick={onDownload}>Download quality checklist</button><p>CSV with all flagged record references and source values, including issues beyond the on-screen preview. Keep it as private as your source reports. Counts may overlap; this checklist does not test aggregate overflow.</p></div>
  </section>;
}
