import { MetadataRoute } from "next";
import { dataService } from "@/lib/data";

const BASE_URL = "https://chinaprohub.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, regions, enterprises] = await Promise.all([
    dataService.getAllCategories(),
    dataService.getAllRegions(),
    dataService.getAllEnterprises(),
  ]);

  const locales = ["en", "zh", "es", "ar", "ru", "fr"];

  const staticPages = ["", "/categories", "/regions", "/enterprises", "/search", "/submit", "/about"];

  const urls: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      urls.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    }
  }

  // Dynamic pages
  for (const locale of locales) {
    for (const cat of categories) {
      urls.push({
        url: `${BASE_URL}/${locale}/categories/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    for (const region of regions) {
      urls.push({
        url: `${BASE_URL}/${locale}/regions/${region.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    for (const ent of enterprises) {
      urls.push({
        url: `${BASE_URL}/${locale}/enterprises/${ent.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return urls;
}
