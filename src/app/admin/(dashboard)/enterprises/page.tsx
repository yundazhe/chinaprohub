import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import DataTable from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { fieldsToTranslate } from "@/lib/translation";
import Link from "next/link";
import { remove, retranslate, toggle } from "./actions";

// 待翻译黄点：fieldsToTranslate 认定的多语缺口（已锁定的列不计入）。
function TranslateDot({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      title="存在待翻译字段"
      className="mr-1 inline-block h-2 w-2 shrink-0 rounded-full bg-yellow-400 align-middle"
    />
  );
}

export default async function EnterprisesAdmin() {
  await requireAdmin();
  const db = serviceClient();
  // products 仅有 enterprise_id 列即够：服务端聚合成 id→级联产品数，供删除确认文案展示。
  const [{ data }, { data: productRows }] = await Promise.all([
    db.from("enterprises").select("*").order("name_zh"),
    db.from("products").select("enterprise_id"),
  ]);
  const counts: Record<string, number> = {};
  for (const p of (productRows ?? []) as { enterprise_id: string | null }[]) {
    if (p.enterprise_id) counts[p.enterprise_id] = (counts[p.enterprise_id] ?? 0) + 1;
  }
  const rows = ((data ?? []) as Record<string, unknown>[]).map((r) => ({
    ...r,
    // 隐藏字段：仅用于 deleteConfirm 文案，不作为列渲染。
    _product_count: counts[String(r.id)] ?? 0,
  }));
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">企业管理</h1>
        <Link href="/admin/enterprises/new" className="btn-primary">
          新建企业
        </Link>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        黄色圆点＝该记录存在待翻译字段，可点「补翻」手动触发翻译；删除企业会级联删除其产品。
      </p>
      <DataTable
        hrefBase="/admin/enterprises"
        rows={rows}
        deleteAction={remove}
        deleteConfirm={(r) =>
          `确认删除企业「${String(r.name_zh ?? "")}」？其 ${String(
            r._product_count
          )} 个产品将一并删除，此操作不可撤销。`
        }
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
          { key: "verification_status", label: "认证状态" },
          {
            key: "is_active",
            label: "上架状态",
            render: (r) => (r.is_active === false ? "已下架" : "已上架"),
          },
        ]}
        extraActions={(r) => (
          <RowActions
            id={String(r.id)}
            active={r.is_active !== false}
            retranslateAction={retranslate}
            toggleAction={toggle}
          />
        )}
      />
    </div>
  );
}
