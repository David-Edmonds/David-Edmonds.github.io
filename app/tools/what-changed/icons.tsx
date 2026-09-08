import type { SVGProps } from 'react';
type Props = SVGProps<SVGSVGElement> & { size?: number };
function icon(d: string) { return function Icon({size=24,...props}: Props) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={d}/></svg>; }; }
export const ArrowUpRight=icon('M7 17 17 7M7 7h10v10');
export const ArrowRight=icon('M4 12h16M14 6l6 6-6 6');
export const ArrowDownToLine=icon('M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4');
export const ArrowLeftRight=icon('M3 7h18m-5-5 5 5-5 5M21 17H3m5-5-5 5 5 5');
export const FileSpreadsheet=icon('M14 2H5v20h14V7l-5-5v5h5M8 12h8M8 16h8M12 10v9');
export const ShieldCheck=icon('M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4M8 12l3 3 5-6');
export const Plus=icon('M12 5v14M5 12h14');
export const Minus=icon('M5 12h14');
export const Copy=icon('M9 9h12v12H9zM15 5V2H2v13h3');
export const Check=icon('M4 12l5 5L20 6');
export const X=icon('m6 6 12 12M6 18 18 6');
export const Search=icon('M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0');
export const SlidersHorizontal=icon('M3 7h6m4 0h8M3 17h12m4 0h2M9 4v6m6 4v6');
