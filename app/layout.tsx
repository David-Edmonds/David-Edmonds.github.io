import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  jobTitle: "Data Analytics & BI Consultant",
  url: "https://david-edmonds-analytics.davidedmonds1.chatgpt.site",
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
  title: "David Edmonds — Data Analytics & BI Consultant",
  description: "David Edmonds is a Data Analytics and BI Consultant with 10+ years of experience in dashboards, reporting automation, KPI design, and operational analytics.",
  openGraph: {
    title: "David Edmonds — Data Analytics & BI Consultant",
    description: "10+ years turning complex data into clear dashboards, reliable reporting, and better decisions.",
    images: [{ url: "https://david-edmonds-analytics.davidedmonds1.chatgpt.site/og-v2.png", width: 1200, height: 630, alt: "David Edmonds — Data Analytics & BI Consultant" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "David Edmonds — Data Analytics & BI Consultant",
    description: "10+ years turning complex data into clear dashboards, reliable reporting, and better decisions.",
    images: ["https://david-edmonds-analytics.davidedmonds1.chatgpt.site/og-v2.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalProfile) }} /></head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
