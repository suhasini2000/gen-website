import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/lib/site";

const empty = { courses: [], projects: [], gallery: [], faculty: {}, social_links: [], reviews: { youtube_videos: [] }, branding: {} };
const SiteContentCtx = createContext({ content: empty, setContent: () => {}, loaded: false });

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(empty);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    axios.get(`${API}/content`).then((r) => setContent({ ...empty, ...r.data })).catch(() => {}).finally(() => setLoaded(true));
  }, []);
  return <SiteContentCtx.Provider value={{ content, setContent, loaded }}>{children}</SiteContentCtx.Provider>;
}

export const useSiteContent = () => useContext(SiteContentCtx);
