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

export const metadata: Metadata = {
  title: "David Edmonds — Data Analytics & BI Consultant",
  description: "Clear dashboards, trusted KPIs, and automated reporting built for better business decisions.",
  openGraph: {
    title: "David Edmonds — Data Analytics & BI Consultant",
    description: "Clear data. Better decisions.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "David Edmonds — Data Analytics & BI Consultant" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "David Edmonds — Data Analytics & BI Consultant",
    description: "Clear data. Better decisions.",
    images: ["/og.png"],
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
