import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";

// 计数卡：head count 查询（select("*", { count: "exact", head: true })）只取计数不拉数据行。
async function headCount(table: string, eq?: [string, string | boolean]): Promise<number> {
  const db = serviceClient();
  let query = db.from(table).select("*", { count: "exact", head: true });
  if (eq) query = query.eq(eq[0], eq[1]);
  const { count } = await query;
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [categories, regions, enterprisesActive, enterprisesPending, submissionsPending, submissionsTotal] =
    await Promise.all([
      headCount("categories"),
      headCount("regions"),
      headCount("enterprises", ["is_active", true]),
      headCount("enterprises", ["status", "pending"]),
      headCount("submissions", ["status", "pending"]),
      headCount("submissions"),
    ]);

  const cards = [
    {
      label: "分类",
      value: categories,
      note: "含中/英及多语字段",
      href: "/admin/categories",
    },
    {
      label: "产业带",
      value: regions,
      note: "省/市/集群",
      href: "/admin/regions",
    },
    {
      label: "企业（已上架）",
      value: enterprisesActive,
      note: `门户待审企业 ${enterprisesPending} 家`,
      href: "/admin/enterprises",
    },
    {
      label: "待处理线索",
      value: submissionsPending,
      note: `线索总量 ${submissionsTotal}`,
      href: "/admin/submissions",
    },
  ];

  const quickLinks = [
    { href: "/admin/enterprises/new", label: "新建企业" },
    { href: "/admin/products", label: "产品管理" },
    { href: "/admin/users", label: "管理员账号" },
    { href: "/admin/settings", label: "系统设置" },
    { href: "/", label: "前台首页" },
  ];

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">仪表盘</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="card p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{c.value}</p>
            <p className="mt-1 text-xs text-slate-400">{c.note}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-slate-700">快捷入口</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg border bg-white px-4 py-3 text-center text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
