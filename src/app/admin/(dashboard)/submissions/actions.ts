"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";

// 线索状态流转：approved（采纳）/ rejected（拒绝）。
// schema.sql 的 submissions 表没有 reviewed_at 列（仅 status/created_at/updated_at）→ 只更新 status。
export async function setStatus(id: string, status: "approved" | "rejected"): Promise<{ err?: string }> {
  await requireAdmin();
  const { error } = await serviceClient().from("submissions").update({ status }).eq("id", id);
  if (error) return { err: error.message };
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
  return {};
}
