import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import DataTable from "@/components/admin/DataTable";
import Link from "next/link";
import { remove } from "./actions";

export default async function CategoriesAdmin() {
  await requireAdmin();
  const { data } = await serviceClient().from("categories").select("*").order("sort_order");
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">分类管理</h1>
        <Link href="/admin/categories/new" className="btn-primary">
          新建分类
        </Link>
      </div>
      <DataTable
        hrefBase="/admin/categories"
        rows={(data ?? []) as Record<string, unknown>[]}
        deleteAction={remove}
        cols={[
          { key: "name_zh", label: "中文名" },
          { key: "name_en", label: "英文名" },
          { key: "slug", label: "slug" },
          { key: "sort_order", label: "排序" },
        ]}
      />
    </div>
  );
}
