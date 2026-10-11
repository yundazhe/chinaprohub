"use server";

import { revalidatePath } from "next/cache";
import { makeSaveHandler, deleteRow } from "@/lib/crud-factory";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import { applyTranslation } from "@/lib/translation";
import { PRODUCTS } from "@/app/admin/entities";

const saveHandler = makeSaveHandler(PRODUCTS);

export async function save(fd: FormData): Promise<{ ok?: boolean; err?: string }> {
  return saveHandler(fd);
}

export async function remove(id: string): Promise<{ err?: string }> {
  return deleteRow(PRODUCTS, id);
}

// 产品仅有 name_* 多语列（无 description_*）；localized.description=false 已在 def 中体现，
// fieldsToTranslate/applyTranslation 按行实际列探测，安全复用。
export async function retranslate(id: string): Promise<{ ok?: boolean; err?: string }> {
  await requireAdmin();
  const { data } = await serviceClient().from("products").select("*").eq("id", id).single();
  if (!data) return { err: "不存在" };
  const patch = await applyTranslation("products", data);
  revalidatePath("/", "layout");
  return Object.keys(patch).length ? { ok: true } : { err: "翻译失败或无需翻译，请检查设置" };
}
