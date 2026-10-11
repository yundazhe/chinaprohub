import { dataService } from "@/lib/data";
import RegionCard from "@/components/ui/RegionCard";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600;

export default async function RegionsPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations("regions");

  const regions = await dataService.getAllRegions();

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        <div className="text-center">
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-subtitle mx-auto max-w-2xl">
            {t("subtitle")}
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region) => (
            <RegionCard key={region.id} region={region} locale={locale} />
          ))}
        </div>
      </div>
    </div>
  );
}
