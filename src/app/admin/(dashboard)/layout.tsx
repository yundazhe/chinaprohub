import { requireAdmin } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";

const navItems = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/categories", label: "分类" },
  { href: "/admin/regions", label: "产业带" },
  { href: "/admin/enterprises", label: "企业" },
  { href: "/admin/products", label: "产品" },
  { href: "/admin/submissions", label: "线索" },
  { href: "/admin/users", label: "管理员" },
  { href: "/admin/settings", label: "设置" },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-56 border-r border-slate-200 bg-white p-4">
        <div className="mb-6 font-bold text-slate-900">ChinaProHub 后台</div>
        <nav className="space-y-1 text-sm">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-8 text-xs text-slate-500">{user.email}</div>
        <LogoutButton />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
