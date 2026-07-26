"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  ListChecks,
  MessageSquareText,
  Search,
  TriangleAlert,
  UsersRound,
  X,
} from "lucide-react";
import SupervisorShell from "../../../components/supervisor/SupervisorShell";

type ActivityStatus =
  | "Approved"
  | "Pending"
  | "Returned"
  | "Draft";

type ActivityPriority = "Low" | "Medium" | "High" | "Urgent";

type TeamActivity = {
  id: number;
  employee: string;
  initials: string;
  position: string;
  date: string;
  activity: string;
  project: string;
  hours: number;
  output: string;
  priority: ActivityPriority;
  status: ActivityStatus;
  challenges: string;
  remarks: string;
};

const initialActivities: TeamActivity[] = [
  {
    id: 1,
    employee: "Aaron Kalamya",
    initials: "AK",
    position: "Content Developer",
    date: "2026-07-26",
    activity: "Prepared university website news article",
    project: "Content Development",
    hours: 6,
    output: "Publication-ready university news article",
    priority: "High",
    status: "Pending",
    challenges: "Awaiting confirmation of one participant's title.",
    remarks: "Submitted for supervisor review.",
  },
  {
    id: 2,
    employee: "Godwin Malinde",
    initials: "GM",
    position: "ICT Officer",
    date: "2026-07-26",
    activity: "Updated staff directory module",
    project: "University Website",
    hours: 7,
    output: "Updated staff listing and profile links",
    priority: "High",
    status: "Approved",
    challenges: "Some profile records had incomplete information.",
    remarks: "Changes tested successfully.",
  },
  {
    id: 3,
    employee: "Brian Mwarisi",
    initials: "BM",
    position: "Systems Developer",
    date: "2026-07-25",
    activity: "Implemented task tracker interface",
    project: "Timesheet System",
    hours: 8,
    output: "Responsive task tracker frontend page",
    priority: "Urgent",
    status: "Pending",
    challenges: "Filtering logic required additional testing.",
    remarks: "Frontend complete. Backend integration pending.",
  },
  {
    id: 4,
    employee: "Gerald Kisombo",
    initials: "GK",
    position: "M&E Officer",
    date: "2026-07-25",
    activity: "Reviewed monthly performance indicators",
    project: "Performance Monitoring",
    hours: 5,
    output: "Revised KPI assessment framework",
    priority: "Medium",
    status: "Returned",
    challenges: "Some indicators were not measurable.",
    remarks: "Returned for clarification of indicator weights.",
  },
  {
    id: 5,
    employee: "Aaron Kalamya",
    initials: "AK",
    position: "Content Developer",
    date: "2026-07-24",
    activity: "Uploaded publication content",
    project: "Research Communication",
    hours: 4,
    output: "Research publication added to the website",
    priority: "Medium",
    status: "Approved",
    challenges: "Image resolution required improvement.",
    remarks: "Content published successfully.",
  },
  {
    id: 6,
    employee: "Sarah Namusoke",
    initials: "SN",
    position: "Administrative Assistant",
    date: "2026-07-24",
    activity: "Compiled departmental activity records",
    project: "Administration",
    hours: 6,
    output: "Consolidated departmental activity register",
    priority: "Low",
    status: "Draft",
    challenges: "Two staff submissions are still missing.",
    remarks: "Record will be submitted after completion.",
  },
];

export default function SupervisorActivitiesPage() {
  const [activities, setActivities] =
    useState<TeamActivity[]>(initialActivities);

  const [searchTerm, setSearchTerm] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedActivity, setSelectedActivity] =
    useState<TeamActivity | null>(null);

  const employees = useMemo(() => {
    return Array.from(
      new Set(activities.map((activity) => activity.employee)),
    );
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        activity.employee.toLowerCase().includes(search) ||
        activity.activity.toLowerCase().includes(search) ||
        activity.project.toLowerCase().includes(search) ||
        activity.output.toLowerCase().includes(search);

      const matchesEmployee =
        employeeFilter === "All" ||
        activity.employee === employeeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        activity.status === statusFilter;

      const matchesDate =
        !dateFilter || activity.date === dateFilter;

      return (
        matchesSearch &&
        matchesEmployee &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    activities,
    searchTerm,
    employeeFilter,
    statusFilter,
    dateFilter,
  ]);

  const pendingCount = activities.filter(
    (activity) => activity.status === "Pending",
  ).length;

  const approvedCount = activities.filter(
    (activity) => activity.status === "Approved",
  ).length;

  const returnedCount = activities.filter(
    (activity) => activity.status === "Returned",
  ).length;

  const totalHours = activities.reduce(
    (total, activity) => total + activity.hours,
    0,
  );

  function updateActivityStatus(
    activityId: number,
    status: ActivityStatus,
  ) {
    setActivities((currentActivities) =>
      currentActivities.map((activity) =>
        activity.id === activityId
          ? { ...activity, status }
          : activity,
      ),
    );

    setSelectedActivity((currentActivity) =>
      currentActivity?.id === activityId
        ? { ...currentActivity, status }
        : currentActivity,
    );
  }

  function clearFilters() {
    setSearchTerm("");
    setEmployeeFilter("All");
    setStatusFilter("All");
    setDateFilter("");
  }

  return (
    <SupervisorShell>
      <section className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Team Monitoring
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
            Team Activities
          </h1>

          <p className="mt-1 max-w-3xl text-slate-500">
            Review daily work recorded by employees, monitor hours and
            provide feedback on submitted activities.
          </p>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Filter size={18} />
          Clear filters
        </button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Total activities"
          value={activities.length.toString()}
          description="Activities currently recorded"
          icon={ListChecks}
        />

        <SummaryCard
          title="Pending review"
          value={pendingCount.toString()}
          description="Awaiting supervisor review"
          icon={Clock3}
        />

        <SummaryCard
          title="Approved"
          value={approvedCount.toString()}
          description="Successfully reviewed"
          icon={CheckCircle2}
        />

        <SummaryCard
          title="Returned"
          value={returnedCount.toString()}
          description="Require employee correction"
          icon={TriangleAlert}
        />

        <SummaryCard
          title="Hours recorded"
          value={totalHours.toString()}
          description="Across listed activities"
          icon={CalendarDays}
        />
      </section>

      <section className="mt-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search activities..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={employeeFilter}
            onChange={(event) =>
              setEmployeeFilter(event.target.value)
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All employees</option>

            {employees.map((employee) => (
              <option key={employee} value={employee}>
                {employee}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Returned">Returned</option>
            <option value="Draft">Draft</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </section>

      <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recorded team activities
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review employee submissions and update their status.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredActivities.length}
            </span>{" "}
            of {activities.length}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-300 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredActivities.map((activity) => (
                <tr
                  key={activity.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {activity.initials}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {activity.employee}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {activity.position}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {formatDate(activity.date)}
                  </td>

                  <td className="min-w-72 px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {activity.activity}
                    </p>

                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                      Output: {activity.output}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {activity.project}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {activity.hours}
                  </td>

                  <td className="px-6 py-4">
                    <PriorityBadge priority={activity.priority} />
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={activity.status} />
                  </td>

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedActivity(activity)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={16} />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredActivities.length === 0 && (
          <div className="px-6 py-16 text-center">
            <UsersRound
              size={45}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-bold text-slate-900">
              No activities found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Change the filters or search term and try again.
            </p>
          </div>
        )}
      </section>

      {selectedActivity && (
        <ActivityReviewPanel
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onApprove={() =>
            updateActivityStatus(
              selectedActivity.id,
              "Approved",
            )
          }
          onReturn={() =>
            updateActivityStatus(
              selectedActivity.id,
              "Returned",
            )
          }
        />
      )}
    </SupervisorShell>
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {description}
      </p>
    </article>
  );
}

type ActivityReviewPanelProps = {
  activity: TeamActivity;
  onClose: () => void;
  onApprove: () => void;
  onReturn: () => void;
};

function ActivityReviewPanel({
  activity,
  onClose,
  onApprove,
  onReturn,
}: ActivityReviewPanelProps) {
  const [feedback, setFeedback] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45">
      <button
        type="button"
        aria-label="Close activity review"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <aside className="relative z-10 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Activity Review
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Review employee activity
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {activity.initials}
            </div>

            <div>
              <p className="font-bold text-slate-900">
                {activity.employee}
              </p>

              <p className="text-sm text-slate-500">
                {activity.position}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ReviewInformation
              label="Activity date"
              value={formatDate(activity.date)}
            />

            <ReviewInformation
              label="Hours worked"
              value={`${activity.hours} hours`}
            />

            <ReviewInformation
              label="Project"
              value={activity.project}
            />

            <ReviewInformation
              label="Priority"
              value={activity.priority}
            />
          </div>

          <ReviewSection
            title="Activity performed"
            content={activity.activity}
          />

          <ReviewSection
            title="Expected output"
            content={activity.output}
          />

          <ReviewSection
            title="Challenges"
            content={activity.challenges}
          />

          <ReviewSection
            title="Employee remarks"
            content={activity.remarks}
          />

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MessageSquareText size={17} />
              Supervisor feedback
            </label>

            <textarea
              rows={5}
              value={feedback}
              onChange={(event) =>
                setFeedback(event.target.value)
              }
              placeholder="Enter comments, corrections or feedback..."
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-200 bg-white px-6 py-5 sm:flex-row">
          <button
            type="button"
            onClick={onReturn}
            className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          >
            Return for correction
          </button>

          <button
            type="button"
            onClick={onApprove}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Approve activity
          </button>
        </div>
      </aside>
    </div>
  );
}

function ReviewInformation({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function ReviewSection({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700">
        {title}
      </h3>

      <p className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        {content}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: ActivityStatus;
}) {
  const styles: Record<ActivityStatus, string> = {
    Approved: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Returned: "bg-red-100 text-red-700",
    Draft: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: ActivityPriority;
}) {
  const styles: Record<ActivityPriority, string> = {
    Low: "bg-slate-100 text-slate-700",
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