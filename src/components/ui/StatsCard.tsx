interface StatsCardProps {
  value: string | number;
  label: string;
}

export default function StatsCard({ value, label }: StatsCardProps) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-primary-600 sm:text-3xl">{value}</div>
      <div className="mt-1 text-sm text-slate-600">{label}</div>
    </div>
  );
}
