export function SectionTitle({eyebrow,title,accent}:{eyebrow:string;title:string;accent:string}) {
  return <div className="section-title"><span>{eyebrow}</span><h2>{title}<br/><em>{accent}</em></h2></div>;
}
