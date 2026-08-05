import { NextResponse } from "next/server";

import { getCurrentEmployee } from "../../../../lib/current-employee";
import prisma from "../../../../lib/prisma";
import {
  ActivityWorkStatus,
  SubmissionStatus,
  TaskPriority,
} from "../../../generated/prisma/enums";

const priorityMap = {
  Low: TaskPriority.LOW,
  Medium: TaskPriority.MEDIUM,
  High: TaskPriority.HIGH,
  Urgent: TaskPriority.URGENT,
} as const;

const workStatusMap = {
  "Not Started": ActivityWorkStatus.NOT_STARTED,
  "In Progress": ActivityWorkStatus.IN_PROGRESS,
  Completed: ActivityWorkStatus.COMPLETED,
  Deferred: ActivityWorkStatus.BLOCKED,
} as const;

function presentActivity(activity: {
  id: number;
  projectId: number;
  activityDate: Date;
  dueDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  workLocation: string | null;
  evidenceLink: string | null;
  evidenceFileId: number | null;
  evidenceFile: { fileName: string } | null;
  title: string;
  description: string;
  hours: { toNumber(): number };
  priority: TaskPriority;
  workStatus: ActivityWorkStatus;
  submissionStatus: SubmissionStatus;
  expectedOutput: string | null;
  actualOutput: string | null;
  challenges: string | null;
  remarks: string | null;
  project: { name: string };
}) {
  const displayStatus =
    activity.submissionStatus === SubmissionStatus.DRAFT
      ? "Draft"
      : activity.workStatus === ActivityWorkStatus.COMPLETED
        ? "Completed"
        : activity.workStatus === ActivityWorkStatus.IN_PROGRESS
          ? "In Progress"
          : activity.submissionStatus === SubmissionStatus.SUBMITTED
            ? "Submitted"
            : activity.submissionStatus;

  return {
    id: activity.id,
    projectId: activity.projectId,
    date: activity.activityDate.toISOString().slice(0, 10),
    dueDate: activity.dueDate?.toISOString().slice(0, 10) ?? "",
    startTime: formatTime(activity.startTime),
    endTime: formatTime(activity.endTime),
    workLocation: activity.workLocation ?? "",
    evidenceLink: activity.evidenceLink ?? "",
    evidenceFileId: activity.evidenceFileId,
    evidenceFileName: activity.evidenceFile?.fileName ?? "",
    project: activity.project.name,
    activity: activity.title,
    description: activity.description,
    hours: activity.hours.toNumber(),
    priority:
      activity.priority.charAt(0) + activity.priority.slice(1).toLowerCase(),
    status: displayStatus,
    workStatus: displayWorkStatus(activity.workStatus),
    expectedOutput: activity.expectedOutput ?? "",
    actualOutput: activity.actualOutput ?? "",
    challenges: activity.challenges ?? "",
    remarks: activity.remarks ?? "",
  };
}

export async function GET() {
  const employee = await getCurrentEmployee();

  const [projects, activities] = await Promise.all([
    prisma.project.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.activity.findMany({
      where: { employeeId: employee.id },
      orderBy: [{ activityDate: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        projectId: true,
        activityDate: true,
        dueDate: true,
        startTime: true,
        endTime: true,
        workLocation: true,
        evidenceLink: true,
        evidenceFileId: true,
        evidenceFile: { select: { fileName: true } },
        title: true,
        description: true,
        hours: true,
        priority: true,
        workStatus: true,
        submissionStatus: true,
        expectedOutput: true,
        actualOutput: true,
        challenges: true,
        remarks: true,
        project: { select: { name: true } },
      },
    }),
  ]);

  return NextResponse.json({
    projects,
    activities: activities.map(presentActivity),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const requiredTextFields = ["date", "dueDate", "activity", "description"];

  for (const field of requiredTextFields) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      return NextResponse.json(
        { message: `The ${field} field is required.` },
        { status: 400 },
      );
    }
  }


  if (String(body.dueDate) < String(body.date)) {
    return NextResponse.json(
      { message: "Due date cannot be earlier than the activity date." },
      { status: 400 },
    );
  }

  if (body.workLocation === "Other") {
    return NextResponse.json(
      { message: "Please specify the other work location." },
      { status: 400 },
    );
  }
  const projectId = Number(body.projectId);
  const evidenceFileId = parseOptionalId(body.evidenceFileId);
  const timeResult = calculateHours(body.startTime, body.endTime);

  if (!Number.isInteger(projectId) || projectId < 1) {
    return NextResponse.json(
      { message: "Please select a valid project." },
      { status: 400 },
    );
  }

  if (!timeResult) {
    return NextResponse.json(
      { message: "End time must be later than start time." },
      { status: 400 },
    );
  }

  const priority = priorityMap[String(body.priority) as keyof typeof priorityMap];
  const workStatus =
    workStatusMap[String(body.status) as keyof typeof workStatusMap];
  const submissionStatus =
    body.submissionStatus === "Draft"
      ? SubmissionStatus.DRAFT
      : SubmissionStatus.SUBMITTED;

  if (!priority || !workStatus) {
    return NextResponse.json(
      { message: "Priority or activity status is invalid." },
      { status: 400 },
    );
  }

  const employee = await getCurrentEmployee();
  const project = await prisma.project.findFirst({
    where: { id: projectId, status: "ACTIVE" },
    select: { id: true },
  });

  if (!project) {
    return NextResponse.json(
      { message: "The selected project does not exist." },
      { status: 400 },
    );
  }

  if (evidenceFileId) {
    const evidenceFile = await prisma.evidenceFile.findFirst({
      where: { id: evidenceFileId, employeeId: employee.id },
      select: { id: true },
    });
    if (!evidenceFile) {
      return NextResponse.json({ message: "The uploaded evidence file does not exist." }, { status: 400 });
    }
  }

  const activity = await prisma.activity.create({
    data: {
      employeeId: employee.id,
      projectId: project.id,
      activityDate: new Date(`${body.date}T00:00:00.000Z`),
      dueDate: new Date(`${body.dueDate}T00:00:00.000Z`),
      title: String(body.activity).trim(),
      description: String(body.description).trim(),
      startTime: timeResult.startTime,
      endTime: timeResult.endTime,
      hours: timeResult.hours,
      priority,
      workStatus,
      submissionStatus,
      expectedOutput: optionalText(body.expectedOutput),
      actualOutput: optionalText(body.actualOutput),
      challenges: optionalText(body.challenges),
      remarks: optionalText(body.remarks),
      workLocation: optionalText(body.workLocation),
      evidenceLink: optionalText(body.evidenceLink),
      evidenceFileId,
      submittedAt:
        submissionStatus === SubmissionStatus.SUBMITTED ? new Date() : null,
    },
    select: {
      id: true,
      projectId: true,
      activityDate: true,
      dueDate: true,
      startTime: true,
      endTime: true,
        workLocation: true,
        evidenceLink: true,
        evidenceFileId: true,
        evidenceFile: { select: { fileName: true } },
      title: true,
      description: true,
      hours: true,
      priority: true,
      workStatus: true,
      submissionStatus: true,
      expectedOutput: true,
      actualOutput: true,
      challenges: true,
      remarks: true,
      project: { select: { name: true } },
    },
  });

  return NextResponse.json(
    {
      message:
        submissionStatus === SubmissionStatus.DRAFT
          ? "Activity saved as a draft."
          : "Activity submitted successfully.",
      activity: presentActivity(activity),
    },
    { status: 201 },
  );
}

function optionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
function formatTime(value: Date | null) {
  return value?.toISOString().slice(11, 16) ?? "";
}

function displayWorkStatus(value: ActivityWorkStatus) {
  return value
    .toLowerCase()
    .split("_")
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseOptionalId(value: unknown) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
function calculateHours(startValue: unknown, endValue: unknown) {
  if (typeof startValue !== "string" || typeof endValue !== "string" || !/^\d{2}:\d{2}$/.test(startValue) || !/^\d{2}:\d{2}$/.test(endValue)) return null;

  const [startHour, startMinute] = startValue.split(":").map(Number);
  const [endHour, endMinute] = endValue.split(":").map(Number);
  if (startHour > 23 || endHour > 23 || startMinute > 59 || endMinute > 59) return null;

  const durationMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  if (durationMinutes <= 0) return null;

  return {
    startTime: new Date(`1970-01-01T${startValue}:00.000Z`),
    endTime: new Date(`1970-01-01T${endValue}:00.000Z`),
    hours: durationMinutes / 60,
  };
}


