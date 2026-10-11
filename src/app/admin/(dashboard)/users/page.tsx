import { requireAdmin, resolveRole } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase-server";
import { DeleteButton } from "@/components/admin/DeleteButton";
import ResetPasswordButton from "@/components/admin/ResetPasswordButton";
import UserCreateForm from "@/components/admin/UserCreateForm";
import { removeUser } from "./actions";

export default async function UsersAdmin() {
  const me = await requireAdmin();
  const { data } = await serviceClient().auth.admin.listUsers();
  const users = data?.users ?? [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">管理员账号</h1>
      </div>
      <p className="mb-3 text-xs text-slate-500">
        后台账号基于 Supabase Auth（app_metadata.role 决定权限）。不能删除当前登录的自己；系统至少保留一名管理员。
      </p>
      <div className="mb-8 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-slate-100">
              <th className="px-3 py-2 font-medium">邮箱</th>
              <th className="px-3 py-2 font-medium">角色</th>
              <th className="px-3 py-2 font-medium">创建时间</th>
              <th className="px-3 py-2 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="px-3 py-2">
                  {u.email ?? "—"}
                  {u.id === me.id && <span className="ml-2 text-xs text-slate-400">（当前登录）</span>}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      resolveRole(u.app_metadata) === "admin"
                        ? "bg-primary-100 text-primary-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {resolveRole(u.app_metadata) === "admin" ? "管理员" : "普通用户"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-500">
                  {u.created_at ? new Date(u.created_at).toLocaleString("zh-CN") : "—"}
                </td>
                <td className="space-x-2 whitespace-nowrap px-3 py-2">
                  <ResetPasswordButton id={u.id} />
                  <DeleteButton
                    id={u.id}
                    action={removeUser}
                    confirmText={`确认删除账号「${u.email ?? u.id}」？该账号将无法再登录后台。`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users.length && <p className="px-3 py-6 text-center text-sm text-slate-500">暂无账号</p>}
      </div>

      <h2 className="mb-3 text-lg font-bold">新建账号</h2>
      <UserCreateForm />
    </div>
  );
}
