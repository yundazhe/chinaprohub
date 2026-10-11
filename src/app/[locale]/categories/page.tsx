import type { Metadata } from "next";
import { dataService } from "@/lib/data";
import CategoryCard from "@/components/ui/CategoryCard";

export const metadata: Metadata = {
  title: "Product Categories",
  description: "Browse Chinese factories by product category. Find verified suppliers across all major industries.",
};

export const revalidate = 3600;

export default async function CategoriesPage() {
  const categories = await dataService.getAllCategories();

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        <div className="text-center">
          <h1 className="section-title">Product Categories</h1>
          <p className="section-subtitle mx-auto max-w-2xl">
            Browse factories by product type. From hardware and electronics to
            textiles and food — find the right supplier for your needs.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
