import { Facebook, Instagram, Youtube } from "lucide-react";
import { useSiteContent } from "@/context/SiteContent";

const icons = { youtube: Youtube, instagram: Instagram, facebook: Facebook };

export function SocialLinks({ testPrefix = "social", variant = "" }) {
  const { content } = useSiteContent();
  const links = content.social_links || [];
  if (!links.length) return null;
  return (
    <div className={`social-links ${variant}`}>
      {links.map((s, i) => {
        const Icon = icons[s.platform] || Youtube;
        return (
          <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className={`social-link ${s.platform}`} data-testid={`${testPrefix}-${s.platform}-${i}`}>
            <Icon size={16} /><span>{s.label || s.platform}</span>
          </a>
        );
      })}
    </div>
  );
}
