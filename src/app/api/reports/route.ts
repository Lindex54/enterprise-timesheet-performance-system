import { NextResponse } from "next/server";

import { getCurrentEmployee } from "../../../../lib/current-employee";
import prisma from "../../../../lib/prisma";
import { ActivityWorkStatus, SubmissionStatus } from "../../../generated/prisma/enums";

type Activity = {
  id: number;
  activityDate: Date;
  title: string;
  description: string;
  hours: { toNumber(): number };
  workStatus: ActivityWorkStatus;
  submissionStatus: SubmissionStatus;
  expectedOutput: string | null;
  challenges: string | null;
  project: { name: string };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const month = getMonth(searchParams.get("month")) ?? now.getUTCMonth() + 1;
  const year = getYear(searchParams.get("year")) ?? now.getUTCFullYear();
  const employee = await getCurrentEmployee();
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 1));
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year + 1, 0, 1));

  const [monthlyActivities, yearlyActivities] = await Promise.all([
    prisma.activity.findMany({
      where: { employeeId: employee.id, activityDate: { gte: monthStart, lt: monthEnd } },
      orderBy: [{ activityDate: "desc" }, { createdAt: "desc" }],
      select: activitySelect,
    }),
    prisma.activity.findMany({
      where: { employeeId: employee.id, activityDate: { gte: yearStart, lt: yearEnd } },
      select: { activityDate: true, hours: true },
    }),
  ]);

  return NextResponse.json({
    summary: buildSummary(monthlyActivities),
    months: buildMonths(yearlyActivities, year),
    activities: monthlyActivities.map(presentActivity),
    workAreas: buildWorkAreas(monthlyActivities),
    achievements: monthlyActivities
      .filter((activity) => activity.workStatus === ActivityWorkStatus.COMPLETED)
      .slice(0, 4)
      .map((activity) => activity.expectedOutput || activity.title),
    challenges: monthlyActivities
      .flatMap((activity) => activity.challenges?.split("\n") ?? [])
      .map((challenge) => challenge.trim())
      .filter(Boolean)
      .slice(0, 4),
  });
}

const activitySelect = {
  id: true,
  activityDate: true,
  title: true,
  description: true,
  hours: true,
  workStatus: true,
  submissionStatus: true,
  expectedOutput: true,
  challenges: true,
  project: { select: { name: true } },
} as const;

function buildSummary(activities: Activity[]) {
  const completedActivities = activities.filter(
    (activity) => activity.workStatus === ActivityWorkStatus.COMPLETED,
  ).length;
  const submittedActivities = activities.filter(
    (activity) => activity.submissionStatus !== SubmissionStatus.DRAFT,
  ).length;
  const totalHours = activities.reduce(
    (total, activity) => total + activity.hours.toNumber(),
    0,
  );

  return {
    totalActivities: activities.length,
    completedActivities,
    submittedActivities,
    totalHours: Math.round(totalHours * 100) / 100,
    completionRate: activities.length
      ? Math.round((completedActivities / activities.length) * 100)
      : 0,
  };
}

function buildMonths(
  activities: { activityDate: Date; hours: { toNumber(): number } }[],
  year: number,
) {
  return Array.from({ length: 12 }, (_, index) => {
    const monthActivities = activities.filter(
      (activity) => activity.activityDate.getUTCMonth() === index,
    );

    return {
      month: index + 1,
      label: new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(
        new Date(Date.UTC(year, index, 1)),
      ),
      activities: monthActivities.length,
      hours: Math.round(
        monthActivities.reduce((total, activity) => total + activity.hours.toNumber(), 0) * 100,
      ) / 100,
    };
  });
}

function buildWorkAreas(activities: Activity[]) {
  const areas = new Map<string, { activities: number; completed: number; hours: number }>();

  for (const activity of activities) {
    const area = areas.get(activity.project.name) ?? { activities: 0, completed: 0, hours: 0 };
    area.activities += 1;
    area.hours += activity.hours.toNumber();
    if (activity.workStatus === ActivityWorkStatus.COMPLETED) area.completed += 1;
    areas.set(activity.project.name, area);
  }

  return [...areas.entries()]
    .map(([name, area]) => ({
      name,
      activities: area.activities,
      completed: area.completed,
      hours: Math.round(area.hours * 100) / 100,
      completionRate: area.activities ? Math.round((area.completed / area.activities) * 100) : 0,
    }))
    .sort((left, right) => right.hours - left.hours);
}

function presentActivity(activity: Activity) {
  return {
    id: activity.id,
    date: activity.activityDate.toISOString().slice(0, 10),
    title: activity.title,
    description: activity.description,
    project: activity.project.name,
    hours: activity.hours.toNumber(),
    status: titleCase(activity.workStatus),
    submissionStatus: titleCase(activity.submissionStatus),
    expectedOutput: activity.expectedOutput ?? "",
    challenges: activity.challenges ?? "",
  };
}

function titleCase(value: string) {
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function getMonth(value: string | null) {
  const month = Number(value);
  return Number.isInteger(month) && month >= 1 && month <= 12 ? month : null;
}

function getYear(value: string | null) {
  const year = Number(value);
  return Number.isInteger(year) && year >= 2000 && year <= 2100 ? year : null;
}
