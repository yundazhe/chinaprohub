import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  Mail,
  Globe,
  MessageCircle,
  Calendar,
  Users,
  Ruler,
  Package,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { dataService } from "@/lib/data";
import CertificationBadge from "@/components/ui/CertificationBadge";
import EnterpriseCard from "@/components/ui/EnterpriseCard";
import JsonLd from "@/components/seo/JsonLd";
import { getTranslations } from "next-intl/server";
import { getLocalizedName } from "@/lib/locale-fields";

export const revalidate = 3600;

interface Props {
  params: { slug: string; locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const enterprise = await dataService.getEnterpriseBySlug(params.slug);
  if (!enterprise) return { title: "Enterprise Not Found" };
  const name = params.locale === "zh" ? enterprise.name_zh : enterprise.name_en;
  const description = params.locale === "zh" ? enterprise.description_zh : enterprise.description_en;
  return {
    title: name,
    description: description || `${name} — Chinese factory directory`,
  };
}

export default async function EnterpriseDetailPage({ params }: Props) {
  const { locale } = params;
  const te = await getTranslations("enterprises");

  const enterprise = await dataService.getEnterpriseBySlug(params.slug);
  if (!enterprise) {
    return (
      <div className="py-12 sm:py-16">
        <div className="container-custom text-center">
          <h1 className="text-2xl font-bold text-slate-900">Enterprise Not Found</h1>
          <p className="mt-4 text-slate-600">The enterprise you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/enterprises" className="btn-primary mt-6 inline-block">
            {te("allEnterprises")}
          </Link>
        </div>
      </div>
    );
  }

  const [category, region, relatedEnterprises] = await Promise.all([
    enterprise.category_id
      ? dataService.getAllCategories().then((cats) => cats.find((c) => c.id === enterprise.category_id))
      : Promise.resolve(undefined),
    enterprise.region_id
      ? dataService.getAllRegions().then((regs) => regs.find((r) => r.id === enterprise.region_id))
      : Promise.resolve(undefined),
    enterprise.category_id
      ? dataService.getEnterprisesByCategory(
          (await dataService.getAllCategories()).find((c) => c.id === enterprise.category_id)?.slug || ""
        ).then((ents) => ents.filter((e) => e.id !== enterprise.id).slice(0, 3))
      : Promise.resolve([]),
  ]);

  const name = locale === "zh" ? enterprise.name_zh : enterprise.name_en;
  const subtitle = locale === "zh" ? enterprise.name_en : enterprise.name_zh;
  const description = locale === "zh" ? enterprise.description_zh : enterprise.description_en;

  const verificationLabel = {
    unverified: te("unverified"),
    verified: te("verified"),
    premium: te("premium"),
  }[enterprise.verification_status];

  const verificationColor = {
    unverified: "bg-slate-100 text-slate-700",
    verified: "bg-green-100 text-green-700",
    premium: "bg-amber-100 text-amber-700",
  }[enterprise.verification_status];

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: enterprise.name_en,
    alternateName: enterprise.name_zh,
    description: enterprise.description_en,
    address: {
      "@type": "PostalAddress",
      addressRegion: region ? getLocalizedName(region, locale) : undefined,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: enterprise.contact_email,
      telephone: enterprise.contact_whatsapp,
    },
  };

  return (
    <div className="py-12 sm:py-16">
      <JsonLd data={organizationData} />
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/enterprises"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4" />
            {te("allEnterprises")}
          </Link>
          {category && (
            <>
              <span className="mx-2 text-slate-300">/</span>
              <Link
                href={`/categories/${category.slug}`}
                className="text-sm text-slate-500 hover:text-primary-600"
              >
                {getLocalizedName(category, locale)}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="card p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {name}
                  </h1>
                  <p className="mt-1 text-lg text-slate-500">{subtitle}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${verificationColor}`}>
                  {verificationLabel}
                </span>
              </div>

              {description && (
                <p className="mt-4 text-slate-600 leading-relaxed">
                  {description}
                </p>
              )}

              {/* Key Info */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {enterprise.established_year && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{te("est")} {enterprise.established_year}</span>
                  </div>
                )}
                {enterprise.employee_range && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>{enterprise.employee_range} {te("employees")}</span>
                  </div>
                )}
                {enterprise.factory_area_sqm && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Ruler className="h-4 w-4 text-slate-400" />
                    <span>{enterprise.factory_area_sqm.toLocaleString()} {te("factory")}</span>
                  </div>
                )}
                {enterprise.moq_text && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Package className="h-4 w-4 text-slate-400" />
                    <span>{te("moq")}: {enterprise.moq_text}</span>
                  </div>
                )}
              </div>

              {/* Certifications */}
              {enterprise.certifications.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2 text-sm font-semibold text-slate-700">{te("certifications")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {enterprise.certifications.map((cert) => (
                      <CertificationBadge key={cert} certification={cert} />
                    ))}
                  </div>
                </div>
              )}

              {/* Export Markets */}
              {enterprise.export_markets.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2 text-sm font-semibold text-slate-700">{te("exportMarkets")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {enterprise.export_markets.map((market) => (
                      <span
                        key={market}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                      >
                        {market}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* OEM Support */}
              {enterprise.supports_oem && (
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700">
                    <CheckCircle className="h-4 w-4" />
                    {te("supportsOem")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar — Contact Info */}
          <div>
            <div className="card p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">{te("contactFactory")}</h3>

              <div className="space-y-3">
                {enterprise.contact_whatsapp && (
                  <a
                    href={`https://wa.me/${enterprise.contact_whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-green-300 hover:bg-green-50"
                  >
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">WhatsApp</div>
                      <div className="text-sm text-slate-500">{enterprise.contact_whatsapp}</div>
                    </div>
                  </a>
                )}

                {enterprise.contact_email && (
                  <a
                    href={`mailto:${enterprise.contact_email}`}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-primary-300 hover:bg-primary-50"
                  >
                    <Mail className="h-5 w-5 text-primary-600" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{te("email")}</div>
                      <div className="text-sm text-slate-500">{enterprise.contact_email}</div>
                    </div>
                  </a>
                )}

                {enterprise.contact_website && (
                  <a
                    href={enterprise.contact_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-primary-300 hover:bg-primary-50"
                  >
                    <Globe className="h-5 w-5 text-primary-600" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{te("website", { defaultMessage: "Website" })}</div>
                      <div className="flex items-center gap-1 text-sm text-primary-600">
                        {te("visitWebsite")} <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </a>
                )}
              </div>

              {/* Location */}
              {(category || region) && (
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <h4 className="mb-2 text-sm font-semibold text-slate-700">{te("locationCategory")}</h4>
                  <div className="space-y-1 text-sm text-slate-600">
                    {region && (
                      <Link
                        href={`/regions/${region.slug}`}
                        className="block hover:text-primary-600"
                      >
                        📍 {getLocalizedName(region, locale)}
                      </Link>
                    )}
                    {category && (
                      <Link
                        href={`/categories/${category.slug}`}
                        className="block hover:text-primary-600"
                      >
                        🏭 {getLocalizedName(category, locale)}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Enterprises */}
        {relatedEnterprises.length > 0 && category && (
          <div className="mt-12">
            <h2 className="section-title">{te("moreFactories")} {getLocalizedName(category, locale)}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEnterprises.map((ent) => (
                <EnterpriseCard
                  key={ent.id}
                  enterprise={ent}
                  locale={locale}
                  verifiedLabel={te("verified")}
                  premiumLabel={te("premium")}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
