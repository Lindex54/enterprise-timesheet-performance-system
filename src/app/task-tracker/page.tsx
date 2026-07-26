"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  ListTodo,
  Pencil,
  Search,
} from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";

type TaskStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "Overdue";

type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

type Task = {
  id: number;
  taskCode: string;
  title: string;
  project: string;
  assignedDate: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  hoursWorked: number;
};

const initialTasks: Task[] = [
  {
    id: 1,
    taskCode: "TSK-001",
    title: "Update university website content",
    project: "University Website",
    assignedDate: "2026-07-20",
    dueDate: "2026-07-28",
    priority: "High",
    status: "In Progress",
    progress: 90,
    hoursWorked: 10,
  },
  {
    id: 2,
    taskCode: "TSK-002",
    title: "Prepare timesheet system documentation",
    project: "Timesheet System",
    assignedDate: "2026-07-22",
    dueDate: "2026-07-30",
    priority: "High",
    status: "In Progress",
    progress: 70,
    hoursWorked: 8,
  },
  {
    id: 3,
    taskCode: "TSK-003",
    title: "Review faculty website interface",
    project: "Faculty Website",
    assignedDate: "2026-07-18",
    dueDate: "2026-07-24",
    priority: "Medium",
    status: "Completed",
    progress: 100,
    hoursWorked: 5,
  },
  {
    id: 4,
    taskCode: "TSK-004",
    title: "Prepare monthly ICT performance report",
    project: "Performance Reporting",
    assignedDate: "2026-07-15",
    dueDate: "2026-07-23",
    priority: "Urgent",
    status: "Overdue",
    progress: 45,
    hoursWorked: 4,
  },
  {
    id: 5,
    taskCode: "TSK-005",
    title: "Upload research publication content",
    project: "Content Development",
    assignedDate: "2026-07-25",
    dueDate: "2026-08-02",
    priority: "Low",
    status: "Not Started",
    progress: 0,
    hoursWorked: 0,
  },
];

export default function TaskTrackerPage() {
  const [tasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress",
  ).length;

  const overdueTasks = tasks.filter(
    (task) => task.status === "Overdue",
  ).length;

  const averageProgress =
    tasks.length === 0
      ? 0
      : Math.round(
          tasks.reduce((total, task) => total + task.progress, 0) /
            tasks.length,
        );

  return (
    <DashboardShell>
      <section className="mb-7">
        <p className="text-sm font-semibold text-blue-600">
          Work Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
          Task Tracker
        </h1>

        <p className="mt-1 text-slate-500">
          Monitor assigned tasks, completion progress, deadlines and priorities.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Total tasks"
          value={tasks.length.toString()}
          description="All assigned tasks"
          icon={ListTodo}
        />

        <SummaryCard
          title="Completed"
          value={completedTasks.toString()}
          description="Successfully completed"
          icon={CheckCircle2}
        />

        <SummaryCard
          title="In progress"
          value={inProgressTasks.toString()}
          description="Currently being worked on"
          icon={Clock3}
        />

        <SummaryCard
          title="Overdue"
          value={overdueTasks.toString()}
          description="Past the expected deadline"
          icon={AlertTriangle}
        />

        <SummaryCard
          title="Average progress"
          value={`${averageProgress}%`}
          description="Overall task completion"
          icon={CalendarDays}
        />
      </section>

      <section className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Assigned tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track all tasks generated from daily activities and assignments.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search tasks..."
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All statuses</option>
                <option value="Not Started">Not started</option>
                <option value="In Progress">In progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-275 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Assigned</th>
                <th className="px-6 py-4">Due date</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50">
                  <td className="min-w-72 px-6 py-4">
                    <p className="text-xs font-semibold text-blue-600">
                      {task.taskCode}
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {task.title}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {task.project}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {formatDate(task.assignedDate)}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {formatDate(task.dueDate)}
                  </td>

                  <td className="px-6 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  <td className="min-w-48 px-6 py-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Completion
                      </span>

                      <span className="text-xs font-bold text-slate-700">
                        {task.progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          task.status === "Overdue"
                            ? "bg-red-500"
                            : task.status === "Completed"
                              ? "bg-emerald-500"
                              : "bg-blue-600"
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {task.hoursWorked}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`View ${task.title}`}
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`Edit ${task.title}`}
                      >
                        <Pencil size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="px-6 py-16 text-center">
            <ListTodo className="mx-auto text-slate-300" size={44} />

            <h3 className="mt-4 font-semibold text-slate-900">
              No tasks found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing the search term or selected filters.
            </p>
          </div>
        )}

        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-500 sm:flex-row sm:items-center">
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredTasks.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {tasks.length}
            </span>{" "}
            tasks
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
            >
              Previous
            </button>

            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
            >
              1
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
};

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
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

function StatusBadge({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, string> = {
    "Not Started": "bg-slate-100 text-slate-700",
    "In Progress": "bg-amber-100 text-amber-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Overdue: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles: Record<TaskPriority, string> = {
    Low: "bg-slate-100 text-slate-600",
    Medium: "bg-blue-100 text-blue-700",
    High: "bg-orange-100 text-orange-700",
    Urgent: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}