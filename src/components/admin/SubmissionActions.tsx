"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

// 线索行内操作：通过/拒绝（已是目标状态则不渲染对应按钮）。
// server action 由 RSC 列表页作 prop 传入，模式同 RowActions/DeleteButton。
export default function SubmissionActions({
  id,
  status,
  setStatusAction,
}: {
  id: string;
  status: string;
  setStatusAction: (id: string, status: "approved" | "rejected") => Promise<{ err?: string }>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(next: "approved" | "rejected") {
    startTransition(async () => {
      const res = await setStatusAction(id, next);
      if (res?.err) window.alert(res.err);
      else router.refresh();
    });
  }

  return (
    <>
      {status !== "approved" && (
        <button
          type="button"
          disabled={pending}
          className="text-green-700 hover:underline disabled:opacity-50"
          onClick={() => run("approved")}
        >
          {pending ? "处理中…" : "通过"}
        </button>
      )}
      {status !== "rejected" && (
        <button
          type="button"
          disabled={pending}
          className="text-red-600 hover:underline disabled:opacity-50"
          onClick={() => run("rejected")}
        >
          {pending ? "处理中…" : "拒绝"}
        </button>
      )}
    </>
  );
}
