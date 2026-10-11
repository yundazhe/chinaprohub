import { chatCompletion } from "./llm";
import { getTranslateConfig } from "./settings";
import { serviceClient } from "./supabase-server";

export const TARGET_LOCALES = ["en", "es", "ar", "ru", "fr"];
export const NAME_COLS = ["name_es", "name_ar", "name_ru", "name_fr"];
export type TranslateConfig = { base_url: string; api_key: string; model: string };

export function maskSecret(key: string): string {
  return key.length > 8 ? `${key.slice(0, 3)}***${key.slice(-4)}` : "***";
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function fieldsToTranslate(row: Record<string, unknown>, locales = TARGET_LOCALES): string[] {
  const locks = new Set((row.translation_locks as string[] | undefined) ?? []);
  const hasName = !!(row.name_zh ?? row.name_en);
  const hasDesc = !!(row.description_zh ?? row.description_en);
  const cols: string[] = [];
  for (const l of locales) {
    if (l !== "en" && hasName && !row[`name_${l}`] && !locks.has(`name_${l}`)) cols.push(`name_${l}`);
    if (hasDesc && !row[`description_${l}`] && !locks.has(`description_${l}`)) cols.push(`description_${l}`);
  }
  if (hasName && !row.name_en && !locks.has("name_en")) cols.unshift("name_en");
  return cols;
}

export function buildPrompt(
  items: { id: string; name: string; description: string }[], locales: string[]
): string {
  return `你是 B2B 采购目录的本地化翻译。将以下内容翻译为 ${locales.join(", ")}。
要求：公司/品牌名用目标语言通行写法且保持品牌感；描述简洁专业；ISO9001、CE、FCC、RoHS、OEM/ODM 等缩写不翻译；阿拉伯语用现代标准阿拉伯语。
只输出 JSON，格式 {"<id>":{"name_en":..,"name_es":..,...,"description_fr":..}}，仅输出请求所需的键。
内容: ${JSON.stringify(items)}`;
}

export function parseLlmJson(raw: string): Record<string, Record<string, string>> {
  const cleaned = raw.replace(/^```(json)?\s*|```$/g, "").trim();
  const start = cleaned.indexOf("{");
  const obj = JSON.parse(cleaned.slice(start));
  if (typeof obj !== "object" || obj === null) throw new Error("LLM JSON invalid");
  return obj;
}

export async function translateRow(
  config: TranslateConfig, _table: string, row: Record<string, unknown>
): Promise<Record<string, string>> {
  const cols = fieldsToTranslate(row);
  if (!cols.length) return {};
  const locales = Array.from(new Set(cols.map((c) => c.split("_").pop()!)));
  const items = [{ id: String(row.id), name: (row.name_zh ?? row.name_en) as string,
                   description: ((row.description_zh ?? row.description_en) as string) ?? "" }];
  const patch: Record<string, string> = {};
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const out = parseLlmJson(await chatCompletion(config, buildPrompt(items, locales)));
      const rec = out[String(row.id)] ?? {};
      for (const col of cols) if (rec[col]) patch[col] = rec[col];
      break;
    } catch (e) { if (attempt === 1) console.error("translation failed", e); }
  }
  return patch;
}

export async function applyTranslation(
  table: string, row: Record<string, unknown>, configOverride?: TranslateConfig | null
): Promise<Record<string, string>> {
  const config = configOverride ?? await getTranslateConfig();
  if (!config?.api_key) return {};
  const patch = await translateRow(config, table, row);
  if (Object.keys(patch).length) {
    const { error } = await serviceClient().from(table).update(patch).eq("id", row.id as string);
    if (error) console.error("translation persist failed", table, error.message);
  }
  return patch;
}
