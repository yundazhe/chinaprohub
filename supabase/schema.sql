-- ============================================================
-- ChinaProHub Database Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Table: categories
-- ============================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_es TEXT,
  name_ar TEXT,
  name_ru TEXT,
  name_fr TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  description_en TEXT,
  description_zh TEXT,
  enterprise_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ============================================================
-- Table: regions
-- ============================================================
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_es TEXT,
  name_ar TEXT,
  name_ru TEXT,
  name_fr TEXT,
  type TEXT NOT NULL CHECK (type IN ('province', 'city', 'cluster')),
  parent_id UUID REFERENCES regions(id) ON DELETE SET NULL,
  core_products JSONB DEFAULT '[]'::jsonb,
  description_en TEXT,
  description_zh TEXT,
  enterprise_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_regions_slug ON regions(slug);
CREATE INDEX idx_regions_type ON regions(type);

-- ============================================================
-- Table: enterprises
-- ============================================================
CREATE TABLE enterprises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
  description_en TEXT,
  description_zh TEXT,
  established_year INTEGER,
  employee_range TEXT,
  factory_area_sqm INTEGER,
  certifications JSONB DEFAULT '[]'::jsonb,
  export_markets JSONB DEFAULT '[]'::jsonb,
  moq_text TEXT,
  supports_oem BOOLEAN DEFAULT false,
  contact_whatsapp TEXT,
  contact_email TEXT,
  contact_website TEXT,
  logo_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'premium')),
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enterprises_slug ON enterprises(slug);
CREATE INDEX idx_enterprises_category ON enterprises(category_id);
CREATE INDEX idx_enterprises_region ON enterprises(region_id);
CREATE INDEX idx_enterprises_active ON enterprises(is_active);
CREATE INDEX idx_enterprises_verification ON enterprises(verification_status);

-- ============================================================
-- Table: products
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enterprise_id UUID REFERENCES enterprises(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  hs_code TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_enterprise ON products(enterprise_id);
CREATE INDEX idx_products_category ON products(category_id);

-- ============================================================
-- Table: submissions
-- ============================================================
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  products_text TEXT,
  region_text TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_status ON submissions(status);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Public can read active enterprises, all categories, all regions, all products
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view regions" ON regions FOR SELECT USING (true);
CREATE POLICY "Public can view active enterprises" ON enterprises FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);

-- Anyone can submit (for the self-submission form)
CREATE POLICY "Anyone can create submissions" ON submissions FOR INSERT WITH CHECK (true);

-- Authenticated users (admins) can do everything
-- (Supabase service role key bypasses RLS entirely for admin operations)
