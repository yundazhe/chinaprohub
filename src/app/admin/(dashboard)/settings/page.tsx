import { requireAdmin } from "@/lib/auth";
import { getTranslateConfig } from "@/lib/settings";
import { maskSecret } from "@/lib/translation";
import { ConfigForm, TestButton } from "./forms";

export const metadata = { title: "设置 | ChinaProHub 后台" };

export default async function AdminSettingsPage() {
  await requireAdmin();
  const config = await getTranslateConfig();
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
    </div>
  );
}
