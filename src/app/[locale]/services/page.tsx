import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Handshake, SearchCheck, Languages, ClipboardCheck, Ship, LifeBuoy, Mail } from "lucide-react";

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
  const items = [
    { icon: Handshake, title: t("matchTitle"), body: t("matchBody") },
    { icon: SearchCheck, title: t("auditTitle"), body: t("auditBody") },
    { icon: Languages, title: t("interpTitle"), body: t("interpBody") },
    { icon: ClipboardCheck, title: t("qcTitle"), body: t("qcBody") },
    { icon: Ship, title: t("logTitle"), body: t("logBody") },
    { icon: LifeBuoy, title: t("afterTitle"), body: t("afterBody") },
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom max-w-5xl">
        <h1 className="section-title text-center">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{t("subtitle")}</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-slate-900 p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold text-white">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">{t("ctaBody")}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="btn-primary mt-6 inline-flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            {t("ctaButton")}
          </a>
          <p className="mt-3 text-sm text-slate-400">{CONTACT_EMAIL}</p>
        </div>
      </div>
    </div>
  );
}
