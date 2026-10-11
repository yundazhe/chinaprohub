"use client";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { Field, Alert } from "./ui";
import type { Choice } from "./ui";
// 仅类型导入（编译期擦除），避免把 crud-factory 的服务端依赖带入 client bundle。
import type { EntityDef } from "@/lib/crud-factory";

const LOCALES = ["es", "ar", "ru", "fr"] as const;

export default function EntityForm({
  def,
  row,
  action,
  selectOptions,
}: {
  def: EntityDef;
  row?: Record<string, unknown>;
  action: (fd: FormData) => Promise<{ ok?: boolean; err?: string }>;
  // 外键列（category_id/region_id/enterprise_id）的动态下拉选项：
  // 由各 new/edit 页面服务端查询后按列名注入（FieldDef.options 仅用于静态枚举）。
  selectOptions?: Record<string, Choice[]>;
}) {
  const router = useRouter();
  const [result, setResult] = useState<{ ok?: boolean; err?: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const locks = (row?.translation_locks as string[] | undefined) ?? [];

  const localizedCols: { col: string; label: string; textarea?: boolean }[] = [];
  if (def.localized.name) {
    for (const l of LOCALES) localizedCols.push({ col: `name_${l}`, label: `名称 (${l})` });
  }
  if (def.localized.description) {
    for (const l of LOCALES) {
      localizedCols.push({ col: `description_${l}`, label: `描述 (${l})`, textarea: true });
    }
  }

  function valueOf(col: string): string {
    const v = row?.[col];
    return typeof v === "string" ? v : "";
  }
  // 有值且已在 translation_locks 中 → 默认勾选（表示人工固定，不再自动翻译）。
  function lockChecked(col: string): boolean {
    return !!valueOf(col) && locks.includes(col);
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setResult(null);
        startTransition(async () => {
          try {
            const res = await action(fd);
            setResult(res);
            if (res.ok) router.refresh();
          } catch (err) {
            setResult({ err: err instanceof Error ? err.message : "保存失败" });
          }
        });
      }}
    >
      {row?.id != null && <input type="hidden" name="id" value={String(row.id)} />}
      {def.baseFields.map((f) => (
        <Field
          key={f.col}
          name={f.col}
          label={f.label}
          type={f.type}
          textarea={f.textarea}
          required={f.required}
          options={f.options}
          checkbox={f.kind === "checkbox"}
          checked={row?.[f.col] === true}
          choices={selectOptions?.[f.col]}
          defaultValue={valueOf(f.col)}
        />
      ))}

      {localizedCols.length > 0 && (
        <details className="rounded-lg border bg-slate-50 p-3">
          <summary className="cursor-pointer text-sm font-medium text-slate-700">
            多语言字段（人工编辑；勾选＝锁定不再自动翻译）
          </summary>
          <div className="mt-3 space-y-4">
            {localizedCols.map((c) => (
              <div key={c.col} className="space-y-1">
                <Field
                  name={c.col}
                  label={c.label}
                  textarea={c.textarea}
                  defaultValue={valueOf(c.col)}
                />
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input type="checkbox" name={`lock_${c.col}`} defaultChecked={lockChecked(c.col)} />
                  锁定 {c.col}
                </label>
              </div>
            ))}
          </div>
        </details>
      )}

      {result?.err && <Alert kind="err">{result.err}</Alert>}
      {result?.ok && <Alert kind="ok">保存成功</Alert>}
      {/* React 18 无 useActionState：沿用仓库约定，pending 用 disabled 控制（同 settings/forms.tsx） */}
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "保存中…" : "保存"}
      </button>
    </form>
  );
}
