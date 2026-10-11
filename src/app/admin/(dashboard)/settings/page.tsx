import { requireAdmin } from "@/lib/auth";
import { getTranslateConfig, getSiteConfig } from "@/lib/settings";
import { maskSecret } from "@/lib/translation";
import { ConfigForm, SiteConfigForm, TestButton } from "./forms";

export const metadata = { title: "设置 | ChinaProHub 后台" };

export default async function AdminSettingsPage() {
  await requireAdmin();
  const config = await getTranslateConfig();
  const site = await getSiteConfig();
  // 真实 api_key 仅在服务端参与掩码计算，绝不渲染原文
  const maskedKey = config?.api_key ? maskSecret(config.api_key) : "";

  return (
    <div className="card space-y-4 p-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">设置</h1>
        <p className="mt-1 text-sm text-slate-500">翻译 API（OpenAI 兼容 Chat Completions）配置，供企业/产品多语言翻译使用。</p>
      </div>
      <ConfigForm
        maskedKey={maskedKey}
        config={config ? { base_url: config.base_url, model: config.model } : null}
      />
      <TestButton />

      <div className="border-t border-slate-200 pt-6">
        <h2 className="text-lg font-bold text-slate-900">门户预订设置</h2>
        <p className="mt-1 text-sm text-slate-500">前台「服务」页预订展示块的价格与 PayPal 付款链接，保存后前台自动更新。</p>
        <div className="mt-4">
          <SiteConfigForm config={site} />
        </div>
      </div>
    </div>
  );
}
