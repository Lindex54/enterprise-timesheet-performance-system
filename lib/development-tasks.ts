import "server-only";

import prisma from "./prisma";
import { getCurrentEmployee } from "./current-employee";

const DEVELOPMENT_TASKS = [
  ["TSK-001", "Update university website content", "University Website", "2026-07-20", "2026-07-28", "HIGH", "IN_PROGRESS", 90, 10],
  ["TSK-002", "Prepare timesheet system documentation", "Timesheet System", "2026-07-22", "2026-07-30", "HIGH", "IN_PROGRESS", 70, 8],
  ["TSK-003", "Review faculty website interface", "Faculty Website", "2026-07-18", "2026-07-24", "MEDIUM", "COMPLETED", 100, 5],
  ["TSK-004", "Prepare monthly ICT performance report", "Research and Publication", "2026-07-15", "2026-07-23", "URGENT", "OVERDUE", 45, 4],
  ["TSK-005", "Upload research publication content", "Content Development", "2026-07-25", "2026-08-02", "LOW", "NOT_STARTED", 0, 0],
] as const;

export async function ensureDevelopmentTasks() {
  const employee = await getCurrentEmployee();
  const existingCount = await prisma.task.count({
    where: { assignedToId: employee.id },
  });

  if (existingCount > 0) return employee;

  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
  });
  const projectIds = new Map(
    projects.map((project: { id: number; name: string }) => [
      project.name,
      project.id,
    ]),
  );

  await prisma.$transaction(
    DEVELOPMENT_TASKS.map(
      ([taskCode, title, projectName, assignedDate, dueDate, priority, status, progress, hours]) =>
        prisma.task.upsert({
          where: { taskCode },
          update: {},
          create: {
            taskCode,
            title,
            projectId: projectIds.get(projectName)!,
            assignedToId: employee.id,
            assignedDate: new Date(`${assignedDate}T00:00:00.000Z`),
            dueDate: new Date(`${dueDate}T00:00:00.000Z`),
            priority,
            status,
            progress,
            estimatedHours: hours,
            completedAt: status === "COMPLETED" ? new Date(`${dueDate}T12:00:00.000Z`) : null,
          },
        }),
    ),
  );

  return employee;
}
