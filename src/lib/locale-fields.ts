/**
 * Helper to get localized field values from database records.
 * Database stores name_en, name_zh, name_es, name_ar, name_ru, name_fr etc.
 * This helper picks the right field based on current locale.
 */

type LocalizedRecord = {
  name_en: string;
  name_zh?: string;
  name_es?: string;
  name_ar?: string;
  name_ru?: string;
  name_fr?: string;
  description_en?: string;
  description_zh?: string;
  description_es?: string;
  description_ar?: string;
  description_ru?: string;
  description_fr?: string;
};

export function getLocalizedName(record: LocalizedRecord, locale: string): string {
  const key = `name_${locale}` as keyof LocalizedRecord;
  return (record[key] as string) || record.name_en;
}

export function getLocalizedDescription(record: LocalizedRecord, locale: string): string {
  const key = `description_${locale}` as keyof LocalizedRecord;
  return (record[key] as string) || record.description_en || "";
}
