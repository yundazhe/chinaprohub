"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase-server";

export async function login(formData: FormData): Promise<{ error?: string }> {
  const supabase = serverSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error) return { error: "邮箱或密码错误" };
  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await serverSupabase().auth.signOut();
  redirect("/admin/login");
}
