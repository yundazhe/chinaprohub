#!/usr/bin/env node
// 创建首个后台管理员账号（app_metadata.role = "admin"）。
// 运行: node scripts/create-admin.mjs 邮箱 密码
// 需要 .env.local 中配置 SUPABASE_SECRET_KEY（服务密钥，仅在此脚本运行时使用，绝不输出）。

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

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
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL) throw new Error("缺少 NEXT_PUBLIC_SUPABASE_URL");
if (!SECRET_KEY) throw new Error("缺少 SUPABASE_SECRET_KEY（Supabase 服务密钥，请在 .env.local 中配置后运行）");

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("用法: node scripts/create-admin.mjs 邮箱 密码");
  process.exit(1);
}
if (password.length < 8) {
  console.error("密码至少 8 位");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SECRET_KEY, { auth: { persistSession: false } });

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  app_metadata: { role: "admin" },
});

if (error) {
  console.error("创建失败:", error.message);
  process.exit(1);
}
console.log(`已创建管理员 ${data.user.id} (${email})`);
