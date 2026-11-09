import { useSearchParams } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { StandardPage } from "@/components/common";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SocialLinks } from "@/components/SocialLinks";
import { useSiteContent } from "@/context/SiteContent";
import { useLang } from "@/context/Lang";
import { ADDRESS_LINES, EMAIL, MAP_URL, PHONE, TEL, waLink } from "@/lib/site";

function ContactDetails() {
  const { t } = useLang();
  return (
    <div className="contact-details">
      <h2>{t.contact.heading}</h2>
      <p>{t.contact.text}</p>
      <a href={MAP_URL} target="_blank" rel="noreferrer" data-testid="contact-map"><MapPin /><span>{ADDRESS_LINES.map((l) => <span key={l} className="block">{l}</span>)}</span></a>
      <a href={TEL} data-testid="contact-phone"><Phone /> {PHONE}</a>
      <a href={waLink()} target="_blank" rel="noreferrer" data-testid="contact-whatsapp"><MessageCircle /> {t.contact.chat}</a>
      <a href={`mailto:${EMAIL}`} data-testid="contact-email"><Mail /> {EMAIL}</a>
      <p className="footer-label contact-follow">{t.contact.follow}</p>
      <SocialLinks testPrefix="contact-social" variant="pills" />
    </div>
  );
}

export default function Contact() {
  const { t } = useLang();
  const { content } = useSiteContent();
  const [params] = useSearchParams();
  const options = content.courses.map((c) => ({ value: c.name, label: c.name }));
  return (
    <StandardPage eyebrow={t.contact.eyebrow} title={t.contact.title}>
      <div className="contact-grid">
        <ContactDetails />
        <EnquiryForm key={content.courses.length} unit="main" options={options} initialCourse={params.get("course") || ""} />
      </div>
    </StandardPage>
  );
}
