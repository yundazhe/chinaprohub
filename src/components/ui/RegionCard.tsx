import { Link } from "@/i18n/routing";
import { MapPin } from "lucide-react";
import type { Region } from "@/types/database";
import { getLocalizedName, getLocalizedDescription } from "@/lib/locale-fields";

interface RegionCardProps {
  region: Region;
  locale: string;
}

export default function RegionCard({ region, locale }: RegionCardProps) {
  const name = getLocalizedName(region, locale);
  const description = getLocalizedDescription(region, locale);
  const subtitle = locale === "en" ? region.name_zh : (locale === "zh" ? region.name_en : "");

  return (
    <Link
      href={`/regions/${region.slug}`}
      className="card group p-5"
    >
      <div className="mb-2 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary-500" />
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {region.type}
        </span>
      </div>
      <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary-600">
        {name}
      </h3>
      {subtitle && (
        <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
      )}
      {description && (
        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{description}</p>
      )}
      {region.core_products.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {region.core_products.slice(0, 4).map((product) => (
            <span
              key={product}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600"
            >
              {product}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
