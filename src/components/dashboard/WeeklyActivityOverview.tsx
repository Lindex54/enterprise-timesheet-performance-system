"use client";

import { useEffect, useState } from "react";

type Activity = { id: number; title: string; status: string };
type Day = { date: string; activities: Activity[] };
type WeeklyData = { weekStart: string; month: number; year: number; selectedWeek: number; weeks: { value: number; label: string }[]; days: Day[] };
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function WeeklyActivityOverview({ filters = false }: { filters?: boolean }) {
  const [data, setData] = useState<WeeklyData | null>(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [week, setWeek] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters && month && year) { params.set("month", month); params.set("year", year); if (week) params.set("week", week); }
    void fetch(`/api/dashboard/weekly-activities?${params}`)
      .then(async (response) => { if (!response.ok) throw new Error(); return response.json() as Promise<WeeklyData>; })
      .then((result) => {
        setData(result);
        if (filters && (!month || week !== String(result.selectedWeek))) {
          setMonth(String(result.month)); setYear(String(result.year)); setWeek(String(result.selectedWeek));
        }
      })
      .catch(() => setData({ weekStart: "", month: 0, year: 0, selectedWeek: 0, weeks: [], days: [] }));
  }, [filters, month, year, week]);

  return <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center"><div><h2 className="text-lg font-bold text-slate-900">Weekly activity overview</h2><p className="mt-1 text-sm text-slate-500">{filters ? "Choose a month and one of its calendar weeks to review recorded work." : "Your latest recorded week, from Monday to Sunday."}</p></div>{filters && <div className="flex flex-wrap gap-2"><select value={month} onChange={(event) => { setMonth(event.target.value); setWeek(""); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">{monthNames.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}</select><select value={year} onChange={(event) => { setYear(event.target.value); setWeek(""); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm"><option value="2026">2026</option><option value="2025">2025</option></select><select value={week} onChange={(event) => setWeek(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">{(data?.weeks ?? []).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>}</div>
    <div className="grid divide-y divide-slate-100 md:grid-cols-7 md:divide-x md:divide-y-0">{(data?.days ?? Array.from({ length: 7 }, () => null)).map((day, index) => { const weekend = index >= 5; return <article key={day?.date ?? index} className="min-h-44 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</p><p className="mt-1 text-sm font-semibold text-slate-900">{day ? formatDay(day.date) : "Loading..."}</p><div className="mt-4 space-y-3">{day?.activities.map((activity) => <div key={activity.id} className="flex gap-2"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotClass(activity.status)}`} /><p className="text-xs leading-5 text-slate-700">{activity.title}</p></div>)}{day && !day.activities.length && !weekend && <div className="flex gap-2"><span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" /><p className="text-xs leading-5 text-slate-500">No activity recorded</p></div>}{day && !day.activities.length && weekend && <p className="text-xs text-slate-400">No activity recorded</p>}</div></article>; })}</div>
    <div className="flex flex-wrap gap-4 border-t border-slate-200 px-6 py-3 text-xs text-slate-600"><Legend colour="bg-emerald-500" label="Completed" /><Legend colour="bg-amber-500" label="In progress" /><Legend colour="bg-slate-400" label="Draft" /><Legend colour="bg-red-500" label="No weekday activity" /></div>
  </section>;
}

function dotClass(status: string) { return status === "Completed" ? "bg-emerald-500" : status === "In Progress" ? "bg-amber-500" : status === "Draft" ? "bg-slate-400" : "bg-blue-500"; }
function formatDay(date: string) { return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }
function Legend({ colour, label }: { colour: string; label: string }) { return <span className="inline-flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${colour}`} />{label}</span>; }
