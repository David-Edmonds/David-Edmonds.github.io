import type { Metadata } from 'next';
import './analyzer.css';
const title = 'What Changed? Report Analyzer | David Edmonds';
const description = 'Compare two CSV reports, find missing records and duplicates, and trace changes to source evidence. Reports stay in your browser.';
export const metadata: Metadata = { title, description, alternates: { canonical: '/tools/what-changed' }, openGraph: { title, description, url: '/tools/what-changed', images: [] }, twitter: { card: 'summary', title, description, images: [] } };
export default function Layout({children}: {children: React.ReactNode}) { return children; }
