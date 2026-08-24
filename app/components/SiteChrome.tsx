import Link from "next/link";

const links = [
  ["Work", "/work"],
  ["Services", "/services"],
  ["About", "/about"],
  ["Tools", "/tools"],
  ["Resume", "/david-edmonds-resume.pdf"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav">
        <Link className="brand" href="/">
          <span>DE</span>
          <div>
            <b>David Edmonds</b>
            <small>DATA ANALYTICS &amp; BI</small>
          </div>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            {links.map(([label, href]) => (
              <Link key={label} href={href}>
                {label}
              </Link>
            ))}
            <Link href="/contact">Contact</Link>
          </nav>
        </details>
        <Link className="header-cta" href="/contact">
          Let’s talk <span>↗</span>
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer shell">
      <Link className="brand" href="/">
        <span>DE</span>
        <div>
          <b>David Edmonds</b>
          <small>DATA ANALYTICS &amp; BI</small>
        </div>
      </Link>
      <p>
        Data Analytics Consultant · Confia Solutions, LLC
        <br />
        Remote · U.S. work authorized
      </p>
      <div>
        <Link href="/work">Work</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
        <a href="#top">Top ↑</a>
      </div>
      <small>
        © {new Date().getFullYear()} David Edmonds · Client-confidential data is never published.
      </small>
    </footer>
  );
}
