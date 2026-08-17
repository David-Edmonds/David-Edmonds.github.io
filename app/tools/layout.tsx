import type { Metadata } from "next";
const title = "Reporting Time & Cost Calculator | David Edmonds";
const description = "Estimate annual hours and capacity value that could be recovered by reducing manual reporting work.";
export const metadata: Metadata = { title, description, openGraph:{title,description,images:[]}, twitter:{card:"summary",title,description,images:[]} };
export default function ToolsLayout({children}:{children:React.ReactNode}) { return children; }
