import { dataService } from "@/lib/data";
import CategoryCard from "@/components/ui/CategoryCard";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600;

export default async function CategoriesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations("categories");
  const tc = await getTranslations("common");

  const categories = await dataService.getAllCategories();

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        <div className="text-center">
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-subtitle mx-auto max-w-2xl">
            {t("subtitle")}
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} locale={locale} browseText={tc("browseFactories")} />
          ))}
        </div>
      </div>
    </div>
  );
}
