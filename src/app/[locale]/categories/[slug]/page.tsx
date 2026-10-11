import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Building2 } from "lucide-react";
import { dataService } from "@/lib/data";
import EnterpriseCard from "@/components/ui/EnterpriseCard";
import JsonLd from "@/components/seo/JsonLd";
import { getTranslations } from "next-intl/server";
import { getLocalizedName, getLocalizedDescription } from "@/lib/locale-fields";

export const revalidate = 3600;

interface Props {
  params: { slug: string; locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await dataService.getCategoryBySlug(params.slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: getLocalizedName(category, params.locale),
    description: getLocalizedDescription(category, params.locale) || `Browse factories in ${category.name_en}`,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { locale } = params;
  const t = await getTranslations("categories");
  const te = await getTranslations("enterprises");

  const category = await dataService.getCategoryBySlug(params.slug);
  if (!category) {
    return (
      <div className="py-12 sm:py-16">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-slate-900">Category Not Found</h1>
          <Link href="/categories" className="btn-primary mt-6 inline-block">
            {t("allCategories")}
          </Link>
        </div>
      </div>
    );
  }

  const enterprises = await dataService.getEnterprisesByCategory(params.slug);
  const name = getLocalizedName(category, locale);
  const description = getLocalizedDescription(category, locale);
  const subtitle = locale === "en" ? category.name_zh : (locale === "zh" ? category.name_en : "");

  const itemListData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: name,
    itemListElement: enterprises.map((enterprise, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: locale === "zh" ? enterprise.name_zh : enterprise.name_en,
      url: `https://chinaprohub.com/${locale}/enterprises/${enterprise.slug}`,
    })),
  };

  return (
    <div className="py-12 sm:py-16">
      <JsonLd data={itemListData} />
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("allCategories")}
          </Link>
        </nav>

        {/* Category Header */}
        <div className="mb-10">
          <div className="mb-3 text-4xl">{category.icon || "📦"}</div>
          <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
          {subtitle && <p className="mt-1 text-lg text-slate-500">{subtitle}</p>}
          {description && (
            <p className="mt-3 max-w-3xl text-slate-600">{description}</p>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Building2 className="h-4 w-4" />
            <span>{enterprises.length} {t("factoriesListed")}</span>
          </div>
        </div>

        {/* Enterprise List */}
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
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
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
