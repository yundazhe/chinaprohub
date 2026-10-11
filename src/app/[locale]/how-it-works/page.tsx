import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "howItWorks" });
  return {
    title: `${t("title")} | ChinaProHub`,
    description: t("subtitle"),
  };
}

const CONTACT_EMAIL = "540540777@qq.com";

export default async function HowItWorksPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "howItWorks" });
  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
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
        {/* Sourcing flow */}
        <section className="mt-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-600">{t("eyebrow")}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="mt-4 text-base font-semibold text-slate-900">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Email box */}
        <section className="mt-8 rounded-2xl border-2 border-primary-600 bg-white p-8 text-center">
          <p className="text-slate-700">{t("emailBoxTitle")}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-2 inline-block text-xl font-bold text-primary-600 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </section>

        {/* Free factory listing band */}
        <section className="mt-14 flex flex-col items-center justify-between gap-6 rounded-2xl bg-slate-900 p-8 text-center sm:flex-row sm:p-10 sm:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">{t("factoriesTitle")}</h2>
            <p className="mt-2 text-slate-300">{t("factoriesBody")}</p>
          </div>
          <Link href="/submit" className="btn-primary inline-flex shrink-0 items-center gap-2">
            <Mail className="h-4 w-4" />
            {t("factoryCta")}
          </Link>
        </section>
      </div>
    </div>
  );
}
