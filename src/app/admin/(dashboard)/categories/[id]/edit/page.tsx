import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import EntityForm from "@/components/admin/EntityForm";
import { CATEGORIES, formDef } from "@/app/admin/entities";
import { save } from "../../actions";

export default async function EditCategory({ params }: { params: { id: string } }) {
  await requireAdmin();
  const { data } = await serviceClient()
    .from("categories")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!data) return <p className="text-slate-500">记录不存在</p>;
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">编辑分类</h1>
      <EntityForm def={formDef(CATEGORIES)} row={data as Record<string, unknown>} action={save} />
    </div>
  );
}
