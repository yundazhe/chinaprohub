import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ArrowLeft, MapPin, Building2 } from "lucide-react";
import { dataService } from "@/lib/data";
import EnterpriseCard from "@/components/ui/EnterpriseCard";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = await dataService.getRegionBySlug(params.slug);
  if (!region) return { title: "Region Not Found" };
  return {
    title: region.name_en,
    description: region.description_en || `Factories in ${region.name_en}`,
  };
}

export default async function RegionDetailPage({ params }: Props) {
  const region = await dataService.getRegionBySlug(params.slug);
  if (!region) notFound();

  const enterprises = await dataService.getEnterprisesByRegion(params.slug);

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        <nav className="mb-6">
          <Link
            href="/regions"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            All Regions
          </Link>
        </nav>

        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-500" />
            <span className="text-sm font-medium uppercase tracking-wider text-slate-400">
              {region.type}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{region.name_en}</h1>
          <p className="mt-1 text-lg text-slate-500">{region.name_zh}</p>
          {region.description_en && (
            <p className="mt-3 max-w-3xl text-slate-600">{region.description_en}</p>
          )}
          {region.core_products.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {region.core_products.map((product) => (
                <span
                  key={product}
                  className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700"
                >
                  {product}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Building2 className="h-4 w-4" />
            <span>{enterprises.length} factories in this region</span>
          </div>
        </div>

        {enterprises.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enterprises.map((enterprise) => (
              <EnterpriseCard key={enterprise.id} enterprise={enterprise} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
            <MapPin className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-medium text-slate-700">
              No factories listed yet
            </h3>
            <p className="mt-2 text-slate-500">
              Factories in this region are being added. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
