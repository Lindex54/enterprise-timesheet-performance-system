const tasks = [
  {
    id: 1,
    name: "University website content update",
    progress: 90,
  },
  {
    id: 2,
    name: "Timesheet system preliminary documentation",
    progress: 70,
  },
  {
    id: 3,
    name: "Faculty website development",
    progress: 55,
  },
];

export default function TaskProgress() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="font-semibold text-slate-900">Task progress</h3>
        <p className="text-sm text-slate-500">
          Progress on your current assignments
        </p>
      </div>

      <div className="space-y-6">
        {tasks.map((task) => (
          <div key={task.id}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-slate-700">{task.name}</p>
              <span className="text-sm font-semibold text-slate-900">
                {task.progress}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}