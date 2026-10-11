export function Field({
  label,
  name,
  defaultValue,
  textarea,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
  required?: boolean;
  type?: string;
}) {
  const cls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500";
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <em className="not-italic text-red-500"> *</em>}
      </span>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={3} className={cls} required={required} />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue} className={cls} required={required} />
      )}
    </label>
  );
}
export function SubmitButton({ children }: { children: React.ReactNode }) {
  return <button className="btn-primary">{children}</button>;
}
export function Alert({ kind, children }: { kind: "ok" | "err"; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg px-3 py-2 text-sm ${kind === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
      {children}
    </div>
  );
}
