import DashboardShell from "../../components/layout/DashboardShell";
import WeeklyActivityOverview from "../../components/dashboard/WeeklyActivityOverview";

export default function WeeklyActivitiesPage() {
  return (
    <DashboardShell>
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">Activity Monitoring</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">Weekly Activities</h1>
          <p className="mt-1 max-w-2xl text-slate-500">Track recorded work across the week and quickly identify completed, in-progress and missing weekday activities.</p>
        </div>
        <a href="/activities" className="inline-flex w-fit items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Record activity</a>
      </section>

      <WeeklyActivityOverview filters />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusGuide title="Completed" description="Work marked as completed." colour="bg-emerald-500" />
        <StatusGuide title="In progress" description="Work that is still underway." colour="bg-amber-500" />
        <StatusGuide title="Draft" description="Work saved but not submitted." colour="bg-slate-400" />
        <StatusGuide title="Missing weekday record" description="A weekday with no activity recorded." colour="bg-red-500" />
      </section>
    </DashboardShell>
  );
}

function StatusGuide({ title, description, colour }: { title: string; description: string; colour: string }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${colour}`} /><h2 className="font-bold text-slate-900">{title}</h2></div><p className="mt-3 text-sm text-slate-500">{description}</p></article>;
}
