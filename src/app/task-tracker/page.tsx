"use client";

import { useEffect, useMemo, useState } from "react";
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
import { calculateOverallCompletion } from "../../../lib/completion-progress";

type CompletionRates = {
  taskCompletionRate: number;
  timesheetSubmissionRate: number;
  supervisorApprovalRate: number;
};

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



export default function TaskTrackerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completionRates, setCompletionRates] = useState<CompletionRates>({
    taskCompletionRate: 0,
    timesheetSubmissionRate: 0,
    supervisorApprovalRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Unable to load tasks.");
        setTasks(data.tasks);
        setCompletionRates(data.completionComponents);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Unable to load tasks.");
      } finally {
        setIsLoading(false);
      }
    }
    void loadTasks();
  }, []);

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


  const completion = calculateOverallCompletion(completionRates);

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
          title="Completion progress"
          value={`${completion.overallRate}%`}
          description="Combined weighted score"
          icon={CalendarDays}
        />
      </section>

      <section className="mt-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900">Overall completion progress</h2>
            <p className="mt-1 text-sm text-slate-500">Weighted from task completion, timesheet submission, and supervisor approval.</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">{completion.overallRate}%</p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${completion.overallRate}%` }} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <CompletionPart label="Task completion" rate={completion.components.taskCompletionRate} weight="50%" />
          <CompletionPart label="Timesheet submission" rate={completion.components.timesheetSubmissionRate} weight="30%" />
          <CompletionPart label="Supervisor approval" rate={completion.components.supervisorApprovalRate} weight="20%" />
        </div>
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
              {isLoading && (
                <tr><td colSpan={9} className="px-6 py-12 text-center text-slate-500">Loading tasks from the database...</td></tr>
              )}
              {loadError && (
                <tr><td colSpan={9} className="px-6 py-12 text-center text-red-600">{loadError}</td></tr>
              )}
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
function CompletionPart({ label, rate, weight }: { label: string; rate: number; weight: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">Weight {weight}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{Math.round(rate)}%</p>
    </div>
  );
}

