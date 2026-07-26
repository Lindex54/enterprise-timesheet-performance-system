"use client";

import { FormEvent, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FilePenLine,
  Plus,
  Save,
} from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";

type ActivityStatus = "Draft" | "Submitted" | "Completed" | "In Progress";

type Activity = {
  id: number;
  date: string;
  project: string;
  activity: string;
  description: string;
  hours: number;
  priority: string;
  status: ActivityStatus;
};

const initialActivities: Activity[] = [
  {
    id: 1,
    date: "2026-07-26",
    project: "University Website",
    activity: "Website content development",
    description: "Updated news articles and reviewed website content.",
    hours: 4,
    priority: "High",
    status: "Completed",
  },
  {
    id: 2,
    date: "2026-07-25",
    project: "Timesheet System",
    activity: "System documentation",
    description: "Prepared preliminary documentation for the proposed system.",
    hours: 3,
    priority: "High",
    status: "In Progress",
  },
  {
    id: 3,
    date: "2026-07-24",
    project: "Faculty Website",
    activity: "Interface review",
    description: "Reviewed the layout and content structure of the faculty website.",
    hours: 5,
    priority: "Medium",
    status: "Completed",
  },
];

const emptyForm = {
  date: "",
  project: "",
  activity: "",
  description: "",
  hours: "",
  priority: "Medium",
  status: "In Progress",
  expectedOutput: "",
  challenges: "",
  remarks: "",
};

export default function ActivitiesPage() {
  const [activities, setActivities] =
    useState<Activity[]>(initialActivities);

  const [formData, setFormData] = useState(emptyForm);

  const [message, setMessage] = useState("");

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function saveActivity(status: "Draft" | "Submitted") {
    if (
      !formData.date ||
      !formData.project ||
      !formData.activity ||
      !formData.description ||
      !formData.hours
    ) {
      setMessage("Please complete all required fields.");
      return;
    }

    const newActivity: Activity = {
      id: Date.now(),
      date: formData.date,
      project: formData.project,
      activity: formData.activity,
      description: formData.description,
      hours: Number(formData.hours),
      priority: formData.priority,
      status,
    };

    setActivities((current) => [newActivity, ...current]);
    setFormData(emptyForm);

    setMessage(
      status === "Draft"
        ? "Activity saved as a draft."
        : "Activity submitted successfully.",
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveActivity("Submitted");
  }

  const totalHours = activities.reduce(
    (total, activity) => total + activity.hours,
    0,
  );

  const completedActivities = activities.filter(
    (activity) => activity.status === "Completed",
  ).length;

  const draftActivities = activities.filter(
    (activity) => activity.status === "Draft",
  ).length;

  return (
    <DashboardShell>
      <section className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Timesheet Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
            Daily Activities
          </h1>

          <p className="mt-1 text-slate-500">
            Record the activities and tasks you have worked on during the day.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("activity-form")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add activity
        </button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Activities recorded"
          value={activities.length.toString()}
          description="Activities entered this month"
          icon={FilePenLine}
        />

        <SummaryCard
          title="Total hours"
          value={totalHours.toString()}
          description="Hours recorded this month"
          icon={Clock3}
        />

        <SummaryCard
          title="Completed"
          value={completedActivities.toString()}
          description="Successfully completed activities"
          icon={CheckCircle2}
        />

        <SummaryCard
          title="Drafts"
          value={draftActivities.toString()}
          description="Activities not yet submitted"
          icon={Save}
        />
      </section>

      <section
        id="activity-form"
        className="mt-7 rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">
            Record daily activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Provide accurate information about the work completed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {message && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
              {message}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <FormField label="Date" required>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
              />
            </FormField>

            <FormField label="Project or work area" required>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select project</option>
                <option value="University Website">
                  University Website
                </option>
                <option value="Timesheet System">
                  Timesheet System
                </option>
                <option value="Faculty Website">Faculty Website</option>
                <option value="Content Development">
                  Content Development
                </option>
                <option value="Research and Publication">
                  Research and Publication
                </option>
                <option value="Other">Other</option>
              </select>
            </FormField>

            <FormField label="Activity title" required>
              <input
                type="text"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                placeholder="Example: Updated website content"
                className="form-input"
              />
            </FormField>

            <FormField label="Hours worked" required>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                min="0.5"
                max="24"
                step="0.5"
                placeholder="Example: 4"
                className="form-input"
              />
            </FormField>

            <FormField label="Priority">
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </FormField>

            <FormField label="Activity status">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Not Started">Not started</option>
                <option value="In Progress">In progress</option>
                <option value="Completed">Completed</option>
                <option value="Deferred">Deferred</option>
              </select>
            </FormField>
          </div>

          <div className="mt-5 grid gap-5">
            <FormField label="Activity description" required>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the work completed, the purpose and what was achieved."
                className="form-input resize-y"
              />
            </FormField>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Expected output">
                <textarea
                  name="expectedOutput"
                  value={formData.expectedOutput}
                  onChange={handleChange}
                  rows={3}
                  placeholder="What output or result was expected?"
                  className="form-input resize-y"
                />
              </FormField>

              <FormField label="Challenges encountered">
                <textarea
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe any challenges encountered."
                  className="form-input resize-y"
                />
              </FormField>
            </div>

            <FormField label="Additional remarks">
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={3}
                placeholder="Add any additional information or follow-up required."
                className="form-input resize-y"
              />
            </FormField>
          </div>

          <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() => setFormData(emptyForm)}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear form
            </button>

            <button
              type="button"
              onClick={() => saveActivity("Draft")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              <Save size={18} />
              Save draft
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <CheckCircle2 size={18} />
              Submit activity
            </button>
          </div>
        </form>
      </section>

      <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Activity history
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recently recorded daily activities.
            </p>
          </div>

          <div className="flex gap-3">
            <input
              type="search"
              placeholder="Search activities..."
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500">
              <option>All statuses</option>
              <option>Draft</option>
              <option>Submitted</option>
              <option>In progress</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {formatDate(activity.date)}
                  </td>

                  <td className="min-w-70 px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {activity.activity}
                    </p>

                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {activity.description}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {activity.project}
                  </td>

                  <td className="px-6 py-4">
                    <PriorityBadge priority={activity.priority} />
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-700">
                    {activity.hours}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={activity.status} />
                  </td>

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      <div className="flex items-start justify-between">
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

type FormFieldProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
};

function FormField({
  label,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      {children}
    </label>
  );
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const styles: Record<ActivityStatus, string> = {
    Draft: "bg-slate-100 text-slate-700",
    Submitted: "bg-blue-100 text-blue-700",
    Completed: "bg-emerald-100 text-emerald-700",
    "In Progress": "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Low: "bg-slate-100 text-slate-600",
    Medium: "bg-blue-100 text-blue-700",
    High: "bg-orange-100 text-orange-700",
    Urgent: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[priority] ?? styles.Medium
      }`}
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