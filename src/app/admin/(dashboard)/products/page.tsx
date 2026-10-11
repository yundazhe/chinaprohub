import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import DataTable from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { fieldsToTranslate } from "@/lib/translation";
import Link from "next/link";
import { remove, retranslate } from "./actions";

function TranslateDot({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      title="存在待翻译字段"
      className="mr-1 inline-block h-2 w-2 shrink-0 rounded-full bg-yellow-400 align-middle"
    />
  );
}

export default async function ProductsAdmin() {
  await requireAdmin();
  const db = serviceClient();
  const [{ data }, { data: enterpriseRows }] = await Promise.all([
    db.from("products").select("*").order("name_zh"),
    db.from("enterprises").select("id,name_zh,name_en"),
  ]);
  // 服务端取 id→名称映射（中文名优先），列表用 render 展示企业名。
  const nameById: Record<string, string> = {};
  for (const e of (enterpriseRows ?? []) as {
    id: string;
    name_zh: string | null;
    name_en: string | null;
  }[]) {
    nameById[e.id] = e.name_zh || e.name_en || e.id;
  }
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">产品管理</h1>
        <Link href="/admin/products/new" className="btn-primary">
          新建产品
        </Link>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        黄色圆点＝该记录存在待翻译字段，可点「补翻」手动触发翻译；所属企业被删除时产品一并删除。
      </p>
      <DataTable
        hrefBase="/admin/products"
        rows={(data ?? []) as Record<string, unknown>[]}
        deleteAction={remove}
        cols={[
          {
            key: "name_zh",
            label: "中文名",
            render: (r) => (
              <span className="flex items-center gap-1">
                <TranslateDot show={fieldsToTranslate(r).length > 0} />
                {String(r.name_zh ?? "—")}
              </span>
            ),
          },
          { key: "name_en", label: "英文名" },
          {
            key: "enterprise_id",
            label: "所属企业",
            render: (r) => nameById[String(r.enterprise_id)] ?? "—",
          },
          { key: "hs_code", label: "HS Code" },
        ]}
        extraActions={(r) => (
          <RowActions id={String(r.id)} retranslateAction={retranslate} />
        )}
      />
    </div>
  );
}
