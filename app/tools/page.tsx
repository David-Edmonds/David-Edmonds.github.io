"use client";

import { type ChangeEvent, useMemo, useState } from "react";

type ColumnType = "Number" | "Date" | "Boolean" | "Text" | "Empty" | "Mixed";

type ColumnProfile = {
  name: string;
  type: ColumnType;
  missing: number;
  missingRate: number;
  unique: number;
  flags: string[];
};

type CsvAnalysis = {
  fileName: string;
  rows: number;
  analyzedRows: number;
  columns: number;
  missing: number;
  duplicates: number;
  raggedRows: number;
  emptyColumns: number;
  constantColumns: number;
  qualityScore: number;
  profiles: ColumnProfile[];
  warnings: string[];
};

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_ANALYZED_ROWS = 50_000;

function parseCsv(text: string): string[][] {
  const input = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (char === '"') {
      if (inQuotes && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (inQuotes) throw new Error("The CSV contains an unclosed quoted value.");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  while (rows.length > 1 && rows.at(-1)?.every((value) => value.trim() === "")) {
    rows.pop();
  }

  return rows;
}

function makeUniqueHeaders(rawHeaders: string[], columnCount: number): string[] {
  const seen = new Map<string, number>();

  return Array.from({ length: columnCount }, (_, index) => {
    const base = rawHeaders[index]?.trim() || `Column ${index + 1}`;
    const count = (seen.get(base.toLowerCase()) ?? 0) + 1;
    seen.set(base.toLowerCase(), count);
    return count === 1 ? base : `${base} (${count})`;
  });
}

function looksLikeNumber(value: string): boolean {
  const normalized = value.replace(/[$,%]/g, "").trim();
  return /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(normalized) && Number.isFinite(Number(normalized));
}

function looksLikeDate(value: string): boolean {
  const normalized = value.trim();
  const recognizableDate =
    /^\d{4}-\d{1,2}-\d{1,2}(?:[ T].*)?$/.test(normalized) ||
    /^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}$/.test(normalized) ||
    /^[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}$/.test(normalized);
  return recognizableDate && !Number.isNaN(Date.parse(normalized));
}

function inferType(values: string[]): ColumnType {
  const populated = values.map((value) => value.trim()).filter(Boolean);
  if (populated.length === 0) return "Empty";

  const counts = { number: 0, date: 0, boolean: 0, text: 0 };
  for (const value of populated) {
    if (looksLikeNumber(value)) counts.number += 1;
    else if (/^(?:true|false|yes|no|y|n)$/i.test(value)) counts.boolean += 1;
    else if (looksLikeDate(value)) counts.date += 1;
    else counts.text += 1;
  }

  const ranked = Object.entries(counts).sort((left, right) => right[1] - left[1]);
  const [topType, topCount] = ranked[0];
  if (topCount / populated.length < 0.9) return "Mixed";
  if (topType === "number") return "Number";
  if (topType === "date") return "Date";
  if (topType === "boolean") return "Boolean";
  return "Text";
}

function analyzeCsv(fileName: string, rows: string[][]): CsvAnalysis {
  if (rows.length < 2) throw new Error("The CSV needs a header row and at least one data row.");

  const rawHeaders = rows[0];
  const dataRows = rows.slice(1);
  const columnCount = Math.max(rawHeaders.length, ...dataRows.map((row) => row.length));
  if (columnCount === 0) throw new Error("No columns were found in the CSV.");

  const headers = makeUniqueHeaders(rawHeaders, columnCount);
  const analyzedSource = dataRows.slice(0, MAX_ANALYZED_ROWS);
  const matrix = analyzedSource.map((row) =>
    Array.from({ length: columnCount }, (_, index) => row[index] ?? ""),
  );

  const raggedRows = analyzedSource.filter((row) => row.length !== rawHeaders.length).length;
  const normalizedRows = matrix.map((row) => row.map((value) => value.trim()).join("\u001f"));
  const duplicates = normalizedRows.length - new Set(normalizedRows).size;

  const profiles = headers.map((name, columnIndex): ColumnProfile => {
    const values = matrix.map((row) => row[columnIndex]);
    const populated = values.map((value) => value.trim()).filter(Boolean);
    const missing = values.length - populated.length;
    const unique = new Set(populated).size;
    const type = inferType(values);
    const flags: string[] = [];

    if (values.length > 0 && missing / values.length >= 0.2) flags.push("High missing rate");
    if (type === "Mixed") flags.push("Mixed value types");
    if (type === "Empty") flags.push("Empty column");
    if (populated.length > 1 && unique === 1) flags.push("Constant value");

    return {
      name,
      type,
      missing,
      missingRate: values.length === 0 ? 0 : missing / values.length,
      unique,
      flags,
    };
  });

  const missing = profiles.reduce((total, profile) => total + profile.missing, 0);
  const emptyColumns = profiles.filter((profile) => profile.type === "Empty").length;
  const constantColumns = profiles.filter((profile) => profile.flags.includes("Constant value")).length;
  const mixedColumns = profiles.filter((profile) => profile.type === "Mixed").length;
  const cellCount = Math.max(1, matrix.length * columnCount);
  const rowCount = Math.max(1, matrix.length);

  const penalty =
    (missing / cellCount) * 40 +
    (duplicates / rowCount) * 25 +
    (raggedRows / rowCount) * 20 +
    emptyColumns * 10 +
    constantColumns * 3 +
    mixedColumns * 5;

  const warnings: string[] = [];
  if (dataRows.length > MAX_ANALYZED_ROWS) warnings.push(`Only the first ${MAX_ANALYZED_ROWS.toLocaleString()} rows were profiled.`);
  if (raggedRows > 0) warnings.push(`${raggedRows.toLocaleString()} row(s) have a different number of fields than the header.`);
  if (duplicates > 0) warnings.push(`${duplicates.toLocaleString()} duplicate row(s) were found in the analyzed sample.`);
  if (emptyColumns > 0) warnings.push(`${emptyColumns.toLocaleString()} column(s) contain no populated values.`);
  if (mixedColumns > 0) warnings.push(`${mixedColumns.toLocaleString()} column(s) contain mixed value types.`);
  if (warnings.length === 0) warnings.push("No major structural issues were found in this first-pass profile.");

  return {
    fileName,
    rows: dataRows.length,
    analyzedRows: matrix.length,
    columns: columnCount,
    missing,
    duplicates,
    raggedRows,
    emptyColumns,
    constantColumns,
    qualityScore: Math.max(0, Math.min(100, Math.round(100 - penalty))),
    profiles,
    warnings,
  };
}

export default function ToolsPage() {
  const [hours, setHours] = useState(10);
  const [people, setPeople] = useState(2);
  const [rate, setRate] = useState(45);
  const [automation, setAutomation] = useState(70);
  const [analysis, setAnalysis] = useState<CsvAnalysis | null>(null);
  const [csvError, setCsvError] = useState("");
  const [isReading, setIsReading] = useState(false);

  const savings = useMemo(() => {
    const recoveredHours = (hours * people * 52 * automation) / 100;
    return { hours: Math.round(recoveredHours), value: Math.round(recoveredHours * rate) };
  }, [hours, people, rate, automation]);

  async function inspectCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setAnalysis(null);
    setCsvError("");
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setCsvError("Choose a file with a .csv extension.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setCsvError("Use a CSV smaller than 8 MB for this browser-based first pass.");
      event.target.value = "";
      return;
    }

    setIsReading(true);
    try {
      const text = await file.text();
      setAnalysis(analyzeCsv(file.name, parseCsv(text)));
    } catch (error) {
      setCsvError(error instanceof Error ? error.message : "The CSV could not be analyzed.");
    } finally {
      setIsReading(false);
    }
  }

  function downloadReport() {
    if (!analysis) return;
    const report = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(report);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${analysis.fileName.replace(/\.csv$/i, "")}-quality-report.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main id="top" className="tools-page">
      <section className="page-intro shell">
        <span>ANALYTICS LAB</span>
        <h1>Test a process.<br/><em>Check the data.</em></h1>
        <p>Two practical, browser-based tools for estimating reporting effort and profiling a sanitized CSV before deeper analysis.</p>
      </section>

      <section className="lab section">
        <div className="shell tools-stack">
          <article className="lab-card calculator-card analytics-card">
            <div className="lab-head"><span>01</span><div><h2>Reporting time &amp; cost calculator</h2><p>Adjust the assumptions to estimate annual capacity that could be recovered.</p></div></div>
            <div className="calculator">
              <div className="inputs">
                <label htmlFor="weekly-hours">Weekly reporting hours <b>{hours}</b><input id="weekly-hours" type="range" min="1" max="40" value={hours} onChange={(event) => setHours(Number(event.target.value))}/></label>
                <label htmlFor="people-involved">People involved<input id="people-involved" type="number" min="1" max="100" value={people} onChange={(event) => setPeople(Math.max(1, Number(event.target.value) || 1))}/></label>
                <label htmlFor="hourly-cost">Hourly cost ($)<input id="hourly-cost" type="number" min="1" max="1000" value={rate} onChange={(event) => setRate(Math.max(1, Number(event.target.value) || 1))}/></label>
                <label htmlFor="automatable-work">Automatable work <b>{automation}%</b><input id="automatable-work" type="range" min="10" max="95" step="5" value={automation} onChange={(event) => setAutomation(Number(event.target.value))}/></label>
              </div>
              <div className="result" aria-live="polite">
                <span>POTENTIAL ANNUAL IMPACT</span>
                <strong>{savings.hours.toLocaleString()}</strong>
                <small>hours recovered</small>
                <hr/>
                <b>${savings.value.toLocaleString()}</b>
                <small>estimated capacity value</small>
              </div>
            </div>
            <p className="calculator-note">This is a directional estimate, not a guaranteed financial return. Validate the assumptions against the actual reporting process before using it in a business case.</p>
          </article>

          <article className="lab-card analytics-card csv-card">
            <div className="lab-head"><span>02</span><div><h2>CSV quality checker</h2><p>Profile structure, missing values, duplicates, and likely column types before building a dashboard.</p></div></div>

            <label className="upload csv-upload" htmlFor="csv-file">
              <input id="csv-file" type="file" accept=".csv,text/csv" onChange={inspectCsv}/>
              <i aria-hidden="true">↑</i>
              <b>{isReading ? "Analyzing the CSV…" : analysis?.fileName ?? "Choose a sanitized CSV"}</b>
              <small>Maximum 8 MB · up to 50,000 rows profiled · never uploaded</small>
            </label>

            <div className="safe-note">The file is read only in your browser. Use public, synthetic, or properly sanitized data; never use client-confidential, classified, medical, financial, or personally identifiable data.</div>

            {csvError ? <p className="csv-error" role="alert">{csvError}</p> : null}

            {analysis ? (
              <div className="csv-analysis" aria-live="polite">
                <div className="analysis-summary">
                  <div className="quality-score"><span>QUALITY SCORE</span><strong>{analysis.qualityScore}</strong><small>out of 100</small></div>
                  <div className="summary-stats">
                    <div><strong>{analysis.rows.toLocaleString()}</strong><span>data rows</span></div>
                    <div><strong>{analysis.columns.toLocaleString()}</strong><span>columns</span></div>
                    <div><strong>{analysis.missing.toLocaleString()}</strong><span>empty cells</span></div>
                    <div><strong>{analysis.duplicates.toLocaleString()}</strong><span>duplicate rows</span></div>
                  </div>
                </div>

                <div className="analysis-warnings">
                  <h3>First-pass findings</h3>
                  <ul>{analysis.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
                </div>

                <div className="profile-table-wrap">
                  <table className="profile-table">
                    <caption>Column-level CSV profile</caption>
                    <thead><tr><th scope="col">Column</th><th scope="col">Likely type</th><th scope="col">Missing</th><th scope="col">Unique</th><th scope="col">Flags</th></tr></thead>
                    <tbody>
                      {analysis.profiles.map((profile) => (
                        <tr key={profile.name}>
                          <th scope="row">{profile.name}</th>
                          <td><span className="type-pill">{profile.type}</span></td>
                          <td>{profile.missing.toLocaleString()} <small>({Math.round(profile.missingRate * 100)}%)</small></td>
                          <td>{profile.unique.toLocaleString()}</td>
                          <td>{profile.flags.length > 0 ? profile.flags.join(" · ") : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="csv-actions">
                  <button className="button dark" type="button" onClick={downloadReport}>Download JSON report <span>↓</span></button>
                  <a className="secondary-action" href="/contact">Need a deeper analysis? Start a conversation ↗</a>
                </div>
              </div>
            ) : null}
          </article>
        </div>
      </section>

      <section className="compact-cta shell"><div><span>NEED MORE THAN A FIRST PASS?</span><h2>Turn the findings into a reliable reporting plan.</h2></div><a className="button dark" href="/contact">Discuss the process <span>↗</span></a></section>
    </main>
  );
}
