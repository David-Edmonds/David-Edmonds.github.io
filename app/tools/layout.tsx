import type { Metadata } from "next";
import "./tools.css";

const title = "Analytics Lab | David Edmonds";
const description = "Estimate reporting effort and run a private, browser-only first-pass quality profile on a sanitized CSV.";

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
