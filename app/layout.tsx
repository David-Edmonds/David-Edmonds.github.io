import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

const siteUrl = new URL("https://david-edmonds.github.io");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const professionalProfile = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "David Edmonds",
  jobTitle: "Data Analytics Consultant",
  worksFor: { "@type": "Organization", name: "Confia Solutions, LLC" },
  url: siteUrl.toString(),
  email: "mailto:davidedmondsc@gmail.com",
  telephone: "+1-843-819-2435",
  sameAs: [
    "https://www.linkedin.com/in/david-c-edmonds/",
    "https://github.com/David-Edmonds",
    "https://public.tableau.com/app/profile/david.edmonds5066",
  ],
  knowsAbout: ["Power BI", "Tableau", "SQL", "Excel", "Data Quality", "KPI Reporting", "Operational Analytics"],
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "David Edmonds — Senior Data Analyst & BI Professional",
  description: "David Edmonds is a Data Analytics Consultant with Confia Solutions, LLC and a senior data analyst and BI professional with 10+ years of experience in dashboards, reporting, data quality, KPI design, and operational analytics.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "David Edmonds Analytics",
    title: "David Edmonds — Senior Data Analyst & BI Professional",
    description: "10+ years turning complex data into clear dashboards, reliable reporting, and better decisions.",
    images: [{ url: "/og-v2.png", width: 1200, height: 630, alt: "David Edmonds — Senior Data Analyst & BI Professional" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "David Edmonds — Senior Data Analyst & BI Professional",
    description: "10+ years turning complex data into clear dashboards, reliable reporting, and better decisions.",
    images: ["/og-v2.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalProfile) }} /></head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
