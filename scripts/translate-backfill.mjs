#!/usr/bin/env node
// 一次性翻译回填：读取 Supabase 行的中文内容，调 LLM 翻译成 en/es/ar/ru/fr，
// 生成 supabase/backfill-translations.sql（由你手动在 Supabase SQL Editor 执行）。
// 运行: node scripts/translate-backfill.mjs

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const file = join(root, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const LLM_URL = (process.env.DASHSCOPE_BASE_URL || "https://coding.dashscope.aliyuncs.com/v1").replace(/\/$/, "") + "/chat/completions";
const LLM_KEY = process.env.DASHSCOPE_API_KEY;
const MODEL = process.env.TRANSLATE_MODEL || "qwen3.7-plus";

if (!SUPABASE_URL || !ANON_KEY) throw new Error("缺少 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY");
if (!LLM_KEY || LLM_KEY === "PASTE_YOUR_KEY_HERE") {
  throw new Error("缺少 DASHSCOPE_API_KEY，请先在 .env.local 填入真实 Key");
}

const TARGETS = ["en", "es", "ar", "ru", "fr"];

async function fetchTable(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`${table} 读取失败: ${res.status} ${await res.text()}`);
  return res.json();
}

async function translateBatch(items) {
  const prompt = `你是 B2B 采购目录的本地化翻译。将以下内容翻译为 ${TARGETS.join(", ")}。
要求：
- 公司/产品名翻译成目标语言的通行写法（如 "许昌皇冠发制品" → 英文 "Xuchang Crown Hair Products"），保持品牌感
- 描述简洁专业，符合国际买家阅读习惯；阿拉伯语用现代标准阿拉伯语
- ISO9001、CE、FCC、OEM/ODM 等认证缩写不翻译
- 只输出 JSON，不要其他文字。格式: {"<id>":{"name_en":..,"name_es":..,"name_ar":..,"name_ru":..,"name_fr":..,"description_en":..,"description_es":..,"description_ar":..,"description_ru":..,"description_fr":..},"..."}

内容:
${JSON.stringify(items, null, 0)}`;

  const res = await fetch(LLM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${LLM_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });
  if (!res.ok) throw new Error(`LLM 调用失败: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const text = data.choices[0].message.content.replace(/^```(json)?|```$/g, "").trim();
  return JSON.parse(text);
}

function sourceOf(row) {
  return {
    name: row.name_zh || row.name_en,
    description: row.description_zh || row.description_en || "",
  };
}

function needsTranslation(row) {
  return TARGETS.some((l) => !row[`name_${l}`]) ||
    TARGETS.some((l) => (row.description_zh || row.description_en) && !row[`description_${l}`]);
}

const sqlEsc = (s) => `'${String(s).replace(/'/g, "''")}'`;

async function processTable(table) {
  const rows = (await fetchTable(table)).filter(needsTranslation);
  if (rows.length === 0) {
    console.log(`[${table}] 全部已翻译，跳过`);
    return [];
  }
  console.log(`[${table}] 待翻译 ${rows.length} 行`);
  const updates = [];
  const BATCH = 5;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const items = chunk.map((r) => ({ id: String(r.id), ...sourceOf(r) }));
    console.log(`  批次 ${i / BATCH + 1}/${Math.ceil(rows.length / BATCH)} ...`);
    const out = await translateBatch(items);
    for (const r of chunk) {
      const t = out[String(r.id)];
      if (!t) { console.warn(`  行 ${r.id} 无翻译结果，跳过`); continue; }
      const sets = [];
      for (const l of TARGETS) {
        if (t[`name_${l}`] && !r[`name_${l}`]) sets.push(`name_${l} = ${sqlEsc(t[`name_${l}`])}`);
        if (t[`description_${l}`] && !r[`description_${l}`]) sets.push(`description_${l} = ${sqlEsc(t[`description_${l}`])}`);
      }
      if (sets.length) updates.push(`UPDATE ${table} SET ${sets.join(", ")} WHERE id = ${sqlEsc(r.id)};`);
    }
  }
  return updates;
}

let all = [];
for (const table of ["categories", "regions", "enterprises"]) {
  all = all.concat(await processTable(table));
}

if (all.length) {
  const out = join(root, "supabase", "backfill-translations.sql");
  writeFileSync(out, "-- 自动生成：多语言翻译回填（请先执行 migrations/002_localization_columns.sql）\n" + all.join("\n") + "\n", "utf8");
  console.log(`\n完成！已生成 ${out}`);
  console.log("请在 Supabase SQL Editor 中审查并执行该文件。重复运行安全（只翻译空缺字段）。");
} else {
  console.log("\n没有需要翻译的数据。");
}
