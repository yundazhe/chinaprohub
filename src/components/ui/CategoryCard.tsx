import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/database";
import { getLocalizedName, getLocalizedDescription } from "@/lib/locale-fields";

interface CategoryCardProps {
  category: Category;
  locale: string;
  browseText?: string;
}

export default function CategoryCard({ category, locale, browseText = "Browse factories" }: CategoryCardProps) {
  const name = getLocalizedName(category, locale);
  const description = getLocalizedDescription(category, locale);
  const subtitle = locale === "en" ? category.name_zh : (locale === "zh" ? category.name_en : "");

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card group flex flex-col p-5"
    >
      <div className="mb-3 text-3xl">{category.icon || "📦"}</div>
      <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary-600">
        {name}
      </h3>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      )}
      {description && (
        <p className="mt-2 flex-1 text-sm text-slate-600 line-clamp-2">
          {description}
        </p>
      )}
      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary-600">
        <span>{browseText}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
