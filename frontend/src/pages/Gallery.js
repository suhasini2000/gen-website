import { StandardPage } from "@/components/common";
import { FeatureHero } from "./InfoPage";
import { useLang } from "@/context/Lang";

const GALLERY_IMAGES = [
  "/0ic21.jpg",
  ...Array.from({ length: 16 }, (_, i) => `/pic${i + 1}.jpg`),
  "/pic18.jpg",
  "/pic19.jpg",
  "/pic20.jpg",
  "/pic22.jpg",
  "/WhatsApp%20Image%202026-11-08%20at%2015.39.57.jpeg",
];

export default function Gallery() {
  const { t } = useLang();
  const p = t.pages;
  return (
    <StandardPage eyebrow={p.learning} title={t.nav.gallery}>
      <FeatureHero heading={p.galleryHeading} text={p.galleryText} />
      <div className="gallery-grid" data-testid="gallery-public">
        {GALLERY_IMAGES.map((image, i) => (
          <figure key={image} data-testid={`gallery-item-${i}`}>
            <img src={image} alt="GenInfotech classroom" loading="lazy" data-testid={`gallery-image-${i}`} />
          </figure>
        ))}
      </div>
    </StandardPage>
  );
}
