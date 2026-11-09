import { createContext, useContext, useEffect, useState } from "react";
import { STRINGS } from "@/i18n/strings";

const LangCtx = createContext({ lang: "en", setLang: () => {}, t: STRINGS.en });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("gi-lang") || "en");
  useEffect(() => { localStorage.setItem("gi-lang", lang); document.documentElement.lang = lang; }, [lang]);
  return <LangCtx.Provider value={{ lang, setLang, t: STRINGS[lang] }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

export function LangToggle({ testId = "lang-toggle" }) {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-toggle" role="group" aria-label="Language" data-testid={testId}>
      <button type="button" className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} data-testid={`${testId}-en`}>EN</button>
      <button type="button" className={lang === "te" ? "on" : ""} onClick={() => setLang("te")} data-testid={`${testId}-te`}>తెలుగు</button>
    </div>
  );
}
