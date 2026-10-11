import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SearchCheck, Footprints, UserCheck, ClipboardCheck, Ship, Wallet, Mail } from "lucide-react";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });
  return {
    title: `${t("title")} | ChinaProHub`,
    description: t("subtitle"),
  };
}

const CONTACT_EMAIL = "540540777@qq.com";

export default async function ServicesPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "services" });
  const hiw = await getTranslations({ locale: params.locale, namespace: "howItWorks" });
  const items = [
    { icon: SearchCheck, title: t("matchTitle"), body: t("matchBody") },
    { icon: Footprints, title: t("auditTitle"), body: t("auditBody") },
    { icon: UserCheck, title: t("agentTitle"), body: t("agentBody") },
    { icon: ClipboardCheck, title: t("qcTitle"), body: t("qcBody") },
    { icon: Ship, title: t("logTitle"), body: t("logBody") },
    { icon: Wallet, title: t("priceTitle"), body: t("priceBody") },
  ];

  return (
    <div className="pb-16">
      {/* Hero band */}
      <div className="border-b border-slate-200 bg-primary-50/60 py-10">
        <div className="container-custom">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{t("title")}</h1>
          <p className="mt-3 max-w-3xl text-slate-600">{t("subtitle")}</p>
        </div>
      </div>

      <div className="container-custom max-w-5xl">
        {/* Value-added services */}
        <section className="mt-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600">{t("eyebrow")}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{t("valueTitle")}</h2>
          <p className="mt-2 text-sm text-slate-500">{t("valueNote")}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Booking block */}
        <section className="mt-12 rounded-2xl border-2 border-primary-600 bg-white p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600">{t("bookEyebrow")}</p>
          <p className="mt-3 text-4xl font-extrabold text-primary-700">
            {t("bookPrice")} <span className="text-lg font-semibold text-slate-500">{t("bookPer")}</span>
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">{t("bookBody")}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Factory audit visit booking")}`}
            className="btn-primary mt-6 inline-flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            {t("bookCta")}
          </a>
        </section>

        {/* Free factory listing band */}
        <section className="mt-14 flex flex-col items-center justify-between gap-6 rounded-2xl bg-slate-900 p-8 text-center sm:flex-row sm:p-10 sm:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">{hiw("factoriesTitle")}</h2>
            <p className="mt-2 text-slate-300">{hiw("factoriesBody")}</p>
          </div>
          <Link href="/submit" className="btn-primary inline-flex shrink-0 items-center gap-2">
            <Mail className="h-4 w-4" />
            {hiw("factoryCta")}
          </Link>
        </section>
      </div>
    </div>
  );
}
