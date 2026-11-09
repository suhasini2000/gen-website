import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { useLang } from "@/context/Lang";
import { courseText, slugify } from "@/lib/site";

export function SectionTitle({ eyebrow, title, text, light = false }) {
  return <div className={light ? "section-title light" : "section-title"}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export function StandardPage({ title, eyebrow, children }) {
  return (
    <>
      <section className="page-head"><div className="container"><span className="eyebrow gold">{eyebrow}</span><h1>{title}</h1></div></section>
      <section className="section"><div className="container">{children}</div></section>
    </>
  );
}

export function CourseCard({ course, index }) {
  const { t, lang } = useLang();
  return (
    <article className={index === 0 ? "course-card lead-card" : "course-card"} data-testid={`course-card-${index + 1}`}>
      <span className="course-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="tag">{course.category}</span>
      <h3>{course.name}</h3>
      <p>{courseText(course, lang)}</p>
      <Link to={`/courses/${slugify(course.name)}`} className="card-link" data-testid={`course-view-${index + 1}`}>{t.common.viewCourse} <ChevronRight size={16} /></Link>
    </article>
  );
}

export function Division({ unit, accent, link }) {
  const { t } = useLang();
  const u = t.units[unit];
  return (
    <Link to={link} className={`division ${accent}`} data-testid={`${accent}-division`}>
      <div className="division-icon"><Sparkles /></div>
      <span className="eyebrow">{u.sub}</span><h3>{u.title}</h3><strong>{u.tagline}</strong><p>{u.text}</p>
      <span className="text-link">{t.common.explore} <ArrowRight size={16} /></span>
    </Link>
  );
}

export function CTA() {
  const { t } = useLang();
  return (
    <section className="cta"><div className="container cta-inner">
      <div><span className="eyebrow gold">{t.common.ctaEyebrow}</span><h2>{t.common.ctaTitle1}<br /><em>{t.common.ctaTitle2}</em></h2></div>
      <div><p>{t.common.ctaText}</p><Link className="button button-gold" to="/contact" data-testid="cta-enquire">{t.common.enquireNow} <ArrowRight size={17} /></Link></div>
    </div></section>
  );
}
