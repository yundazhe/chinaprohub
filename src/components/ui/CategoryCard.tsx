import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/database";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card group flex flex-col p-5"
    >
      <div className="mb-3 text-3xl">{category.icon || "📦"}</div>
      <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary-600">
        {category.name_en}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {category.name_zh}
      </p>
      {category.description_en && (
        <p className="mt-2 flex-1 text-sm text-slate-600 line-clamp-2">
          {category.description_en}
        </p>
      )}
      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary-600">
        <span>Browse factories</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
