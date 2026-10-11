import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import EntityForm from "@/components/admin/EntityForm";
import { REGIONS, formDef, listToText } from "@/app/admin/entities";
import { save } from "../../actions";

export default async function EditRegion({ params }: { params: { id: string } }) {
  await requireAdmin();
  const { data } = await serviceClient()
    .from("regions")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!data) return <p className="text-slate-500">记录不存在</p>;
  const row = data as Record<string, unknown>;
  // EntityForm 只回填字符串：把 JSONB 数组列 core_products 拍平成逗号文本，
  // 与 FieldDef.serialize（逗号文本 → 数组）往返一致。
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">编辑产业带</h1>
      <EntityForm
        def={formDef(REGIONS)}
        row={{ ...row, core_products: listToText(row, "core_products") }}
        action={save}
      />
    </div>
  );
}
