import { useState } from "react";
import axios from "axios";
import { ArrowRight, Check } from "lucide-react";
import { useLang } from "@/context/Lang";
import { API, UNITS, waLink } from "@/lib/site";

export function EnquiryForm({ unit = "main", title, interestLabel, options, initialCourse = "" }) {
  const { t } = useLang();
  const f = t.form;
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ student_name: "", phone: "", course: initialCourse, mode: "Offline", message: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const allOptions = form.course && !options.some((o) => o.value === form.course) ? [{ value: form.course, label: form.course }, ...options] : options;
  const submit = async (e) => {
    e.preventDefault(); setError("");
    try {
      await axios.post(`${API}/enquiries`, { ...form, unit });
      const text = `Hello GenInfotech (${UNITS[unit]}), I am ${form.student_name}. I am interested in ${form.course || "your courses"}. Preferred mode: ${form.mode}.${form.message ? ` ${form.message}` : ""}`;
      setSent(true);
      window.open(waLink(text), "_blank");
    } catch {
      setError(f.error);
    }
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
      {sent && <p className="success" data-testid={`${p}-success`}><Check size={16} /> {f.success}</p>}
      {error && <p className="error" data-testid={`${p}-error`}>{error}</p>}
    </form>
  );
}
