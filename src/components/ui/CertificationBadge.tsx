interface CertificationBadgeProps {
  certification: string;
}

const certColors: Record<string, string> = {
  ISO9001: "bg-blue-100 text-blue-700",
  CE: "bg-green-100 text-green-700",
  FDA: "bg-purple-100 text-purple-700",
  RoHS: "bg-teal-100 text-teal-700",
  FCC: "bg-indigo-100 text-indigo-700",
  BSCI: "bg-orange-100 text-orange-700",
  FSC: "bg-emerald-100 text-emerald-700",
  HACCP: "bg-cyan-100 text-cyan-700",
  ISO22000: "bg-sky-100 text-sky-700",
  ISO13485: "bg-rose-100 text-rose-700",
  IATF16949: "bg-violet-100 text-violet-700",
  OEKO: "bg-lime-100 text-lime-700",
  SGS: "bg-yellow-100 text-yellow-700",
  API: "bg-red-100 text-red-700",
  EN71: "bg-pink-100 text-pink-700",
  ASTM: "bg-amber-100 text-amber-700",
  Sedex: "bg-stone-100 text-stone-700",
  REACH: "bg-gray-100 text-gray-700",
  Organic: "bg-green-100 text-green-700",
  GS: "bg-blue-100 text-blue-700",
};

export default function CertificationBadge({ certification }: CertificationBadgeProps) {
  const colorClass = certColors[certification] || "bg-slate-100 text-slate-700";
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${colorClass}`}>
      {certification}
    </span>
  );
}
