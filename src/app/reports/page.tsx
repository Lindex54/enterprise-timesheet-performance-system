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
      <section className="report-screen-header mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">Reporting and Documentation</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">Monthly Report</h1>
          <p className="mt-1 text-slate-500">A consolidated summary of your recorded work for the selected month.</p>
        </div>
        <div className="flex gap-3">
          <select value={selectedMonth} onChange={(event) => setSelectedMonth(Number(event.target.value))} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            {monthNames.map((label, index) => <option key={label} value={index + 1}>{label}</option>)}
          </select>
          <select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value={2026}>2026</option><option value={2025}>2025</option><option value={2024}>2024</option>
          </select>
          <button type="button" onClick={() => window.print()} disabled={isLoading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"><Printer size={18} />Generate report</button>
        </div>
      </section>

      {error && <p className="report-screen-message mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div id="printable-report" className="min-w-0">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2 text-blue-600"><CalendarDays size={19} /><span className="text-sm font-semibold">Report period</span></div><h2 className="mt-2 text-2xl font-bold text-slate-900">{selectedLabel} {selectedYear}</h2><p className="mt-1 text-sm text-slate-500">Summary of activities, recorded hours, delivery progress, and work areas.</p></div><span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">{summary.totalActivities} activity records</span></div>

            <div className="mt-6"><h3 className="text-base font-bold text-slate-900">Report summary</h3><p className="mt-1 text-sm text-slate-500">Key figures for {selectedLabel} {selectedYear}.</p></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><SummaryCard title="Total activities" value={summary.totalActivities} icon={ListChecks} /><SummaryCard title="Completed activities" value={summary.completedActivities} icon={CheckCircle2} /><SummaryCard title="Hours recorded" value={`${summary.totalHours} hrs`} icon={Clock3} /><SummaryCard title="Completion rate" value={`${summary.completionRate}%`} icon={FileText} /></div>
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
      <PrintedMonthlyReport data={data} month={selectedMonth} year={selectedYear} />
    </DashboardShell>
  );
}

const emptySummary = { totalActivities: 0, completedActivities: 0, submittedActivities: 0, totalHours: 0, completionRate: 0 };

function SummaryCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) { return <div className="rounded-lg bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate-500">{title}</p><Icon size={18} className="text-blue-600" /></div><p className="mt-3 text-2xl font-bold text-slate-900">{value}</p></div>; }
function StatusBadge({ status }: { status: string }) { const styles: Record<string, string> = { Completed: "bg-emerald-100 text-emerald-700", "In Progress": "bg-blue-100 text-blue-700", "Not Started": "bg-slate-100 text-slate-700", Blocked: "bg-amber-100 text-amber-700" }; return <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${styles[status] ?? "bg-slate-100 text-slate-700"}`}>{status}</span>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }

function PrintedMonthlyReport({ data, month, year }: { data: ReportData | null; month: number; year: number }) {
  const summary = data?.summary ?? emptySummary;
  const period = `${monthNames[month - 1]} ${year}`;
  const shortPeriod = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1))).toUpperCase();

  return <article className="report-print-sheet">
    <header className="report-paper-header"><div className="report-punches">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div><p className="report-eyebrow">Reporting &amp; Documentation</p><div className="report-title-row"><h1>Monthly Report</h1><span className="report-period-tag">{shortPeriod}</span></div><p className="report-subtitle">A consolidated summary of recorded work — activities, hours, delivery progress, and work areas for the selected month.</p><p className="report-record-count">{summary.totalActivities} ACTIVITY {summary.totalActivities === 1 ? "RECORD" : "RECORDS"} LOGGED</p></header>
    <section className="report-metrics"><Metric label="Total activities" value={summary.totalActivities} /><Metric label="Completed" value={summary.completedActivities} /><Metric label="Hours recorded" value={summary.totalHours} suffix="hrs" /><Metric label="Completion rate" value={summary.completionRate} suffix="%" stamp /></section>
    <section className="report-paper-section"><SectionHead title="Activity details" text={`What was recorded during ${monthNames[month - 1]}, most recent first.`} /><div className="report-log">{(data?.activities ?? []).map((activity) => <div key={activity.id} className={`report-entry ${activity.status === "In Progress" ? "report-entry-progress" : ""}`}><time className="report-entry-date">{formatShortDate(activity.date)}</time><i className="report-entry-dot" /><div className="report-entry-body"><div className="report-entry-top"><div><h3>{activity.title}</h3><p>{activity.description}</p></div><div className="report-entry-meta"><b>{activity.hours}h</b><span>{activity.status}</span></div></div><div className="report-entry-footer"><em>{activity.project}</em><i>{activity.expectedOutput || "No output recorded."}</i></div></div></div>)}{!data?.activities.length && <p className="report-empty">No activities were recorded for this period.</p>}</div></section>
    <section className="report-paper-section"><SectionHead title="Work areas" text="Recorded time by project." />{(data?.workAreas ?? []).map((area) => <div className="report-area-row" key={area.name}><div><strong>{area.name}</strong><small>{area.activities} {area.activities === 1 ? "ACTIVITY" : "ACTIVITIES"} · {area.completed} COMPLETED</small></div><div className="report-area-track"><i style={{ width: `${area.completionRate}%` }} /></div><b>{area.hours} hrs</b></div>)}{!data?.workAreas.length && <p className="report-empty">No work areas were recorded for this period.</p>}</section>
    <section className="report-paper-section"><SectionHead title="Recorded challenges" text="Challenges entered with your activities." /><div className="report-flags">{(data?.challenges ?? []).map((challenge, index) => <p className="report-flag" key={`${challenge}-${index}`}><b>{String(index + 1).padStart(2, "0")}</b><span>{challenge}</span></p>)}{!data?.challenges.length && <p className="report-empty">No challenges were recorded for this period.</p>}</div></section>
    <footer className="report-paper-footer">GENERATED FROM RECORDED ACTIVITY · {period.toUpperCase()}</footer>
  </article>;
}

function Metric({ label, value, suffix, stamp = false }: { label: string; value: number; suffix?: string; stamp?: boolean }) { return <div className="report-metric"><p>{label}</p><strong>{value}{suffix && <small>{suffix}</small>}</strong>{stamp && <i>{value}%</i>}</div>; }
function SectionHead({ title, text }: { title: string; text: string }) { return <div className="report-section-head"><h2>{title}</h2><p>{text}</p></div>; }
function formatShortDate(value: string) { return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
