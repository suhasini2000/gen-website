import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { StandardPage } from "@/components/common";
import { useSiteContent } from "@/context/SiteContent";
import { useLang } from "@/context/Lang";
import { courseText, slugify } from "@/lib/site";

export default function CourseDetail() {
  const { t, lang } = useLang();
  const d = t.detail;
  const { slug } = useParams();
  const { content, loaded } = useSiteContent();
  const course = content.courses.find((c) => slugify(c.name) === slug);
  if (!course) return <StandardPage eyebrow={t.courses.eyebrow} title={loaded ? d.notFound : d.loading}>{loaded && <Link className="text-link" to="/courses" data-testid="course-not-found-back">{d.browse} <ArrowRight size={16} /></Link>}</StandardPage>;
  const hasTopics = course.topics?.length > 0;
  return (
    <StandardPage eyebrow={course.category} title={course.name}>
      <div className="detail-grid">
        <div>
          <p className="lead" data-testid="course-detail-description">{courseText(course, lang)}</p>
          <div className="detail-meta">
            <p data-testid="course-detail-duration"><span>{t.common.duration}</span>{course.duration || t.common.contactDetails}</p>
            <p data-testid="course-detail-fee"><span>{t.common.fee}</span>{t.common.feesOnEnquiry}</p>
          </div>
          <Link className="button button-gold" to={`/contact?course=${encodeURIComponent(course.name)}`} data-testid="course-detail-enquire">{d.enquire} <ArrowRight size={16} /></Link>
        </div>
        <div className="detail-points">
          <h3>{hasTopics ? d.learn : d.expect}</h3>
          {(hasTopics ? course.topics : d.points).map((x, i) => <p key={i}><Check size={17} />{x}</p>)}
        </div>
      </div>
    </StandardPage>
  );
}
