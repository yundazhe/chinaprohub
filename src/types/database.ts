export interface Category {
  id: string;
  slug: string;
  name_en: string;
  name_zh: string;
  name_es?: string;
  name_ar?: string;
  name_ru?: string;
  name_fr?: string;
  parent_id?: string;
  icon?: string;
  sort_order: number;
  description_en?: string;
  description_zh?: string;
  description_es?: string;
  description_ar?: string;
  description_ru?: string;
  description_fr?: string;
  translation_locks?: string[];
  enterprise_count: number;
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: string;
  slug: string;
  name_en: string;
  name_zh: string;
  name_es?: string;
  name_ar?: string;
  name_ru?: string;
  name_fr?: string;
  type: "province" | "city" | "cluster";
  parent_id?: string;
  core_products: string[];
  description_en?: string;
  description_zh?: string;
  description_es?: string;
  description_ar?: string;
  description_ru?: string;
  description_fr?: string;
  translation_locks?: string[];
  enterprise_count: number;
  created_at: string;
  updated_at: string;
}

export type VerificationStatus = "unverified" | "verified" | "premium";

export interface Enterprise {
  id: string;
  slug: string;
  name_en: string;
  name_zh: string;
  name_es?: string;
  name_ar?: string;
  name_ru?: string;
  name_fr?: string;
  category_id?: string;
  region_id?: string;
  description_en?: string;
  description_zh?: string;
  description_es?: string;
  description_ar?: string;
  description_ru?: string;
  description_fr?: string;
  translation_locks?: string[];
  owner_user_id?: string | null;
  status: "draft" | "pending" | "approved" | "rejected";
  pending_changes?: Record<string, string> | null;
  review_note?: string | null;
  established_year?: number;
  employee_range?: string;
  factory_area_sqm?: number;
  certifications: string[];
  export_markets: string[];
  moq_text?: string;
  supports_oem: boolean;
  contact_whatsapp?: string;
  contact_email?: string;
  contact_website?: string;
  logo_url?: string;
  images: string[];
  verification_status: VerificationStatus;
  view_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  enterprise_id: string;
  name_en: string;
  name_zh: string;
  name_es?: string;
  name_ar?: string;
  name_ru?: string;
  name_fr?: string;
  translation_locks?: string[];
  category_id?: string;
  hs_code?: string;
  specifications: Record<string, string>;
  images: string[];
  created_at: string;
  updated_at: string;
}

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Submission {
  id: string;
  status: SubmissionStatus;
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  products_text?: string;
  region_text?: string;
  message?: string;
  created_at: string;
  updated_at: string;
}
