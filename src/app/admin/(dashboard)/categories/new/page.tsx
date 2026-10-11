import EntityForm from "@/components/admin/EntityForm";
import { CATEGORIES, formDef } from "@/app/admin/entities";
import { save } from "../actions";

export default function NewCategory() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">新建分类</h1>
      <EntityForm def={formDef(CATEGORIES)} action={save} />
    </div>
  );
}
