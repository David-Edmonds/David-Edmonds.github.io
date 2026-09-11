import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & Apps | David Edmonds",
  description: "Independent app projects by David Edmonds: recipe management, fantasy football decision support and a private job-search workspace.",
  alternates: { canonical: "/apps" },
};

const apps = [
  {
    id: "savorshelf", name: "SavorShelf", category: "RECIPES & PERSONAL KNOWLEDGE", status: "In development",
    question: "Keep the recipe. Remember what made it better.",
    description: "A recipe app built around the way a collection changes over time: saved dishes, personal notes, ratings and named versions. The focus is making a recipe easy to find, adapt and cook again.",
    contribution: "I’m developing the Android and web experience, recipe import and version handling, and a companion workflow for creating and revising recipes with AI.",
    decision: "A generated revision is a draft to review. It should not silently replace a saved recipe or erase the cook’s notes.",
    scope: "Personal app in active development. Recipe enrichment and the creator workflow are ongoing; no public app-store release is offered here.",
    steps: ["Save a recipe", "Review a variation", "Keep a named version"],
    tech: "Android · JavaScript · AI-assisted recipe drafts", topic: "SavorShelf",
  },
  {
    id: "fourth-and-forever", name: "Fourth & Forever", category: "DECISION SUPPORT", status: "Private prototype",
    question: "Advice is only useful when it understands the league.",
    description: "A fantasy football adviser that brings roster context, scoring and available projections into the same decision. The app compares lineup and roster options and explains the assumptions behind each result.",
    contribution: "I’m building the web and Android app, read-only roster integration, lineup calculations and local-model question interpretation.",
    decision: "Roster freshness and projection freshness are different. Missing information stays visible, and the app does not make league transactions.",
    scope: "Private prototype. Connected roster access and reviewed imports are implemented; complete current injury/projection coverage and the Android update remain in development.",
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
    </section>
    <section className="shell app-collection" aria-label="App projects">
      {apps.map(app => <article className={`app-project app-${app.id}`} key={app.id} id={app.id}>
        <div className="app-project-heading"><div><span className="apps-eyebrow">{app.category}</span><h2>{app.name}</h2></div><span className="app-status">{app.status}</span></div>
        <div className="app-project-body"><div><h3>{app.question}</h3><p>{app.description}</p><dl><dt>What I’m building</dt><dd>{app.contribution}</dd><dt>Design decision</dt><dd>{app.decision}</dd></dl></div>
          <aside className="app-workflow" aria-label={`${app.name} workflow`}><span>THE WORKFLOW</span><ol>{app.steps.map(step => <li key={step}>{step}</li>)}</ol><p>{app.tech}</p></aside>
        </div>
        <div className="app-project-footer"><p>{app.scope}</p><a href={`mailto:davidedmondsc@gmail.com?subject=${encodeURIComponent(`Portfolio project: ${app.topic}`)}`}>Discuss {app.topic}<span aria-hidden="true"> ↗</span></a></div>
      </article>)}
    </section>
    <section className="shell apps-next"><div><h2>Try the public tools</h2><p>Compare two reports or explore a profit scenario directly in your browser.</p></div><a className="button blue" href="/tools">Open the analytics lab <span aria-hidden="true">→</span></a></section>
  </main>;
}
