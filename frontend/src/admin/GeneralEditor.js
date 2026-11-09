import { Plus } from "lucide-react";
import { Field, listOps, newId, RowControls } from "./editorKit";

function SocialLinksEditor({ links, onChange }) {
  const ops = listOps(links, onChange);
  const add = () => onChange([...links, { id: newId(), platform: "youtube", label: "", url: "" }]);
  return (
    <div className="editor-row open"><div className="editor-row-head"><strong>Social links (footer & contact page)</strong>
      <button type="button" className="button button-outline-dark" onClick={add} data-testid="social-add"><Plus size={15} /> Add link</button></div>
      {links.map((s, i) => (
        <div className="editor-form social-row" key={s.id} data-testid={`social-row-${i}`}>
          <label>Platform<select value={s.platform} onChange={(e) => ops.patch(i, { platform: e.target.value })} data-testid={`social-platform-${i}`}><option value="youtube">YouTube</option><option value="instagram">Instagram</option><option value="facebook">Facebook</option></select></label>
          <Field label="Label shown" value={s.label} onChange={(v) => ops.patch(i, { label: v })} testId={`social-label-${i}`} />
          <Field label="Link" value={s.url} onChange={(v) => ops.patch(i, { url: v })} testId={`social-url-${i}`} placeholder="https://…" />
          <RowControls index={i} total={links.length} ops={ops} label={s.label || s.url} testPrefix="social" />
        </div>
      ))}
    </div>
  );
}

export default function GeneralEditor({ content, update }) {
  const group = (key) => (field) => (v) => update(key)({ ...content[key], [field]: v });
  const faculty = group("faculty"), branding = group("branding"), reviews = group("reviews");
  return (
    <div className="editor" data-testid="general-editor">
      <div className="editor-row open"><div className="editor-row-head"><strong>Faculty profile (About page)</strong></div>
        <div className="editor-form">
          <Field label="Faculty name / heading" value={content.faculty.name} onChange={faculty("name")} testId="admin-faculty-name" />
          <Field label="Profile text — leave empty to keep the current text. New line = new paragraph" value={content.faculty.bio} onChange={faculty("bio")} testId="admin-faculty-bio" textarea rows={5} />
        </div>
      </div>
      <div className="editor-row open"><div className="editor-row-head"><strong>Reviews (home page)</strong></div>
        <div className="editor-form">
          <Field label="YouTube review videos, one link per line" value={(content.reviews.youtube_videos || []).join("\n")} onChange={(v) => reviews("youtube_videos")(v.split("\n"))} testId="admin-review-videos" textarea rows={3} />
          <Field label="Google reviews link" value={content.reviews.google_reviews_url} onChange={reviews("google_reviews_url")} testId="admin-google-reviews" placeholder="https://g.page/…" />
          <Field label="Instagram reel link (QR card button)" value={content.reviews.instagram_reel_url} onChange={reviews("instagram_reel_url")} testId="admin-instagram-reel" placeholder="https://www.instagram.com/reel/…" />
        </div>
      </div>
      <SocialLinksEditor links={content.social_links} onChange={update("social_links")} />
      <div className="editor-row open"><div className="editor-row-head"><strong>Logo</strong></div>
        <div className="editor-form"><Field label="Logo image link — leave empty to use the GenInfotech badge" value={content.branding.logo_url} onChange={branding("logo_url")} testId="admin-logo-url" placeholder="https://…" /></div>
      </div>
    </div>
  );
}
