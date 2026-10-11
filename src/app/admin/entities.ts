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
    {
      col: "type",
      label: "类型（province/city/cluster）",
      required: true,
      options: ["province", "city", "cluster"],
    },
    {
      col: "core_products",
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

// Task 7 共用 serialize 小函数（纯函数，client 页面可 import）。
const commaToList = (raw: string) =>
  String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// 空/空白 → null：可空外键下拉选"未指定"时清除关联。
const blankToNull = (raw: string) => (raw.trim() ? raw : null);

// number 输入框提交字符串；空 → null（established_year/factory_area_sqm 均可空）。
const toNumberOrNull = (raw: string) => (raw.trim() ? Number(raw) : null);

// 企业管理 def。
// 注意：slug 有意不进表单——由 name_en 翻译回填自动生成（crud-factory 保存后处理），
// 手工编辑 slug 会破坏前台 /enterprises/[slug] 路由与既有外链；images 同理（URL 上传超范围）。
export const ENTERPRISES: EntityDef = {
  table: "enterprises",
  label: "企业",
  nameCol: "name_zh",
  baseFields: [
    { col: "name_zh", label: "中文名称", required: true },
    { col: "description_zh", label: "中文描述", textarea: true },
    { col: "contact_email", label: "联系邮箱" },
    { col: "contact_whatsapp", label: "WhatsApp" },
    { col: "contact_website", label: "官网" },
    { col: "established_year", label: "成立年份", type: "number", serialize: toNumberOrNull },
    { col: "employee_range", label: "员工规模" },
    { col: "factory_area_sqm", label: "厂房面积（㎡）", type: "number", serialize: toNumberOrNull },
    { col: "moq_text", label: "起订量（MOQ）说明" },
    // checkbox 提交 "on"/缺省；serialize 转 boolean（未勾选缺省 → false）。
    {
      col: "supports_oem",
      label: "支持 OEM/ODM",
      kind: "checkbox",
      serialize: (raw) => raw === "on",
    },
    { col: "certifications", label: "认证证书（逗号分隔）", serialize: commaToList },
    { col: "export_markets", label: "出口市场（逗号分隔）", serialize: commaToList },
    // CHECK 约束仅允许这三个值；required 避免空串（"未指定"选项会违反 CHECK）。
    {
      col: "verification_status",
      label: "认证状态",
      required: true,
      options: ["unverified", "verified", "premium"],
    },
    // 动态外键下拉：选项由各 new/edit 页服务端查询后经 EntityForm.selectOptions 注入；
    // serialize 仅负责把"未指定"（空串）清成 NULL。
    { col: "category_id", label: "所属分类", serialize: blankToNull },
    { col: "region_id", label: "所属产业带", serialize: blankToNull },
  ],
  localized: { name: true, description: true },
};

// 产品管理 def。specifications/images 有意不进表单（JSONB 键值编辑与图片上传超范围）。
// products 表无 description_* 列（migration 003 只加了 name_es/ar/ru/fr）→ localized.description=false。
export const PRODUCTS: EntityDef = {
  table: "products",
  label: "产品",
  nameCol: "name_zh",
  baseFields: [
    { col: "name_zh", label: "中文名称", required: true },
    // 必填外键下拉（企业），选项服务端注入。
    { col: "enterprise_id", label: "所属企业", required: true },
    { col: "category_id", label: "所属分类", serialize: blankToNull },
    { col: "hs_code", label: "海关编码（HS Code）" },
  ],
  localized: { name: true, description: false },
};

// RSC → client 组件（EntityForm）的 props 必须可序列化，函数（FieldDef.serialize）会触发
// "Functions cannot be passed directly to Client Components"。服务端 actions.ts 用原始 def
// （makeSaveHandler 需要 serialize），渲染表单时改用本函数剥离函数字段。
export function formDef(def: EntityDef): EntityDef {
  return {
    ...def,
    baseFields: def.baseFields.map(({ col, label, textarea, required, type, options, kind }) => ({
      col,
      label,
      textarea,
      required,
      type,
      options,
      kind,
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
