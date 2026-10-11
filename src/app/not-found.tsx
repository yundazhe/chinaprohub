import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-slate-300">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-700">Page Not Found</h2>
      <p className="mt-2 text-slate-500">The page you're looking for doesn't exist.</p>
      <Link href="/" className="btn-primary mt-6">
        Go Home
      </Link>
    </div>
  );
}
