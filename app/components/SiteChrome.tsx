const links = [
  ["Work", "/work"],
  ["Services", "/services"],
  ["About", "/about"],
  ["Calculator", "/tools"],
  ["Resume", "/david-edmonds-resume.pdf"],
];

export function SiteHeader() {
  return <header className="site-header"><div className="shell nav">
    <a className="brand" href="/"><span>DE</span><div><b>David Edmonds</b><small>DATA ANALYTICS &amp; BI</small></div></a>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label,href])=><a key={label} href={href}>{label}</a>)}</nav>
    <details className="mobile-nav"><summary>Menu</summary><nav aria-label="Mobile navigation">{links.map(([label,href])=><a key={label} href={href}>{label}</a>)}<a href="/contact">Contact</a></nav></details>
    <a className="header-cta" href="/contact">Let’s talk <span>↗</span></a>
  </div></header>;
}

export function SiteFooter() {
  return <footer className="footer shell"><a className="brand" href="/"><span>DE</span><div><b>David Edmonds</b><small>DATA ANALYTICS &amp; BI</small></div></a><p>Remote · United States<br/>Consulting &amp; analytics opportunities</p><div><a href="/work">Work</a><a href="/services">Services</a><a href="/contact">Contact</a><a href="#top">Top ↑</a></div><small>© {new Date().getFullYear()} David Edmonds · Client-confidential data is never published.</small></footer>;
}
