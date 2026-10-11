import { Link } from "@/i18n/routing";
import { MapPin } from "lucide-react";
import type { Enterprise } from "@/types/database";
import CertificationBadge from "./CertificationBadge";

interface EnterpriseCardProps {
  enterprise: Enterprise;
  locale: string;
  categoryName?: string;
  regionName?: string;
  verifiedLabel?: string;
  premiumLabel?: string;
}

export default function EnterpriseCard({
  enterprise,
  locale,
  regionName,
  verifiedLabel = "Verified",
  premiumLabel = "Premium",
}: EnterpriseCardProps) {
  const name = locale === "zh" ? enterprise.name_zh : enterprise.name_en;
  const subtitle = locale === "zh" ? enterprise.name_en : enterprise.name_zh;
  const description = locale === "zh" ? enterprise.description_zh : enterprise.description_en;

  return (
    <Link
      href={`/enterprises/${enterprise.slug}`}
      className="card group p-5"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary-600">
            {name}
          </h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        {enterprise.verification_status === "premium" && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            {premiumLabel}
          </span>
        )}
        {enterprise.verification_status === "verified" && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            {verifiedLabel}
          </span>
        )}
      </div>

      {description && (
        <p className="mb-3 text-sm text-slate-600 line-clamp-2">
          {description}
        </p>
      )}

      <div className="mb-3 flex flex-wrap gap-1.5">
        {enterprise.certifications.slice(0, 4).map((cert) => (
          <CertificationBadge key={cert} certification={cert} />
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        {regionName && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {regionName}
          </span>
        )}
        {enterprise.supports_oem && (
          <span className="rounded bg-primary-50 px-2 py-0.5 text-primary-700">
            OEM/ODM
          </span>
        )}
      </div>
    </Link>
  );
}
