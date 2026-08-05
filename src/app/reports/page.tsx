"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  ListChecks,
  Printer,
} from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type ReportData = {
  summary: { totalActivities: number; completedActivities: number; submittedActivities: number; totalHours: number; completionRate: number };
  months: { month: number; label: string; activities: number; hours: number }[];
  activities: { id: number; date: string; title: string; description: string; project: string; hours: number; status: string; submissionStatus: string; expectedOutput: string; challenges: string }[];
  workAreas: { name: string; activities: number; completed: number; hours: number; completionRate: number }[];
  achievements: string[];
  challenges: string[];
};

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(7);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/reports?month=${selectedMonth}&year=${selectedYear}`);
        const result = (await response.json()) as ReportData & { message?: string };
        if (!response.ok) throw new Error(result.message ?? "Unable to load this monthly record.");
        setData(result);
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Unable to load this monthly record.");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadReport();
  }, [selectedMonth, selectedYear]);

  const summary = data?.summary ?? emptySummary;
  const selectedLabel = monthNames[selectedMonth - 1];

  return (
    <DashboardShell>
      <section className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">Reporting and Documentation</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">Monthly work records</h1>
          <p className="mt-1 text-slate-500">Choose a month to review your recorded work and create a report.</p>
        </div>
        <div className="flex gap-3">
          <select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value={2026}>2026</option><option value={2025}>2025</option><option value={2024}>2024</option>
          </select>
          <button type="button" onClick={() => window.print()} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"><Printer size={18} />Generate report</button>
        </div>
      </section>

      {error && <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-6 xl:grid-cols-[330px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5"><h2 className="font-bold text-slate-900">{selectedYear} records</h2><p className="mt-1 text-sm text-slate-500">Select a month to view its work.</p></div>
          <div className="divide-y divide-slate-100">{(data?.months ?? monthNames.map((label, index) => ({ month: index + 1, label, activities: 0, hours: 0 }))).map((month) => <button type="button" key={month.month} onClick={() => setSelectedMonth(month.month)} className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition ${month.month === selectedMonth ? "bg-blue-50" : "hover:bg-slate-50"}`}><div><p className={`font-semibold ${month.month === selectedMonth ? "text-blue-700" : "text-slate-800"}`}>{month.label}</p><p className="mt-0.5 text-xs text-slate-500">{month.activities} {month.activities === 1 ? "activity" : "activities"}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${month.month === selectedMonth ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{month.hours} hrs</span></button>)}</div>
        </aside>

        <div id="printable-report" className="min-w-0">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2 text-blue-600"><CalendarDays size={19} /><span className="text-sm font-semibold">Monthly record</span></div><h2 className="mt-2 text-2xl font-bold text-slate-900">{selectedLabel} {selectedYear}</h2><p className="mt-1 text-sm text-slate-500">All activities recorded for this month.</p></div><span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">{summary.totalActivities} records</span></div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard title="Activities" value={summary.totalActivities} icon={ListChecks} /><SummaryCard title="Completed" value={summary.completedActivities} icon={CheckCircle2} /><SummaryCard title="Hours recorded" value={summary.totalHours} icon={Clock3} /><SummaryCard title="Completion" value={`${summary.completionRate}%`} icon={FileText} /></div>
          </section>

          <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5"><h2 className="text-lg font-bold text-slate-900">Activity details</h2><p className="mt-1 text-sm text-slate-500">What was recorded during {selectedLabel}.</p></div>
            <div className="overflow-x-auto"><table className="w-full min-w-225 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Activity</th><th className="px-6 py-4">Project</th><th className="px-6 py-4">Hours</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Output</th></tr></thead><tbody className="divide-y divide-slate-100">{(data?.activities ?? []).map((activity) => <tr key={activity.id} className="hover:bg-slate-50"><td className="whitespace-nowrap px-6 py-4 text-slate-600">{formatDate(activity.date)}</td><td className="min-w-56 px-6 py-4"><p className="font-semibold text-slate-900">{activity.title}</p><p className="mt-1 text-xs text-slate-500">{activity.description}</p></td><td className="px-6 py-4 text-slate-600">{activity.project}</td><td className="px-6 py-4 font-medium text-slate-700">{activity.hours}</td><td className="px-6 py-4"><StatusBadge status={activity.status} /></td><td className="min-w-52 px-6 py-4 text-slate-600">{activity.expectedOutput || "—"}</td></tr>)}{!isLoading && !data?.activities.length && <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">No activities were recorded for {selectedLabel} {selectedYear}.</td></tr>}</tbody></table></div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 px-6 py-5"><h2 className="text-lg font-bold text-slate-900">Work areas</h2><p className="mt-1 text-sm text-slate-500">Recorded time by project.</p></div><div className="divide-y divide-slate-100">{(data?.workAreas ?? []).map((area) => <div key={area.name} className="px-6 py-4"><div className="flex justify-between gap-4"><p className="font-semibold text-slate-900">{area.name}</p><p className="whitespace-nowrap text-sm text-slate-600">{area.hours} hrs</p></div><p className="mt-1 text-sm text-slate-500">{area.activities} activities · {area.completed} completed</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${area.completionRate}%` }} /></div></div>)}{!isLoading && !data?.workAreas.length && <p className="px-6 py-8 text-sm text-slate-500">No work areas recorded for this month.</p>}</div></article>
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-slate-900">Recorded challenges</h2><p className="mt-1 text-sm text-slate-500">Challenges entered with your activities.</p><div className="mt-5 space-y-4">{(data?.challenges ?? []).map((challenge, index) => <div key={`${challenge}-${index}`} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">{index + 1}</span><p className="text-sm leading-6 text-slate-600">{challenge}</p></div>)}{!isLoading && !data?.challenges.length && <p className="text-sm text-slate-500">No challenges were recorded for this month.</p>}</div></article>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}

const emptySummary = { totalActivities: 0, completedActivities: 0, submittedActivities: 0, totalHours: 0, completionRate: 0 };

function SummaryCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) { return <div className="rounded-lg bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate-500">{title}</p><Icon size={18} className="text-blue-600" /></div><p className="mt-3 text-2xl font-bold text-slate-900">{value}</p></div>; }
function StatusBadge({ status }: { status: string }) { const styles: Record<string, string> = { Completed: "bg-emerald-100 text-emerald-700", "In Progress": "bg-blue-100 text-blue-700", "Not Started": "bg-slate-100 text-slate-700", Blocked: "bg-amber-100 text-amber-700" }; return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-slate-100 text-slate-700"}`}>{status}</span>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
