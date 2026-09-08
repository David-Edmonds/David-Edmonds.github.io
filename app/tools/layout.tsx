import type { Metadata } from "next";
import "./tools.css";

const title = "Analytics Lab | David Edmonds";
const description = "Estimate reporting effort, check CSV quality, and compare reports with browser-only tools.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tools" },
  openGraph: { title, description, url: "/tools", images: [] },
  twitter: { card: "summary", title, description, images: [] },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
