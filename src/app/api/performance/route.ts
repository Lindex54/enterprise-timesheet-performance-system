import { NextResponse } from "next/server";

import { getCurrentEmployee } from "../../../../lib/current-employee";
import prisma from "../../../../lib/prisma";
import {
  ActivityWorkStatus,
  SubmissionStatus,
} from "../../../generated/prisma/enums";

const DEFAULT_EXPECTED_HOURS = 160;

type ActivityRecord = {
  activityDate: Date;
  title: string;
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
  const month = validMonth(searchParams.get("month")) ?? now.getUTCMonth() + 1;
  const year = validYear(searchParams.get("year")) ?? now.getUTCFullYear();
  const employee = await getCurrentEmployee();
  const periodStart = new Date(Date.UTC(year, month - 1, 1));
  const periodEnd = new Date(Date.UTC(year, month, 1));
  const trendStart = new Date(Date.UTC(year, month - 7, 1));

  const [activities, trendActivities, timesheet, performancePeriod] = await Promise.all([
    prisma.activity.findMany({
      where: {
        employeeId: employee.id,
        activityDate: { gte: periodStart, lt: periodEnd },
      },
      orderBy: [{ activityDate: "desc" }, { createdAt: "desc" }],
      select: activitySelect,
    }),
    prisma.activity.findMany({
      where: {
        employeeId: employee.id,
        activityDate: { gte: trendStart, lt: periodEnd },
      },
      select: activitySelect,
    }),
    prisma.timesheet.findUnique({
      where: { employeeId_month_year: { employeeId: employee.id, month, year } },
      select: {
        expectedHours: true,
        status: true,
        supervisorFeedback: true,
        reviewedAt: true,
        reviewedBy: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.performancePeriod.findUnique({
      where: { employeeId_month_year: { employeeId: employee.id, month, year } },
      select: {
        supervisorComment: true,
        metrics: { select: { name: true, score: true } },
      },
    }),
  ]);

  const expectedHours = timesheet?.expectedHours.toNumber() ?? DEFAULT_EXPECTED_HOURS;
  const summary = buildSummary(activities, expectedHours);
  const trend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 7 + index, 1));
    const monthActivities = trendActivities.filter(
      (activity) =>
        activity.activityDate.getUTCFullYear() === date.getUTCFullYear() &&
        activity.activityDate.getUTCMonth() === date.getUTCMonth(),
    );

    return {
      month: new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(date),
      score: buildOverallScore(buildSummary(monthActivities, DEFAULT_EXPECTED_HOURS), null),
    };
  });

  return NextResponse.json({
    summary,
    overallScore: buildOverallScore(summary, performancePeriod),
    qualityScore: metricScore(performancePeriod, "Quality of output"),
    supervisorReview: {
      score: metricScore(performancePeriod, "Supervisor assessment"),
      feedback: timesheet?.supervisorFeedback ?? performancePeriod?.supervisorComment ?? "No supervisor feedback has been recorded for this period.",
      status: timesheet?.status ?? "DRAFT",
      reviewer: timesheet?.reviewedBy ? `${timesheet.reviewedBy.firstName} ${timesheet.reviewedBy.lastName}` : "Not yet reviewed",
      reviewedAt: timesheet?.reviewedAt?.toISOString() ?? null,
    },
    workCategories: buildWorkCategories(activities, summary.totalHours),
    achievements: activities
      .filter((activity) => activity.workStatus === ActivityWorkStatus.COMPLETED)
      .slice(0, 3)
      .map((activity) => activity.expectedOutput || activity.title),
    challenges: activities
      .flatMap((activity) => activity.challenges?.split("\n") ?? [])
      .map((challenge) => challenge.trim())
      .filter(Boolean)
      .slice(0, 3),
    trend,
  });
}

const activitySelect = {
  activityDate: true,
  title: true,
  hours: true,
  workStatus: true,
  submissionStatus: true,
  expectedOutput: true,
  challenges: true,
  project: { select: { name: true } },
} as const;

function buildSummary(activities: ActivityRecord[], expectedHours: number) {
  const totalHours = activities.reduce(
    (total, activity) => total + activity.hours.toNumber(),
    0,
  );
  const completedActivities = activities.filter(
    (activity) => activity.workStatus === ActivityWorkStatus.COMPLETED,
  ).length;
  const submittedActivities = activities.filter(
    (activity) => activity.submissionStatus !== SubmissionStatus.DRAFT,
  ).length;
  const taskCompletionRate = activities.length
    ? Math.round(
        activities.reduce(
          (total, activity) => total + progressFor(activity.workStatus),
          0,
        ) / activities.length,
      )
    : 0;

  return {
    totalActivities: activities.length,
    completedActivities,
    inProgressActivities: activities.filter(
      (activity) => activity.workStatus === ActivityWorkStatus.IN_PROGRESS,
    ).length,
    submittedActivities,
    totalHours: Math.round(totalHours * 100) / 100,
    expectedHours,
    taskCompletionRate,
    timesheetSubmissionRate: activities.length
      ? Math.round((submittedActivities / activities.length) * 100)
      : 0,
    productivityRate: expectedHours
      ? Math.min(100, Math.round((totalHours / expectedHours) * 100))
      : 0,
  };
}

function buildOverallScore(
  summary: ReturnType<typeof buildSummary>,
  performancePeriod: { metrics: { name: string; score: { toNumber(): number } }[] } | null,
) {
  if (summary.totalActivities === 0) return 0;

  return Math.round(
    summary.taskCompletionRate * 0.3 +
      summary.timesheetSubmissionRate * 0.2 +
      summary.productivityRate * 0.15 +
      metricScore(performancePeriod, "Quality of output") * 0.15 +
      metricScore(performancePeriod, "Supervisor assessment") * 0.2,
  );
}

function metricScore(
  performancePeriod: { metrics: { name: string; score: { toNumber(): number } }[] } | null,
  name: string,
) {
  return performancePeriod?.metrics.find((metric) => metric.name === name)?.score.toNumber() ?? 0;
}

function buildWorkCategories(activities: ActivityRecord[], totalHours: number) {
  const categories = new Map<string, { activities: number; hours: number }>();

  for (const activity of activities) {
    const current = categories.get(activity.project.name) ?? { activities: 0, hours: 0 };
    current.activities += 1;
    current.hours += activity.hours.toNumber();
    categories.set(activity.project.name, current);
  }

  return [...categories.entries()]
    .map(([name, category]) => ({
      name,
      activities: category.activities,
      hours: Math.round(category.hours * 100) / 100,
      percentage: totalHours ? Math.round((category.hours / totalHours) * 100) : 0,
    }))
    .sort((left, right) => right.hours - left.hours);
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

function validMonth(value: string | null) {
  const month = Number(value);
  return Number.isInteger(month) && month >= 1 && month <= 12 ? month : null;
}

function validYear(value: string | null) {
  const year = Number(value);
  return Number.isInteger(year) && year >= 2000 && year <= 2100 ? year : null;
}
