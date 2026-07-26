"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  ListChecks,
  Target,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import SupervisorShell from "../../../components/supervisor/SupervisorShell";

type EmployeePerformance = {
  id: number;
  name: string;
  initials: string;
  position: string;
  activities: number;
  completedTasks: number;
  hours: number;
  performance: number;
  status: "Excellent" | "Very Good" | "Good" | "Needs Attention";
};

type PendingApproval = {
  id: number;
  employee: string;
  type: string;
  period: string;
  submittedAt: string;
  status: "Pending" | "Returned";
};

const employeePerformance: EmployeePerformance[] = [
  {
    id: 1,
    name: "Aaron Kalamya",
    initials: "AK",
    position: "Content Developer",
    activities: 24,
    completedTasks: 18,
    hours: 126,
    performance: 86,
    status: "Very Good",
  },
  {
    id: 2,
    name: "Godwin Malinde",
    initials: "GM",
    position: "ICT Officer",
    activities: 21,
    completedTasks: 17,
    hours: 132,
    performance: 91,
    status: "Excellent",
  },
  {
    id: 3,
    name: "Brian Mwarisi",
    initials: "BM",
    position: "Systems Developer",
    activities: 19,
    completedTasks: 14,
    hours: 118,
    performance: 78,
    status: "Good",
  },
  {
    id: 4,
    name: "Gerald Kisombo",
    initials: "GK",
    position: "M&E Officer",
    activities: 16,
    completedTasks: 10,
    hours: 104,
    performance: 67,
    status: "Needs Attention",
  },
];

const pendingApprovals: PendingApproval[] = [
  {
    id: 1,
    employee: "Aaron Kalamya",
    type: "Monthly Timesheet",
    period: "July 2026",
    submittedAt: "26 Jul 2026",
    status: "Pending",
  },
  {
    id: 2,
    employee: "Brian Mwarisi",
    type: "Daily Activities",
    period: "25 July 2026",
    submittedAt: "25 Jul 2026",
    status: "Pending",
  },
  {
    id: 3,
    employee: "Gerald Kisombo",
    type: "Monthly Report",
    period: "July 2026",
    submittedAt: "24 Jul 2026",
    status: "Returned",
  },
];

export default function SupervisorDashboardPage() {
  return (
    <SupervisorShell>
      <section className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Supervisor Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
            Team Performance Dashboard
          </h1>

          <p className="mt-1 max-w-3xl text-slate-500">
            Monitor employee activities, approve timesheets, review tasks and
            assess team performance.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/supervisor/approvals"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ClipboardCheck size={18} />
            Review approvals
          </Link>

          <Link
            href="/supervisor/reports"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FileText size={18} />
            View reports
          </Link>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <SupervisorSummaryCard
          title="Team members"
          value="12"
          description="Employees under supervision"
          icon={UsersRound}
        />

        <SupervisorSummaryCard
          title="Pending approvals"
          value="8"
          description="Awaiting your review"
          icon={ClipboardCheck}
        />

        <SupervisorSummaryCard
          title="Team activities"
          value="80"
          description="Recorded this month"
          icon={ListChecks}
        />

        <SupervisorSummaryCard
          title="Completed tasks"
          value="59"
          description="Out of 72 assigned tasks"
          icon={CheckCircle2}
        />

        <SupervisorSummaryCard
          title="Average performance"
          value="81%"
          description="Current team average"
          icon={BarChart3}
        />
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Employee performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current monthly performance of supervised employees
              </p>
            </div>

            <Link
              href="/supervisor/performance"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Activities</th>
                  <th className="px-6 py-4">Completed tasks</th>
                  <th className="px-6 py-4">Hours</th>
                  <th className="px-6 py-4">Performance</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {employeePerformance.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {employee.initials}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {employee.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {employee.position}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-700">
                      {employee.activities}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-700">
                      {employee.completedTasks}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-700">
                      {employee.hours}
                    </td>

                    <td className="min-w-48 px-6 py-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Score
                        </span>

                        <span className="text-xs font-bold text-slate-700">
                          {employee.performance}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${getPerformanceColour(
                            employee.performance,
                          )}`}
                          style={{
                            width: `${employee.performance}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <PerformanceStatus status={employee.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pending approvals
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Submissions requiring attention
              </p>
            </div>

            <Clock3 size={22} className="text-amber-600" />
          </div>

          <div className="divide-y divide-slate-100">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {approval.employee}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {approval.type}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {approval.period} · Submitted {approval.submittedAt}
                    </p>
                  </div>

                  <ApprovalStatus status={approval.status} />
                </div>

                <Link
                  href="/supervisor/approvals"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Review submission
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-5">
            <Link
              href="/supervisor/approvals"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View all approvals
            </Link>
          </div>
        </article>
      </section>

      <section className="mt-7 grid gap-6 lg:grid-cols-3">
        <TeamInsightCard
          title="Overdue tasks"
          value="6"
          description="Tasks have passed their expected deadlines."
          icon={AlertTriangle}
          action="Review overdue tasks"
          href="/supervisor/tasks"
        />

        <TeamInsightCard
          title="Timesheet completion"
          value="83%"
          description="10 of 12 employees have submitted their timesheets."
          icon={ClipboardCheck}
          action="View submissions"
          href="/supervisor/approvals"
        />

        <TeamInsightCard
          title="Team performance"
          value="81%"
          description="The team is currently performing within the very good range."
          icon={Target}
          action="Review performance"
          href="/supervisor/performance"
        />
      </section>
    </SupervisorShell>
  );
}

type SupervisorSummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
};

function SupervisorSummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: SupervisorSummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">{description}</p>
    </article>
  );
}

type TeamInsightCardProps = {
  title: string;
  value: string;
  description: string;
  action: string;
  href: string;
  icon: React.ElementType;
};

function TeamInsightCard({
  title,
  value,
  description,
  action,
  href,
  icon: Icon,
}: TeamInsightCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>

        <span className="text-3xl font-bold text-slate-900">{value}</span>
      </div>

      <h3 className="mt-5 font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        {action}
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}

function PerformanceStatus({
  status,
}: {
  status: EmployeePerformance["status"];
}) {
  const styles: Record<EmployeePerformance["status"], string> = {
    Excellent: "bg-emerald-100 text-emerald-700",
    "Very Good": "bg-blue-100 text-blue-700",
    Good: "bg-amber-100 text-amber-700",
    "Needs Attention": "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ApprovalStatus({
  status,
}: {
  status: PendingApproval["status"];
}) {
  const styles: Record<PendingApproval["status"], string> = {
    Pending: "bg-amber-100 text-amber-700",
    Returned: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function getPerformanceColour(score: number) {
  if (score >= 90) {
    return "bg-emerald-500";
  }

  if (score >= 80) {
    return "bg-blue-600";
  }

  if (score >= 70) {
    return "bg-amber-500";
  }

  return "bg-red-500";
}