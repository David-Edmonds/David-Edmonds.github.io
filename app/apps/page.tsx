import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & Apps | David Edmonds",
  description: "David Edmonds's app websites, with detailed explanations of AI integration, validation, privacy and development decisions.",
  alternates: { canonical: "/apps" },
};

const apps = [
  {
    id: "savorshelf", name: "SavorShelf", category: "RECIPES & PERSONAL KNOWLEDGE", status: "In development",
    question: "Keep the recipe. Remember what made it better.",
    description: "A recipe app built around the way a collection changes over time: saved dishes, personal notes, ratings and named versions. The focus is making a recipe easy to find, adapt and cook again.",
    contribution: "I’m developing the Android and web experience, recipe import and version handling, and a companion workflow for creating and revising recipes with AI.",
    decision: "A generated revision is a draft to review. It should not silently replace a saved recipe or erase the cook’s notes.",
    scope: "Public cookbook and web recipe creator, with the Android app and recipe collection in active development. The creator requires provider sign-in; this is not an app-store release.",
    steps: ["Save a recipe", "Review a variation", "Keep a named version"],
    tech: "Android · JavaScript · AI-assisted recipe drafts", topic: "SavorShelf",
  },
  {
    id: "fourth-and-forever", name: "Fourth & Forever", category: "DECISION SUPPORT", status: "Private web app",
    question: "Advice is only useful when it understands the league.",
    description: "A fantasy football adviser that brings roster context, scoring and available projections into the same decision. The app compares lineup and roster options and explains the assumptions behind each result.",
    contribution: "I’m building the web and Android app, read-only roster integration, lineup calculations and local-model question interpretation.",
    decision: "Roster freshness and projection freshness are different. Missing information stays visible, and the app does not make league transactions.",
    scope: "Hosted private web app with owner sign-in. Connected rosters and reviewed imports are implemented; data and local-AI freshness still depend on the desktop companion. The Android update remains in development.",
    steps: ["Check the sources", "Compare eligible options", "Explain the trade-off"],
    tech: "JavaScript · Android · Local language model", topic: "Fourth & Forever",
  },
  {
    id: "quick-apply", name: "Quick Apply", category: "WORKFLOW AUTOMATION", status: "Private working app",
    question: "Spend less time organizing applications—and more time choosing the right roles.",
    description: "A phone-friendly job-search workspace for saving roles, reviewing restrictions, preparing answers and tracking responses. It connects each application to the resume and role information used at submission.",
    contribution: "I built job intake, duplicate checks, evidence-linked restriction flags, editable profile-based drafts and application analytics in an authenticated web app.",
    decision: "Unknown requirements need review. Drafts use recorded profile facts, and submitting an application remains a deliberate action by the user.",
    scope: "Private working app. Screening and drafting use explicit rules and templates, not a language model. Personal records and the authenticated workspace are not published here.",
    steps: ["Save and screen", "Review the draft", "Track the response"],
    tech: "React · TypeScript · Cloudflare D1 · PWA", topic: "Quick Apply",
  },
];

export default function AppsPage() {
  return <main id="top" className="apps-page">
    <section className="shell apps-intro">
      <span className="apps-eyebrow">INDEPENDENT PRODUCT WORK</span>
      <h1>AI &amp; apps.<br/><em>Built around real tasks.</em></h1>
      <p>Alongside my analytics work, I’m building apps that turn information into a useful next step. These projects show how I approach product design, data handling and the parts of a workflow that need human judgment.</p>
      <nav className="work-switch" aria-label="Browse my work"><a href="/work">Analytics</a><a href="/apps" aria-current="page">AI &amp; Apps</a></nav>
      <nav className="apps-section-links" aria-label="Explore app projects"><a href="#savorshelf">SavorShelf</a><a href="#fourth-and-forever">Fourth &amp; Forever</a><a href="#quick-apply">Quick Apply</a><a href="#ai-approach">How the AI works ↓</a></nav>
    </section>
    <section className="shell app-collection" aria-label="App projects">
      {apps.map(app => <article className={`app-project app-${app.id}`} key={app.id} id={app.id}>
        <div className="app-project-heading"><div><span className="apps-eyebrow">{app.category}</span><h2>{app.name}</h2></div><span className="app-status">{app.status}</span></div>
        <div className="app-project-body"><div><h3>{app.question}</h3><p>{app.description}</p><dl><dt>What I’m building</dt><dd>{app.contribution}</dd><dt>Design decision</dt><dd>{app.decision}</dd></dl></div>
          <aside className="app-workflow" aria-label={`${app.name} workflow`}><span>THE WORKFLOW</span><ol>{app.steps.map(step => <li key={step}>{step}</li>)}</ol><p>{app.tech}</p></aside>
        </div>
        {app.id === "savorshelf" && <div className="website-project-links"><a href="https://david-edmonds.github.io/savorshelf-cookbook/">Visit SavorShelf ↗</a><a href="https://david-edmonds.github.io/savorshelf-creator/">Open recipe creator ↗</a></div>}
        {app.id === "fourth-and-forever" && <div className="website-project-links"><a href="https://fourth-and-forever.quickapply-david.workers.dev/">Open football app · sign-in required ↗</a></div>}
        <div className="app-project-footer"><p>{app.scope}</p><a href={`mailto:davidedmondsc@gmail.com?subject=${encodeURIComponent(`Portfolio project: ${app.topic}`)}`}>Discuss {app.topic}<span aria-hidden="true"> ↗</span></a></div>
      </article>)}
    </section>
    <section className="shell ai-approach" id="ai-approach" aria-labelledby="ai-approach-title">
      <span className="apps-eyebrow">IMPLEMENTATION NOTES</span><h2 id="ai-approach-title">Where AI fits—and how I check its work.</h2>
      <p className="ai-intro">These projects use AI in different ways: to help develop software, draft recipe variations, or interpret a question. I define the model’s job narrowly, then use application logic and review to decide what happens next. Using an existing model is different from training one; these are integration projects, not claims of original model research.</p>
      <details className="ai-detail"><summary>SavorShelf: structured recipe generation and revision<span>Inputs, validation and saved versions</span></summary><div>
        <h3>What the model receives</h3><p>The creator companion sends the user’s dish request and visible preferences. A revision includes the latest complete draft and the requested change. The workflow does not send the entire saved collection or an unlimited chat history.</p>
        <h3>What it produces</h3><p>The requested output is a structured recipe: ingredients, quantities, servings, steps and notes. This gives the app fields it can parse and validate instead of treating a free-form answer as a finished recipe. The current provider adapter uses Puter; keeping that adapter separate allows the provider to change without moving ownership of recipe state.</p>
        <h3>How the app handles the result</h3><p>The companion parses the response, validates the recipe structure and presents a draft. The user reviews it, names the version and imports it deliberately. Recipe identity and version handling protect the original card; repeated imports of the same formulation should not create duplicate recipes.</p>
        <h3>Failures and limits</h3><p>An invalid response or failed request retains the last valid draft. There is no automatic retry; stopping locally ignores late results but does not guarantee a provider request has stopped. Structural validation cannot prove that a dish tastes good, a substitution behaves correctly or dietary advice is appropriate. New recipes remain untested drafts until reviewed and tried. The web creator is published; recipe enrichment and evaluation of generated recipes remain ongoing work.</p>
      </div></details>
      <details className="ai-detail"><summary>Fourth &amp; Forever: language understanding backed by calculations<span>Constrained output and source-aware decisions</span></summary><div>
        <h3>The model’s job</h3><p>A local language-model integration interprets a football question and returns an intent, such as lineup, waiver, trade or scoring, plus referenced players. It receives a bounded roster context and the two most recent questions for follow-up references. It is instructed to interpret the request, not generate advice or execute tools.</p>
        <h3>Grounding the answer</h3><p>The response must match a defined JSON structure. Allowed intents are enumerated, player references must exist in the supplied roster, and duplicate or unknown references are rejected. Application code then resolves the request against the available data. Lineup and roster comparisons are calculated separately from the language model.</p>
        <h3>Why data freshness matters</h3><p>A successful roster refresh does not make a captured projection current. The app preserves the distinction between connected rosters, reviewed imports and missing evidence. A recommendation needs compatible scoring, eligible lineup slots and the relevant player information; fluent model output cannot supply a missing injury report or lineup-lock status.</p>
        <h3>Failure handling and limits</h3><p>The local request has a timeout and response-size limit. Invalid structure or invented player references fail validation. The integration treats supplied text as untrusted input, but prompting alone is not a security guarantee—the constrained output and code checks matter. The app remains read-only, with no automated league transactions. Broader current-data coverage and the Android update are unfinished.</p>
      </div></details>
      <details className="ai-detail"><summary>Quick Apply: choosing rules where they are easier to inspect<span>Profile-based drafts without a language model</span></summary><div>
        <h3>What runs today</h3><p>Quick Apply uses explicit screening rules, duplicate checks and editable templates. Restriction flags point back to evidence in the posting, and drafts draw from recorded profile facts. This is workflow automation, not a model making an eligibility decision.</p>
        <h3>The analytical decision</h3><p>Rules are useful when the question is specific: whether a posting mentions office attendance, whether a requisition is already saved, or which resume was used for a submitted application. Missing requirements remain review items. An application is only recorded as submitted when the user confirms that action.</p>
        <h3>What an AI extension would need</h3><p>A future model-assisted drafting feature would need a bounded set of approved profile facts, traceable support for each claim and a review step before use. It would also need evaluation against unsupported credentials, ambiguous restrictions and instructions embedded in job descriptions. That is a design requirement, not a feature claimed as implemented.</p>
      </div></details>

    </section>
    <section className="shell apps-next"><div><h2>Try the public tools</h2><p>Compare two reports or explore a profit scenario directly in your browser.</p></div><a className="button blue" href="/tools">Open the analytics lab <span aria-hidden="true">→</span></a></section>
  </main>;
}
