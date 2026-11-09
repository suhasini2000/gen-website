import { StandardPage } from "@/components/common";
import { FeatureHero } from "./InfoPage";
import { useSiteContent } from "@/context/SiteContent";
import { useLang } from "@/context/Lang";
import { STOCK_PHOTOS } from "@/lib/site";

export default function Gallery() {
  const { t } = useLang();
  const p = t.pages;
  const { content } = useSiteContent();
  const real = content.gallery.length > 0;
  const items = real ? content.gallery : STOCK_PHOTOS.map((image, i) => ({ id: `stock-${i}`, image, title: "" }));
  return (
    <StandardPage eyebrow={p.learning} title={t.nav.gallery}>
      <FeatureHero heading={p.galleryHeading} text={p.galleryText} />
      <div className="gallery-grid" data-testid={real ? "gallery-real" : "gallery-placeholder"}>
        {items.map((g, i) => (
          <figure key={g.id} data-testid={`gallery-item-${i}`}>
            <img src={g.image} alt={g.title || "GenInfotech classroom"} loading="lazy" data-testid={`gallery-image-${i}`} />
            {real ? g.title && <figcaption>{g.title}</figcaption> : <figcaption className="sample">{p.sample}</figcaption>}
          </figure>
        ))}
      </div>
    </StandardPage>
  );
}
