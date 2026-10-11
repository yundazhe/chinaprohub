# ChinaProHub Deployment Guide

## Prerequisites

1. **Supabase Project** — Create at https://supabase.com/dashboard
   - Run `supabase/schema.sql` in SQL Editor
   - Copy Project URL and anon key to `.env.local`

2. **Meilisearch Cloud** (optional, for production search) — https://www.meilisearch.com/cloud
   - Create an index named `enterprises`
   - Copy URL and API key to `.env.local`

3. **Vercel Account** — https://vercel.com

## Environment Variables

Set these in Vercel Project Settings > Environment Variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `NEXT_PUBLIC_MEILISEARCH_URL` | No | Meilisearch instance URL |
| `MEILISEARCH_API_KEY` | No | Meilisearch API key |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | No | Plausible domain |
| `NEXT_PUBLIC_ANALYTICS_API` | No | Plausible API host |

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## Cloudflare Setup

1. Add domain to Cloudflare
2. Set nameservers
3. In DNS settings, add CNAME record:
   - Name: `@` → Value: `cname.vercel-dns.com`
   - Name: `www` → Value: `cname.vercel-dns.com`
4. Enable "Always Use HTTPS"
5. Enable "Automatic HTTPS Rewrites"
6. Set SSL/TLS mode to "Full"

## Post-Deployment

1. Submit sitemap to Google Search Console: `https://chinaprohub.com/sitemap.xml`
2. Verify hreflang tags are correct
3. Test all 6 locale versions
4. Set up Supabase database backups

---

# 管理后台（/admin）部署章节

## 1. 新增环境变量

在 Vercel Project Settings > Environment Variables 以及本地 `.env.local` 中新增：

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_SECRET_KEY` | Yes（使用后台时） | Supabase 服务密钥（`sb_secret_` 前缀）。类型必须选 **Secret**，**不要**加 `NEXT_PUBLIC_` 前缀，仅服务端使用，绝不出现在客户端代码或浏览器中 |

## 2. 数据库迁移

在 Supabase Dashboard > SQL Editor 中**按顺序**执行以下迁移脚本：

1. `supabase/migrations/002_localization_columns.sql`
2. `supabase/migrations/003_admin_panel.sql`
3. `supabase/migrations/004_chinese_first_nullable.sql`

> 注意：若 003 曾按旧版执行过，需**重跑新版 003**（新版包含 `admin_settings` 表的 `ENABLE ROW LEVEL SECURITY` 语句——该表启用 RLS 且不建任何 policy，anon/authenticated 均不可访问，仅服务端 Secret Key 可达），并补执行 004 的全部语句（中文优先录入：`name_en`/`slug` 允许为空）。

## 3. 创建首个管理员

在项目根目录运行（脚本自动读取 `.env.local`，需已配置 `NEXT_PUBLIC_SUPABASE_URL` 与 `SUPABASE_SECRET_KEY`）：

```bash
node scripts/create-admin.mjs 邮箱 密码
```

- 密码至少 8 位；成功后输出管理员用户 ID 与邮箱。
- 脚本通过 Supabase Admin API 建号并直接确认邮箱，同时将 `role: "admin"` 写入用户的 `app_metadata`。

## 4. Supabase Auth 设置

- **关闭公开注册**：Supabase Dashboard > Authentication > Sign In / Up 中禁用 Allow new users to sign up（计划二企业门户开放前，非管理员不应能自行注册）。
- 后台路由为 `/admin`（登录页 `/admin/login`）；登录会话由服务端校验，角色判定读取 `app_metadata.role`，未登录访问 `/admin/*` 会被重定向到登录页。

## 5. 翻译配置（DashScope）

管理员登录后进入 `/admin/settings`，填写翻译服务三要素：

| 字段 | 示例 |
|------|------|
| base_url | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| api_key | `sk-` 开头的 DashScope API Key |
| model | `qwen-plus` |

保存后 api_key 以掩码显示，可用「测试连接」按钮验证配置是否可用。配置存储于 `admin_settings` 表（RLS 保护，仅服务端可读）。

**锁字段与「补翻译」行为**：编辑表单中每个多语言字段旁有「锁定」勾选框，勾选后该字段值记入行的 `translation_locks`，后续「同步翻译」不会覆盖它（锁定项跨保存合并累积）。列表中的黄点行表示存在缺失翻译，行内「补翻译」按钮仅翻译并回填**为空**的多语言字段，不覆盖已有值、不覆盖锁定字段。

## 6. 冒烟验收清单（本地 `npm run dev`，逐项验证）

1. 本地 `.env.local` 配 `SUPABASE_SECRET_KEY` → 运行 `node scripts/create-admin.mjs 邮箱 密码`
2. 登录 `/admin/login` → 侧边栏渲染 → 未登录直接访问 `/admin/categories` 被重定向
3. `/admin/settings` 填 DashScope 三要素 → 保存 → 掩码显示 → 测试连接成功
4. 新建分类（只填中文）→ 列表出现英文名（LLM 生成）→ es/ar/ru/fr 有值
5. 编辑该分类改 `name_es` 并勾选锁定 → 修改中文 → 「同步翻译」→ es 不被覆盖，其余更新
6. 分类删除被引用保护：删除有企业引用的分类 → 提示阻止
7. 企业列表：下架 → 前台消失；上架恢复；黄点行「补翻译」
8. 线索标记通过；users 新建/删除自己被阻止
9. 前台 `/zh` `/en` `/es` 抽查新数据各语言显示

部署到 Vercel 后，线上访问 `https://chinaprohub.com/admin/login` 登录并跑通第 3~5 项即可完成线上验证。
