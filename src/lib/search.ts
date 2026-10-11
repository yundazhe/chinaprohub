import { Meilisearch } from "meilisearch";

const meilisearchUrl = process.env.NEXT_PUBLIC_MEILISEARCH_URL;
const meilisearchKey = process.env.MEILISEARCH_API_KEY;

export const meilisearch = meilisearchUrl && meilisearchKey
  ? new Meilisearch({ host: meilisearchUrl, apiKey: meilisearchKey })
  : null;

export function isMeilisearchConfigured(): boolean {
  return !!meilisearch;
}

export interface SearchResult {
  id: string;
  slug: string;
  name_en: string;
  name_zh: string;
  description_en?: string;
  category_name?: string;
  region_name?: string;
  certifications: string[];
  verification_status: string;
  _formatted?: Record<string, string>;
}

export interface FilterOption {
  slug: string;
  name_en: string;
  name_zh: string;
}

export interface SearchResponse {
  hits: SearchResult[];
  total: number;
  processingTimeMs: number;
  query: string;
  categories?: FilterOption[];
  regions?: FilterOption[];
  certifications?: string[];
}

// Mock search for when Meilisearch is not configured
const mockEnterprises = async () => {
  const { mockEnterprises: enterprises, mockCategories, mockRegions } = await import("@/data/mock");
  return { enterprises, categories: mockCategories, regions: mockRegions };
};

export async function searchEnterprises(
  query: string,
  options?: {
    category?: string;
    region?: string;
    certification?: string;
    limit?: number;
    offset?: number;
  }
): Promise<SearchResponse> {
  if (!isMeilisearchConfigured()) {
    // Mock search
    const { enterprises, categories, regions } = await mockEnterprises();
    const q = query.toLowerCase();
    const results = enterprises.filter((e) => {
      if (!e.is_active) return false;
      const matchesQuery = !q ||
        e.name_en.toLowerCase().includes(q) ||
        e.name_zh.includes(query) ||
        (e.description_en?.toLowerCase().includes(q)) ||
        (e.description_zh?.includes(query));
      if (!matchesQuery) return false;
      if (options?.category) {
        const cat = categories.find((c) => c.slug === options.category);
        if (cat && e.category_id !== cat.id) return false;
      }
      if (options?.region) {
        const reg = regions.find((r) => r.slug === options.region);
        if (reg && e.region_id !== reg.id) return false;
      }
      if (options?.certification && !e.certifications.includes(options.certification)) {
        return false;
      }
      return true;
    });
    const offset = options?.offset || 0;
    const limit = options?.limit || 20;
    // Collect unique certifications from active enterprises
    const allCertifications = new Set<string>();
    enterprises.forEach((e) => {
      if (e.is_active) e.certifications.forEach((c) => allCertifications.add(c));
    });

    return {
      hits: results.slice(offset, offset + limit).map((e) => ({
        id: e.id,
        slug: e.slug,
        name_en: e.name_en,
        name_zh: e.name_zh,
        description_en: e.description_en,
        category_name: categories.find((c) => c.id === e.category_id)?.name_en,
        region_name: regions.find((r) => r.id === e.region_id)?.name_en,
        certifications: e.certifications,
        verification_status: e.verification_status,
      })),
      total: results.length,
      processingTimeMs: 1,
      query,
      categories: categories.map((c) => ({ slug: c.slug, name_en: c.name_en, name_zh: c.name_zh })),
      regions: regions.map((r) => ({ slug: r.slug, name_en: r.name_en, name_zh: r.name_zh })),
      certifications: Array.from(allCertifications).sort(),
    };
  }

  const index = meilisearch!.index("enterprises");
  const result = await index.search(query, {
    limit: options?.limit || 20,
    offset: options?.offset || 0,
    filter: [
      options?.category ? `category_slug = ${options.category}` : null,
      options?.region ? `region_slug = ${options.region}` : null,
      options?.certification ? `certifications = ${options.certification}` : null,
    ].filter(Boolean) as string[],
    attributesToHighlight: ["name_en", "name_zh", "description_en"],
  });

  return {
    hits: result.hits as SearchResult[],
    total: result.estimatedTotalHits || 0,
    processingTimeMs: result.processingTimeMs,
    query,
  };
}
