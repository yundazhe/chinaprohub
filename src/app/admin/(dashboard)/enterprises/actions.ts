"use server";

import { revalidatePath } from "next/cache";
import { makeSaveHandler, deleteRow, toggleActive } from "@/lib/crud-factory";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import { applyTranslation } from "@/lib/translation";
import { ENTERPRISES } from "@/app/admin/entities";

const saveHandler = makeSaveHandler(ENTERPRISES);

export async function save(fd: FormData): Promise<{ ok?: boolean; err?: string }> {
  return saveHandler(fd);
}

// 服务端删除保持通用守卫（deleteRow 仅对 categories/regions 做引用计数拦截）；
// enterprises 无额外守卫——产品随 FK ON DELETE CASCADE 一并删除，N 仅在列表确认文案中展示。
export async function remove(id: string): Promise<{ err?: string }> {
  return deleteRow(ENTERPRISES, id);
}

// 上架/下架：crud-factory.toggleActive 内部已 requireAdmin + revalidatePath("/", "layout")。
export async function toggle(id: string, active: boolean): Promise<void> {
  return toggleActive(id, active);
}

// 手动补翻译：重查整行（含最新多语列/锁）→ applyTranslation 只补 fieldsToTranslate 认定的缺口。
export async function retranslate(id: string): Promise<{ ok?: boolean; err?: string }> {
  await requireAdmin();
  const { data } = await serviceClient().from("enterprises").select("*").eq("id", id).single();
  if (!data) return { err: "不存在" };
  const patch = await applyTranslation("enterprises", data);
  // 翻译直接改行，绕开 save/toggle 路径 → 这里同样做全量 layout 失效（前台多语页可见）。
  revalidatePath("/", "layout");
  return Object.keys(patch).length ? { ok: true } : { err: "翻译失败或无需翻译，请检查设置" };
}
