const activities = [
  {
    id: 1,
    date: "26 July 2026",
    activity: "Updated university website content",
    project: "Website Management",
    hours: 4,
    status: "Completed",
  },
  {
    id: 2,
    date: "25 July 2026",
    activity: "Prepared staff performance documentation",
    project: "Performance Management",
    hours: 3,
    status: "In Progress",
  },
  {
    id: 3,
    date: "24 July 2026",
    activity: "Reviewed faculty website interface",
    project: "Faculty Website",
    hours: 5,
    status: "Completed",
  },
];

export default function RecentActivities() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="font-semibold text-slate-900">Recent activities</h3>
          <p className="text-sm text-slate-500">
            Your latest submitted daily activities
          </p>
        </div>

        <button
          type="button"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Activity</th>
              <th className="px-5 py-3">Project</th>
              <th className="px-5 py-3">Hours</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {activity.date}
                </td>

                <td className="min-w-64 px-5 py-4 font-medium text-slate-900">
                  {activity.activity}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {activity.project}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {activity.hours}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      activity.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}