import { Plus } from "lucide-react";
import { Field, listOps, newId, RowControls } from "./editorKit";

export default function ProjectEditor({ projects, onChange }) {
  const ops = listOps(projects, onChange);
  const add = () => onChange([...projects, { id: newId(), title: "New project", description: "", technology: "", student: "", image: "" }]);
  return (
    <div className="editor" data-testid="project-editor">
      <div className="editor-head">
        <div><h3>Student projects <span>{projects.length}</span></h3><p className="muted">Showcase student work on the Projects page. Photo is optional — paste an image link.</p></div>
        <button type="button" className="button button-gold" onClick={add} data-testid="project-add"><Plus size={16} /> Add project</button>
      </div>
      {!projects.length && <p className="muted" data-testid="project-empty">No projects yet. The Projects page shows sample categories until you add one.</p>}
      {projects.map((p, i) => {
        const set = (k) => (v) => ops.patch(i, { [k]: v });
        return (
          <div className="editor-row open" key={p.id} data-testid={`project-row-${i}`}>
            <div className="editor-row-head"><strong>{String(i + 1).padStart(2, "0")} · {p.title || "Untitled project"}</strong><RowControls index={i} total={projects.length} ops={ops} label={p.title} testPrefix="project" /></div>
            <div className="editor-form">
              <Field label="Project title" value={p.title} onChange={set("title")} testId={`project-title-${i}`} />
              <Field label="Technology (e.g. Python)" value={p.technology} onChange={set("technology")} testId={`project-technology-${i}`} />
              <Field label="Student name (optional)" value={p.student} onChange={set("student")} testId={`project-student-${i}`} />
              <Field label="Photo link (optional)" value={p.image} onChange={set("image")} testId={`project-image-${i}`} placeholder="https://…" />
              <Field label="Description" value={p.description} onChange={set("description")} testId={`project-description-${i}`} textarea rows={2} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
