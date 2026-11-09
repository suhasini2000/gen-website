import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CourseCard, StandardPage } from "@/components/common";
import { useSiteContent } from "@/context/SiteContent";
import { useLang } from "@/context/Lang";
import { slugify } from "@/lib/site";

export default function Courses() {
  const { t } = useLang();
  const { content } = useSiteContent();
  const main = content.courses.filter((c) => c.featured);
  const groups = useMemo(() => content.courses.filter((c) => !c.featured).reduce((a, c) => { (a[c.category || "Other Courses"] ??= []).push(c); return a; }, {}), [content.courses]);
  return (
    <StandardPage eyebrow={t.courses.eyebrow} title={t.courses.title}>
      <p className="lead">{t.courses.lead}</p>
      <h2 className="block-title" data-testid="courses-main-title">{t.courses.main} <span>{String(main.length).padStart(2, "0")}</span></h2>
      <div className="course-grid" data-testid="courses-main-grid">{main.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}</div>
      {Object.keys(groups).length > 0 && <h2 className="block-title" data-testid="courses-more-title">{t.courses.more}</h2>}
      <div className="catalogue">
        {Object.entries(groups).map(([group, items]) => (
          <div className="catalogue-group" key={group}>
            <h3>{group}<span>{String(items.length).padStart(2, "0")}</span></h3>
            <div className="catalogue-items">
              {items.map((c) => <Link to={`/courses/${slugify(c.name)}`} key={c.id} data-testid={`catalogue-${slugify(c.name)}`}><span>{c.name}</span><ChevronRight size={15} /></Link>)}
            </div>
          </div>
        ))}
      </div>
    </StandardPage>
  );
}
