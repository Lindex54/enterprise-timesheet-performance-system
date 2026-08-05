import { NextResponse } from "next/server";

import { getCurrentEmployee } from "../../../../../lib/current-employee";
import prisma from "../../../../../lib/prisma";
import {
  ActivityWorkStatus,
  SubmissionStatus,
  TaskPriority,
} from "../../../../generated/prisma/enums";

type ActivityRouteContext = {
  params: Promise<{ id: string }>;
};

const priorities = {
  Low: TaskPriority.LOW,
  Medium: TaskPriority.MEDIUM,
  High: TaskPriority.HIGH,
  Urgent: TaskPriority.URGENT,
} as const;

const workStatuses = {
  "Not Started": ActivityWorkStatus.NOT_STARTED,
  "In Progress": ActivityWorkStatus.IN_PROGRESS,
  Completed: ActivityWorkStatus.COMPLETED,
  Deferred: ActivityWorkStatus.BLOCKED,
} as const;

export async function PATCH(
  request: Request,
  context: ActivityRouteContext,
) {
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  const body = (await request.json()) as Record<string, unknown>;
  const employee = await getCurrentEmployee();
  const evidenceFileId = parseOptionalId(body.evidenceFileId);

  if (body.workLocation === "Other") {
    return NextResponse.json(
      { message: "Please specify the other work location." },
      { status: 400 },
    );
  }

  const values = validateBody(body);

  if (!Number.isInteger(id) || !values.ok) {
    return NextResponse.json(
      { message: values.ok ? "Invalid activity." : values.message },
      { status: 400 },
    );
  }

  const existing = await prisma.activity.findFirst({
    where: {
      id,
      employeeId: employee.id,
      submissionStatus: SubmissionStatus.DRAFT,
    },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json(
      { message: "Only your own draft activities can be edited." },
      { status: 404 },
    );
  }

  const project = await prisma.project.findFirst({
    where: { id: values.projectId, status: "ACTIVE" },
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

  const activity = await prisma.activity.update({
    where: { id },
    data: {
      projectId: project.id,
      activityDate: new Date(`${values.date}T00:00:00.000Z`),
      dueDate: new Date(`${values.dueDate}T00:00:00.000Z`),
      startTime: values.time.startTime,
      endTime: values.time.endTime,
      hours: values.time.hours,
      title: values.title,
      description: values.description,
      priority: values.priority,
      workStatus: values.workStatus,
      expectedOutput: optionalText(body.expectedOutput),
      challenges: optionalText(body.challenges),
      remarks: optionalText(body.remarks),
      workLocation: optionalText(body.workLocation),
      evidenceLink: optionalText(body.evidenceLink),
      evidenceFileId,
    },
    select: activitySelect,
  });

  return NextResponse.json({
    message: "Draft updated successfully.",
    activity: presentActivity(activity),
  });
}

export async function DELETE(
  _request: Request,
  context: ActivityRouteContext,
) {
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  const employee = await getCurrentEmployee();

  if (!Number.isInteger(id)) {
    return NextResponse.json({ message: "Invalid activity." }, { status: 400 });
  }

  const result = await prisma.activity.deleteMany({
    where: {
      id,
      employeeId: employee.id,
      submissionStatus: SubmissionStatus.DRAFT,
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      { message: "Only your own draft activities can be deleted." },
      { status: 404 },
    );
  }

  return NextResponse.json({ message: "Draft deleted successfully." });
}

const activitySelect = {
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
  challenges: true,
  remarks: true,
  project: { select: { name: true } },
} as const;

function validateBody(body: Record<string, unknown>) {
  const date = typeof body.date === "string" ? body.date : "";
  const dueDate = typeof body.dueDate === "string" ? body.dueDate : "";
  const title = typeof body.activity === "string" ? body.activity.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const projectId = Number(body.projectId);
  const priority = priorities[String(body.priority) as keyof typeof priorities];
  const workStatus =
    workStatuses[String(body.status) as keyof typeof workStatuses];
  const time = calculateHours(body.startTime, body.endTime);

  if (dueDate && date && dueDate < date) {
    return { ok: false as const, message: "Due date cannot be earlier than the activity date." };
  }

  if (
    !date ||
    !dueDate ||
    !title ||
    !description ||
    !Number.isInteger(projectId) ||
    !priority ||
    !workStatus ||
    !time
  ) {
    return { ok: false as const, message: "Please provide valid required fields." };
  }

  return {
    ok: true as const,
    date,
    dueDate,
    title,
    description,
    projectId,
    priority,
    workStatus,
    time,
  };
}

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
  challenges: string | null;
  remarks: string | null;
  project: { name: string };
}) {
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
    workStatus: displayWorkStatus(activity.workStatus),
    status: "Draft",
    expectedOutput: activity.expectedOutput ?? "",
    challenges: activity.challenges ?? "",
    remarks: activity.remarks ?? "",
  };
}

function calculateHours(startValue: unknown, endValue: unknown) {
  if (
    typeof startValue !== "string" ||
    typeof endValue !== "string" ||
    !/^\d{2}:\d{2}$/.test(startValue) ||
    !/^\d{2}:\d{2}$/.test(endValue)
  )
    return null;
  const [startHour, startMinute] = startValue.split(":").map(Number);
  const [endHour, endMinute] = endValue.split(":").map(Number);
  const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  if (
    startHour > 23 ||
    endHour > 23 ||
    startMinute > 59 ||
    endMinute > 59 ||
    minutes <= 0
  )
    return null;
  return {
    startTime: new Date(`1970-01-01T${startValue}:00.000Z`),
    endTime: new Date(`1970-01-01T${endValue}:00.000Z`),
    hours: minutes / 60,
  };
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

function optionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function parseOptionalId(value: unknown) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

