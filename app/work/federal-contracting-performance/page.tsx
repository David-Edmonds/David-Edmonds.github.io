import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Federal Contracting Performance | David Edmonds",
  description:
    "An independent public-data Power BI case study covering 19.2 million federal award rows, $2.27 trillion in obligations, competition, small-business participation, agency goals, and validation.",
  alternates: {
    canonical: "https://david-edmonds.github.io/work/federal-contracting-performance/",
  },
};

const questions = [
  "How much was obligated in each fiscal year, and where did the total change?",
  "What share of obligations was competed versus awarded through sole-source paths?",
  "How much obligated value went to small businesses?",
  "Which agencies were above, near, or below the goal associated with their agency, fiscal year, and category?",
];

const findings = [
  "FY2025 was the largest of the three modeled years at $778.4B, compared with $746.4B in FY2023 and $740.9B in FY2024.",
  "68.2% of obligations were competed; 31.8% were associated with sole-source awards.",
  "Small businesses represented 22.9% of modeled obligated dollars. That share is a portfolio KPI, not by itself proof that every agency met its goal.",
  "Agency attainment required goal data to be matched by agency, fiscal year, and category rather than applying one constant target across the report.",
];

const checks = [
  "Reconciled the total obligated amount and each fiscal-year total against the prior validated run.",
  "Confirmed competed and sole-source shares sum to the complete modeled obligation base.",
  "Kept the goal table separate and retrieved the correct target only for the matching agency, fiscal year, and category.",
  "Removed an unnecessary transaction key and used compressed storage to reduce the large fact table while preserving the validated totals.",
];

export default function FederalContractingPerformancePage() {
  return (
    <main id="top" className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.shell}>
          <p className={styles.eyebrow}>Power BI portfolio build · independent public data</p>
          <h1 className={styles.title}>Federal Contracting Performance</h1>
          <p className={styles.lead}>
            A decision-focused model built to compare obligated dollars, competition,
            small-business participation, and agency goal attainment across FY2023–FY2025.
          </p>
          <ul className={styles.tags} aria-label="Project capabilities">
            <li>Power BI</li>
            <li>DAX</li>
            <li>Data modeling</li>
            <li>19.2M award rows</li>
            <li>Validation and reconciliation</li>
          </ul>
        </div>
      </header>

      <section className={styles.shell} aria-label="Project summary metrics">
        <div className={styles.metrics}>
          <article className={styles.metric}>
            <strong>$2.27T</strong>
            <span>Total modeled obligations</span>
          </article>
          <article className={styles.metric}>
            <strong>19.2M</strong>
            <span>Rows in the award fact table</span>
          </article>
          <article className={styles.metric}>
            <strong>68.2%</strong>
            <span>Competed share of obligations</span>
          </article>
          <article className={styles.metric}>
            <strong>22.9%</strong>
            <span>Small-business share of obligations</span>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.shell} ${styles.sectionGrid}`}>
          <div>
            <p className={styles.sectionLabel}>01 · The question</p>
            <h2>Turn a very large award dataset into an answer leaders can use.</h2>
          </div>
          <div className={styles.copy}>
            <p>
              Federal-award records are detailed enough to support many valid analyses, but
              that detail can make a report slow, inconsistent, or hard to interpret. The
              project therefore started with a small set of decision questions and built the
              model around them.
            </p>
            <ul className={styles.questionList}>
              {questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.shell} ${styles.sectionGrid}`}>
          <div>
            <p className={styles.sectionLabel}>02 · The model</p>
            <h2>Keep the detail needed for analysis without letting the fact table control the report.</h2>
          </div>
          <div className={styles.copy}>
            <p>
              The central award fact table contains approximately 19.2 million rows. A rewrite
              reduced it to roughly 297 MB by removing an unnecessary transaction key and using
              compressed storage, while validation confirmed that the obligation totals did not
              change.
            </p>
            <div className={styles.modelGrid}>
              <article className={styles.modelCard}>
                <h3>Fact_Awards</h3>
                <p>
                  The large obligation-level fact table used for fiscal-year, competition,
                  agency, and small-business analysis.
                </p>
              </article>
              <article className={styles.modelCard}>
                <h3>Dim_Goal</h3>
                <p>
                  A 360-row goal table covering 120 agency-year combinations. It remains
                  disconnected so the correct target can be retrieved by agency, fiscal year,
                  and category rather than creating an ambiguous relationship.
                </p>
              </article>
              <article className={styles.modelCard}>
                <h3>Measures</h3>
                <p>
                  DAX measures calculate obligations, competed and sole-source shares,
                  small-business participation, and the goal applicable to the selected agency
                  context.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.shell} ${styles.sectionGrid}`}>
          <div>
            <p className={styles.sectionLabel}>03 · The report</p>
            <h2>Make the main performance signals visible before asking the user to explore.</h2>
          </div>
          <div className={styles.copy}>
            <p>
              The report leads with the complete obligation base and the core participation and
              competition measures. Agency views then add the correct goal context instead of
              repeating a single 23% line for every agency and year.
            </p>
            <figure className={styles.figure}>
              <img
                src="/federal-contracting-dashboard.jpg"
                width="1600"
                height="900"
                loading="lazy"
                alt="Power BI dashboard showing federal contracting obligations, competition, small-business participation, and agency performance"
              />
              <figcaption>
                Sanitized portfolio screenshot. The PBIX file and underlying row-level source
                data are intentionally not published.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.shell} ${styles.sectionGrid}`}>
          <div>
            <p className={styles.sectionLabel}>04 · Validated results</p>
            <h2>Separate a useful insight from a number that merely looks precise.</h2>
          </div>
          <div className={styles.copy}>
            <table className={styles.fyTable}>
              <caption className="sr-only">Federal obligations by fiscal year</caption>
              <thead>
                <tr>
                  <th scope="col">Fiscal year</th>
                  <th scope="col">Obligations</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>FY2023</td>
                  <td>$746.4B</td>
                </tr>
                <tr>
                  <td>FY2024</td>
                  <td>$740.9B</td>
                </tr>
                <tr>
                  <td>FY2025</td>
                  <td>$778.4B</td>
                </tr>
              </tbody>
            </table>
            <ul className={styles.findingList}>
              {findings.map((finding) => (
                <li key={finding}>{finding}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.shell} ${styles.sectionGrid}`}>
          <div>
            <p className={styles.sectionLabel}>05 · Quality control</p>
            <h2>Build reconciliation into the analysis, not into the final explanation after something breaks.</h2>
          </div>
          <div className={styles.copy}>
            <ul className={styles.checkList}>
              {checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
            <p className={styles.note}>
              Obligations are not the same as outlays, award records can be revised, and a
              portfolio-level small-business share should not be treated as universal agency
              attainment. Those limitations are part of the interpretation, not footnotes to
              ignore.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.shell} ${styles.sectionGrid}`}>
          <div>
            <p className={styles.sectionLabel}>06 · Why it matters</p>
            <h2>The deliverable is not only a dashboard. It is a defensible path from source data to decision.</h2>
          </div>
          <div className={styles.copy}>
            <p>
              This project demonstrates the work required before a polished visual is credible:
              modeling a large fact table, defining KPIs, resolving goal context, checking totals,
              labeling limitations, and presenting the result so a nontechnical reviewer can act
              on it.
            </p>
            <p>
              It is an independent portfolio build using public data. It is not presented as
              Confia Solutions, LLC client work, and no confidential employer or client data is
              included.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.shell}>
          <h2>Need a reporting model that people can trust before they use it?</h2>
          <p>
            I help teams turn complex operational data into clear measures, reliable reporting,
            and decision-ready explanations.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/contact/">
              Discuss a role or project
            </Link>
            <Link className={styles.secondary} href="/work/">
              Back to all work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
