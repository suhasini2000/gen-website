import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useLang } from "@/context/Lang";
import { UNITS, waLink } from "@/lib/site";

export function EnquiryForm({ unit = "main", title, interestLabel, options, initialCourse = "" }) {
  const { t } = useLang();
  const f = t.form;
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ student_name: "", phone: "", course: initialCourse, mode: "Offline", message: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const allOptions = form.course && !options.some((o) => o.value === form.course) ? [{ value: form.course, label: form.course }, ...options] : options;
  const submit = (e) => {
    e.preventDefault();
    const text = `Hello GenInfotech (${UNITS[unit]}), I am ${form.student_name}. My phone number is ${form.phone}. I am interested in ${form.course || "your courses"}. Preferred mode: ${form.mode}.${form.message ? ` ${form.message}` : ""}`;
    setSent(true);
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  };
  const p = `enquiry-${unit}`;
  return (
    <form className="enquiry-form" onSubmit={submit} data-testid={`${p}-form`}>
      <span className="eyebrow">{title || f.eyebrow}</span>
      <label>{f.name}<input required value={form.student_name} onChange={set("student_name")} data-testid={`${p}-student-name`} /></label>
      <label>{f.phone}<input required type="tel" value={form.phone} onChange={set("phone")} data-testid={`${p}-phone`} /></label>
      <label>{interestLabel || f.course}<select value={form.course} onChange={set("course")} data-testid={`${p}-course`}><option value="">{f.select}</option>{allOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
      <label>{f.mode}<select value={form.mode} onChange={set("mode")} data-testid={`${p}-mode`}>{["Offline", "Online", "Not sure yet"].map((m, i) => <option key={m} value={m}>{f.modes[i]}</option>)}</select></label>
      <label>{f.message}<textarea rows="3" value={form.message} onChange={set("message")} data-testid={`${p}-message`} placeholder={f.messagePh} /></label>
      <button className="button button-gold" type="submit" data-testid={`${p}-submit`}>{f.submit} <ArrowRight size={16} /></button>
      <p className="muted">{f.notice}</p>
      {sent && <p className="success" data-testid={`${p}-success`}><Check size={16} /> {f.success}</p>}
    </form>
  );
}
