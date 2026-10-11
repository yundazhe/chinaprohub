"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Search, SlidersHorizontal, X, MapPin, ChevronDown } from "lucide-react";
import CertificationBadge from "@/components/ui/CertificationBadge";

interface SearchResult {
  id: string;
  slug: string;
  name_en: string;
  name_zh: string;
  description_en?: string;
  category_name?: string;
  region_name?: string;
  certifications: string[];
  verification_status: string;
}

interface FilterOption {
  slug: string;
  name_en: string;
  name_zh: string;
}

interface SearchData {
  hits: SearchResult[];
  total: number;
  processingTimeMs: number;
  query: string;
  categories?: FilterOption[];
  regions?: FilterOption[];
  certifications?: string[];
}

const PAGE_SIZE = 12;

export default function SearchPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const tSearch = useTranslations("search");
  const tCommon = useTranslations("common");
  const tEnterprises = useTranslations("enterprises");

  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [processingTimeMs, setProcessingTimeMs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Filter options
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [regions, setRegions] = useState<FilterOption[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);

  // Selected filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCertification, setSelectedCertification] = useState("");

  // Pagination
  const [offset, setOffset] = useState(0);

  // Mobile filter toggle
  const [showFilters, setShowFilters] = useState(false);

  const isZh = locale === "zh";

  const performSearch = useCallback(
    async (searchQuery: string, searchOffset: number, append: boolean = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("q", searchQuery);
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedRegion) params.set("region", selectedRegion);
        if (selectedCertification) params.set("certification", selectedCertification);
        params.set("limit", PAGE_SIZE.toString());
        params.set("offset", searchOffset.toString());

        const res = await fetch(`/api/search?${params.toString()}`);
        const data: SearchData = await res.json();

        if (append) {
          setResults((prev) => [...prev, ...data.hits]);
        } else {
          setResults(data.hits);
        }
        setTotal(data.total);
        setProcessingTimeMs(data.processingTimeMs);

        // Populate filter options from first request
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
        if (data.regions && data.regions.length > 0) {
          setRegions(data.regions);
        }
        if (data.certifications && data.certifications.length > 0) {
          setCertifications(data.certifications);
        }
      } catch {
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, selectedRegion, selectedCertification]
  );

  // Initial search on mount - show all results
  useEffect(() => {
    performSearch("", 0);
    setHasSearched(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-search when filters change
  useEffect(() => {
    if (!hasSearched) return;
    setOffset(0);
    performSearch(submittedQuery, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedRegion, selectedCertification]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(query);
    setOffset(0);
    setHasSearched(true);
    performSearch(query, 0);
  };

  const handleLoadMore = () => {
    const newOffset = offset + PAGE_SIZE;
    setOffset(newOffset);
    performSearch(submittedQuery, newOffset, true);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedRegion("");
    setSelectedCertification("");
    setQuery("");
    setSubmittedQuery("");
    setOffset(0);
  };

  const hasActiveFilters = selectedCategory || selectedRegion || selectedCertification;
  const canLoadMore = results.length < total;

  return (
    <div className="py-8 sm:py-12">
      <div className="container-custom">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {tSearch("title")}
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mx-auto mb-8 max-w-3xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tSearch("placeholder")}
              className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-28 text-lg text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              {tSearch("searchButton")}
            </button>
          </div>
        </form>

        {/* Mobile filter toggle */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {tSearch("filters")}
            {hasActiveFilters && (
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-700">
                {[selectedCategory, selectedRegion, selectedCertification].filter(Boolean).length}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filter Sidebar */}
          <aside
            className={`w-full shrink-0 lg:sticky lg:top-24 lg:w-64 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  {tSearch("filters")}
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    {tSearch("clearFilters")}
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  {tSearch("category")}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">{tSearch("allCategories")}</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {isZh ? cat.name_zh : cat.name_en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Filter */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  {tSearch("region")}
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">{tSearch("allRegions")}</option>
                  {regions.map((reg) => (
                    <option key={reg.slug} value={reg.slug}>
                      {isZh ? reg.name_zh : reg.name_en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Certification Filter */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  {tSearch("certifications")}
                </label>
                <select
                  value={selectedCertification}
                  onChange={(e) => setSelectedCertification(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="">{tSearch("allCertifications")}</option>
                  {certifications.map((cert) => (
                    <option key={cert} value={cert}>
                      {cert}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Results Area */}
          <div className="min-w-0 flex-1">
            {/* Results Header */}
            {hasSearched && (
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  {loading ? (
                    tCommon("loading")
                  ) : (
                    <>
                      <span className="font-semibold text-slate-900">{total}</span>{" "}
                      {tSearch("results")}
                      {processingTimeMs > 0 && (
                        <span className="ml-2 text-slate-400">
                          ({processingTimeMs}{tSearch("ms")})
                        </span>
                      )}
                    </>
                  )}
                </p>
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                        {categories.find((c) => c.slug === selectedCategory)?.[isZh ? "name_zh" : "name_en"] || selectedCategory}
                        <button onClick={() => setSelectedCategory("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedRegion && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        {regions.find((r) => r.slug === selectedRegion)?.[isZh ? "name_zh" : "name_en"] || selectedRegion}
                        <button onClick={() => setSelectedRegion("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedCertification && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {selectedCertification}
                        <button onClick={() => setSelectedCertification("")}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && results.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              </div>
            )}

            {/* No Results */}
            {hasSearched && !loading && results.length === 0 && (
              <div className="py-20 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="text-lg font-medium text-slate-600">
                  {tSearch("noResults")}
                </p>
              </div>
            )}

            {/* Results Grid */}
            {results.length > 0 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((enterprise) => (
                    <Link
                      key={enterprise.id}
                      href={`/enterprises/${enterprise.slug}`}
                      className="card group p-5"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-primary-600">
                            {enterprise.name_en}
                          </h3>
                          <p className="truncate text-sm text-slate-500">
                            {enterprise.name_zh}
                          </p>
                        </div>
                        {enterprise.verification_status === "premium" && (
                          <span className="ml-2 shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            {tEnterprises("premium")}
                          </span>
                        )}
                        {enterprise.verification_status === "verified" && (
                          <span className="ml-2 shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            {tEnterprises("verified")}
                          </span>
                        )}
                      </div>

                      <p className="mb-3 text-sm text-slate-600 line-clamp-2">
                        {enterprise.description_en}
                      </p>

                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {enterprise.certifications.slice(0, 4).map((cert) => (
                          <CertificationBadge key={cert} certification={cert} />
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {enterprise.region_name && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {enterprise.region_name}
                          </span>
                        )}
                        {enterprise.category_name && (
                          <span className="text-slate-400">
                            {enterprise.category_name}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Load More */}
                {canLoadMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
                    >
                      {loading && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                      )}
                      {tSearch("loadMore")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
