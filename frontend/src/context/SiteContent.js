import { createContext, useContext, useState } from "react";
import siteContent from "@/data/site-content.json";

const SiteContentCtx = createContext({ content: siteContent, setContent: () => {}, loaded: true });

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(siteContent);
  return <SiteContentCtx.Provider value={{ content, setContent, loaded: true }}>{children}</SiteContentCtx.Provider>;
}

export const useSiteContent = () => useContext(SiteContentCtx);
