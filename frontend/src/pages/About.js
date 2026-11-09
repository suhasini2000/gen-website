import { GraduationCap } from "lucide-react";
import { StandardPage } from "@/components/common";
import { useSiteContent } from "@/context/SiteContent";
import { useLang } from "@/context/Lang";

export default function About() {
  const { t } = useLang();
  const p = t.pages;
  const { content } = useSiteContent();
  const { name, bio } = content.faculty || {};
  const paragraphs = bio ? bio.split("\n").filter(Boolean) : p.facultyBio;
  return (
    <StandardPage eyebrow={p.aboutEyebrow} title={p.aboutTitle}>
      <div className="about-grid">
        <div><h2>{p.aboutLead}</h2></div>
        <div>{p.aboutText.map((x) => <p key={x}>{x}</p>)}</div>
      </div>
      <div className="faculty" data-testid="faculty-section">
        <div className="faculty-badge"><GraduationCap size={30} /><span>{p.years}<br /><small>{p.yearsSub}</small></span></div>
        <div>
          <span className="eyebrow">{p.facultyEyebrow}</span>
          <h2 data-testid="faculty-name">{name || p.facultyDefault}</h2>
          {paragraphs.map((x, i) => <p key={i} data-testid={`faculty-bio-${i}`}>{x}</p>)}
        </div>
      </div>
    </StandardPage>
  );
}
