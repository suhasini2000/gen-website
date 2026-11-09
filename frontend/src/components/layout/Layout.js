import { MessageCircle, Phone } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLang } from "@/context/Lang";
import { TEL, waLink } from "@/lib/site";

function FloatingContact() {
  const { t } = useLang();
  return (
    <div className="floating-contact">
      <a className="float-call" href={TEL} aria-label={t.common.call} data-testid="floating-call"><Phone size={20} /></a>
      <a className="whatsapp" href={waLink("Hello GenInfotech, I would like to know about your courses.")} target="_blank" rel="noreferrer" data-testid="floating-whatsapp"><MessageCircle size={20} /><span>{t.common.whatsapp}</span></a>
    </div>
  );
}

export function Layout({ children }) {
  return <><Header /><main>{children}</main><Footer /><FloatingContact /></>;
}
