import { supabase, isSupabaseConfigured } from "./supabase";
import { mockCategories, mockRegions, mockEnterprises } from "@/data/mock";
import type { Category, Region, Enterprise } from "@/types/database";

function useMock(): boolean {
  return !isSupabaseConfigured();
}

export const dataService = {
  async getAllCategories(): Promise<Category[]> {
    if (useMock()) return mockCategories;
    const { data } = await supabase!
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? [];
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (useMock()) return mockCategories.find((c) => c.slug === slug) ?? null;
    const { data } = await supabase!
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();
    return data ?? null;
  },

  async getAllRegions(): Promise<Region[]> {
    if (useMock()) return mockRegions;
    const { data } = await supabase!
      .from("regions")
      .select("*")
      .order("enterprise_count", { ascending: false });
    return data ?? [];
  },

  async getRegionBySlug(slug: string): Promise<Region | null> {
    if (useMock()) return mockRegions.find((r) => r.slug === slug) ?? null;
    const { data } = await supabase!
      .from("regions")
      .select("*")
      .eq("slug", slug)
      .single();
    return data ?? null;
  },

  async getAllEnterprises(options?: {
    limit?: number;
    categoryId?: string;
    regionId?: string;
  }): Promise<Enterprise[]> {
    if (useMock()) {
      let results = mockEnterprises.filter((e) => e.is_active);
      if (options?.categoryId) results = results.filter((e) => e.category_id === options.categoryId);
      if (options?.regionId) results = results.filter((e) => e.region_id === options.regionId);
      if (options?.limit) results = results.slice(0, options.limit);
      return results;
    }
    let query = supabase!.from("enterprises").select("*").eq("is_active", true);
    if (options?.categoryId) query = query.eq("category_id", options.categoryId);
    if (options?.regionId) query = query.eq("region_id", options.regionId);
    if (options?.limit) query = query.limit(options.limit);
    const { data } = await query.order("view_count", { ascending: false });
    return data ?? [];
  },

  async getEnterpriseBySlug(slug: string): Promise<Enterprise | null> {
    if (useMock()) return mockEnterprises.find((e) => e.slug === slug && e.is_active) ?? null;
    const { data } = await supabase!
      .from("enterprises")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    return data ?? null;
  },

  async getEnterprisesByCategory(categorySlug: string): Promise<Enterprise[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];
    return this.getAllEnterprises({ categoryId: category.id });
  },

  async getEnterprisesByRegion(regionSlug: string): Promise<Enterprise[]> {
    const region = await this.getRegionBySlug(regionSlug);
    if (!region) return [];
    return this.getAllEnterprises({ regionId: region.id });
  },

  async incrementViewCount(enterpriseId: string): Promise<void> {
    if (useMock()) return;
    await supabase!
      .from("enterprises")
      .update({ view_count: supabase!.rpc("increment_view_count", { enterprise_id: enterpriseId }) })
      .eq("id", enterpriseId);
  },
};
