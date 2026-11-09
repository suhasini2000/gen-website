import { Link } from "react-router-dom";
import { ArrowRight, Check, Instagram, MessageCircle, Phone, Play, Star } from "lucide-react";
import { CourseCard, CTA, Division, SectionTitle } from "@/components/common";
import { useSiteContent } from "@/context/SiteContent";
import { useLang } from "@/context/Lang";
import { INSTAGRAM_REEL_URL, STOCK_PHOTOS, TEL, waLink, youtubeId } from "@/lib/site";

function Hero() {
  const { t } = useLang();
  return (
    <section className="hero-banner" data-testid="home-hero">
      <div className="hero-banner-img"><img src="/banner.jpg" alt="GenInfotech – AI based Software Training Hub. Build like a pro, with the power of AI." data-testid="home-hero-banner" /></div>
      <div className="container hero-bar">
        <div>
          <h1 data-testid="home-hero-title">{t.home.heroTitle}</h1>
          <p>{t.home.heroText}</p>
        </div>
        <div className="hero-actions">
          <Link className="button button-gold" to="/courses" data-testid="hero-explore-courses">{t.home.exploreCourses} <ArrowRight size={17} /></Link>
          <a className="button button-outline" href={waLink()} target="_blank" rel="noreferrer" data-testid="hero-whatsapp"><MessageCircle size={16} /> {t.home.whatsappEnquiry}</a>
          <a className="button button-outline icon-only" href={TEL} aria-label={t.common.call} data-testid="hero-call"><Phone size={16} /></a>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const { t } = useLang();
  return (
    <section className="stats-strip" data-testid="home-stats">
      <div className="container stats-grid">
        {t.home.stats.map(([n, l], i) => <div key={l} className="stat" data-testid={`home-stat-${i}`}><strong>{n}</strong><span>{l}</span></div>)}
      </div>
    </section>
  );
}

function AboutSection() {
  const { t } = useLang();
  return (
    <section className="section home-about" data-testid="home-about">
      <div className="container home-about-grid">
        <div className="home-about-media">
          <img src="/pic5.jpg" alt="Students learning on computers" />
          <div className="home-about-badge"><strong>20+</strong><span>{t.home.stats[0][1]}</span></div>
        </div>
        <div>
          <SectionTitle eyebrow={t.home.aboutEyebrow} title={t.home.aboutTitle} />
          {t.home.aboutText.map((p) => <p key={p} className="home-about-text">{p}</p>)}
          <ul className="check-list">{t.home.aboutPoints.map((x) => <li key={x}><Check size={16} />{x}</li>)}</ul>
          <Link to="/about" className="text-link" data-testid="home-about-link">{t.pages.about} <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}

const SUCCESS_STORIES = [
  {
    name: "Divya Anaparthi",
    company: "Deloitte Digital",
    quote: "The course transformed my career. I went from a junior developer to a senior role in just 2 years!",
    image: "/divya.jpg",
    imageAlt: "Divya Anaparthi",
  },
  {
    name: "Tulasi",
    company: "TCS Company",
    quote: "By offering a thorough and practical curriculum, we prepare our students to confidently handle real-world technical challenges.",
    image: "/tulasi.jpg",
    imageAlt: "Tulasi at a GenInfotech event",
  },
  {
    name: "D. Irwin Emmanuel",
    company: "Threatmodeler Software Inc",
    quote: "The comprehensive curriculum gave me the confidence to tackle any technical challenge.",
    image: "/shinnu.jpg",
    imageAlt: "D. Irwin Emmanuel",
  },
  {
    name: "Kishore",
    company: "Abroad Educational Consultancy",
    quote: "Our in-depth curriculum builds the knowledge and confidence required to excel in any technical environment.",
    image: "/kishore.jpg",
    imageAlt: "Kishore",
  },
  {
    name: "K Ayyappa",
    company: "Work From Home",
    quote: "The hands-on projects and mentorship were invaluable. I'm now leading a team of 10 developers.",
    image: "/ayyappa.jpg",
    imageAlt: "K Ayyappa",
  },
  {
    name: "Sravani",
    company: "TCS Software Company",
    quote: "The comprehensive curriculum gave me the confidence to tackle any technical challenge.",
    image: "/sravani.png",
    imageAlt: "Sravani",
  },
  {
    name: "P.M.Mrudula",
    company: "WIPRO",
    quote: "Our comprehensive curriculum equips students with the confidence and skills needed to tackle any technical challenge.",
    image: "/pic1.jpg",
    imageAlt: "GenInfotech students learning in class",
  },
];

function SuccessStories() {
  return (
    <section className="section success-stories" id="past-students" data-testid="home-success-stories">
      <div className="container">
        <SectionTitle eyebrow="Student outcomes" title="Our Success Stories" />
        <div className="students-grid">
          {SUCCESS_STORIES.map((student, i) => (
            <article className="student-item" key={student.name} data-testid={`success-story-${i}`}>
              <img src={student.image} alt={student.imageAlt} loading="lazy" />
              <div className="student-content">
                <h3>{student.name}</h3>
                <p className="student-company">{student.company}</p>
                <p className="student-quote">“{student.quote}”</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MainCourses() {
  const { t } = useLang();
  const { content } = useSiteContent();
  return (
    <section className="section main-courses"><div className="container">
      <SectionTitle eyebrow={t.home.coursesEyebrow} title={t.home.coursesTitle} text={t.home.coursesText} />
      <div className="course-grid">{content.courses.filter((c) => c.featured).map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}</div>
      <Link className="text-link" to="/courses" data-testid="home-all-courses">{t.home.allCourses} <ArrowRight size={16} /></Link>
    </div></section>
  );
}

function Reviews() {
  const { t } = useLang();
  const { content } = useSiteContent();
  const r = content.reviews || {};
  const videos = (r.youtube_videos || []).map(youtubeId).filter(Boolean);
  const reel = r.instagram_reel_url || INSTAGRAM_REEL_URL;
  return (
    <section className="dark-section reviews" data-testid="home-reviews"><div className="container">
      <SectionTitle light eyebrow={t.home.reviewsEyebrow} title={t.home.reviewsTitle} text={t.home.reviewsText} />
      <div className="reviews-grid">
        {videos.map((id, i) => (
          <div className="video-card" key={id} data-testid={`review-video-${i}`}>
            <iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={`GenInfotech review ${i + 1}`} loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        ))}
        <div className="reel-card" data-testid="review-instagram-reel">
          <a className="reel-thumbnail-link" href={reel} target="_blank" rel="noreferrer" aria-label={t.home.openInstagram}>
            <img src="/reel-thumbnail.jpg" alt="Preview of the GenInfotech Instagram student review reel" />
            <span className="reel-play-icon" aria-hidden="true"><Play size={24} fill="currentColor" /></span>
          </a>
          <div><Instagram size={18} /><h3>{t.home.reelTitle}</h3><p>{t.home.reelText}</p>
            <a className="button button-gold" href={reel} target="_blank" rel="noreferrer" data-testid="review-instagram-link">{t.home.openInstagram} <ArrowRight size={15} /></a></div>
        </div>
      </div>
      {r.google_reviews_url && <a className="button button-outline google-reviews" href={r.google_reviews_url} target="_blank" rel="noreferrer" data-testid="review-google-link"><Star size={16} /> {t.home.googleReviews}</a>}
    </div></section>
  );
}

export default function Home() {
  const { t } = useLang();
  return (
    <>
      <Hero />
      <Stats />
      <AboutSection />
      <MainCourses />
      <SuccessStories />
      <section className="section divisions"><div className="container">
        <SectionTitle eyebrow={t.home.unitsEyebrow} title={t.home.unitsTitle} />
        <div className="division-grid">
          <Division unit="ai" accent="violet" link="/ai-vista-360" />
          <Division unit="vedic" accent="orange" link="/vedic-maths" />
        </div>
      </div></section>
      <Reviews />
      <CTA />
    </>
  );
}
