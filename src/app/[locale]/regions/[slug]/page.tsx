import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { ArrowLeft, MapPin, Building2 } from "lucide-react";
import { dataService } from "@/lib/data";
import EnterpriseCard from "@/components/ui/EnterpriseCard";
import { getTranslations } from "next-intl/server";
import { getLocalizedName, getLocalizedDescription } from "@/lib/locale-fields";

export const revalidate = 3600;

interface Props {
  params: { slug: string; locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const region = await dataService.getRegionBySlug(params.slug);
  if (!region) return { title: "Region Not Found" };
  return {
    title: getLocalizedName(region, params.locale),
    description: getLocalizedDescription(region, params.locale) || `Factories in ${region.name_en}`,
  };
}

export default async function RegionDetailPage({ params }: Props) {
  const { locale } = params;
  const t = await getTranslations("regions");
  const te = await getTranslations("enterprises");

  const region = await dataService.getRegionBySlug(params.slug);
  if (!region) {
    return (
      <div className="py-12 sm:py-16">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-slate-900">Region Not Found</h1>
          <Link href="/regions" className="btn-primary mt-6 inline-block">
            {t("allRegions")}
          </Link>
        </div>
      </div>
    );
  }

  const enterprises = await dataService.getEnterprisesByRegion(params.slug);
  const name = getLocalizedName(region, locale);
  const description = getLocalizedDescription(region, locale);
  const subtitle = locale === "en" ? region.name_zh : (locale === "zh" ? region.name_en : "");

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        <nav className="mb-6">
          <Link
            href="/regions"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("allRegions")}
          </Link>
        </nav>

        <div className="mb-10">
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-500" />
            <span className="text-sm font-medium uppercase tracking-wider text-slate-400">
              {region.type}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
          {subtitle && <p className="mt-1 text-lg text-slate-500">{subtitle}</p>}
          {description && (
            <p className="mt-3 max-w-3xl text-slate-600">{description}</p>
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
            <span>{enterprises.length} {t("factoriesInRegion")}</span>
          </div>
        </div>

        {enterprises.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enterprises.map((enterprise) => (
              <EnterpriseCard
                key={enterprise.id}
                enterprise={enterprise}
                locale={locale}
                verifiedLabel={te("verified")}
                premiumLabel={te("premium")}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
            <MapPin className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-medium text-slate-700">
              {t("noFactories")}
            </h3>
            <p className="mt-2 text-slate-500">
              {t("noFactoriesSub")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
