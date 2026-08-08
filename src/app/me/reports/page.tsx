import { BarChart3, Building2, ClipboardCheck, Download, FileText, PieChart, Target, TrendingUp } from "lucide-react";
import MePageHeader from "../../../components/me/MePageHeader";

const reports = [
  { title: "Monthly performance brief", description: "Institutional results, trends, exceptions and management actions.", icon: TrendingUp, updated: "Ready for July 2026" },
  { title: "Target achievement report", description: "Actual achievement against approved institutional targets.", icon: Target, updated: "Updated today" },
  { title: "Department comparison", description: "Comparative score, compliance and trend analysis by unit.", icon: Building2, updated: "Updated today" },
  { title: "Reporting compliance", description: "Submission, approval and report-readiness across departments.", icon: ClipboardCheck, updated: "Updated 15 minutes ago" },
  { title: "Performance distribution", description: "Employee and department results by classification band.", icon: PieChart, updated: "Updated today" },
  { title: "Data quality statement", description: "Completeness, validation exceptions and resolution history.", icon: BarChart3, updated: "Updated 30 minutes ago" },
];

export default function MeReportsPage() {
  return <><MePageHeader eyebrow="Evidence & Reporting" title="M&E Reports" description="Produce validated performance evidence for management, planning, review meetings and institutional accountability." actions={<button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"><FileText size={18} /> Build custom report</button>} />
    <section className="mb-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="grid gap-4 md:grid-cols-4"><Filter label="Reporting period" options={["July 2026", "Quarter 2, 2026", "2026 Year to date"]} /><Filter label="Department" options={["All departments", "ICT Directorate", "University Library"]} /><Filter label="Campus" options={["All campuses", "Busitema Campus", "Main Administration"]} /><div className="flex items-end"><button className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Apply report context</button></div></div></section>
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{reports.map((report) => { const Icon = report.icon; return <article key={report.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Icon size={22} /></div><span className="text-xs text-slate-400">{report.updated}</span></div><h2 className="mt-5 font-bold text-slate-900">{report.title}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{report.description}</p><div className="mt-5 flex gap-3 border-t border-slate-100 pt-5"><button className="flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white">View report</button><button aria-label={`Download ${report.title}`} className="rounded-lg border border-slate-300 p-2.5 text-slate-600"><Download size={18} /></button></div></article>; })}</section>
  </>;
}

function Filter({ label, options }: { label: string; options: string[] }) { return <label><span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span><select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
