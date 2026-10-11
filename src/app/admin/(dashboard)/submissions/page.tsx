import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import SubmissionActions from "@/components/admin/SubmissionActions";
import { setStatus } from "./actions";

// 状态徽标：与产品/企业列表的文字色风格一致，pending 用琥珀提醒优先处理。
const BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};
const BADGE_LABEL: Record<string, string> = {
  pending: "待处理",
  approved: "已通过",
  rejected: "已拒绝",
};

export default async function SubmissionsAdmin() {
  await requireAdmin();
  const { data } = await serviceClient()
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">线索管理</h1>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        企业自主提交表单产生的线索：「通过/拒绝」仅更新线索状态；「转为企业」跳转新建企业表单并预填线索内容。
      </p>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-slate-100">
              <th className="px-3 py-2 font-medium">企业名称</th>
              <th className="px-3 py-2 font-medium">联系邮箱</th>
              <th className="px-3 py-2 font-medium">主营产品</th>
              <th className="px-3 py-2 font-medium">状态</th>
              <th className="px-3 py-2 font-medium">提交时间</th>
              <th className="px-3 py-2 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r.id)} className="border-b last:border-0">
                <td className="px-3 py-2">{String(r.company_name ?? "—")}</td>
                <td className="px-3 py-2">{String(r.contact_email ?? "—")}</td>
                <td className="max-w-xs truncate px-3 py-2" title={String(r.products_text ?? "")}>
                  {String(r.products_text ?? "—")}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      BADGE[String(r.status)] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {BADGE_LABEL[String(r.status)] ?? String(r.status ?? "—")}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-500">
                  {r.created_at ? new Date(String(r.created_at)).toLocaleString("zh-CN") : "—"}
                </td>
                <td className="space-x-2 whitespace-nowrap px-3 py-2">
                  <SubmissionActions id={String(r.id)} status={String(r.status)} setStatusAction={setStatus} />
                  <Link
                    className="text-primary-600 hover:underline"
                    href={`/admin/enterprises/new?from=${String(r.id)}`}
                  >
                    转为企业
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="px-3 py-6 text-center text-sm text-slate-500">暂无线索</p>}
      </div>
    </div>
  );
}
