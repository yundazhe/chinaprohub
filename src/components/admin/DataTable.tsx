import Link from "next/link";
import type { ReactNode } from "react";
import { DeleteButton } from "./DeleteButton";

export default function DataTable({
  rows,
  cols,
  hrefBase,
  deleteAction,
}: {
  rows: Record<string, unknown>[];
  cols: { key: string; label: string; render?: (row: Record<string, unknown>) => ReactNode }[];
  hrefBase: string;
  deleteAction: (id: string) => Promise<{ err?: string }>;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-slate-100">
            {cols.map((c) => (
              <th key={c.key} className="px-3 py-2 font-medium">
                {c.label}
              </th>
            ))}
            <th className="px-3 py-2 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r.id)} className="border-b last:border-0">
              {cols.map((c) => (
                <td key={c.key} className="px-3 py-2">
                  {c.render ? c.render(r) : String(r[c.key] ?? "—")}
                </td>
              ))}
              <td className="space-x-2 px-3 py-2">
                <Link className="text-primary-600 hover:underline" href={`${hrefBase}/${r.id}/edit`}>
                  编辑
                </Link>
                <DeleteButton id={String(r.id)} action={deleteAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <p className="px-3 py-6 text-center text-sm text-slate-500">暂无数据</p>}
    </div>
  );
}
