import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ChinaProHub",
  description: "Learn about ChinaProHub — your gateway to verified Chinese suppliers.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom max-w-3xl">
        <h1 className="section-title text-center">About ChinaProHub</h1>
        <div className="mt-8 space-y-6 text-slate-600 leading-relaxed">
          <p>
            ChinaProHub is a directory of verified Chinese suppliers, designed to help
            international buyers find the right factory for their sourcing needs.
          </p>
          <p>
            We organize factories by product category, industrial cluster, and region —
            making it easy to discover where China makes it best.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Our Mission</h2>
          <p>
            To bridge the information gap between international buyers and Chinese
            manufacturers. We believe that finding the right factory should be transparent,
            efficient, and accessible to businesses of all sizes.
          </p>
          <h2 className="text-xl font-semibold text-slate-900">Listing Principles</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Free listing — no pay-to-rank, no paid certifications</li>
            <li>Verified information — we review all submitted data</li>
            <li>Direct contact — buyer connects directly with the factory</li>
            <li>Multi-language — serving buyers worldwide</li>
          </ul>
          <h2 className="text-xl font-semibold text-slate-900" id="contact">Contact Us</h2>
          <p>
            For inquiries, partnerships, or data corrections, email us at{" "}
            <a href="mailto:info@chinaprohub.com" className="text-primary-600 hover:underline">
              info@chinaprohub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
