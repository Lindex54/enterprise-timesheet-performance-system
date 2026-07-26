"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  MessageSquareText,
  RotateCcw,
  Search,
  Send,
  TriangleAlert,
  UsersRound,
  X,
} from "lucide-react";
import SupervisorShell from "../../../components/supervisor/SupervisorShell";

type TimesheetStatus =
  | "Pending"
  | "Approved"
  | "Returned"
  | "Draft";

type TimesheetActivity = {
  id: number;
  date: string;
  activity: string;
  project: string;
  hours: number;
  output: string;
};

type TimesheetSubmission = {
  id: number;
  employee: string;
  initials: string;
  position: string;
  employeeNumber: string;
  department: string;
  month: string;
  year: number;
  submittedDate: string;
  totalActivities: number;
  totalHours: number;
  expectedHours: number;
  status: TimesheetStatus;
  employeeRemarks: string;
  supervisorFeedback: string;
  activities: TimesheetActivity[];
};

const initialTimesheets: TimesheetSubmission[] = [
  {
    id: 1,
    employee: "Aaron Kalamya",
    initials: "AK",
    position: "Content Developer",
    employeeNumber: "BU-CD-001",
    department: "University Library",
    month: "July",
    year: 2026,
    submittedDate: "2026-07-26",
    totalActivities: 4,
    totalHours: 24,
    expectedHours: 160,
    status: "Pending",
    employeeRemarks:
      "All completed activities for the reporting period have been included.",
    supervisorFeedback: "",
    activities: [
      {
        id: 1,
        date: "2026-07-21",
        activity: "Prepared university website news article",
        project: "Content Development",
        hours: 6,
        output: "Publication-ready article",
      },
      {
        id: 2,
        date: "2026-07-22",
        activity: "Updated staff profile content",
        project: "University Website",
        hours: 5,
        output: "Updated staff profile records",
      },
      {
        id: 3,
        date: "2026-07-23",
        activity: "Reviewed institutional web pages",
        project: "Website Quality Review",
        hours: 6,
        output: "Website review findings",
      },
      {
        id: 4,
        date: "2026-07-24",
        activity: "Prepared monthly content report",
        project: "Reporting",
        hours: 7,
        output: "Monthly content development report",
      },
    ],
  },
  {
    id: 2,
    employee: "Godwin Malinde",
    initials: "GM",
    position: "ICT Officer",
    employeeNumber: "BU-ICT-002",
    department: "University Library",
    month: "July",
    year: 2026,
    submittedDate: "2026-07-25",
    totalActivities: 3,
    totalHours: 22,
    expectedHours: 160,
    status: "Approved",
    employeeRemarks:
      "System maintenance and website tasks were completed successfully.",
    supervisorFeedback: "Timesheet reviewed and approved.",
    activities: [
      {
        id: 1,
        date: "2026-07-21",
        activity: "Updated staff directory module",
        project: "University Website",
        hours: 8,
        output: "Updated staff directory",
      },
      {
        id: 2,
        date: "2026-07-22",
        activity: "Tested website forms",
        project: "Website Maintenance",
        hours: 6,
        output: "Completed form test report",
      },
      {
        id: 3,
        date: "2026-07-23",
        activity: "Configured system backup",
        project: "ICT Support",
        hours: 8,
        output: "Verified system backup",
      },
    ],
  },
  {
    id: 3,
    employee: "Brian Mwarisi",
    initials: "BM",
    position: "Systems Developer",
    employeeNumber: "BU-SD-003",
    department: "ICT Directorate",
    month: "July",
    year: 2026,
    submittedDate: "2026-07-24",
    totalActivities: 3,
    totalHours: 20,
    expectedHours: 160,
    status: "Returned",
    employeeRemarks:
      "The system development activities are still in progress.",
    supervisorFeedback:
      "Please provide clearer outputs for the second activity.",
    activities: [
      {
        id: 1,
        date: "2026-07-20",
        activity: "Designed task tracker interface",
        project: "Timesheet System",
        hours: 8,
        output: "Task tracker frontend",
      },
      {
        id: 2,
        date: "2026-07-21",
        activity: "Worked on performance module",
        project: "Timesheet System",
        hours: 6,
        output: "Module work",
      },
      {
        id: 3,
        date: "2026-07-22",
        activity: "Tested dashboard responsiveness",
        project: "Timesheet System",
        hours: 6,
        output: "Responsive dashboard",
      },
    ],
  },
  {
    id: 4,
    employee: "Gerald Kisombo",
    initials: "GK",
    position: "M&E Officer",
    employeeNumber: "BU-ME-004",
    department: "Planning Directorate",
    month: "July",
    year: 2026,
    submittedDate: "2026-07-23",
    totalActivities: 2,
    totalHours: 12,
    expectedHours: 160,
    status: "Draft",
    employeeRemarks: "The timesheet is still being completed.",
    supervisorFeedback: "",
    activities: [
      {
        id: 1,
        date: "2026-07-21",
        activity: "Reviewed performance indicators",
        project: "Performance Monitoring",
        hours: 6,
        output: "Reviewed KPI list",
      },
      {
        id: 2,
        date: "2026-07-22",
        activity: "Prepared M&E training notes",
        project: "Staff Training",
        hours: 6,
        output: "Draft training notes",
      },
    ],
  },
];

export default function TimesheetApprovalsPage() {
  const [timesheets, setTimesheets] =
    useState<TimesheetSubmission[]>(initialTimesheets);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [selectedTimesheet, setSelectedTimesheet] =
    useState<TimesheetSubmission | null>(null);

  const filteredTimesheets = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return timesheets.filter((timesheet) => {
      const matchesSearch =
        timesheet.employee.toLowerCase().includes(search) ||
        timesheet.employeeNumber.toLowerCase().includes(search) ||
        timesheet.department.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        timesheet.status === statusFilter;

      const matchesMonth =
        monthFilter === "All" ||
        timesheet.month === monthFilter;

      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [timesheets, searchTerm, statusFilter, monthFilter]);

  const pendingCount = timesheets.filter(
    (timesheet) => timesheet.status === "Pending",
  ).length;

  const approvedCount = timesheets.filter(
    (timesheet) => timesheet.status === "Approved",
  ).length;

  const returnedCount = timesheets.filter(
    (timesheet) => timesheet.status === "Returned",
  ).length;

  const totalHours = timesheets.reduce(
    (total, timesheet) => total + timesheet.totalHours,
    0,
  );

  function updateTimesheet(
    timesheetId: number,
    status: TimesheetStatus,
    feedback: string,
  ) {
    setTimesheets((currentTimesheets) =>
      currentTimesheets.map((timesheet) =>
        timesheet.id === timesheetId
          ? {
              ...timesheet,
              status,
              supervisorFeedback: feedback,
            }
          : timesheet,
      ),
    );

    setSelectedTimesheet(null);
  }

  return (
    <SupervisorShell>
      <section className="mb-7">
        <p className="text-sm font-semibold text-blue-600">
          Review and Approval
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 lg:text-3xl">
          Timesheet Approvals
        </h1>

        <p className="mt-1 max-w-3xl text-slate-500">
          Review employee timesheets, verify recorded activities and approve
          or return submissions for correction.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Total submissions"
          value={timesheets.length.toString()}
          description="All listed timesheets"
          icon={FileText}
        />

        <SummaryCard
          title="Pending review"
          value={pendingCount.toString()}
          description="Awaiting your decision"
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
          description="Require corrections"
          icon={TriangleAlert}
        />

        <SummaryCard
          title="Recorded hours"
          value={totalHours.toString()}
          description="Across listed submissions"
          icon={CalendarDays}
        />
      </section>

      <section className="mt-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
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
              placeholder="Search employee, number or department..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

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

          <select
            value={monthFilter}
            onChange={(event) =>
              setMonthFilter(event.target.value)
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
          </select>
        </div>
      </section>

      <section className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Submitted timesheets
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a submission to review its full activity record.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredTimesheets.length}
            </span>{" "}
            of {timesheets.length}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-275 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Activities</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4">Completion</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTimesheets.map((timesheet) => {
                const completion =
                  timesheet.expectedHours === 0
                    ? 0
                    : Math.round(
                        (timesheet.totalHours /
                          timesheet.expectedHours) *
                          100,
                      );

                return (
                  <tr
                    key={timesheet.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {timesheet.initials}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {timesheet.employee}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {timesheet.position}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {timesheet.month} {timesheet.year}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {formatDate(timesheet.submittedDate)}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {timesheet.totalActivities}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {timesheet.totalHours}
                    </td>

                    <td className="min-w-44 px-6 py-4">
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-slate-500">
                          Recorded
                        </span>

                        <span className="font-bold text-slate-700">
                          {completion}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${Math.min(completion, 100)}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={timesheet.status} />
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTimesheet(timesheet)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={16} />
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTimesheets.length === 0 && (
          <div className="px-6 py-16 text-center">
            <UsersRound
              size={45}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-bold text-slate-900">
              No submissions found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Change the search term or selected filters.
            </p>
          </div>
        )}
      </section>

      {selectedTimesheet && (
        <TimesheetReviewPanel
          timesheet={selectedTimesheet}
          onClose={() => setSelectedTimesheet(null)}
          onApprove={(feedback) =>
            updateTimesheet(
              selectedTimesheet.id,
              "Approved",
              feedback,
            )
          }
          onReturn={(feedback) =>
            updateTimesheet(
              selectedTimesheet.id,
              "Returned",
              feedback,
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

type TimesheetReviewPanelProps = {
  timesheet: TimesheetSubmission;
  onClose: () => void;
  onApprove: (feedback: string) => void;
  onReturn: (feedback: string) => void;
};

function TimesheetReviewPanel({
  timesheet,
  onClose,
  onApprove,
  onReturn,
}: TimesheetReviewPanelProps) {
  const [feedback, setFeedback] = useState(
    timesheet.supervisorFeedback,
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50">
      <button
        type="button"
        aria-label="Close timesheet review"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <aside className="relative z-10 h-full w-full max-w-4xl overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Timesheet Review
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {timesheet.employee}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-7 p-6">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InformationCard
              label="Employee number"
              value={timesheet.employeeNumber}
            />

            <InformationCard
              label="Department"
              value={timesheet.department}
            />

            <InformationCard
              label="Reporting period"
              value={`${timesheet.month} ${timesheet.year}`}
            />

            <InformationCard
              label="Total hours"
              value={`${timesheet.totalHours} hours`}
            />
          </section>

          <section>
            <div className="mb-4">
              <h3 className="font-bold text-slate-900">
                Recorded activities
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review the activities included in this submission.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Activity</th>
                    <th className="px-5 py-4">Project</th>
                    <th className="px-5 py-4">Output</th>
                    <th className="px-5 py-4">Hours</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {timesheet.activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {formatDate(activity.date)}
                      </td>

                      <td className="min-w-64 px-5 py-4 font-semibold text-slate-900">
                        {activity.activity}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {activity.project}
                      </td>

                      <td className="min-w-56 px-5 py-4 text-slate-600">
                        {activity.output}
                      </td>

                      <td className="px-5 py-4 font-bold text-slate-700">
                        {activity.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-slate-50 font-bold text-slate-900">
                  <tr>
                    <td className="px-5 py-4" colSpan={4}>
                      Total recorded hours
                    </td>

                    <td className="px-5 py-4">
                      {timesheet.totalHours}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-700">
              Employee remarks
            </h3>

            <p className="mt-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {timesheet.employeeRemarks}
            </p>
          </section>

          <section>
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
              placeholder="Enter approval comments or corrections required..."
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </section>
        </div>

        <div className="sticky bottom-0 z-20 flex flex-col gap-3 border-t border-slate-200 bg-white px-6 py-5 sm:flex-row">
          <button
            type="button"
            onClick={() => onReturn(feedback)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            <RotateCcw size={18} />
            Return for correction
          </button>

          <button
            type="button"
            onClick={() => onApprove(feedback)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Send size={18} />
            Approve timesheet
          </button>
        </div>
      </aside>
    </div>
  );
}

function InformationCard({
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

      <p className="mt-2 font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: TimesheetStatus;
}) {
  const styles: Record<TimesheetStatus, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Returned: "bg-red-100 text-red-700",
    Draft: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
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