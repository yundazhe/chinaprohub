"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";

const locales = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
  { code: "fr", label: "Français" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLabel = locales.find((l) => l.code === locale)?.label || "English";

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => {
          const newLocale = e.target.value;
          router.replace(pathname, { locale: newLocale });
        }}
        className="appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm text-slate-600 shadow-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
        aria-label="Language"
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <Globe className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
