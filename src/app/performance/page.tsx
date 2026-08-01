"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock3,
  Lightbulb,
  ListChecks,
  MessageSquareText,
  Target,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Summary = {
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  submittedActivities: number;
  totalHours: number;
  expectedHours: number;
  taskCompletionRate: number;
  timesheetSubmissionRate: number;
  productivityRate: number;
};

type PerformanceData = {
  summary: Summary;
  overallScore: number;
  workCategories: { name: string; activities: number; hours: number; percentage: number }[];
  achievements: string[];
  challenges: string[];
  trend: { month: string; score: number }[];
};

const staticKpis = [
  { id: "quality", title: "Quality of output", description: "Quality, accuracy and completeness of completed work.", score: 84, weight: 25 },
  { id: "supervisor", title: "Supervisor rating", description: "Performance rating provided by the immediate supervisor.", score: 86, weight: 10 },
];

export default function PerformancePage() {
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [data, setData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const monthNumber = months.indexOf(selectedMonth) + 1;

  useEffect(() => {
    async function loadPerformance() {
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await fetch(`/api/performance?month=${monthNumber}&year=${selectedYear}`);
        const result = (await response.json()) as PerformanceData & { message?: string };
        if (!response.ok) throw new Error(result.message ?? "Unable to load performance data.");
        setData(result);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Unable to load performance data.");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadPerformance();
  }, [monthNumber, selectedYear]);

  const summary = data?.summary ?? emptySummary;
  const overallScore = data?.overallScore ?? 0;
  const kpiItems = useMemo(() => [
    { id: "completion", title: "Task completion", description: "Progress across the activities recorded for this month.", score: summary.taskCompletionRate, weight: 30 },
    { id: "submission", title: "Timesheet submission", description: "Daily activities submitted from the recorded monthly work.", score: summary.timesheetSubmissionRate, weight: 20 },
    { id: "productivity", title: "Productivity", description: "Recorded hours compared with the expected monthly hours.", score: summary.productivityRate, weight: 15 },
    ...staticKpis,
  ], [summary]);
  const previousScore = data?.trend.at(-2)?.score ?? 0;
  const scoreChange = overallScore - previousScore;
  const highestScore = Math.max(...(data?.trend.map((item) => item.score) ?? [0]));
  const highestMonth = data?.trend.find((item) => item.score === highestScore)?.month ?? selectedMonth;

  return (
    <DashboardShell>
      <section className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">Performance Monitoring</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">Individual Performance</h1>
          <p className="mt-1 max-w-3xl text-slate-500">Review work output, recorded hours and performance indicators.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            {months.map((month) => <option key={month}>{month}</option>)}
          </select>
          <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </section>

      {loadError && <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <PerformanceSummaryCard title="Overall performance" value={`${overallScore}%`} description={`${selectedMonth} ${selectedYear} performance score`} icon={Award} trend={isLoading ? "Loading data..." : "Calculated from recorded work"} />
        <PerformanceSummaryCard title="Task completion" value={`${summary.taskCompletionRate}%`} description={`${summary.completedActivities} of ${summary.totalActivities} activities completed`} icon={CheckCircle2} trend={`${summary.inProgressActivities} activities in progress`} />
        <PerformanceSummaryCard title="Hours worked" value={summary.totalHours.toString()} description={`Out of ${summary.expectedHours} expected hours`} icon={Clock3} trend={`${summary.productivityRate}% of expected hours`} />
        <PerformanceSummaryCard title="Activities recorded" value={summary.totalActivities.toString()} description="Daily activities recorded" icon={ListChecks} trend={`${summary.submittedActivities} submitted`} />
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div><h2 className="text-lg font-bold text-slate-900">Performance overview</h2><p className="mt-1 text-sm text-slate-500">Overall assessment for {selectedMonth} {selectedYear}</p></div>
            <span className={`inline-flex w-fit rounded-full px-4 py-1.5 text-sm font-semibold ${classificationStyle(overallScore)}`}>{classification(overallScore)}</span>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
            <PerformanceGauge score={overallScore} />
            <div>
              <h3 className="text-xl font-bold text-slate-900">{classification(overallScore)} monthly performance</h3>
              <p className="mt-3 leading-7 text-slate-600">This score uses your saved activities, submission status and recorded working hours. Quality and supervisor rating will update once those workflows are available.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <MetricBox label="Previous score" value={`${previousScore}%`} />
                <MetricBox label="Performance change" value={`${scoreChange >= 0 ? "+" : ""}${scoreChange}%`} positive={scoreChange >= 0} />
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Performance classification</h2><p className="mt-1 text-sm text-slate-500">Interpretation of the calculated score</p>
          <div className="mt-6 space-y-4">
            <ClassificationItem label="Excellent" range="90–100%" active={overallScore >= 90} />
            <ClassificationItem label="Very good" range="80–89%" active={overallScore >= 80 && overallScore < 90} />
            <ClassificationItem label="Good" range="70–79%" active={overallScore >= 70 && overallScore < 80} />
            <ClassificationItem label="Needs improvement" range="Below 70%" active={overallScore < 70} />
          </div>
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4"><div className="flex gap-3"><Lightbulb size={21} className="mt-0.5 shrink-0 text-blue-600" /><p className="text-sm leading-6 text-blue-800">Completing remaining activities and recording expected working hours can improve the monthly score.</p></div></div>
        </article>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-slate-900">KPI performance breakdown</h2><p className="mt-1 text-sm text-slate-500">Performance against the current indicators and weights</p></div><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Target size={22} /></div></div>
          <div className="mt-7 space-y-7">{kpiItems.map((item) => <div key={item.id}><div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-start"><div><p className="font-semibold text-slate-900">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.description}</p></div><div className="flex shrink-0 items-center gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Weight: {item.weight}%</span><span className="text-sm font-bold text-slate-900">{item.score}%</span></div></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${getProgressColour(item.score)}`} style={{ width: `${item.score}%` }} /></div></div>)}</div>
          <div className="mt-7 flex items-center justify-between border-t border-slate-200 pt-5"><span className="text-sm font-semibold text-slate-600">Total KPI weight</span><span className="text-lg font-bold text-slate-900">100%</span></div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between"><div><h2 className="text-lg font-bold text-slate-900">Monthly performance trend</h2><p className="mt-1 text-sm text-slate-500">Scores based on recorded activity data</p></div><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><BarChart3 size={22} /></div></div>
          <div className="mt-8 flex h-72 items-end justify-between gap-3 border-b border-slate-200">{(data?.trend ?? []).map((item) => <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end"><span className="mb-2 text-xs font-bold text-slate-700">{item.score}%</span><div className={`w-full max-w-12 rounded-t-md transition ${item.month === selectedMonth ? "bg-blue-600" : "bg-blue-200"}`} style={{ height: `${item.score}%` }} title={`${item.month}: ${item.score}%`} /><span className="mt-3 pb-3 text-xs font-medium text-slate-500">{item.month.slice(0, 3)}</span></div>)}</div>
          <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 p-4"><div><p className="text-sm text-slate-500">Highest score</p><p className="mt-1 font-bold text-slate-900">{highestScore}% in {highestMonth}</p></div><TrendingUp className="text-emerald-600" size={25} /></div>
        </article>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 px-6 py-5"><h2 className="text-lg font-bold text-slate-900">Work distribution</h2><p className="mt-1 text-sm text-slate-500">Recorded activities and working hours by project</p></div><div className="overflow-x-auto"><table className="w-full min-w-175 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">Work area</th><th className="px-6 py-4">Activities</th><th className="px-6 py-4">Hours</th><th className="px-6 py-4">Distribution</th></tr></thead><tbody className="divide-y divide-slate-100">{(data?.workCategories ?? []).map((category) => <tr key={category.name} className="hover:bg-slate-50"><td className="px-6 py-4 font-semibold text-slate-900">{category.name}</td><td className="px-6 py-4 text-slate-600">{category.activities}</td><td className="px-6 py-4 text-slate-600">{category.hours}</td><td className="min-w-56 px-6 py-4"><div className="mb-2 flex justify-between text-xs"><span className="text-slate-500">Contribution</span><span className="font-bold text-slate-700">{category.percentage}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${category.percentage}%` }} /></div></td></tr>)}{!isLoading && !data?.workCategories.length && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No activities recorded for this period.</td></tr>}</tbody></table></div></article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="text-lg font-bold text-slate-900">Supervisor feedback</h2><p className="mt-1 text-sm text-slate-500">Assessment from the immediate supervisor</p></div><MessageSquareText className="text-blue-600" size={24} /></div><blockquote className="mt-6 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-5 text-sm leading-7 text-slate-700">The employee has demonstrated good consistency in completing assigned work and submitting daily activities. Greater attention should be given to completing urgent reporting tasks within agreed timelines.</blockquote><div className="mt-5 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700">FK</div><div><p className="font-semibold text-slate-900">Immediate Supervisor</p><p className="text-sm text-slate-500">Reviewed on 26 July 2026</p></div></div><div className="mt-6 border-t border-slate-200 pt-5"><p className="text-sm text-slate-500">Supervisor rating</p><div className="mt-2 flex items-center justify-between"><span className="text-3xl font-bold text-slate-900">86%</span><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Very good</span></div></div></article>
      </section>

      <section className="mt-7 grid gap-6 lg:grid-cols-2"><RecordedList title="Key achievements" description="Completed work recorded during the month" items={data?.achievements ?? []} emptyMessage="No completed activities recorded for this period." icon={<Award size={22} />} tone="emerald" /><RecordedList title="Challenges and improvement areas" description="Issues recorded during the month" items={data?.challenges ?? []} emptyMessage="No challenges recorded for this period." icon={<TriangleAlert size={22} />} tone="amber" /></section>
    </DashboardShell>
  );
}

const emptySummary: Summary = { totalActivities: 0, completedActivities: 0, inProgressActivities: 0, submittedActivities: 0, totalHours: 0, expectedHours: 160, taskCompletionRate: 0, timesheetSubmissionRate: 0, productivityRate: 0 };

function PerformanceSummaryCard({ title, value, description, trend, icon: Icon }: { title: string; value: string; description: string; trend: string; icon: React.ElementType }) { return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Icon size={22} /></div></div><p className="mt-4 text-sm text-slate-500">{description}</p><p className="mt-2 text-xs font-semibold text-blue-600">{trend}</p></article>; }
function MetricBox({ label, value, positive }: { label: string; value: string; positive?: boolean }) { return <div className="rounded-lg bg-slate-50 p-4"><p className="text-sm text-slate-500">{label}</p><p className={`mt-1 text-2xl font-bold ${positive === undefined ? "text-slate-900" : positive ? "text-emerald-600" : "text-red-600"}`}>{value}</p></div>; }
function PerformanceGauge({ score }: { score: number }) { const circumference = 2 * Math.PI * 72; return <div className="relative mx-auto h-48 w-48"><svg viewBox="0 0 180 180" className="h-full w-full -rotate-90" aria-label={`Performance score ${score}%`}><circle cx="90" cy="90" r="72" fill="none" stroke="#e2e8f0" strokeWidth="15" /><circle cx="90" cy="90" r="72" fill="none" stroke="#2563eb" strokeWidth="15" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - (score / 100) * circumference} /></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-bold text-slate-900">{score}%</span><span className="mt-1 text-sm font-medium text-slate-500">Overall score</span></div></div>; }
function ClassificationItem({ label, range, active }: { label: string; range: string; active: boolean }) { return <div className={`flex items-center justify-between rounded-lg border px-4 py-3 ${active ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"}`}><div className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${active ? "bg-blue-600" : "bg-slate-300"}`} /><span className={`text-sm font-semibold ${active ? "text-blue-800" : "text-slate-700"}`}>{label}</span></div><span className="text-xs font-medium text-slate-500">{range}</span></div>; }
function RecordedList({ title, description, items, emptyMessage, icon, tone }: { title: string; description: string; items: string[]; emptyMessage: string; icon: React.ReactNode; tone: "emerald" | "amber" }) { const styles = tone === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"; return <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div className={`rounded-xl p-3 ${styles}`}>{icon}</div><div><h2 className="text-lg font-bold text-slate-900">{title}</h2><p className="text-sm text-slate-500">{description}</p></div></div><div className="mt-6 space-y-4">{items.length ? items.map((item, index) => <div key={`${item}-${index}`} className="flex gap-3"><div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${styles}`}>{index + 1}</div><p className="text-sm leading-6 text-slate-600">{item}</p></div>) : <p className="text-sm text-slate-500">{emptyMessage}</p>}</div></article>; }
function classification(score: number) { if (score >= 90) return "Excellent"; if (score >= 80) return "Very good"; if (score >= 70) return "Good"; return "Needs improvement"; }
function classificationStyle(score: number) { if (score >= 90) return "bg-emerald-100 text-emerald-700"; if (score >= 80) return "bg-blue-100 text-blue-700"; if (score >= 70) return "bg-amber-100 text-amber-700"; return "bg-red-100 text-red-700"; }
function getProgressColour(score: number) { if (score >= 85) return "bg-emerald-500"; if (score >= 70) return "bg-blue-600"; if (score >= 50) return "bg-amber-500"; return "bg-red-500"; }
