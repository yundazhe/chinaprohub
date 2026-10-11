-- 中文优先录入：name_en/slug 由保存后自动翻译回填，插入时允许为空
ALTER TABLE categories ALTER COLUMN name_en DROP NOT NULL;
ALTER TABLE categories ALTER COLUMN slug      DROP NOT NULL;
ALTER TABLE regions    ALTER COLUMN name_en DROP NOT NULL;
ALTER TABLE regions    ALTER COLUMN slug      DROP NOT NULL;
ALTER TABLE enterprises ALTER COLUMN name_en DROP NOT NULL;
ALTER TABLE enterprises ALTER COLUMN slug     DROP NOT NULL;
ALTER TABLE products    ALTER COLUMN name_en DROP NOT NULL;
