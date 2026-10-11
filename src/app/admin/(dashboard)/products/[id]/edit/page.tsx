import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import EntityForm from "@/components/admin/EntityForm";
import { PRODUCTS, formDef } from "@/app/admin/entities";
import { categoryChoices, enterpriseChoices } from "@/app/admin/select-options";
import { save } from "../../actions";

export default async function EditProduct({ params }: { params: { id: string } }) {
  await requireAdmin();
  const { data } = await serviceClient()
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!data) return <p className="text-slate-500">记录不存在</p>;
  const selectOptions = {
    enterprise_id: await enterpriseChoices(),
    category_id: await categoryChoices(),
  };
  // 本 def 的列均为字符串型（uuid/text），直接回填；空 uuid → "" → 下拉显示"未指定"。
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">编辑产品</h1>
      <EntityForm
        def={formDef(PRODUCTS)}
        row={data as Record<string, unknown>}
        action={save}
        selectOptions={selectOptions}
      />
    </div>
  );
}
