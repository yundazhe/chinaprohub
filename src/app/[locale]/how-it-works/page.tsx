import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Search, Mail, Factory } from "lucide-react";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "howItWorks" });
  return {
    title: `${t("title")} | ChinaProHub`,
    description: t("subtitle"),
  };
}

export default async function HowItWorksPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "howItWorks" });
  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom max-w-4xl">
        <h1 className="section-title text-center">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{t("subtitle")}</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                {i + 1}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/categories" className="btn-primary inline-flex items-center gap-2">
            <Factory className="h-4 w-4" />
            {t("browseCta")}
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary-300 hover:text-primary-600"
          >
            <Search className="h-4 w-4" />
            {t("searchCta")}
          </Link>
        </div>

        <div className="mt-16 rounded-2xl bg-slate-900 p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold text-white">{t("factoriesTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">{t("factoriesBody")}</p>
          <Link href="/submit" className="btn-primary mt-6 inline-flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t("factoryCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
