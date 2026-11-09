import { useState } from "react";
import { ChevronDown, Plus, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { CATEGORIES } from "@/lib/site";
import { Field, listOps, newId, RowControls } from "./editorKit";

const blank = () => ({ id: newId(), name: "New course", category: CATEGORIES[0], description: "", description_te: "", duration: "", topics: [], featured: false });

function CourseForm({ course, index, ops }) {
  const set = (k) => (v) => ops.patch(index, { [k]: v });
  return (
    <div className="editor-form">
      <Field label="Course name" value={course.name} onChange={set("name")} testId={`course-name-${index}`} />
      <label>Category
        <input list="course-categories" value={course.category} onChange={(e) => set("category")(e.target.value)} data-testid={`course-category-${index}`} />
      </label>
      <Field label="Short description (English)" value={course.description} onChange={set("description")} testId={`course-description-${index}`} textarea rows={2} />
      <Field label="Short description (Telugu)" value={course.description_te} onChange={set("description_te")} testId={`course-description-te-${index}`} textarea rows={2} />
      <Field label="Duration (e.g. 3 months)" value={course.duration} onChange={set("duration")} testId={`course-duration-${index}`} />
      <Field label="Topics covered, one per line" value={(course.topics || []).join("\n")} onChange={(v) => set("topics")(v.split("\n"))} testId={`course-topics-${index}`} textarea rows={4} />
      <label className="switch-label">Main course (top of Courses page and on home page)<Switch checked={course.featured} onCheckedChange={set("featured")} data-testid={`course-featured-${index}`} /></label>
    </div>
  );
}

export default function CourseEditor({ courses, onChange }) {
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState("");
  const ops = listOps(courses, onChange);
  const add = () => { const c = blank(); onChange([c, ...courses]); setOpen(c.id); setQuery(""); };
  const q = query.toLowerCase();
  return (
    <div className="editor" data-testid="course-editor">
      <datalist id="course-categories">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
      <div className="editor-head">
        <div><h3>Courses <span>{courses.length}</span></h3><p className="muted">Add, edit, reorder or remove courses. Starred = main course. Fees are never shown — visitors see “Enquire for fees”.</p></div>
        <button type="button" className="button button-gold" onClick={add} data-testid="course-add"><Plus size={16} /> Add course</button>
      </div>
      <input className="editor-search" placeholder="Search courses…" value={query} onChange={(e) => setQuery(e.target.value)} data-testid="course-search" />
      {courses.map((c, i) => (!q || c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) && (
        <div className={`editor-row ${open === c.id ? "open" : ""}`} key={c.id} data-testid={`course-row-${i}`}>
          <div className="editor-row-head">
            <button type="button" className="editor-toggle" onClick={() => setOpen(open === c.id ? null : c.id)} data-testid={`course-toggle-${i}`}>
              <ChevronDown size={16} /><strong>{c.name || "Untitled course"}</strong><small>{c.category}</small>
              {c.featured && <Star size={13} className="star" />}
            </button>
            <RowControls index={i} total={courses.length} ops={ops} label={c.name} testPrefix="course" />
          </div>
          {open === c.id && <CourseForm course={c} index={i} ops={ops} />}
        </div>
      ))}
    </div>
  );
}
