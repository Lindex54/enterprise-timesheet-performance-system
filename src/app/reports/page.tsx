"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileDown,
  FileSpreadsheet,
  FileText,
  ListChecks,
  Printer,
  Target,
} from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";

type ActivitySummary = {
  id: number;
  workArea: string;
  activities: number;
  completed: number;
  hours: number;
  completionRate: number;
};

const activitySummary: ActivitySummary[] = [
  {
    id: 1,
    workArea: "University Website Management",
    activities: 8,
    completed: 7,
    hours: 42,
    completionRate: 88,
  },
  {
    id: 2,
    workArea: "Content Development",
    activities: 6,
    completed: 6,
    hours: 31,
    completionRate: 100,
  },
  {
    id: 3,
    workArea: "System Development",
    activities: 5,
    completed: 3,
    hours: 29,
    completionRate: 60,
  },
  {
    id: 4,
    workArea: "Research and Reporting",
    activities: 5,
    completed: 4,
    hours: 24,
    completionRate: 80,
  },
];

const achievements = [
  "Completed and published multiple university website articles.",
  "Prepared the preliminary documentation for the Timesheet and Performance Management System.",
  "Reviewed and improved the faculty website interface.",
  "Maintained consistent daily activity submissions throughout the month.",
];

const challenges = [
  "Some website assignments were delayed because feedback was received late.",
  "Competing assignments affected the timely completion of one urgent reporting task.",
  "A few activities required additional technical support before completion.",
];

const recommendations = [
  "Set clear review timelines for assignments that require supervisor feedback.",
  "Prioritise urgent reporting tasks at the beginning of each work week.",
  "Continue using the task tracker to monitor pending and overdue work.",
];

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [reportType, setReportType] = useState("Monthly Performance Report");

  const totals = useMemo(() => {
    return activitySummary.reduce(
      (result, item) => {
        result.activities += item.activities;
        result.completed += item.completed;
        result.hours += item.hours;
        return result;
      },
      {
        activities: 0,
        completed: 0,
        hours: 0,
      },
    );
  }, []);

  const completionRate =
    totals.activities === 0
      ? 0
      : Math.round((totals.completed / totals.activities) * 100);

  function handlePrint() {
    window.print();
  }

  function handleFrontendDownload(format: "PDF" | "Excel") {
    alert(
      `${format} export will be connected during the backend and report-generation phase.`,
    );
  }

  return (
    <DashboardShell>
      <section className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Reporting and Documentation
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
            Reports
          </h1>

          <p className="mt-1 max-w-3xl text-slate-500">
            Review, print and export monthly timesheet and performance reports.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => handleFrontendDownload("PDF")}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <FileDown size={18} />
            Export PDF
          </button>

          <button
            type="button"
            onClick={() => handleFrontendDownload("Excel")}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            <FileSpreadsheet size={18} />
            Export Excel
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Printer size={18} />
            Print report
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Report type
            </span>

            <select
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
              className="form-input"
            >
              <option>Monthly Performance Report</option>
              <option>Timesheet Report</option>
              <option>Task Completion Report</option>
              <option>Annual Performance Summary</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Month
            </span>

            <select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="form-input"
            >
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Year
            </span>

            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="form-input"
            >
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Download size={18} />
              Generate report
            </button>
          </div>
        </div>
      </section>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ReportSummaryCard
          title="Total activities"
          value={totals.activities.toString()}
          description={`${selectedMonth} ${selectedYear}`}
          icon={ListChecks}
        />

        <ReportSummaryCard
          title="Completed activities"
          value={totals.completed.toString()}
          description={`${completionRate}% completion rate`}
          icon={CheckCircle2}
        />

        <ReportSummaryCard
          title="Total hours"
          value={totals.hours.toString()}
          description="Hours recorded during the period"
          icon={Clock3}
        />

        <ReportSummaryCard
          title="Performance score"
          value="86%"
          description="Overall monthly assessment"
          icon={Target}
        />
      </section>

      <section
        id="printable-report"
        className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-200 bg-slate-950 px-6 py-7 text-white">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
                Timesheet and Performance Management System
              </p>

              <h2 className="mt-2 text-2xl font-bold">{reportType}</h2>

              <p className="mt-2 text-sm text-slate-300">
                Reporting period: {selectedMonth} {selectedYear}
              </p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Report status
              </p>

              <p className="mt-1 font-semibold text-emerald-400">
                Ready for review
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <ReportInformation
              label="Employee"
              value="Godwin Malinde"
            />

            <ReportInformation
              label="Position"
              value="ICT Fellow"
            />

            <ReportInformation
              label="Department"
              value="University Library"
            />

            <ReportInformation
              label="Supervisor"
              value="Immediate Supervisor"
            />
          </section>

          <section className="mt-8">
            <h3 className="text-lg font-bold text-slate-900">
              Executive summary
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              During {selectedMonth} {selectedYear}, the employee recorded{" "}
              <strong>{totals.activities} activities</strong> across website
              management, content development, system development, research
              and reporting. A total of <strong>{totals.hours} working hours</strong>{" "}
              were recorded, and <strong>{totals.completed} activities</strong>{" "}
              were completed. The resulting completion rate was{" "}
              <strong>{completionRate}%</strong>, while the overall performance
              score was assessed at <strong>86%</strong>.
            </p>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center gap-3">
              <CalendarDays className="text-blue-600" size={22} />

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Work-area summary
                </h3>

                <p className="text-sm text-slate-500">
                  Consolidated activity and working-hour distribution
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-190 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Work area</th>
                    <th className="px-5 py-4">Activities</th>
                    <th className="px-5 py-4">Completed</th>
                    <th className="px-5 py-4">Hours</th>
                    <th className="px-5 py-4">Completion</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {activitySummary.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {item.workArea}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {item.activities}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {item.completed}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {item.hours}
                      </td>

                      <td className="min-w-52 px-5 py-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Progress
                          </span>

                          <span className="text-xs font-bold text-slate-700">
                            {item.completionRate}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                              width: `${item.completionRate}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-slate-50 font-semibold text-slate-900">
                  <tr>
                    <td className="px-5 py-4">Total</td>
                    <td className="px-5 py-4">{totals.activities}</td>
                    <td className="px-5 py-4">{totals.completed}</td>
                    <td className="px-5 py-4">{totals.hours}</td>
                    <td className="px-5 py-4">{completionRate}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-3">
            <ReportListSection
              title="Key achievements"
              items={achievements}
              variant="success"
            />

            <ReportListSection
              title="Challenges encountered"
              items={challenges}
              variant="warning"
            />

            <ReportListSection
              title="Recommendations"
              items={recommendations}
              variant="info"
            />
          </section>

          <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <FileText size={23} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Performance conclusion
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  The employee demonstrated very good performance during the
                  reporting period. The recorded activities show consistency,
                  good task completion and effective contribution to institutional
                  website management, content development and system-related
                  assignments. Continued attention should be given to urgent
                  tasks and assignments that depend on timely feedback.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 border-t border-slate-200 pt-8 md:grid-cols-2">
            <SignatureArea
              title="Employee confirmation"
              name="Godwin Malinde"
            />

            <SignatureArea
              title="Supervisor approval"
              name="Immediate Supervisor"
            />
          </section>
        </div>
      </section>
    </DashboardShell>
  );
}

type ReportSummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
};

function ReportSummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: ReportSummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">{description}</p>
    </article>
  );
}

function ReportInformation({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-bold text-slate-900">{value}</p>
    </div>
  );
}

type ReportListSectionProps = {
  title: string;
  items: string[];
  variant: "success" | "warning" | "info";
};

function ReportListSection({
  title,
  items,
  variant,
}: ReportListSectionProps) {
  const styles = {
    success: {
      container: "border-emerald-200 bg-emerald-50",
      number: "bg-emerald-200 text-emerald-800",
      heading: "text-emerald-900",
    },
    warning: {
      container: "border-amber-200 bg-amber-50",
      number: "bg-amber-200 text-amber-800",
      heading: "text-amber-900",
    },
    info: {
      container: "border-blue-200 bg-blue-50",
      number: "bg-blue-200 text-blue-800",
      heading: "text-blue-900",
    },
  };

  const currentStyle = styles[variant];

  return (
    <article
      className={`rounded-xl border p-5 ${currentStyle.container}`}
    >
      <h3 className={`font-bold ${currentStyle.heading}`}>{title}</h3>

      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div key={item} className="flex gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${currentStyle.number}`}
            >
              {index + 1}
            </span>

            <p className="text-sm leading-6 text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function SignatureArea({
  title,
  name,
}: {
  title: string;
  name: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>

      <div className="mt-10 border-b border-slate-400" />

      <div className="mt-3 flex justify-between gap-4 text-sm text-slate-500">
        <span>{name}</span>
        <span>Date</span>
      </div>
    </div>
  );
}