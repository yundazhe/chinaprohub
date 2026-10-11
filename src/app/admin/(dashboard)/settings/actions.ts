"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getTranslateConfig, setTranslateConfig } from "@/lib/settings";
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
  await setTranslateConfig(c);
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
