"use client";

import { useTransition, useState, type FormEvent } from "react";
import { login } from "./action";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
      // 成功时服务端 login 内部 redirect("/admin")
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="card w-full max-w-sm p-8">
        <h1 className="mb-1 text-xl font-bold text-slate-900">ChinaProHub 后台登录</h1>
        <p className="mb-6 text-sm text-slate-500">仅限管理员账号访问</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              邮箱
            </label>
            <input id="email" name="email" type="email" required autoComplete="username" className="input-field" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="input-field"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={isPending} className="btn-primary w-full disabled:opacity-60">
            {isPending ? "登录中…" : "登录后台"}
          </button>
        </form>
      </div>
    </div>
  );
}
