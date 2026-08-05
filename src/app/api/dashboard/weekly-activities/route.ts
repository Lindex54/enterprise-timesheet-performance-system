import { NextResponse } from "next/server";

import { getCurrentEmployee } from "../../../../../lib/current-employee";
import prisma from "../../../../../lib/prisma";
import { ActivityWorkStatus, SubmissionStatus } from "../../../../generated/prisma/enums";

export async function GET(request: Request) {
  const employee = await getCurrentEmployee();
  const { searchParams } = new URL(request.url);
  const selectedMonth = validMonth(searchParams.get("month"));
  const selectedYear = validYear(searchParams.get("year"));
  const selectedWeek = validWeek(searchParams.get("week"));
  const latestActivity = await prisma.activity.findFirst({
    where: { employeeId: employee.id },
    orderBy: { activityDate: "desc" },
    select: { activityDate: true },
  });
  const referenceDate = latestActivity?.activityDate ?? new Date();
  const month = selectedMonth ?? referenceDate.getUTCMonth() + 1;
  const year = selectedYear ?? referenceDate.getUTCFullYear();
  const weeks = weeksForMonth(year, month);
  const latestWeekStart = startOfWeek(referenceDate).toISOString().slice(0, 10);
  const activeWeek = selectedWeek && weeks.some((week) => week.value === selectedWeek)
    ? selectedWeek
    : weeks.find((week) => week.start === latestWeekStart)?.value ?? weeks[0].value;
  const weekStart = new Date(`${weeks[activeWeek - 1].start}T00:00:00.000Z`);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

  const activities = await prisma.activity.findMany({
    where: { employeeId: employee.id, activityDate: { gte: weekStart, lt: weekEnd } },
    orderBy: [{ activityDate: "asc" }, { startTime: "asc" }],
    select: { id: true, activityDate: true, title: true, workStatus: true, submissionStatus: true },
  });

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setUTCDate(date.getUTCDate() + index);
    const dayActivities = activities.filter(
      (activity) => activity.activityDate.toISOString().slice(0, 10) === date.toISOString().slice(0, 10),
    );
    return {
      date: date.toISOString().slice(0, 10),
      activities: dayActivities.map((activity) => ({ id: activity.id, title: activity.title, status: displayStatus(activity.workStatus, activity.submissionStatus) })),
    };
  });

  return NextResponse.json({ weekStart: weekStart.toISOString().slice(0, 10), month, year, selectedWeek: activeWeek, weeks, days });
}

function startOfWeek(date: Date) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const daysSinceMonday = (start.getUTCDay() + 6) % 7;
  start.setUTCDate(start.getUTCDate() - daysSinceMonday);
  return start;
}

function weeksForMonth(year: number, month: number) {
  const firstWeekStart = startOfWeek(new Date(Date.UTC(year, month - 1, 1)));
  const lastWeekStart = startOfWeek(new Date(Date.UTC(year, month, 0)));
  const weeks = [];
  for (let start = firstWeekStart, value = 1; start <= lastWeekStart; start = new Date(start.getTime() + 604800000), value += 1) {
    const end = new Date(start.getTime() + 6 * 86400000);
    weeks.push({ value, start: start.toISOString().slice(0, 10), label: `${formatRange(start)} – ${formatRange(end)}` });
  }
  return weeks;
}

function formatRange(date: Date) { return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(date); }

function validMonth(value: string | null) { const month = Number(value); return Number.isInteger(month) && month >= 1 && month <= 12 ? month : null; }
function validYear(value: string | null) { const year = Number(value); return Number.isInteger(year) && year >= 2020 && year <= 2100 ? year : null; }
function validWeek(value: string | null) { const week = Number(value); return Number.isInteger(week) && week >= 1 ? week : null; }

function displayStatus(workStatus: ActivityWorkStatus, submissionStatus: SubmissionStatus) {
  if (submissionStatus === SubmissionStatus.DRAFT) return "Draft";
  if (workStatus === ActivityWorkStatus.COMPLETED) return "Completed";
  if (workStatus === ActivityWorkStatus.IN_PROGRESS) return "In Progress";
  if (workStatus === ActivityWorkStatus.BLOCKED) return "Blocked";
  return "Not Started";
}
