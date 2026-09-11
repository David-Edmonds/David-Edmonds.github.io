/* eslint-disable @next/next/no-html-link-for-pages -- This site is exported to static GitHub Pages HTML, so full-page anchors are intentional. */

const links = [
  ["Work", "/work"],
  ["AI & Apps", "/apps"],
  ["Consulting", "/services"],
  ["About", "/about"],
  ["Tools", "/tools"],
  ["Resume", "/david-edmonds-resume.pdf"],
] as const;

export function SiteHeader() {
  return (
    <><a className="skip-link" href="#top">Skip to content</a><header className="site-header">
      <div className="shell nav">
        <a className="brand" href="/" aria-label="David Edmonds — Home">
          <span>DE</span>
          <div>
            <b>David Edmonds</b>
            <small>DATA ANALYTICS &amp; BI</small>
          </div>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            {links.map(([label, href]) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
            <a href="/contact">Contact</a>
          </nav>
        </details>
        <a className="header-cta" href="/contact">
          Let’s talk <span>↗</span>
        </a>
      </div>
    </header></>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer shell">
      <a className="brand" href="/" aria-label="David Edmonds — Home">
        <span>DE</span>
        <div>
          <b>David Edmonds</b>
          <small>DATA ANALYTICS &amp; BI</small>
        </div>
      </a>
      <p>
        Data Analytics Consultant · Confia Solutions, LLC
        <br />
        Remote · U.S. work authorized
      </p>
      <div>
        <a href="/work">Work</a>
        <a href="/services">Consulting</a>
        <a href="/contact">Contact</a>
        <a href="#top">Top ↑</a>
      </div>
      <small>
        © {new Date().getFullYear()} David Edmonds · Client-confidential data is never published.
      </small>
    </footer>
  );
}
