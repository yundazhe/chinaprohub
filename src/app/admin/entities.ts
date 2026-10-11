// 后台各实体的 EntityDef 常量（Task 6：categories/regions；Task 7 会补 enterprises/products）。
// 纯数据 + serialize 小函数，无服务端依赖，client 页面可直接 import。
import type { EntityDef } from "@/lib/crud-factory";

export const CATEGORIES: EntityDef = {
  table: "categories",
  label: "分类",
  nameCol: "name_zh",
  baseFields: [
    { col: "name_zh", label: "中文名称", required: true },
    { col: "description_zh", label: "中文描述", textarea: true },
    { col: "icon", label: "图标 emoji" },
    { col: "sort_order", label: "排序", type: "number" },
  ],
  localized: { name: true, description: true },
};

export const REGIONS: EntityDef = {
  table: "regions",
  label: "产业带",
  nameCol: "name_zh",
  baseFields: [
    { col: "name_zh", label: "中文名称", required: true },
    { col: "description_zh", label: "中文描述", textarea: true },
    { col: "province_zh", label: "所在省份" },
    {
      col: "specializations",
      label: "特色产品（逗号分隔）",
      // 表单提交逗号文本 → 存 JSONB 数组（makeSaveHandler 对表单内出现的列应用 serialize）
      serialize: (raw) =>
        String(raw)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
    },
  ],
  localized: { name: true, description: true },
};

// RSC → client 组件（EntityForm）的 props 必须可序列化，函数（FieldDef.serialize）会触发
// "Functions cannot be passed directly to Client Components"。服务端 actions.ts 用原始 def
// （makeSaveHandler 需要 serialize），渲染表单时改用本函数剥离函数字段。
export function formDef(def: EntityDef): EntityDef {
  return {
    ...def,
    baseFields: def.baseFields.map(({ col, label, textarea, required, type }) => ({
      col,
      label,
      textarea,
      required,
      type,
    })),
  };
}

// 数组列 → 逗号文本（EntityForm 只回填字符串；编辑页预填 JSONB 数组列时使用）。
export function listToText(
  row: Record<string, unknown>,
  col: string,
  fallbackCol?: string
): string {
  const primary = row[col];
  const fallback = fallbackCol ? row[fallbackCol] : undefined;
  const list: unknown[] = Array.isArray(primary) ? primary : Array.isArray(fallback) ? fallback : [];
  return list.map(String).join(",");
}
