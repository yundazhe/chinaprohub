import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { dataService } from "@/lib/data";
import EnterpriseCard from "@/components/ui/EnterpriseCard";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await dataService.getCategoryBySlug(params.slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name_en,
    description: category.description_en || `Browse factories in ${category.name_en}`,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const category = await dataService.getCategoryBySlug(params.slug);
  if (!category) notFound();

  const enterprises = await dataService.getEnterprisesByCategory(params.slug);

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            All Categories
          </Link>
        </nav>

        {/* Category Header */}
        <div className="mb-10">
          <div className="mb-3 text-4xl">{category.icon || "📦"}</div>
          <h1 className="text-3xl font-bold text-slate-900">{category.name_en}</h1>
          <p className="mt-1 text-lg text-slate-500">{category.name_zh}</p>
          {category.description_en && (
            <p className="mt-3 max-w-3xl text-slate-600">{category.description_en}</p>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Building2 className="h-4 w-4" />
            <span>{enterprises.length} factories listed</span>
          </div>
        </div>

        {/* Enterprise List */}
        {enterprises.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enterprises.map((enterprise) => (
              <EnterpriseCard key={enterprise.id} enterprise={enterprise} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-medium text-slate-700">
              No factories listed yet
            </h3>
            <p className="mt-2 text-slate-500">
              Factories in this category are being added. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
