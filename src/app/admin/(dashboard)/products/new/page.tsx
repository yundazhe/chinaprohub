import EntityForm from "@/components/admin/EntityForm";
import { PRODUCTS, formDef } from "@/app/admin/entities";
import { categoryChoices, enterpriseChoices } from "@/app/admin/select-options";
import { save } from "../actions";

export default async function NewProduct() {
  const selectOptions = {
    enterprise_id: await enterpriseChoices(),
    category_id: await categoryChoices(),
  };
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">新建产品</h1>
      <EntityForm def={formDef(PRODUCTS)} action={save} selectOptions={selectOptions} />
    </div>
  );
}
