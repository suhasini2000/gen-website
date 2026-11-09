import { Plus } from "lucide-react";
import { Field, listOps, newId, RowControls } from "./editorKit";

export default function GalleryEditor({ gallery, onChange }) {
  const ops = listOps(gallery, onChange);
  const add = () => onChange([...gallery, { id: newId(), title: "", image: "" }]);
  return (
    <div className="editor" data-testid="gallery-editor">
      <div className="editor-head">
        <div><h3>Gallery photos <span>{gallery.length}</span></h3><p className="muted">Paste a link to each photo (for example from Google Photos “copy image address”) and add a caption.</p></div>
        <button type="button" className="button button-gold" onClick={add} data-testid="gallery-add"><Plus size={16} /> Add photo</button>
      </div>
      {!gallery.length && <p className="muted" data-testid="gallery-empty">No photos yet.</p>}
      <div className="gallery-editor-grid">
        {gallery.map((g, i) => (
          <div className="gallery-editor-item" key={g.id} data-testid={`gallery-row-${i}`}>
            <div className="gallery-thumb">{g.image ? <img src={g.image} alt={g.title || "Preview"} /> : <span>Preview</span>}</div>
            <Field label="Photo link" value={g.image} onChange={(v) => ops.patch(i, { image: v })} testId={`gallery-image-input-${i}`} placeholder="https://…" />
            <Field label="Caption" value={g.title} onChange={(v) => ops.patch(i, { title: v })} testId={`gallery-title-${i}`} />
            <RowControls index={i} total={gallery.length} ops={ops} label={g.title || `Photo ${i + 1}`} testPrefix="gallery" />
          </div>
        ))}
      </div>
    </div>
  );
}
