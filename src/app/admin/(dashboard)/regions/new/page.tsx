import EntityForm from "@/components/admin/EntityForm";
import { REGIONS, formDef } from "@/app/admin/entities";
import { save } from "../actions";

export default function NewRegion() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">新建产业带</h1>
      <EntityForm def={formDef(REGIONS)} action={save} />
    </div>
  );
}
