ALTER TABLE enterprises
  ADD COLUMN IF NOT EXISTS owner_user_id UUID,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS pending_changes JSONB,
  ADD COLUMN IF NOT EXISTS review_note TEXT,
  ADD COLUMN IF NOT EXISTS translation_locks JSONB DEFAULT '[]';
ALTER TABLE categories ADD COLUMN IF NOT EXISTS translation_locks JSONB DEFAULT '[]';
ALTER TABLE regions    ADD COLUMN IF NOT EXISTS translation_locks JSONB DEFAULT '[]';
ALTER TABLE products   ADD COLUMN IF NOT EXISTS translation_locks JSONB DEFAULT '[]';
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS name_es TEXT,
  ADD COLUMN IF NOT EXISTS name_ar TEXT,
  ADD COLUMN IF NOT EXISTS name_ru TEXT,
  ADD COLUMN IF NOT EXISTS name_fr TEXT;

CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
-- 启用 RLS 且不建任何 policy：anon/authenticated 均不可访问，仅服务端 Secret Key（service role）可达

CREATE INDEX IF NOT EXISTS idx_enterprises_owner ON enterprises(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_enterprises_status ON enterprises(status);

INSERT INTO admin_settings (key, value) VALUES
  ('portal_config', '{"max_enterprises_per_user": 1, "target_locales": ["en","es","ar","ru","fr"]}')
ON CONFLICT (key) DO NOTHING;
