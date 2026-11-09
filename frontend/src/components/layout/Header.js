import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, Menu, MessageCircle, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { LangToggle, useLang } from "@/context/Lang";
import { PHONE, TEL, waLink } from "@/lib/site";

const links = [["home", "/"], ["courses", "/courses"], ["vedic", "/vedic-maths"], ["aiVista", "/ai-vista-360"], ["gallery", "/gallery"], ["contact", "/contact"]];
const tid = (to) => `nav-${to === "/" ? "home" : to.slice(1)}`;

function TopStrip() {
  const { t } = useLang();
  return (
    <div className="top-strip">
      <div className="container top-strip-inner">
        <span className="top-strip-left">{t.top.location}<i />{t.top.modes}</span>
        <span className="top-strip-right">
          <a href={TEL} data-testid="topbar-phone"><Phone size={13} /> {PHONE}</a>
          <a href={waLink()} target="_blank" rel="noreferrer" data-testid="topbar-whatsapp"><MessageCircle size={13} /> {t.top.whatsapp}</a>
          <LangToggle testId="lang-toggle" />
        </span>
      </div>
    </div>
  );
}

export function Header() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { const f = () => setScrolled(window.scrollY > 30); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);
  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <TopStrip />
      <div className="nav-bar">
        <div className="container nav">
          <Logo light />
          <nav className={open ? "nav-links open" : "nav-links"} data-testid="main-nav">
            {links.map(([k, to]) => <NavLink key={to} end={to === "/"} to={to} className="nav-item" data-testid={tid(to)}>{t.nav[k]}</NavLink>)}
            <div className="nav-mobile-extra"><LangToggle testId="mobile-lang-toggle" /><a href={TEL} data-testid="mobile-nav-phone"><Phone size={15} /> {PHONE}</a></div>
          </nav>
          <div className="nav-actions">
            <Link className="button button-gold nav-cta" to="/contact" data-testid="nav-enquire-button">{t.nav.enquire} <ArrowRight size={16} /></Link>
            <button className="mobile-menu" onClick={() => setOpen(!open)} data-testid="mobile-menu-button" aria-label={t.nav.menu}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
      </div>
    </header>
  );
}
