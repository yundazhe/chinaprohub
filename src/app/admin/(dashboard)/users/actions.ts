"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";

// 后台账号即 Supabase Auth 用户（app_metadata.role 区分管理员/普通用户）。
// 表单沿用仓库约定：客户端 onSubmit + FormData 直传（React 18 无 useActionState，不用 prevState 形态）。
export async function createUser(fd: FormData): Promise<{ ok?: boolean; err?: string }> {
  await requireAdmin();
  const email = String(fd.get("email") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  if (!email) return { err: "请填写邮箱" };
  if (password.length < 8) return { err: "密码至少 8 位" };
  const { error } = await serviceClient().auth.admin.createUser({
    email,
    password,
    email_confirm: true, // 后台代建账号：跳过邮箱验证
    app_metadata: { role: fd.get("role") === "admin" ? "admin" : "user" },
  });
  if (error) return { err: error.message };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function removeUser(id: string): Promise<{ err?: string }> {
  const me = await requireAdmin();
  if (me.id === id) return { err: "不能删除自己" };
  const { data } = await serviceClient().auth.admin.listUsers();
  const admins = (data?.users ?? []).filter((u) => u.app_metadata?.role === "admin");
  if (admins.length <= 1) return { err: "至少保留一名管理员" };
  const { error } = await serviceClient().auth.admin.deleteUser(id);
  if (error) return { err: error.message };
  revalidatePath("/admin/users");
  return {};
}

// 管理员代重置密码：service role 直更，无需旧密码。
export async function resetPassword(id: string, password: string): Promise<{ err?: string }> {
  await requireAdmin();
  if (password.length < 8) return { err: "密码至少 8 位" };
  const { error } = await serviceClient().auth.admin.updateUserById(id, { password });
  return error ? { err: error.message } : {};
}
