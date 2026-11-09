import { Check, Code2 } from "lucide-react";
import { StandardPage } from "@/components/common";
import { useLang } from "@/context/Lang";

export function FeatureHero({ heading, text }) {
  return <div className="feature-hero"><div><h2>{heading}</h2><p>{text}</p></div><div className="feature-icon"><Code2 size={42} /></div></div>;
}

export function InfoGrid({ items, note }) {
  return <div className="info-grid">{items.map((x) => <div className="info-item" key={x}><Check size={17} /><strong>{x}</strong><small>{note}</small></div>)}</div>;
}

export default function InfoPage({ type }) {
  const { t } = useLang();
  const p = t.pages;
  const page = type === "kids"
    ? { title: p.kids, heading: p.kidsHeading, text: p.kidsText, items: p.kidsItems }
    : { title: p.onlineTitle, heading: p.onlineHeading, text: p.onlineText, items: p.onlineItems };
  return (
    <StandardPage eyebrow={p.learning} title={page.title}>
      <FeatureHero heading={page.heading} text={page.text} />
      <InfoGrid items={page.items} note={t.common.practical} />
    </StandardPage>
  );
}
