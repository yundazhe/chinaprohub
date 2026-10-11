import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Chinese factories by product, name, or region.",
};

export default function SearchPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom text-center">
        <h1 className="section-title">Search Factories</h1>
        <p className="section-subtitle mx-auto max-w-xl">
          Search coming soon. For now, browse by{" "}
          <a href="/categories" className="text-primary-600 hover:underline">category</a>{" "}
          or <a href="/enterprises" className="text-primary-600 hover:underline">enterprise</a>.
        </p>
      </div>
    </div>
  );
}
