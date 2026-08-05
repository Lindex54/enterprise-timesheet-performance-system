"use client";

import { useEffect, useState } from "react";
import { FileSpreadsheet, Printer, Upload } from "lucide-react";

import DashboardShell from "../../components/layout/DashboardShell";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type Timesheet = {
  employee: { name: string; employeeNumber: string; jobTitle: string; department: string; campus: string };
  period: { month: number; year: number; label: string };
  totalHours: number;
  activities: { id: number; date: string; project: string; activity: string; description: string; startTime: string; endTime: string; hours: number; output: string; workLocation: string; remarks: string }[];
};

export default function PrintableTimesheetPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<Timesheet | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimesheet() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/printable-timesheet?month=${month}&year=${year}`);
        const result = (await response.json()) as Timesheet & { message?: string };
        if (!response.ok) throw new Error(result.message ?? "Unable to load this timesheet.");
        setData(result);
      } catch (caught) {
        setData(null);
        setError(caught instanceof Error ? caught.message : "Unable to load this timesheet.");
      } finally {
        setLoading(false);
      }
    }
    void loadTimesheet();
  }, [month, year]);

  return (
    <DashboardShell>
      <section className="mb-6 flex flex-col justify-between gap-4 print:hidden lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">Reporting and Documentation</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">Printable timesheet</h1>
          <p className="mt-1 text-slate-500">Review your saved work entries, then print or export them for signing.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select aria-label="Timesheet month" value={month} onChange={(event) => setMonth(Number(event.target.value))} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">
            {months.map((label, index) => <option key={label} value={index + 1}>{label}</option>)}
          </select>
          <select aria-label="Timesheet year" value={year} onChange={(event) => setYear(Number(event.target.value))} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">
            {[2026, 2025, 2024].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <button type="button" onClick={() => window.print()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900 disabled:bg-slate-400"><Printer size={18} />Print</button>
          <button type="button" onClick={() => data && exportSpreadsheet(data)} disabled={loading || !data} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-emerald-300"><Upload size={18} />Export Excel</button>
        </div>
      </section>

      {error && <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 print:hidden">{error}</p>}

      <section id="printable-timesheet" className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm print:border-0 print:shadow-none">
        <div className="border-b-4 border-blue-600 px-6 py-6 text-center print:px-0 print:pt-0">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-700">Employee performance timesheet</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">{data?.period.label ?? `${months[month - 1]} ${year}`}</h2>
          <p className="mt-1 text-sm text-slate-600">Record of activities performed and hours worked</p>
        </div>

        <div className="grid border-b border-slate-300 text-sm sm:grid-cols-2 print:grid-cols-2">
          <Detail label="Employee name" value={data?.employee.name} /><Detail label="Employee number" value={data?.employee.employeeNumber} />
          <Detail label="Job title" value={data?.employee.jobTitle} /><Detail label="Department" value={data?.employee.department} />
          <Detail label="Campus / station" value={data?.employee.campus} /><Detail label="Total hours worked" value={data ? `${data.totalHours} hours` : ""} />
        </div>

        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full min-w-300 border-collapse text-left text-xs print:min-w-0 print:text-[9px]">
            <thead className="bg-blue-600 text-white"><tr><th className="border border-blue-700 px-2 py-3">Date</th><th className="border border-blue-700 px-2 py-3">Day</th><th className="border border-blue-700 px-2 py-3">Project</th><th className="border border-blue-700 px-2 py-3">Activity / Task</th><th className="border border-blue-700 px-2 py-3">Start</th><th className="border border-blue-700 px-2 py-3">End</th><th className="border border-blue-700 px-2 py-3">Hours</th><th className="border border-blue-700 px-2 py-3">Output / Deliverable</th><th className="border border-blue-700 px-2 py-3">Work location</th></tr></thead>
            <tbody>{data?.activities.map((entry, index) => <tr key={entry.id} className={index % 2 === 0 ? "bg-sky-50" : "bg-white"}><td className="whitespace-nowrap border border-slate-300 px-2 py-3 align-top">{formatDate(entry.date)}</td><td className="whitespace-nowrap border border-slate-300 px-2 py-3 align-top">{formatDay(entry.date)}</td><td className="border border-slate-300 px-2 py-3 align-top font-medium">{entry.project}</td><td className="min-w-64 border border-slate-300 px-2 py-3 align-top leading-5">{entry.activity}{entry.description && entry.description !== entry.activity ? <p className="mt-1 text-slate-600">{entry.description}</p> : null}</td><td className="whitespace-nowrap border border-slate-300 px-2 py-3 align-top">{entry.startTime || "—"}</td><td className="whitespace-nowrap border border-slate-300 px-2 py-3 align-top">{entry.endTime || "—"}</td><td className="whitespace-nowrap border border-slate-300 px-2 py-3 align-top text-right font-semibold">{entry.hours}</td><td className="min-w-56 border border-slate-300 px-2 py-3 align-top leading-5">{entry.output || "—"}</td><td className="min-w-40 border border-slate-300 px-2 py-3 align-top">{entry.workLocation || "—"}</td></tr>)}{!loading && !data?.activities.length && <tr><td colSpan={9} className="border border-slate-300 px-4 py-10 text-center text-sm text-slate-500">No saved activities were found for this period.</td></tr>}{loading && <tr><td colSpan={9} className="border border-slate-300 px-4 py-10 text-center text-sm text-slate-500">Loading saved activities…</td></tr>}</tbody>
            {data && <tfoot><tr className="bg-slate-100 font-bold"><td colSpan={6} className="border border-slate-300 px-2 py-3 text-right">Total hours worked</td><td className="border border-slate-300 px-2 py-3 text-right">{data.totalHours}</td><td colSpan={2} className="border border-slate-300" /></tr></tfoot>}
          </table>
        </div>

        <div className="grid gap-10 px-6 py-12 text-sm sm:grid-cols-2 print:grid-cols-2 print:px-0"><Signature label="Employee signature" name={data?.employee.name} /><Signature label="Supervisor signature" /></div>
      </section>

      <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 print:hidden"><FileSpreadsheet size={17} />Excel export includes the employee details, activity table, and total hours.</p>
    </DashboardShell>
  );
}

function Detail({ label, value }: { label: string; value?: string }) { return <div className="border-b border-r border-slate-300 px-4 py-3 last:border-r-0"><span className="font-semibold text-slate-600">{label}: </span><span className="text-slate-950">{value || "—"}</span></div>; }
function Signature({ label, name }: { label: string; name?: string }) { return <div><div className="h-10 border-b border-slate-500" /><p className="mt-2 font-semibold text-slate-700">{label}</p>{name && <p className="text-slate-500">{name}</p>}</div>; }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
function formatDay(value: string) { return new Intl.DateTimeFormat("en", { weekday: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }

function exportSpreadsheet(timesheet: Timesheet) {
  const rows = [
    ["EMPLOYEE PERFORMANCE TIMESHEET"],
    ["Period", timesheet.period.label],
    ["Employee", timesheet.employee.name],
    ["Employee number", timesheet.employee.employeeNumber],
    ["Job title", timesheet.employee.jobTitle],
    ["Department", timesheet.employee.department],
    [],
    ["Date", "Day", "Project", "Activity / Task", "Start Time", "End Time", "Hours Worked", "Output / Deliverable", "Work Location"],
    ...timesheet.activities.map((entry) => [formatDate(entry.date), formatDay(entry.date), entry.project, `${entry.activity}${entry.description && entry.description !== entry.activity ? ` — ${entry.description}` : ""}`, entry.startTime, entry.endTime, entry.hours, entry.output, entry.workLocation]),
    [], ["Total hours worked", "", "", "", "", "", timesheet.totalHours],
  ];
  const xml = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Timesheet"><Table>${rows.map((row) => `<Row>${row.map((cell) => `<Cell><Data ss:Type="${typeof cell === "number" ? "Number" : "String"}">${escapeXml(String(cell ?? ""))}</Data></Cell>`).join("")}</Row>`).join("")}</Table></Worksheet></Workbook>`;
  const file = new Blob([xml], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = `timesheet-${timesheet.period.year}-${String(timesheet.period.month).padStart(2, "0")}.xls`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function escapeXml(value: string) { return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ?? character); }
