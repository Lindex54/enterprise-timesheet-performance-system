import { NextResponse } from "next/server";

import { getCurrentEmployee } from "../../../../lib/current-employee";
import prisma from "../../../../lib/prisma";
import {
  ActivityWorkStatus,
  SubmissionStatus,
  TimesheetStatus,
} from "../../../generated/prisma/enums";

export async function GET() {
  const employee = await getCurrentEmployee();
  const [activities, timesheets] = await Promise.all([
    prisma.activity.findMany({
      where: { employeeId: employee.id },
      orderBy: [{ dueDate: "asc" }, { activityDate: "desc" }],
      select: {
        id: true,
        title: true,
        activityDate: true,
        dueDate: true,
        priority: true,
        workStatus: true,
        submissionStatus: true,
        submittedAt: true,
        hours: true,
        project: { select: { name: true } },
      },
    }),
    prisma.timesheet.findMany({
      where: { employeeId: employee.id },
      select: { status: true },
    }),
  ]);

  const today = dateKeyInNairobi(new Date());
  const tasks = activities.map((activity) => {
    const assignedDate = dateKey(activity.activityDate);
    const dueDate = dateKey(activity.dueDate ?? activity.activityDate);
    const submittedDate = activity.submittedAt
      ? dateKeyInNairobi(activity.submittedAt)
      : null;
    const isSubmitted = activity.submissionStatus !== SubmissionStatus.DRAFT;
    const isOverdue = submittedDate
      ? submittedDate > dueDate
      : !isSubmitted && today > dueDate;
    const progress = progressFor(activity.workStatus);

    return {
      id: activity.id,
      taskCode: `ACT-${String(activity.id).padStart(4, "0")}`,
      title: activity.title,
      project: activity.project.name,
      assignedDate,
      dueDate,
      priority: titleCase(activity.priority),
      status: isOverdue
        ? "Overdue"
        : isSubmitted && activity.workStatus === ActivityWorkStatus.COMPLETED
          ? "Completed"
          : activity.workStatus === ActivityWorkStatus.NOT_STARTED
            ? "Not Started"
            : "In Progress",
      progress,
      hoursWorked: activity.hours.toNumber(),
      submittedDate,
    };
  });

  const taskCompletionRate = tasks.length
    ? average(tasks.map((task) => task.progress))
    : 0;
  const submittedActivities = activities.filter(
    (activity) => activity.submissionStatus !== SubmissionStatus.DRAFT,
  ).length;
  const timesheetSubmissionRate = activities.length
    ? Math.round((submittedActivities / activities.length) * 100)
    : 0;
  const reviewableTimesheets = timesheets.filter(
    (timesheet) => timesheet.status !== TimesheetStatus.DRAFT,
  );
  const approvedTimesheets = reviewableTimesheets.filter(
    (timesheet) => timesheet.status === TimesheetStatus.APPROVED,
  ).length;
  const supervisorApprovalRate = reviewableTimesheets.length
    ? Math.round((approvedTimesheets / reviewableTimesheets.length) * 100)
    : 0;

  return NextResponse.json({
    tasks,
    completionComponents: {
      taskCompletionRate,
      timesheetSubmissionRate,
      supervisorApprovalRate,
    },
  });
}

function progressFor(status: ActivityWorkStatus) {
  const progress = {
    [ActivityWorkStatus.NOT_STARTED]: 0,
    [ActivityWorkStatus.IN_PROGRESS]: 50,
    [ActivityWorkStatus.BLOCKED]: 25,
    [ActivityWorkStatus.COMPLETED]: 100,
  };
  return progress[status];
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateKeyInNairobi(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function average(values: number[]) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
