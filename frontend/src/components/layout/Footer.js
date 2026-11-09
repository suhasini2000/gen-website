import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { SocialLinks } from "@/components/SocialLinks";
import { useLang } from "@/context/Lang";
import { ADDRESS_LINES, EMAIL, MAP_URL, PHONE, TEL } from "@/lib/site";

export function Footer() {
  const { t } = useLang();
  const explore = [[t.pages.about, "/about"], [t.nav.courses, "/courses"], [t.pages.projects, "/projects"], [t.pages.kids, "/kids-programming"], [t.pages.online, "/online-classes"], [t.nav.vedic, "/vedic-maths"], [t.nav.aiVista, "/ai-vista-360"]];
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div><Logo light testId="footer-brand" /><p className="footer-copy">{t.footer.tagline}</p></div>
        <div><p className="footer-label">{t.footer.explore}</p>{explore.map(([l, to]) => <Link key={to} to={to} data-testid={`footer-link-${to.slice(1)}`}>{l}</Link>)}</div>
        <div>
          <p className="footer-label">{t.footer.visit}</p>
          <a href={MAP_URL} target="_blank" rel="noreferrer" className="footer-address" data-testid="footer-address"><MapPin size={15} /><span>{ADDRESS_LINES.map((l) => <span key={l}>{l}</span>)}</span></a>
          <p className="footer-label">{t.footer.talk}</p>
          <a href={TEL} data-testid="footer-phone"><Phone size={15} /> {PHONE}</a>
          <a href={`mailto:${EMAIL}`} data-testid="footer-email"><Mail size={15} /> {EMAIL}</a>
        </div>
        <div><p className="footer-label">{t.footer.follow}</p><SocialLinks testPrefix="footer-social" variant="stacked" /></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 GenInfotech. {t.footer.rights}</span><span>{t.top.modes} · Tanuku</span></div>
    </footer>
  );
}
