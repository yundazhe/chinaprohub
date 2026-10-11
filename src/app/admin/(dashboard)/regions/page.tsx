import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import DataTable from "@/components/admin/DataTable";
import Link from "next/link";
import { remove } from "./actions";

// JSONB 数组列 → 逗号文本展示（specializations 缺省时回退 schema 中已有的 core_products）
function joinList(v: unknown, fallback: unknown): string {
  const arr = Array.isArray(v) ? v : Array.isArray(fallback) ? fallback : [];
  return arr.map(String).join(", ") || "—";
}

export default async function RegionsAdmin() {
  await requireAdmin();
  const { data } = await serviceClient().from("regions").select("*").order("name_zh");
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">产业带管理</h1>
        <Link href="/admin/regions/new" className="btn-primary">
          新建产业带
        </Link>
      </div>
      <DataTable
        hrefBase="/admin/regions"
        rows={(data ?? []) as Record<string, unknown>[]}
        deleteAction={remove}
        cols={[
          { key: "name_zh", label: "中文名" },
          { key: "name_en", label: "英文名" },
          { key: "slug", label: "slug" },
          {
            key: "specializations",
            label: "特色产品",
            render: (r) => joinList(r.specializations, r.core_products),
          },
        ]}
      />
    </div>
  );
}
