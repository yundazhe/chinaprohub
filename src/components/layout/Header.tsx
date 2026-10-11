import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/categories", label: "Categories" },
  { href: "/regions", label: "Regions" },
  { href: "/enterprises", label: "Enterprises" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-lg font-bold text-white">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-slate-900">
              ChinaProHub
            </span>
            <span className="text-[10px] leading-tight text-slate-500 uppercase tracking-wider">
              Source Factories in China
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search + CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/search"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition-colors hover:border-primary-300 hover:text-primary-600"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Link>
          <Link href="/submit" className="btn-primary text-sm">
            List Your Factory
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
