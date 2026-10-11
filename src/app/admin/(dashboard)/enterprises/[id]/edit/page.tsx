import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import EntityForm from "@/components/admin/EntityForm";
import { ENTERPRISES, formDef, listToText } from "@/app/admin/entities";
import { categoryChoices, regionChoices } from "@/app/admin/select-options";
import { save } from "../../actions";

export default async function EditEnterprise({ params }: { params: { id: string } }) {
  await requireAdmin();
  const { data } = await serviceClient()
    .from("enterprises")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!data) return <p className="text-slate-500">记录不存在</p>;
  const row = data as Record<string, unknown>;
  const selectOptions = {
    category_id: await categoryChoices(),
    region_id: await regionChoices(),
  };
  // EntityForm 只回填字符串：JSONB 数组列拍平为逗号文本（与 serialize 往返一致）；
  // number 列转字符串供 number 输入框回填；boolean 列(supports_oem)保持原值由 checkbox 分支处理。
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">编辑企业</h1>
      <EntityForm
        def={formDef(ENTERPRISES)}
        row={{
          ...row,
          certifications: listToText(row, "certifications"),
          export_markets: listToText(row, "export_markets"),
          established_year: row.established_year == null ? "" : String(row.established_year),
          factory_area_sqm: row.factory_area_sqm == null ? "" : String(row.factory_area_sqm),
        }}
        action={save}
        selectOptions={selectOptions}
      />
    </div>
  );
}
