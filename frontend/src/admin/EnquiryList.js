import { useState } from "react";
import { Link } from "react-router-dom";
import { UNITS } from "@/lib/site";

const reply = (x) => `https://wa.me/${x.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}?text=${encodeURIComponent(`Hello ${x.student_name}, thank you for your enquiry about ${x.course || "our courses"} at GenInfotech.`)}`;

export default function EnquiryList({ items }) {
  const [unit, setUnit] = useState("all");
  const shown = unit === "all" ? items : items.filter((x) => (x.unit || "main") === unit);
  const count = (u) => items.filter((x) => (x.unit || "main") === u).length;
  return (
    <div className="admin-list" data-testid="enquiry-list">
      <h3>Student enquiries <span>{items.length}</span></h3>
      <div className="unit-filter">
        <button type="button" className={unit === "all" ? "on" : ""} onClick={() => setUnit("all")} data-testid="enquiry-filter-all">All ({items.length})</button>
        {Object.entries(UNITS).map(([k, l]) => <button type="button" key={k} className={unit === k ? "on" : ""} onClick={() => setUnit(k)} data-testid={`enquiry-filter-${k}`}>{l} ({count(k)})</button>)}
      </div>
      {shown.length ? shown.map((x, i) => (
        <div className="admin-row" key={x.id} data-testid={`enquiry-row-${i}`}>
          <strong>{x.student_name}<span className={`unit-badge ${x.unit || "main"}`} data-testid={`enquiry-unit-${i}`}>{UNITS[x.unit || "main"]}</span></strong>
          <span>{x.course || "General enquiry"} · {x.mode}{x.message && <small className="enquiry-msg">{x.message}</small>}</span>
          <a href={reply(x)} target="_blank" rel="noreferrer" data-testid={`enquiry-reply-${i}`}>{x.phone}</a>
          <small>{new Date(x.created_at).toLocaleDateString("en-IN")}</small>
        </div>
      )) : <p className="muted" data-testid="admin-empty">No enquiries here yet. Test it from the <Link to="/contact" className="text-link">Contact page</Link>.</p>}
    </div>
  );
}
