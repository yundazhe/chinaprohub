import type { Metadata } from "next";
import { dataService } from "@/lib/data";
import EnterpriseCard from "@/components/ui/EnterpriseCard";

export const metadata: Metadata = {
  title: "Enterprise Directory",
  description: "Browse verified Chinese factories. Search by product, region, or certification.",
};

export const revalidate = 3600;

export default async function EnterprisesPage() {
  const [enterprises, categories, regions] = await Promise.all([
    dataService.getAllEnterprises(),
    dataService.getAllCategories(),
    dataService.getAllRegions(),
  ]);

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        <div className="text-center">
          <h1 className="section-title">Enterprise Directory</h1>
          <p className="section-subtitle mx-auto max-w-2xl">
            Browse verified Chinese factories. Each listing includes contact
            information, certifications, and product details.
          </p>
        </div>

        {/* Filter hints */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-slate-500">Filter by:</span>
          {categories.slice(0, 6).map((cat) => (
            <a
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition-colors hover:border-primary-300 hover:text-primary-600"
            >
              {cat.icon} {cat.name_en}
            </a>
          ))}
        </div>

        {/* Enterprise Grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enterprises.map((enterprise) => {
            const category = categories.find((c) => c.id === enterprise.category_id);
            const region = regions.find((r) => r.id === enterprise.region_id);
            return (
              <EnterpriseCard
                key={enterprise.id}
                enterprise={enterprise}
                categoryName={category?.name_en}
                regionName={region?.name_en}
              />
            );
          })}
        </div>

        {enterprises.length === 0 && (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white py-16 text-center">
            <p className="text-slate-500">No enterprises listed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
