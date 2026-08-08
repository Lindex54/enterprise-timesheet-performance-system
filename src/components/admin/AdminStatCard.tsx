import type { ElementType } from "react";

type AdminStatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: ElementType;
  tone?: "blue" | "emerald" | "amber" | "red";
};

const tones = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
};

export default function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "blue",
}: AdminStatCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${tones[tone]}`}><Icon size={22} /></div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{description}</p>
    </article>
  );
}
