"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function SubmitPage() {
  const t = useTranslations("submit");

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    products: "",
    region: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [validationError, setValidationError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setValidationError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");
    setError(false);

    // Validate required fields
    if (!formData.companyName.trim()) {
      setValidationError(t("companyName"));
      return;
    }
    if (!formData.contactEmail.trim()) {
      setValidationError(t("contactEmail"));
      return;
    }
    if (!formData.products.trim()) {
      setValidationError(t("products"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setSuccess(true);
      setFormData({
        companyName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        products: "",
        region: "",
        message: "",
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="section-title">{t("title")}</h1>
            <p className="section-subtitle mx-auto max-w-xl">{t("subtitle")}</p>
          </div>

          <div className="card p-6 sm:p-8">
            {success ? (
              <div className="text-center py-8">
                <div className="mb-4 text-5xl">&#10003;</div>
                <p className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
                  {t("success")}
                </p>
                <Link
                  href="/"
                  className="btn-primary mt-6 inline-block"
                >
                  {t("title")}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Validation error */}
                {validationError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                    {validationError}
                  </div>
                )}

                {/* Server error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                    {t("error")}
                  </div>
                )}

                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-1">
                    {t("companyName")}
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder={t("companyName")}
                  />
                </div>

                {/* Contact Name */}
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-1">
                    {t("contactName")}
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder={t("contactName")}
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 mb-1">
                    {t("contactEmail")}
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="input-field"
                    placeholder={t("contactEmail")}
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-700 mb-1">
                    {t("contactPhone")}
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder={t("contactPhone")}
                  />
                </div>

                {/* Products */}
                <div>
                  <label htmlFor="products" className="block text-sm font-medium text-slate-700 mb-1">
                    {t("products")}
                  </label>
                  <input
                    type="text"
                    id="products"
                    name="products"
                    value={formData.products}
                    onChange={handleChange}
                    className="input-field"
                    placeholder={t("products")}
                  />
                </div>

                {/* Region */}
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-slate-700 mb-1">
                    {t("region")}
                  </label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="input-field"
                    placeholder={t("region")}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                    {t("message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="input-field resize-y"
                    placeholder={t("message")}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t("required") : t("submitButton")}
                </button>

                {/* Required note */}
                <p className="text-xs text-slate-500 text-center">{t("required")}</p>

                {/* Privacy note */}
                <p className="text-xs text-slate-400 text-center">{t("privacyNote")}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
