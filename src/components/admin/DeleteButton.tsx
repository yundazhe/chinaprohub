"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function DeleteButton({
  id,
  action,
  confirmText,
}: {
  id: string;
  // 由服务端组件传入的 per-entity server action（Next 14 允许 server action 作为 prop 传给 client 组件）
  action: (id: string) => Promise<{ err?: string }>;
  // 自定义确认文案（如企业删除提示级联产品数）；缺省沿用通用文案。
  confirmText?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="text-red-600 hover:underline disabled:opacity-50"
      onClick={() => {
        if (!window.confirm(confirmText ?? "确认删除该记录？此操作不可撤销。")) return;
        startTransition(async () => {
          const res = await action(id);
          if (res?.err) window.alert(res.err);
          else router.refresh();
        });
      }}
    >
      {pending ? "删除中…" : "删除"}
    </button>
  );
}
