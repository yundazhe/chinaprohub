import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { dataService } from "@/lib/data";
import RegionCard from "@/components/ui/RegionCard";

export const metadata: Metadata = {
  title: "Industrial Clusters & Regions",
  description: "Explore China's key industrial clusters and manufacturing regions.",
};

export const revalidate = 3600;

export default async function RegionsPage() {
  const regions = await dataService.getAllRegions();

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        <div className="text-center">
          <h1 className="section-title">Industrial Clusters & Regions</h1>
          <p className="section-subtitle mx-auto max-w-2xl">
            Discover where China makes it best. Each cluster specializes in specific
            products with concentrated supply chains.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      </div>
    </div>
  );
}
