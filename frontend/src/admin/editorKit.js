import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

export const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

export const listOps = (list, onChange) => ({
  patch: (i, changes) => onChange(list.map((x, j) => (j === i ? { ...x, ...changes } : x))),
  remove: (i) => onChange(list.filter((_, j) => j !== i)),
  move: (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  },
});

export function RowControls({ index, total, ops, label, testPrefix }) {
  const remove = () => { if (window.confirm(`Remove "${label}"? This happens after you press Save changes.`)) ops.remove(index); };
  return (
    <div className="row-controls">
      <button type="button" onClick={() => ops.move(index, -1)} disabled={index === 0} aria-label="Move up" data-testid={`${testPrefix}-up-${index}`}><ArrowUp size={15} /></button>
      <button type="button" onClick={() => ops.move(index, 1)} disabled={index === total - 1} aria-label="Move down" data-testid={`${testPrefix}-down-${index}`}><ArrowDown size={15} /></button>
      <button type="button" className="danger" onClick={remove} aria-label="Remove" data-testid={`${testPrefix}-remove-${index}`}><Trash2 size={15} /></button>
    </div>
  );
}

export function Field({ label, value, onChange, testId, textarea, rows = 3, placeholder }) {
  const props = { value: value || "", onChange: (e) => onChange(e.target.value), "data-testid": testId, placeholder };
  return <label>{label}{textarea ? <textarea rows={rows} {...props} /> : <input {...props} />}</label>;
}
