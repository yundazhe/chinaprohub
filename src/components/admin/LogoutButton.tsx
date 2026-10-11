"use client";

import { logout } from "@/app/admin/login/action";

export default function LogoutButton() {
  return (
    <form action={logout} className="mt-2">
      <button type="submit" className="btn-outline w-full !py-1.5 text-xs">
        退出登录
      </button>
    </form>
  );
}
