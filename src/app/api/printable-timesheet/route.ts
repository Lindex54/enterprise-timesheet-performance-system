import { NextResponse } from "next/server";

import { getCurrentEmployee } from "../../../../lib/current-employee";
import prisma from "../../../../lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const now = new Date();
  const month = getMonth(searchParams.get("month")) ?? now.getUTCMonth() + 1;
  const year = getYear(searchParams.get("year")) ?? now.getUTCFullYear();
  const currentEmployee = await getCurrentEmployee();
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 1));

  const [employee, activities] = await Promise.all([
    prisma.employee.findUniqueOrThrow({
      where: { id: currentEmployee.id },
      select: {
        employeeNumber: true,
        firstName: true,
        lastName: true,
        jobTitle: true,
        department: { select: { name: true } },
        campus: { select: { name: true } },
      },
    }),
    prisma.activity.findMany({
      where: {
        employeeId: currentEmployee.id,
        activityDate: { gte: monthStart, lt: monthEnd },
      },
      orderBy: [{ activityDate: "asc" }, { startTime: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        activityDate: true,
        title: true,
        description: true,
        startTime: true,
        endTime: true,
        workLocation: true,
        hours: true,
        expectedOutput: true,
        actualOutput: true,
        remarks: true,
        project: { select: { name: true } },
      },
    }),
  ]);

  const totalHours = activities.reduce((total, activity) => total + activity.hours.toNumber(), 0);

  return NextResponse.json({
    employee: {
      name: `${employee.firstName} ${employee.lastName}`,
      employeeNumber: employee.employeeNumber,
      jobTitle: employee.jobTitle,
      department: employee.department.name,
      campus: employee.campus?.name ?? "",
    },
    period: { month, year, label: monthLabel(month, year) },
    totalHours: Math.round(totalHours * 100) / 100,
    activities: activities.map((activity) => ({
      id: activity.id,
      date: activity.activityDate.toISOString().slice(0, 10),
      project: activity.project.name,
      activity: activity.title,
      description: activity.description,
      startTime: timeValue(activity.startTime),
      endTime: timeValue(activity.endTime),
      hours: activity.hours.toNumber(),
      output: activity.actualOutput || activity.expectedOutput || "",
      workLocation: activity.workLocation || "",
      remarks: activity.remarks || "",
    })),
  });
}

function timeValue(value: Date | null) {
  return value ? value.toISOString().slice(11, 16) : "";
}

function monthLabel(month: number, year: number) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

function getMonth(value: string | null) {
  const month = Number(value);
  return Number.isInteger(month) && month >= 1 && month <= 12 ? month : null;
}

function getYear(value: string | null) {
  const year = Number(value);
  return Number.isInteger(year) && year >= 2000 && year <= 2100 ? year : null;
}
