type Props = { title: string; description: string; topic: string; source: string };
export function ProjectContact({title,description,topic,source}: Props) {
 return <section className="project-contact shell" aria-label="Discuss a similar project"><div><span>APPLY THIS TO YOUR TEAM</span><h2>{title}</h2><p>{description}</p></div><div className="project-contact-actions"><a className="button blue" href={`/contact?topic=${encodeURIComponent(topic)}&from=${encodeURIComponent(source)}#inquiry`}>Discuss a similar project <span>→</span></a><a className="secondary-action" href="/services">See what’s included →</a></div></section>;
}
