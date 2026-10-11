import { redirect } from "next/navigation";
import { serverSupabase } from "./supabase-server";

export type SessionUser = { id: string; email: string; role: "admin" | "user" };

export function resolveRole(appMetadata: unknown): "admin" | "user" {
  const m = appMetadata as { role?: string } | null;
  return m?.role === "admin" ? "admin" : "user";
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = serverSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email ?? "", role: resolveRole(user.app_metadata) };
}

export async function requireAdmin(): Promise<SessionUser> {
  const u = await getSessionUser();
  if (!u || u.role !== "admin") redirect("/admin/login");
  return u;
}
