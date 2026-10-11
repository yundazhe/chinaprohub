import { serviceClient } from "./supabase-server";
import type { TranslateConfig } from "./translation";

async function kv(key: string) {
  const { data } = await serviceClient().from("admin_settings").select("value").eq("key", key).maybeSingle();
  return (data?.value as never) ?? null;
}

export function getTranslateConfig(): Promise<TranslateConfig | null> {
  return kv("translate_config");
}

export async function setTranslateConfig(c: TranslateConfig) {
  await serviceClient().from("admin_settings").upsert({ key: "translate_config", value: c, updated_at: new Date().toISOString() });
}
