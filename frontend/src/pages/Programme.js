import { StandardPage } from "@/components/common";
import { EnquiryForm } from "@/components/EnquiryForm";
import { useLang } from "@/context/Lang";
import { STRINGS } from "@/i18n/strings";

const config = {
  vedic: { unit: "vedic_maths", accent: "orange", cardsKey: "levels", cardsTitle: "levelsTitle" },
  ai: { unit: "ai_vista", accent: "violet", cardsKey: "audience", cardsTitle: "audienceTitle" },
};

export default function Programme({ kind }) {
  const { t } = useLang();
  const c = config[kind];
  const u = t.units[kind];
  const p = t[kind];
  const options = STRINGS.en[kind].formOptions.map((value, i) => ({ value, label: p.formOptions[i] }));
  return (
    <StandardPage eyebrow={p.eyebrow} title={u.title}>
      <div className={`programme-hero ${c.accent}`} data-testid={`${kind}-programme-hero`}>
        <span className="eyebrow">{u.sub}</span><h2>{u.tagline}</h2><p>{u.text}</p>
      </div>
      <h2 className="block-title">{p[c.cardsTitle]}</h2>
      <div className="level-grid">
        {p[c.cardsKey].map(([title, text], i) => (
          <div className={`level-card ${c.accent}`} key={title} data-testid={`${kind}-card-${i}`}><span>{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></div>
        ))}
      </div>
      <div className="programme-bottom">
        <div className="pill-list">{p.topics.map((x) => <span key={x}>{x}</span>)}</div>
        <EnquiryForm unit={c.unit} title={p.formTitle} interestLabel={p.interest} options={options} />
      </div>
    </StandardPage>
  );
}
