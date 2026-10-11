"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");

  const footerLinks = {
    browse: [
      { label: tn("home"), href: "/" as const },
      { label: tn("categories"), href: "/categories" as const },
      { label: tn("enterprises"), href: "/enterprises" as const },
    ],
    about: [
      { label: tn("howItWorks"), href: "/how-it-works" as const },
      { label: tn("services"), href: "/services" as const },
      { label: t("aboutUs"), href: "/about" as const },
      { label: t("contact"), href: "/about#contact" as const },
    ],
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container-custom py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
                C
              </div>
              <span className="text-lg font-bold text-white">{tc("siteName")}</span>
            </div>
            <p className="text-sm text-slate-400">
              {t("description")}
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-200">
              {t("browse")}
            </h4>
            <ul className="space-y-2">
              {footerLinks.browse.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-200">
              {t("about")}
            </h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-200">
              {t("contactLabel")}
            </h4>
            <p className="text-sm text-slate-400">
              {t("contactDesc")}
            </p>
            <a
              href="mailto:info@chinaprohub.com"
              className="mt-2 block text-sm text-primary-400 hover:text-primary-300"
            >
              info@chinaprohub.com
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {tc("siteName")}. {t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
