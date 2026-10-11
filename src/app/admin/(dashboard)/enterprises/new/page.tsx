import EntityForm from "@/components/admin/EntityForm";
import { ENTERPRISES, formDef } from "@/app/admin/entities";
import { categoryChoices, regionChoices } from "@/app/admin/select-options";
import { serviceClient } from "@/lib/supabase-server";
import { save } from "../actions";

// Next 14：searchParams 为同步普通对象 prop（非 Promise）。
// ?from=<submissionId>：从线索「转为企业」进入时预填新建表单；id 无效/记录不存在则回落为空表单。
export default async function NewEnterprise({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // 外键下拉选项服务端查询（id → 中文名优先），经 selectOptions 注入 EntityForm。
  const selectOptions = {
    category_id: await categoryChoices(),
    region_id: await regionChoices(),
  };

  let prefill: Record<string, unknown> | undefined;
  const fromRaw = searchParams.from;
  const from = typeof fromRaw === "string" ? fromRaw.trim() : "";
  if (from) {
    // 非法 uuid 会让 Postgres 报错 → data 为 null，自然走空表单兜底。
    const { data } = await serviceClient()
      .from("submissions")
      .select("*")
      .eq("id", from)
      .maybeSingle();
    const s = data as Record<string, unknown> | null;
    if (s) {
      // 线索没有 category/region 外键（仅自由文本），且 contact_name 在企业表中无对应列
      // → 与产品/区域/联系人一起并入中文描述，避免信息丢失。
      const description_zh = [
        s.message ? `留言：${String(s.message)}` : "",
        s.products_text ? `主营产品：${String(s.products_text)}` : "",
        s.region_text ? `所在区域：${String(s.region_text)}` : "",
        s.contact_name ? `联系人：${String(s.contact_name)}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      // 注意：不带 id —— EntityForm 见 row.id 会渲染隐藏 id 并当编辑处理。
      prefill = {
        name_zh: String(s.company_name ?? ""),
        description_zh,
        contact_email: String(s.contact_email ?? ""),
        contact_whatsapp: String(s.contact_phone ?? ""),
      };
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">{prefill ? "新建企业（来自线索）" : "新建企业"}</h1>
      {prefill && (
        <p className="mb-3 text-xs text-slate-500">
          已由提交线索预填名称/描述/联系方式，请补全信息后保存；分类与产业带需手动选择。
        </p>
      )}
      <EntityForm
        def={formDef(ENTERPRISES)}
        row={prefill}
        action={save}
        selectOptions={selectOptions}
      />
    </div>
  );
}
