export type Choice = { value: string; label: string };

export function Field({
  label,
  name,
  defaultValue,
  textarea,
  required,
  type = "text",
  options,
  checkbox,
  checked,
  choices,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
  required?: boolean;
  type?: string;
  options?: string[];
  // kind:"checkbox" 字段 → 复选框（提交值 "on"/缺省，由 def.serialize 转 boolean）。
  checkbox?: boolean;
  // 编辑页回填：row[col] 为 true 时默认勾选。
  checked?: boolean;
  // 动态下拉选项（外键 id→名称，服务端按请求查询后经 EntityForm.selectOptions 传入）。
  choices?: Choice[];
}) {
  const cls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500";
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <em className="not-italic text-red-500"> *</em>}
      </span>
      {checkbox ? (
        <input type="checkbox" name={name} value="on" defaultChecked={checked} className="h-4 w-4 rounded border-slate-300" />
      ) : choices ? (
        <select name={name} defaultValue={defaultValue || undefined} className={cls} required={required}>
          {!required && <option value="">未指定</option>}
          {choices.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : options ? (
        <select name={name} defaultValue={defaultValue || undefined} className={cls} required={required}>
          {!required && <option value="">请选择</option>}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : textarea ? (
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
