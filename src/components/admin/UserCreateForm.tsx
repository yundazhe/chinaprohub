"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, type FormEvent } from "react";
import { createUser } from "@/app/admin/(dashboard)/users/actions";

// 新建后台账号：沿用仓库约定 onSubmit + useTransition（同 settings/forms.tsx，但 action 为纯 FormData 形态）。
export default function UserCreateForm() {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // React 合成事件在异步回调中 currentTarget 会被置空，先持有表单引用
    const form = event.currentTarget;
    const formData = new FormData(form);
    setMsg(null);
    start(async () => {
      const res = await createUser(formData);
      if (res.err) setMsg({ err: res.err });
      else {
        setMsg({ ok: "已创建" });
        form.reset();
        router.refresh();
      }
    });
  }

  const cls = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500";
  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <label className="block space-y-1 text-sm">
        <span>邮箱</span>
        <input name="email" type="email" required autoComplete="off" className={cls} />
      </label>
      <label className="block space-y-1 text-sm">
        <span>初始密码（至少 8 位）</span>
        <input name="password" type="password" minLength={8} required autoComplete="new-password" className={cls} />
      </label>
      <label className="block space-y-1 text-sm">
        <span>角色</span>
        {/* resolveRole 只认 "admin"，其余值一律按普通用户处理 */}
        <select name="role" defaultValue="user" className={cls}>
          <option value="user">普通用户</option>
          <option value="admin">管理员</option>
        </select>
      </label>
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "创建中…" : "创建账号"}
      </button>
      {msg?.ok && <p className="text-sm text-green-700">{msg.ok}</p>}
      {msg?.err && <p className="text-sm text-red-700">{msg.err}</p>}
    </form>
  );
}
