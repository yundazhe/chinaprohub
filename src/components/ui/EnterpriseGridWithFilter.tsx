"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import EnterpriseCard from "./EnterpriseCard";
import type { Enterprise, Category, Region } from "@/types/database";

interface EnterpriseGridWithFilterProps {
  enterprises: Enterprise[];
  categories: Category[];
  regions: Region[];
}

export default function EnterpriseGridWithFilter({
  enterprises,
  categories,
  regions,
}: EnterpriseGridWithFilterProps) {
  const t = useTranslations("enterprises");
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const allCertifications = useMemo(() => {
    const certSet = new Set<string>();
    for (const enterprise of enterprises) {
      for (const cert of enterprise.certifications) {
        certSet.add(cert);
      }
    }
    return Array.from(certSet).sort();
  }, [enterprises]);

  const filteredEnterprises = useMemo(() => {
    if (!selectedCert) return enterprises;
    return enterprises.filter((e) =>
      e.certifications.includes(selectedCert)
    );
  }, [enterprises, selectedCert]);

  const handleCertClick = (cert: string) => {
    setSelectedCert((prev) => (prev === cert ? null : cert));
  };

  return (
    <>
      {/* Certification Filter */}
      <div className="mt-8">
        <p className="mb-3 text-center text-sm font-medium text-slate-600">
          {t("filterByCert")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCert(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCert === null
                ? "bg-primary-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-600"
            }`}
          >
            {t("allCerts")}
          </button>
          {allCertifications.map((cert) => (
            <button
              key={cert}
              onClick={() => handleCertClick(cert)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedCert === cert
                  ? "bg-primary-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-600"
              }`}
            >
              {cert}
            </button>
          ))}
        </div>
      </div>

      {/* Enterprise Grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEnterprises.map((enterprise) => {
          const category = categories.find((c) => c.id === enterprise.category_id);
          const region = regions.find((r) => r.id === enterprise.region_id);
          return (
            <EnterpriseCard
              key={enterprise.id}
              enterprise={enterprise}
              categoryName={category?.name_en}
              regionName={region?.name_en}
            />
          );
        })}
      </div>

      {filteredEnterprises.length === 0 && (
        <div className="mt-10 rounded-xl border border-slate-200 bg-white py-16 text-center">
          <p className="text-slate-500">{t("noEnterprises")}</p>
        </div>
      )}
    </>
  );
}
