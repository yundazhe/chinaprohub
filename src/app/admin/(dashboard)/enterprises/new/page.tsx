import EntityForm from "@/components/admin/EntityForm";
import { ENTERPRISES, formDef } from "@/app/admin/entities";
import { categoryChoices, regionChoices } from "@/app/admin/select-options";
import { save } from "../actions";

export default async function NewEnterprise() {
  // 外键下拉选项服务端查询（id → 中文名优先），经 selectOptions 注入 EntityForm。
  const selectOptions = {
    category_id: await categoryChoices(),
    region_id: await regionChoices(),
  };
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">新建企业</h1>
      <EntityForm def={formDef(ENTERPRISES)} action={save} selectOptions={selectOptions} />
    </div>
  );
}
