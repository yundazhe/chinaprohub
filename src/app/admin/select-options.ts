// 外键下拉选项加载（仅服务端使用——依赖 serviceClient，勿在 client 组件 import）。
// new/edit 页面查询后按列名组成 Record 传给 EntityForm 的 selectOptions prop。
import { serviceClient } from "@/lib/supabase-server";
import type { Choice } from "@/components/admin/ui";

type NamedRow = { id: string; name_zh: string | null; name_en: string | null };

function toChoices(rows: NamedRow[] | null): Choice[] {
  return (rows ?? []).map((r) => ({ value: r.id, label: r.name_zh || r.name_en || r.id }));
}

async function named(table: "categories" | "regions" | "enterprises"): Promise<Choice[]> {
  const { data } = await serviceClient().from(table).select("id,name_zh,name_en").order("name_zh");
  return toChoices(data as NamedRow[] | null);
}

export const categoryChoices = () => named("categories");
export const regionChoices = () => named("regions");
export const enterpriseChoices = () => named("enterprises");
