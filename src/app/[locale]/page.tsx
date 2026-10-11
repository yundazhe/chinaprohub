import { Link } from "@/i18n/routing";
import { Search, ArrowRight, Building2, MapPin, Factory } from "lucide-react";
import { dataService } from "@/lib/data";
import CategoryCard from "@/components/ui/CategoryCard";
import RegionCard from "@/components/ui/RegionCard";
import EnterpriseCard from "@/components/ui/EnterpriseCard";
import StatsCard from "@/components/ui/StatsCard";

export const revalidate = 3600;

export default async function HomePage() {
  const [categories, regions, enterprises] = await Promise.all([
    dataService.getAllCategories(),
    dataService.getAllRegions(),
    dataService.getAllEnterprises({ limit: 6 }),
  ]);

  const totalCategories = categories.length;
  const totalRegions = regions.length;
  const totalEnterprises = enterprises.length;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-slate-900 py-16 sm:py-24">
        <div className="container-custom text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Made in China,{" "}
            <span className="text-primary-200">Source from the Best.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-primary-100 sm:text-lg">
            A directory of verified source factories across China. Browse by product
            category, industrial cluster, or region. Compare and contact factories
            directly.
          </p>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <Link
              href="/search"
              className="flex items-center gap-3 rounded-xl bg-white px-5 py-3.5 shadow-lg transition-shadow hover:shadow-xl"
            >
              <Search className="h-5 w-5 text-slate-400" />
              <span className="flex-1 text-left text-slate-400">
                Search products, factories, or regions...
              </span>
              <span className="btn-primary text-sm">Search</span>
            </Link>
          </div>

          {/* Popular Searches */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-primary-200">
            <span>Popular:</span>
            {["LED lighting", "Furniture", "Textiles", "Hardware", "Electronics"].map(
              (term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-full border border-primary-400/30 px-3 py-1 transition-colors hover:bg-white/10"
                >
                  {term}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <StatsCard value={totalCategories} label="Product Categories" />
            <StatsCard value={totalRegions} label="Industrial Clusters" />
            <StatsCard value={totalEnterprises} label="Listed Enterprises" />
            <StatsCard value="30+" label="Provinces Covered" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16">
        <div className="container-custom">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">
                Find factories by product type
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden text-sm font-medium text-primary-600 hover:text-primary-700 sm:flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/categories" className="btn-outline text-sm">
              View all categories
            </Link>
          </div>
        </div>
      </section>

      {/* Industrial Clusters Section */}
      <section className="bg-slate-100 py-12 sm:py-16">
        <div className="container-custom">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-title">Key Industrial Clusters</h2>
              <p className="section-subtitle">
                Where China makes it best — by region
              </p>
            </div>
            <Link
              href="/regions"
              className="hidden text-sm font-medium text-primary-600 hover:text-primary-700 sm:flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((region) => (
              <RegionCard key={region.id} region={region} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Enterprises */}
      <section className="py-12 sm:py-16">
        <div className="container-custom">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="section-title">Featured Enterprises</h2>
              <p className="section-subtitle">
                Verified factories ready for your sourcing needs
              </p>
            </div>
            <Link
              href="/enterprises"
              className="hidden text-sm font-medium text-primary-600 hover:text-primary-700 sm:flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enterprises.map((enterprise) => (
              <EnterpriseCard key={enterprise.id} enterprise={enterprise} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-12 sm:py-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Are you a factory owner?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-100">
            List your factory for free on ChinaProHub. Reach international buyers
            actively searching for Chinese suppliers.
          </p>
          <Link
            href="/submit"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg transition-colors hover:bg-primary-50"
          >
            <Factory className="h-4 w-4" />
            List Your Factory — It&apos;s Free
          </Link>
        </div>
      </section>
    </div>
  );
}
