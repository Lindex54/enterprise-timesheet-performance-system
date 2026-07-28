import { NextResponse } from "next/server";

import { ensureDevelopmentTasks } from "../../../../lib/development-tasks";
import prisma from "../../../../lib/prisma";

export async function GET() {
  const employee = await ensureDevelopmentTasks();
  const tasks = await prisma.task.findMany({
    where: { assignedToId: employee.id },
    orderBy: [{ dueDate: "asc" }, { taskCode: "asc" }],
    select: {
      id: true,
      taskCode: true,
      title: true,
      assignedDate: true,
      dueDate: true,
      priority: true,
      status: true,
      progress: true,
      estimatedHours: true,
      project: { select: { name: true } },
    },
  });

  return NextResponse.json({
    tasks: tasks.map((task) => ({
      id: task.id,
      taskCode: task.taskCode,
      title: task.title,
      project: task.project.name,
      assignedDate: task.assignedDate.toISOString().slice(0, 10),
      dueDate: task.dueDate.toISOString().slice(0, 10),
      priority: titleCase(task.priority),
      status: titleCase(task.status),
      progress: task.progress,
      hoursWorked: task.estimatedHours?.toNumber() ?? 0,
    })),
  });
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
