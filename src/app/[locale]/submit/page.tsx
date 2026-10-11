import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Factory",
  description: "Submit your factory information to be listed on ChinaProHub.",
};

export default function SubmitPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom text-center">
        <h1 className="section-title">List Your Factory</h1>
        <p className="section-subtitle mx-auto max-w-xl">
          Factory submission form coming soon. Contact us at{" "}
          <a href="mailto:info@chinaprohub.com" className="text-primary-600 hover:underline">
            info@chinaprohub.com
          </a>{" "}
          to get listed.
        </p>
      </div>
    </div>
  );
}
