import type { Metadata } from 'next';
import Planner from './Planner';
import './planner.css';

const title = 'Profit Scenario Planner | David Edmonds';
const description = 'Test price, volume, discounts and costs. Compare operating profit, explain its drivers and calculate break-even sales in your browser.';
export const metadata: Metadata = { title, description, alternates: { canonical: '/tools/profit-planner' }, openGraph: { title, description, url: '/tools/profit-planner', images: [] }, twitter: { card: 'summary', title, description, images: [] } };
export default function Page() { return <Planner />; }
