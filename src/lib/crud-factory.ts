// 通用 CRUD 工厂：供各实体 admin action 文件（"use server"）复用。
// 本文件不顶层加 "use server"——调用方（Task 6/7 的 actions.ts）加。
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";
import { serviceClient } from "./supabase-server";
import { applyTranslation, slugify } from "./translation";

export type FieldDef = {
  col: string;
  label: string;
  textarea?: boolean;
  required?: boolean;
  type?: string;
  // 提供时表单渲染下拉选择（如 regions.type 枚举）。
  options?: string[];
  // "checkbox" 时表单渲染复选框（提交值 "on"/缺省；由 serialize 转 boolean）。
  kind?: "checkbox";
  // 提交时对该列原始字符串值做转换（如逗号分隔标签 → 数组）。
  serialize?: (raw: string) => unknown;
};

export type EntityDef = {
  table: "categories" | "regions" | "enterprises" | "products";
  label: string;
  nameCol: string;
  baseFields: FieldDef[];
  localized: { name: boolean; description: boolean };
  hasStatus?: boolean;
};

export function mergeLocks(oldLocks: string[], newLocks: string[]): string[] {
  return Array.from(new Set([...oldLocks, ...newLocks]));
}

export function extractValues(fd: FormData): {
  values: Record<string, string>;
  locks: string[];
  id: string | null;
} {
  const values: Record<string, string> = {};
  const locks: string[] = [];
  let id: string | null = null;
  // tsconfig 目标为 ES5：不能 for...of fd.entries()（TS2802），用 keys()+get()。
  for (const key of Array.from(fd.keys())) {
    const v = fd.get(key);
    if (typeof v !== "string") continue;
    if (key === "id") id = v || null;
    else if (key.startsWith("lock_")) locks.push(key.slice(5));
    else values[key] = v;
  }
  return { values, locks, id };
}

export function makeSaveHandler(def: EntityDef) {
  return async (fd: FormData): Promise<{ ok?: boolean; err?: string }> => {
    await requireAdmin();
    const db = serviceClient();
    const { values, locks, id } = extractValues(fd);
    const old = id
      ? (await db.from(def.table).select("*").eq("id", id).single()).data
      : null;
    if (!old && id) return { err: "记录不存在" };
    const mergedLocks = mergeLocks((old?.translation_locks as string[]) ?? [], locks);
    // 应用 baseFields 的 serialize（如逗号分隔 → 数组）；未定义 serialize 的列保持原始字符串。
    const patch: Record<string, unknown> = { ...values, translation_locks: mergedLocks };
    for (const f of def.baseFields) {
      if (!f.serialize) continue;
      if (f.kind === "checkbox") {
        // 未勾选的 checkbox 根本不出现在 FormData 中 → 按空串处理，serialize 负责 "on"→true／缺省→false。
        patch[f.col] = f.serialize(values[f.col] ?? "");
      } else if (Object.prototype.hasOwnProperty.call(values, f.col)) {
        patch[f.col] = f.serialize(values[f.col]);
      }
    }
    if (!id && def.table !== "products" && !values.slug && values.name_en) {
      patch.slug = slugify(values.name_en);
    }
    const res = id
      ? await db.from(def.table).update(patch).eq("id", id)
      : await db.from(def.table).insert([patch]);
    if (res.error) return { err: res.error.message };
    const saved = id
      ? (await db.from(def.table).select("*").eq("id", id).single()).data
      : (await db.from(def.table).select("*").order("created_at", { ascending: false }).limit(1).single()).data;
    // insert 时 name_en 可能为空 → 先翻译补出 name_en 再回填 slug
    if (saved) await applyTranslation(def.table, saved);
    if (!id && def.table !== "products" && saved && !saved.slug) {
      const fresh = (await db.from(def.table).select("name_en").eq("id", saved.id).single()).data;
      if (fresh?.name_en) {
        await db.from(def.table).update({ slug: slugify(fresh.name_en) }).eq("id", saved.id);
      }
    }
    // 前台为 [locale] 动态段布局——全量 layout 失效策略（build 验证合法）。
    revalidatePath("/", "layout");
    return { ok: true };
  };
}

export async function deleteRow(def: EntityDef, id: string): Promise<{ err?: string }> {
  await requireAdmin();
  const db = serviceClient();
  if (def.table === "categories" || def.table === "regions") {
    const fk = def.table === "categories" ? "category_id" : "region_id";
    const { count } = await db
      .from("enterprises")
      .select("id", { count: "exact", head: true })
      .eq(fk, id);
    if (count) return { err: `仍有 ${count} 家企业引用，请先迁移后再删除` };
  }
  const { error } = await db.from(def.table).delete().eq("id", id);
  if (error) return { err: error.message };
  // 删除同样影响前台页面 → 与 save/toggle 一致做全量 layout 失效，避免悬挂缓存页最长 1 小时。
  revalidatePath("/", "layout");
  return {};
}

export async function toggleActive(id: string, active: boolean): Promise<{ err?: string }> {
  await requireAdmin();
  const { error } = await serviceClient().from("enterprises").update({ is_active: active }).eq("id", id);
  if (error) return { err: error.message };
  revalidatePath("/", "layout");
  return {};
}
