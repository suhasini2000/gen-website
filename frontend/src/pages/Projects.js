import { StandardPage } from "@/components/common";
import { FeatureHero, InfoGrid } from "./InfoPage";
import { useSiteContent } from "@/context/SiteContent";
import { useLang } from "@/context/Lang";

function ProjectCard({ project, index, by }) {
  return (
    <article className="project-card" data-testid={`project-card-${index}`}>
      {project.image && <img src={project.image} alt={project.title} />}
      <div>
        {project.technology && <span className="tag">{project.technology}</span>}
        <h3>{project.title}</h3>
        {project.description && <p>{project.description}</p>}
        {project.student && <small>{by} {project.student}</small>}
      </div>
    </article>
  );
}

export default function Projects() {
  const { t } = useLang();
  const p = t.pages;
  const { content } = useSiteContent();
  return (
    <StandardPage eyebrow={p.learning} title={p.projects}>
      <FeatureHero heading={p.projectsHeading} text={p.projectsText} />
      {content.projects.length
        ? <div className="project-grid">{content.projects.map((x, i) => <ProjectCard key={x.id} project={x} index={i} by={p.by} />)}</div>
        : <InfoGrid items={p.projectPlaceholders} note={t.common.soon} />}
    </StandardPage>
  );
}
