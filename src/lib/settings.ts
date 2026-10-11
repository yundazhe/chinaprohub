import { serviceClient } from "./supabase-server";
import type { TranslateConfig } from "./translation";

async function kv(key: string) {
  const { data } = await serviceClient().from("admin_settings").select("value").eq("key", key).maybeSingle();
  return (data?.value as never) ?? null;
}

export function getTranslateConfig(): Promise<TranslateConfig | null> {
  return kv("translate_config");
}

export async function setTranslateConfig(c: TranslateConfig): Promise<{ err?: string }> {
  const { error } = await serviceClient().from("admin_settings").upsert({ key: "translate_config", value: c, updated_at: new Date().toISOString() });
  return error ? { err: error.message } : {};
}

export type SiteConfig = {
  booking_price: string;
  booking_url: string;
};

export const DEFAULT_SITE_CONFIG: SiteConfig = { booking_price: "US$350", booking_url: "" };

export function mergeSiteConfig(stored: unknown): SiteConfig {
  const out = { ...DEFAULT_SITE_CONFIG };
  if (stored && typeof stored === "object") {
    for (const k of Object.keys(out) as (keyof SiteConfig)[]) {
      const v = (stored as Record<string, unknown>)[k];
      if (typeof v === "string") out[k] = v;
    }
  }
  return out;
}

export function validateBookingUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (!/^https?:\/\/\S+$/i.test(url)) return "链接必须以 http:// 或 https:// 开头";
  return undefined;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  return mergeSiteConfig(await kv("site_config"));
}

export async function setSiteConfig(c: SiteConfig): Promise<{ err?: string }> {
  const { error } = await serviceClient().from("admin_settings").upsert({ key: "site_config", value: c, updated_at: new Date().toISOString() });
  return error ? { err: error.message } : {};
}
