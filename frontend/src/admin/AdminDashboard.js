import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import { Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StandardPage } from "@/components/common";
import { useSiteContent } from "@/context/SiteContent";
import { API } from "@/lib/site";
import CourseEditor from "./CourseEditor";
import ProjectEditor from "./ProjectEditor";
import GalleryEditor from "./GalleryEditor";
import GeneralEditor from "./GeneralEditor";
import EnquiryList from "./EnquiryList";

const tabs = [["courses", "Courses"], ["projects", "Projects"], ["gallery", "Gallery"], ["general", "Faculty & Branding"], ["enquiries", "Enquiries"]];

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const { setContent: publish } = useSiteContent();
  const [content, setContent] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [denied, setDenied] = useState(false);

  const load = useCallback(async () => {
    const headers = { Authorization: `Bearer ${await getToken()}` };
    const c = await axios.get(`${API}/content`);
    setContent(c.data);
    try { setEnquiries((await axios.get(`${API}/enquiries`, { headers })).data); }
    catch (e) { if (e.response?.status === 403) setDenied(true); else toast.error("Could not verify your account right now. Please reload."); }
  }, [getToken]);
  useEffect(() => { load().catch(() => toast.error("Could not load content")); }, [load]);

  const update = (key) => (value) => setContent((c) => ({ ...c, [key]: value }));
  const save = async () => {
    if (content.courses.some((c) => !c.name.trim()) || content.projects.some((p) => !p.title.trim()) || content.gallery.some((g) => !g.image.trim()) || content.social_links.some((s) => !s.url.trim())) {
      toast.error("Every course needs a name, every project a title, and every photo and social link a link.");
      return;
    }
    const names = content.courses.map((c) => c.name.trim().toLowerCase());
    const dup = names.find((n, i) => names.indexOf(n) !== i);
    if (dup) { toast.error(`Two courses are named "${dup}". Please give each course a unique name.`); return; }
    setSaving(true);
    try {
      const { data } = await axios.put(`${API}/content`, content, { headers: { Authorization: `Bearer ${await getToken()}` } });
      setContent(data); publish(data);
      toast.success("Saved — your website is updated.");
    } catch (e) {
      toast.error(e.response?.status === 403 ? "This account is not allowed to edit the website." : "Saving failed. Please try again.");
    } finally { setSaving(false); }
  };

  if (denied) return <StandardPage eyebrow="Owner area" title="Access restricted"><p className="lead" data-testid="admin-access-denied">This account is not the GenInfotech owner account. Please sign in with the owner email.</p></StandardPage>;
  if (!content) return <StandardPage eyebrow="Owner area" title="GenInfotech admin"><p className="lead" data-testid="admin-loading">Loading your content…</p></StandardPage>;

  return (
    <StandardPage eyebrow="Owner area" title="GenInfotech admin">
      <Toaster position="bottom-right" richColors />
      <div className="admin-bar" data-testid="admin-bar">
        <p>Make your changes in any tab, then press <b>Save changes</b> to publish them.</p>
        <div className="admin-bar-actions">
          <button className="button button-outline-dark" onClick={() => load()} data-testid="admin-refresh"><RefreshCw size={15} /> Reload</button>
          <button className="button button-gold" onClick={save} disabled={saving} data-testid="admin-save-content">{saving ? "Saving…" : "Save changes"} <Check size={16} /></button>
        </div>
      </div>
      <Tabs defaultValue="courses" className="admin-tabs">
        <TabsList className="admin-tablist">
          {tabs.map(([v, l]) => <TabsTrigger key={v} value={v} data-testid={`admin-tab-${v}`}>{l}{v === "enquiries" && ` (${enquiries.length})`}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="courses"><CourseEditor courses={content.courses} onChange={update("courses")} /></TabsContent>
        <TabsContent value="projects"><ProjectEditor projects={content.projects} onChange={update("projects")} /></TabsContent>
        <TabsContent value="gallery"><GalleryEditor gallery={content.gallery} onChange={update("gallery")} /></TabsContent>
        <TabsContent value="general"><GeneralEditor content={content} update={update} /></TabsContent>
        <TabsContent value="enquiries"><EnquiryList items={enquiries} /></TabsContent>
      </Tabs>
    </StandardPage>
  );
}
