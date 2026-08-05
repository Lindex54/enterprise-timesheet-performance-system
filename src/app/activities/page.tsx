"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FilePenLine,
  Plus,
  Save,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";

type ActivityStatus = "Draft" | "Submitted" | "Completed" | "In Progress";

type Activity = {
  id: number;
  projectId: number;
  date: string;
  dueDate: string;
  startTime: string;
  endTime: string;
  workLocation: string;
  evidenceLink: string;
  evidenceFileId: number | null;
  evidenceFileName: string;
  project: string;
  activity: string;
  description: string;
  hours: number;
  priority: string;
  status: ActivityStatus;
  workStatus: string;
  expectedOutput: string;
  challenges: string;
  remarks: string;
};

type Project = {
  id: number;
  name: string;
};

type Notification = {
  id: number;
  type: "success" | "error";
  title: string;
  message: string;
};

const workLocations = [
  "E-Learning Center",
  "Reference/Information Desk",
  "Office",
  "Remote",
] as const;

const activitiesPerPage = 10;

const emptyForm = {
  date: "",
  dueDate: "",
  startTime: "",
  endTime: "",
  workLocation: "",
  otherWorkLocation: "",
  evidenceLink: "",
  evidenceFileId: "",
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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);
  const [evidenceFileName, setEvidenceFileName] = useState("");
  const [evidenceInputKey, setEvidenceInputKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [selectedMonth, setSelectedMonth] = useState("latest");
  const [historyPage, setHistoryPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Activity | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  function showNotification(type: Notification["type"], title: string, notificationMessage: string) {
    setNotification({ id: Date.now(), type, title, message: notificationMessage });
  }

  useEffect(() => {
    async function loadActivities() {
      try {
        const response = await fetch("/api/activities");
        const data = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Unable to load activities.");
        setActivities(data.activities);
        setProjects(data.projects);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unable to load activities.";
        setMessage(errorMessage);
        showNotification("error", "Activities could not be loaded", errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    void loadActivities();
  }, []);


  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => {
      const next = {
        ...current,
        [name]: value,
      };

      if (name === "startTime" || name === "endTime") {
        next.hours = calculateDuration(next.startTime, next.endTime);
      }

      return next;
    });
  }

  async function handleEvidenceFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingEvidence(true);
    setMessage("");
    try {
      const uploadData = new FormData();
      uploadData.append("evidenceFile", file);
      const response = await fetch("/api/evidence-upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to upload the evidence file.");

      setFormData((current) => ({ ...current, evidenceFileId: String(data.id) }));
      setEvidenceFileName(data.fileName);
      showNotification("success", "Evidence file uploaded", "The file will be attached when you save the activity.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to upload the evidence file.";
      setMessage(errorMessage);
      showNotification("error", "Evidence file was not uploaded", errorMessage);
      setEvidenceInputKey((key) => key + 1);
    } finally {
      setIsUploadingEvidence(false);
    }
  }

  async function saveActivity(submissionStatus: "Draft" | "Submitted") {
    const requiredFields = [
      ["date", formData.date, "date"],
      ["dueDate", formData.dueDate, "due date"],
      ["startTime", formData.startTime, "start time"],
      ["endTime", formData.endTime, "end time"],
      ["project", formData.project, "project"],
      ["activity", formData.activity, "activity title"],
      ["description", formData.description, "description"],
    ] as const;
    const missingField = requiredFields.find(([, value]) => !value);
    const otherLocationIsMissing =
      formData.workLocation === "Other" && !formData.otherWorkLocation.trim();

    if (missingField || !formData.hours || otherLocationIsMissing) {
      const fieldLabel = otherLocationIsMissing
        ? "other work location"
        : missingField?.[2] ?? "valid start and end times";
      const validationMessage = `Please provide the ${fieldLabel} before updating this draft.`;
      setMessage(validationMessage);
      showNotification("error", "Activity was not saved", validationMessage);
      window.setTimeout(() => {
        const field = document.querySelector<HTMLElement>(
          `[name="${otherLocationIsMissing ? "otherWorkLocation" : missingField?.[0] ?? "startTime"}"]`,
        );
        field?.scrollIntoView({ behavior: "smooth", block: "center" });
        field?.focus();
      }, 0);
      return;
    }
    setIsSaving(true);
    setMessage("");
    try {
      const response = await fetch(editingId ? `/api/activities/${editingId}` : "/api/activities", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          workLocation:
            formData.workLocation === "Other"
              ? formData.otherWorkLocation.trim()
              : formData.workLocation,
          projectId: Number(formData.project),
          submissionStatus,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to save the activity.");
      setActivities((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? data.activity : item))
          : [data.activity, ...current],
      );
      setFormData(emptyForm);
      setEvidenceFileName("");
      setEvidenceInputKey((key) => key + 1);
      setEditingId(null);
      setMessage(data.message);
      showNotification("success", editingId ? "Draft updated successfully" : submissionStatus === "Draft" ? "Draft saved successfully" : "Activity submitted successfully", data.message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to save the activity.";
      setMessage(errorMessage);
      showNotification("error", "Activity was not saved", errorMessage);
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void saveActivity("Submitted");
  }

  const availableMonths = useMemo(
    () => Array.from(new Set(activities.map((activity) => activity.date.slice(0, 7)))).sort().reverse(),
    [activities],
  );

  const activeMonth =
    selectedMonth === "latest" ? (availableMonths[0] ?? "") : selectedMonth;

  const filteredActivities = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return activities.filter((item) =>
      item.date.slice(0, 7) === activeMonth &&
      (!search || item.activity.toLowerCase().includes(search) || item.description.toLowerCase().includes(search) || item.project.toLowerCase().includes(search)) &&
      (statusFilter === "All statuses" || item.status === statusFilter),
    );
  }, [activities, activeMonth, searchTerm, statusFilter]);

  const historyPageCount = Math.max(1, Math.ceil(filteredActivities.length / activitiesPerPage));
  const currentHistoryPage = Math.min(historyPage, historyPageCount);
  const paginatedActivities = filteredActivities.slice(
    (currentHistoryPage - 1) * activitiesPerPage,
    currentHistoryPage * activitiesPerPage,
  );
  const historyStart = filteredActivities.length
    ? (currentHistoryPage - 1) * activitiesPerPage + 1
    : 0;
  const historyEnd = Math.min(currentHistoryPage * activitiesPerPage, filteredActivities.length);

  function editDraft(activity: Activity) {
    setEditingId(activity.id);
    setFormData({
      date: activity.date,
      dueDate: activity.dueDate,
      startTime: activity.startTime,
      endTime: activity.endTime,
      workLocation: workLocations.includes(activity.workLocation as (typeof workLocations)[number])
        ? activity.workLocation
        : activity.workLocation
          ? "Other"
          : "",
      otherWorkLocation: workLocations.includes(activity.workLocation as (typeof workLocations)[number])
        ? ""
        : activity.workLocation,
      evidenceLink: activity.evidenceLink,
      evidenceFileId: activity.evidenceFileId ? String(activity.evidenceFileId) : "",
      project: String(activity.projectId),
      activity: activity.activity,
      description: activity.description,
      hours: String(activity.hours),
      priority: activity.priority,
      status: activity.workStatus,
      expectedOutput: activity.expectedOutput,
      challenges: activity.challenges,
      remarks: activity.remarks,
    });
    setEvidenceFileName("");
    setEvidenceInputKey((key) => key + 1);
    setSelectedActivity(null);
    setMessage("Editing draft. Make your changes and click Update draft.");
    window.setTimeout(() => document.getElementById("activity-form")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  async function deleteDraft(activity: Activity) {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/activities/${activity.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to delete draft.");
      setActivities((current) => current.filter((item) => item.id !== activity.id));
      setSelectedActivity(null);
      setDeleteCandidate(null);
      setMessage(data.message);
      showNotification("success", "Draft deleted successfully", data.message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unable to delete draft.";
      setMessage(errorMessage);
      showNotification("error", "Draft was not deleted", errorMessage);
    } finally {
      setIsSaving(false);
    }
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
      {notification && (
        <ActivityNotification
          key={notification.id}
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}
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
            <FormField label="Due date" required>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={formData.date || undefined}
                className="form-input"
              />
            </FormField>

            <FormField label="Start time" required>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="form-input" />
            </FormField>

            <FormField label="End time" required>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} min={formData.startTime || undefined} className="form-input" />
            </FormField>

            <FormField label="Work location">
              <select name="workLocation" value={formData.workLocation} onChange={handleChange} className="form-input">
                <option value="">Select work location</option>
                {workLocations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </FormField>

            {formData.workLocation === "Other" && (
              <FormField label="Specify other work location" required>
                <input
                  type="text"
                  name="otherWorkLocation"
                  value={formData.otherWorkLocation}
                  onChange={handleChange}
                  placeholder="Enter the work location"
                  className="form-input"
                />
              </FormField>
            )}

            <FormField label="Evidence link">
              <input
                type="url"
                name="evidenceLink"
                value={formData.evidenceLink}
                onChange={handleChange}
                placeholder="https://example.com/evidence"
                className="form-input"
              />
            </FormField>

            <FormField label="Upload evidence file">
              <div className="flex items-center gap-3">
                <input
                  key={evidenceInputKey}
                  type="file"
                  onChange={handleEvidenceFileChange}
                  disabled={isUploadingEvidence || isSaving}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 hover:file:bg-blue-100 disabled:cursor-not-allowed"
                />
                {isUploadingEvidence && <Upload className="shrink-0 animate-pulse text-blue-600" size={20} aria-label="Uploading evidence file" />}
              </div>
              {evidenceFileName && (
                <p className="mt-2 text-xs font-medium text-emerald-700">{evidenceFileName} uploaded</p>
              )}
            </FormField>

            <FormField label="Project or work area" required>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
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
                readOnly
                placeholder="Calculated automatically"
                className="form-input bg-slate-50"
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

          {message && (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700" aria-live="polite">
              {message}
            </div>
          )}

          <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-6 sm:flex-row">
            <button
              type="button"
              disabled={isUploadingEvidence || isSaving}
              onClick={() => {
                setFormData(emptyForm);
                setEditingId(null);
                setEvidenceFileName("");
                setEvidenceInputKey((key) => key + 1);
              }}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear form
            </button>

            <button
              type="button"
              onClick={() => void saveActivity("Draft")}
              disabled={isSaving || isUploadingEvidence}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : editingId ? "Update draft" : "Save draft"}
            </button>

            <button
              type="submit"
              disabled={isSaving || isUploadingEvidence}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <CheckCircle2 size={18} />
              {isSaving ? "Saving..." : isUploadingEvidence ? "Uploading evidence..." : "Submit activity"}
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
              {activeMonth ? `Activities recorded in ${formatMonth(activeMonth)}.` : "No activities recorded yet."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedMonth}
              onChange={(event) => {
                setSelectedMonth(event.target.value);
                setHistoryPage(1);
              }}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              aria-label="Select activity month"
            >
              <option value="latest">Latest month</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>{formatMonth(month)}</option>
              ))}
            </select>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setHistoryPage(1);
              }}
              placeholder="Search activities..."
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setHistoryPage(1);
              }}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option>All statuses</option>
              <option>Draft</option>
              <option>Submitted</option>
              <option>In Progress</option>
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
              {isLoading && (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-500">Loading activities...</td></tr>
              )}
              {!isLoading && filteredActivities.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-500">No activities found.</td></tr>
              )}
              {paginatedActivities.map((activity) => (
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
                      onClick={() => setSelectedActivity(activity)}
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

        {!isLoading && filteredActivities.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {historyStart}–{historyEnd} of {filteredActivities.length} activities
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentHistoryPage === 1}
                onClick={() => setHistoryPage((page) => Math.max(1, page - 1))}
                className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="whitespace-nowrap">Page {currentHistoryPage} of {historyPageCount}</span>
              <button
                type="button"
                disabled={currentHistoryPage === historyPageCount}
                onClick={() => setHistoryPage((page) => Math.min(historyPageCount, page + 1))}
                className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
      {selectedActivity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="activity-modal-title"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedActivity(null); }}
        >
          <article className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 id="activity-modal-title" className="text-xl font-bold text-slate-900">{selectedActivity.activity}</h2>
                <p className="mt-1 text-sm text-slate-500">{selectedActivity.project}</p>
              </div>
              <button type="button" onClick={() => setSelectedActivity(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close activity details"><X size={20} /></button>
            </header>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <Detail label="Date" value={formatDate(selectedActivity.date)} />
              <Detail label="Due date" value={selectedActivity.dueDate ? formatDate(selectedActivity.dueDate) : "Not provided"} />
              <Detail label="Time" value={selectedActivity.startTime && selectedActivity.endTime ? `${selectedActivity.startTime} â€“ ${selectedActivity.endTime} (${selectedActivity.hours} hours)` : `${selectedActivity.hours} hours`} />
              <Detail label="Priority" value={selectedActivity.priority} />
              <Detail label="Status" value={selectedActivity.status} />
              <Detail label="Work status" value={selectedActivity.workStatus} />
              <Detail label="Work location" value={selectedActivity.workLocation || "Not provided"} />
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Evidence link</p>
                {selectedActivity.evidenceLink ? (
                  <a href={selectedActivity.evidenceLink} target="_blank" rel="noreferrer" className="mt-1 block break-all text-sm font-medium text-blue-600 underline hover:text-blue-700">Open evidence</a>
                ) : (
                  <p className="mt-1 text-sm text-slate-800">Not provided</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Evidence file</p>
                {selectedActivity.evidenceFileId ? (
                  <a href={`/api/evidence-files/${selectedActivity.evidenceFileId}`} className="mt-1 block break-all text-sm font-medium text-blue-600 underline hover:text-blue-700">{selectedActivity.evidenceFileName}</a>
                ) : (
                  <p className="mt-1 text-sm text-slate-800">Not provided</p>
                )}
              </div>
              <div className="sm:col-span-2"><Detail label="Description" value={selectedActivity.description} /></div>
              <div className="sm:col-span-2"><Detail label="Expected output" value={selectedActivity.expectedOutput || "Not provided"} /></div>
              <div className="sm:col-span-2"><Detail label="Challenges" value={selectedActivity.challenges || "None recorded"} /></div>
              <div className="sm:col-span-2"><Detail label="Remarks" value={selectedActivity.remarks || "None recorded"} /></div>
            </div>

            <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setSelectedActivity(null)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Close</button>
              {selectedActivity.status === "Draft" && (
                <>
                  <button type="button" disabled={isSaving} onClick={() => { setDeleteCandidate(selectedActivity); setSelectedActivity(null); }} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"><Trash2 size={17} />Delete draft</button>
                  <button type="button" onClick={() => editDraft(selectedActivity)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><Pencil size={17} />Edit draft</button>
                </>
              )}
            </footer>
          </article>
        </div>
      )}
      {deleteCandidate && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirmation-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSaving) setDeleteCandidate(null);
          }}
        >
          <article className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <Trash2 size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-600">Delete confirmation</p>
                  <h2 id="delete-confirmation-title" className="mt-2 text-2xl font-bold text-slate-900">Remove this activity draft?</h2>
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-slate-600">
                You are about to permanently remove the selected daily activity from the system.
              </p>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Selected record</p>
                <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{deleteCandidate.activity}</p>
                    <p className="mt-1 text-sm text-slate-600">{deleteCandidate.project}</p>
                  </div>
                  <span className="mt-2 inline-flex w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 sm:mt-0">
                    ACTIVITY #{deleteCandidate.id}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:grid-cols-3">
                  <span>{formatDate(deleteCandidate.date)}</span>
                  <span>{deleteCandidate.hours} hours</span>
                  <span>{deleteCandidate.status}</span>
                </div>
              </div>

              <p className="mt-5 text-sm font-medium text-slate-600">This action cannot be undone.</p>
            </div>

            <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 px-7 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setDeleteCandidate(null)}
                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Keep draft
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void deleteDraft(deleteCandidate)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 size={17} />
                {isSaving ? "Deleting..." : `Delete activity #${deleteCandidate.id}`}
              </button>
            </footer>
          </article>
        </div>
      )}
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

function formatMonth(month: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${month}-01T00:00:00`));
}

function calculateDuration(startTime: string, endTime: string) {
  if (!startTime || !endTime) return "";

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);

  if (minutes <= 0) return "";

  return (minutes / 60).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{value}</p>
    </div>
  );
}
function ActivityNotification({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 4500);
    return () => window.clearTimeout(timeout);
  }, [onClose]);

  const success = notification.type === "success";

  return (
    <div className="fixed left-1/2 top-6 z-[70] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2" role={success ? "status" : "alert"} aria-live={success ? "polite" : "assertive"}>
      <div className={`overflow-hidden rounded-2xl border bg-white shadow-2xl ${success ? "border-emerald-200" : "border-red-200"}`}>
        <div className={`h-2 ${success ? "bg-emerald-500" : "bg-red-500"}`} />
        <div className="flex items-start gap-4 px-5 py-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white ${success ? "bg-emerald-500" : "bg-red-500"}`}>
            {success ? "OK" : "!"}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-bold uppercase tracking-[0.16em] ${success ? "text-emerald-700" : "text-red-700"}`}>{notification.title}</p>
            <p className="mt-1 text-sm text-slate-700">{notification.message}</p>
            <div className={`mt-4 h-1 overflow-hidden rounded-full ${success ? "bg-emerald-100" : "bg-red-100"}`}>
              <div className={`activity-notification-progress h-full ${success ? "bg-emerald-500" : "bg-red-500"}`} />
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close notification" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${success ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50" : "border-red-200 text-red-700 hover:bg-red-50"}`}><X size={17} /></button>
        </div>
      </div>
    </div>
  );
}
