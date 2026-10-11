"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

// 列表行内附加操作：补翻译（applyTranslation）与 上架/下架（toggleActive）。
// server action 由页面（RSC）作 prop 传入，模式同 DeleteButton。
export function RowActions({
  id,
  active,
  retranslateAction,
  toggleAction,
}: {
  id: string;
  // 当前 is_active；仅传入 toggleAction 时使用。
  active?: boolean;
  retranslateAction: (id: string) => Promise<{ ok?: boolean; err?: string }>;
  // (id, nextActive) => void；缺省则不渲染上/下架按钮（products 无 is_active 列）。
  toggleAction?: (id: string, active: boolean) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <>
      {toggleAction != null && active != null && (
        <button
          type="button"
          disabled={pending}
          className="text-amber-700 hover:underline disabled:opacity-50"
          onClick={() => {
            startTransition(async () => {
              await toggleAction!(id, !active);
              router.refresh();
            });
          }}
        >
          {pending ? "处理中…" : active ? "下架" : "上架"}
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        className="text-blue-600 hover:underline disabled:opacity-50"
        onClick={() => {
          startTransition(async () => {
            const res = await retranslateAction(id);
            if (res?.err) window.alert(res.err);
            else window.alert("翻译已更新");
            router.refresh();
          });
        }}
      >
        {pending ? "处理中…" : "补翻"}
      </button>
    </>
  );
}
