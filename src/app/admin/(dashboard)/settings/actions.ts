"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getTranslateConfig, setTranslateConfig, setSiteConfig, validateBookingUrl } from "@/lib/settings";
import { chatCompletion } from "@/lib/llm";

export type SettingsState = { msg?: string; err?: string; tested?: string };

export async function saveConfig(_prev: SettingsState | null, fd: FormData): Promise<SettingsState> {
  await requireAdmin();
  const c = {
    base_url: String(fd.get("base_url") ?? "").trim(),
    api_key: String(fd.get("api_key") ?? "").trim(),
    model: String(fd.get("model") ?? "").trim(),
  };
  if (!c.base_url || !c.model) return { err: "API 地址与模型名为必填" };
  // api_key 留空则保留旧值（修改 4：掩码不回填表单，此处兜底不覆盖）
  if (!c.api_key) {
    const old = await getTranslateConfig();
    c.api_key = old?.api_key ?? "";
  }
  if (!c.api_key) return { err: "请填写 API Key" };
  const saved = await setTranslateConfig(c);
  if (saved?.err) return { err: "保存失败：" + saved.err };
  revalidatePath("/admin/settings");
  return { msg: "已保存" };
}

export async function testConnection(): Promise<SettingsState> {
  await requireAdmin();
  const c = await getTranslateConfig();
  if (!c) return { err: "尚未保存配置" };
  try {
    await chatCompletion(c, "回复两个字：成功");
    return { tested: `连接成功（模型 ${c.model}）` };
  } catch (e) {
    return { err: `连接失败：${(e as Error).message}` };
  }
}

export async function saveSiteConfig(_prev: SettingsState | null, fd: FormData): Promise<SettingsState> {
  await requireAdmin();
  const c = {
    booking_price: String(fd.get("booking_price") ?? "").trim(),
    booking_url: String(fd.get("booking_url") ?? "").trim(),
  };
  if (!c.booking_price) return { err: "请填写预订价格" };
  const bad = validateBookingUrl(c.booking_url);
  if (bad) return { err: bad };
  const saved = await setSiteConfig(c);
  if (saved?.err) return { err: "保存失败：" + saved.err };
  revalidatePath("/admin/settings");
  // 前台 services/how-it-works 等静态页依赖此配置，需按 layout 失效
  revalidatePath("/", "layout");
  return { msg: "已保存" };
}
