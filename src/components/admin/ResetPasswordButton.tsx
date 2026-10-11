"use client";
import { useTransition } from "react";
import { resetPassword } from "@/app/admin/(dashboard)/users/actions";

// 代重置密码：prompt 输入新密码后调 action（保持简单，未做内联输入框）。
export default function ResetPasswordButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="text-blue-600 hover:underline disabled:opacity-50"
      onClick={() => {
        const pwd = window.prompt("输入新密码（至少 8 位）");
        // 取消 → null；空串同样拦截（客户端 minLength 校验在此不适用）
        if (pwd == null) return;
        if (pwd.length < 8) {
          window.alert("密码至少 8 位");
          return;
        }
        startTransition(async () => {
          const res = await resetPassword(id, pwd);
          window.alert(res?.err ?? "密码已重置");
        });
      }}
    >
      {pending ? "重置中…" : "重置密码"}
    </button>
  );
}
