import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dataService } from "@/lib/data";
import EnterpriseGridWithFilter from "@/components/ui/EnterpriseGridWithFilter";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "enterprises",
  });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function EnterprisesPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "enterprises" });

  const [enterprises, categories, regions] = await Promise.all([
    dataService.getAllEnterprises(),
    dataService.getAllCategories(),
    dataService.getAllRegions(),
  ]);

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        <div className="text-center">
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-subtitle mx-auto max-w-2xl">
            {t("subtitle")}
          </p>
        </div>

        <EnterpriseGridWithFilter
          enterprises={enterprises}
          categories={categories}
          regions={regions}
        />
      </div>
    </div>
  );
}
