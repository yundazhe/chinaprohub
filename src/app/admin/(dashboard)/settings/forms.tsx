"use client";

import { useTransition, useState, type FormEvent } from "react";
import { saveConfig, saveSiteConfig, testConnection, type SettingsState } from "./actions";
import type { SiteConfig } from "@/lib/settings";

export function ConfigForm({
  maskedKey,
  config,
}: {
  maskedKey: string;
  config: { base_url: string; model: string } | null;
}) {
  const [state, setState] = useState<SettingsState | null>(null);
  const [pending, start] = useTransition();

  // React 18 无 useActionState：沿用 Task 2 登录页约定，onSubmit + useTransition + useState
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setState(null);
    start(async () => setState(await saveConfig(null, formData)));
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <label className="block space-y-1 text-sm">
        <span>API 地址</span>
        <input name="base_url" defaultValue={config?.base_url} required className="w-full rounded-lg border px-3 py-2" />
      </label>
      <label className="block space-y-1 text-sm">
        <span>模型名</span>
        <input name="model" defaultValue={config?.model} required className="w-full rounded-lg border px-3 py-2" />
      </label>
      <label className="block space-y-1 text-sm">
        <span>
          API Key{maskedKey && `（当前 ${maskedKey}，留空则不修改）`}
        </span>
        {/* 仅展示掩码提示，真实 Key 不回填；type=password 保持为空 */}
        <input name="api_key" type="password" autoComplete="new-password" className="w-full rounded-lg border px-3 py-2" />
      </label>
      <button className="btn-primary" disabled={pending}>
        {pending ? "保存中…" : "保存"}
      </button>
      {state?.msg && <p className="text-sm text-green-700">{state.msg}</p>}
      {state?.err && <p className="text-sm text-red-700">{state.err}</p>}
    </form>
  );
}

export function SiteConfigForm({ config }: { config: SiteConfig }) {
  const [state, setState] = useState<SettingsState | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setState(null);
    start(async () => setState(await saveSiteConfig(null, formData)));
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <label className="block space-y-1 text-sm">
        <span>预订价格（如 US$350）</span>
        <input name="booking_price" defaultValue={config.booking_price} required className="w-full rounded-lg border px-3 py-2" />
      </label>
      <label className="block space-y-1 text-sm">
        <span>PayPal 付款链接（留空则显示邮件联系按钮）</span>
        <input
          name="booking_url"
          type="url"
          placeholder="https://paypal.me/..."
          defaultValue={config.booking_url}
          className="w-full rounded-lg border px-3 py-2"
        />
      </label>
      <button className="btn-primary" disabled={pending}>
        {pending ? "保存中…" : "保存"}
      </button>
      {state?.msg && <p className="text-sm text-green-700">{state.msg}</p>}
      {state?.err && <p className="text-sm text-red-700">{state.err}</p>}
    </form>
  );
}

export function TestButton() {
  const [state, setState] = useState<SettingsState | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => start(async () => setState(await testConnection()))}
        disabled={pending}
        className="rounded-lg border px-4 py-2 text-sm"
      >
        {pending ? "测试中…" : "测试连接"}
      </button>
      {state?.tested && <span className="ml-2 text-sm text-green-700">{state.tested}</span>}
      {state?.err && <span className="ml-2 text-sm text-red-700">{state.err}</span>}
    </div>
  );
}
