import {
  CheckCircle2,
  Clock3,
  ListChecks,
  TrendingUp,
} from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import RecentActivities from "../../components/dashboard/RecentActivities";
import StatCard from "../../components/dashboard/StatCard";
import TaskProgress from "../../components/dashboard/TaskProgress";
import WeeklyActivityOverview from "../../components/dashboard/WeeklyActivityOverview";
import { calculateOverallCompletion } from "../../../lib/completion-progress";

export default function DashboardPage() {
  const completion = calculateOverallCompletion({
    taskCompletionRate: 90,
    timesheetSubmissionRate: 100,
    supervisorApprovalRate: 80,
  });
  return (
    <DashboardShell>
      <section className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Sunday, 26 July 2026
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
            Good afternoon, Godwin
          </h1>

          <p className="mt-1 text-slate-500">
            Here is an overview of your work and performance this month.
          </p>
        </div>

        <a
          href="/activities"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add daily activity
        </a>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total activities"
          value="24"
          description="Activities recorded this month"
          icon={ListChecks}
        />

        <StatCard
          title="Hours worked"
          value="126"
          description="Out of 160 expected hours"
          icon={Clock3}
        />

        <StatCard
          title="Completed tasks"
          value="18"
          description="Three tasks currently in progress"
          icon={CheckCircle2}
        />

        <StatCard
          title="Completion rate"
          value={`${completion.overallRate}%`}
          description="Combined weighted completion"
          icon={TrendingUp}
        />
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-3">
        <CompletionComponent label="Task completion" value={completion.components.taskCompletionRate} weight="50%" />
        <CompletionComponent label="Timesheet submission" value={completion.components.timesheetSubmissionRate} weight="30%" />
        <CompletionComponent label="Supervisor approval" value={completion.components.supervisorApprovalRate} weight="20%" />
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <RecentActivities />
        <TaskProgress />
      </section>

      <WeeklyActivityOverview />

      <section className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Monthly submission
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">
            July timesheet
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Your monthly report is currently being prepared.
          </p>

          <div className="mt-5 flex items-center justify-between">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              In progress
            </span>
            <span className="text-sm font-semibold text-slate-700">82%</span>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Pending approval
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">3</h3>
          <p className="mt-2 text-sm text-slate-500">
            Activities waiting for supervisor review.
          </p>

          <button
            type="button"
            className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Review submissions
          </button>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2 xl:col-span-1">
          <p className="text-sm font-medium text-slate-500">
            Current performance
          </p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">Very good</h3>
          <p className="mt-2 text-sm text-slate-500">
            Your performance score for July is 86%.
          </p>

          <a
            href="/performance"
            className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View performance details
          </a>
        </article>
      </section>
    </DashboardShell>
  );
}
function CompletionComponent({ label, value, weight }: { label: string; value: number; weight: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
      <span className="font-medium text-slate-600">{label}</span>
      <span className="font-bold text-slate-900">{value}% <span className="text-xs text-slate-400">({weight})</span></span>
    </div>
  );
}
