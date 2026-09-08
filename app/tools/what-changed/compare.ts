export type Report = { name: string; headers: string[]; rows: string[][] };
export function parseCSV(text: string, name = 'Report'): Report {
  text = text.replace(/^\uFEFF/, '');
  const rows: string[][] = []; let row: string[] = [], cell = '', quoted = false, closed = false;
  const pushCell = () => { row.push(cell); cell = ''; closed = false; };
  const pushRow = () => { pushCell(); if (row.length > 1 || row[0] !== '') rows.push(row); row = []; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else { quoted = false; closed = true; } } else cell += c; }
    else if (c === ',') pushCell();
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; pushRow(); }
    else if (c === '"' && cell === '' && !closed) quoted = true;
    else { if (closed || c === '"') throw new Error('Invalid CSV quoting. Export the report as a comma-separated CSV.'); cell += c; }
  }
  if (quoted) throw new Error('An opening quote has no closing quote.');
  if (cell !== '' || row.length || closed) pushRow();
  const headers = rows.shift()?.map(h => h.trim()) ?? [];
  if (!headers.length || headers.some(h => !h) || new Set(headers).size !== headers.length) throw new Error('Use non-empty, unique column headings.');
  if (!rows.length) throw new Error('This report has headings but no records.');
  if (rows.length > 50000) throw new Error('Use a report with 50,000 records or fewer.');
  const bad = rows.findIndex(r => r.length !== headers.length);
  if (bad >= 0) throw new Error(`Record ${bad + 1} has ${rows[bad].length} fields; expected ${headers.length}.`);
  return { name, headers, rows };
}
export function numeric(value: string): number | null {
  const v = value.trim();
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(v)) return null;
  const n = Number(v); return Number.isFinite(n) ? n : null;
}
export type Entry = { id: string; status: string; before: number; after: number; delta: number; oldRows: number[]; newRows: number[]; fields: string[] };
export function compare(a: Report, b: Report, key: string, metric: string) {
  const ai = a.headers.indexOf(key), bi = b.headers.indexOf(key);
  if (ai < 0 || bi < 0) throw new Error('Choose a record ID column shared by both reports.');
  const am = a.headers.indexOf(metric), bm = b.headers.indexOf(metric);
  if (am < 0 || bm < 0) throw new Error('Choose a numeric measure shared by both reports.');
  const group = (r: Report, ki: number, mi: number) => {
    const map = new Map<string, { rows: number[]; sum: number }>();
    r.rows.forEach((row, i) => {
      const id = row[ki].trim();
      if (!id) throw new Error(`${r.name}: record ${i + 1} has a blank ID. Fill it in before comparing.`);
      const val = numeric(row[mi]);
      if (val === null) throw new Error(`${r.name}: record ${i + 1} has a blank or non-numeric ${metric}. Use plain numbers with a decimal point, without currency symbols or thousands separators.`);
      const item = map.get(id) ?? { rows: [], sum: 0 }; item.rows.push(i + 1); item.sum += val; map.set(id, item);
    }); return map;
  };
  const ag = group(a, ai, am), bg = group(b, bi, bm);
  const shared = a.headers.filter(h => b.headers.includes(h));
  const entries: Entry[] = [...new Set([...ag.keys(), ...bg.keys()])].map(id => {
    const old = ag.get(id), next = bg.get(id);
    const duplicate = (old?.rows.length ?? 0) > 1 || (next?.rows.length ?? 0) > 1;
    const fields = old && next && !duplicate ? shared.filter(h => a.rows[old.rows[0] - 1][a.headers.indexOf(h)] !== b.rows[next.rows[0] - 1][b.headers.indexOf(h)]) : [];
    return { id, status: duplicate ? 'Duplicate ID' : !old ? 'Added' : !next ? 'Missing' : fields.length ? 'Changed' : 'Unchanged', before: old?.sum ?? 0, after: next?.sum ?? 0, delta: (next?.sum ?? 0) - (old?.sum ?? 0), oldRows: old?.rows ?? [], newRows: next?.rows ?? [], fields };
  });
  const before = entries.reduce((s, e) => s + e.before, 0), after = entries.reduce((s, e) => s + e.after, 0);
  if (![before, after, after - before, ...entries.map(e => e.delta)].every(Number.isFinite)) throw new Error('The measure totals are too large to compare safely.');
  const duplicateGroups = entries.filter(e => e.status === 'Duplicate ID').length;
  const exactDuplicates = (r: Report) => r.rows.length - new Set(r.rows.map(row => JSON.stringify(row))).size;
  return { entries, before, after, delta: after - before, duplicateGroups, exactOld: exactDuplicates(a), exactNew: exactDuplicates(b), added: entries.filter(e => !e.oldRows.length).length, missing: entries.filter(e => !e.newRows.length).length, changed: entries.filter(e => e.status === 'Changed').length, removedColumns: a.headers.filter(h => !b.headers.includes(h)), addedColumns: b.headers.filter(h => !a.headers.includes(h)) };
}
export const sampleBefore = `Account ID,Account,Region,Revenue
ACC-001,Atlas Studio,North,28000
ACC-002,Juniper Labs,West,22000
ACC-003,Orbit Supply,East,18000
ACC-004,Northstar Co,North,15000
ACC-005,Fieldwork,South,12000
ACC-006,Forma Design,West,9000
ACC-007,Cedar Group,East,7000
ACC-008,Common Ground,South,5000`;
export const sampleAfter = `Account ID,Account,Region,Revenue
ACC-001,Atlas Studio,North,36000
ACC-002,Juniper Labs,West,26000
ACC-003,Orbit Supply,East,15000
ACC-004,Northstar Co,North,15000
ACC-005,Fieldwork,South,14000
ACC-006,Forma Design,West,9000
ACC-007,Cedar Group,East,7000
ACC-007,Cedar Group,East,7000
ACC-009,Meridian Works,North,16000`;
export function csvCell(value: unknown) { let s = String(value); if (/^[\s]*[=+@-]/.test(s)) s = "'" + s; return '"' + s.replaceAll('"', '""') + '"'; }
