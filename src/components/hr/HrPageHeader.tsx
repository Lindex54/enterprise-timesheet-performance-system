import type { ReactNode } from "react";

export default function HrPageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <section className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><p className="text-sm font-semibold text-blue-600">{eyebrow}</p><h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">{title}</h1><p className="mt-1 max-w-3xl text-slate-500">{description}</p></div>{actions ? <div className="flex flex-col gap-3 sm:flex-row">{actions}</div> : null}</section>;
}
