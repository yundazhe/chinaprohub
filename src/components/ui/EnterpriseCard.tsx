import Link from "next/link";
import { MapPin, Globe } from "lucide-react";
import type { Enterprise } from "@/types/database";
import CertificationBadge from "./CertificationBadge";

interface EnterpriseCardProps {
  enterprise: Enterprise;
  categoryName?: string;
  regionName?: string;
}

export default function EnterpriseCard({
  enterprise,
  categoryName,
  regionName,
}: EnterpriseCardProps) {
  return (
    <Link
      href={`/enterprises/${enterprise.slug}`}
      className="card group p-5"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary-600">
            {enterprise.name_en}
          </h3>
          <p className="text-sm text-slate-500">{enterprise.name_zh}</p>
        </div>
        {enterprise.verification_status === "premium" && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            Premium
          </span>
        )}
        {enterprise.verification_status === "verified" && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Verified
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
