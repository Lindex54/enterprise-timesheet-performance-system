import "server-only";

import prisma from "./prisma";

export const DEVELOPMENT_EMPLOYEE_NUMBER = "BU-ICT-026";

const DEVELOPMENT_PROJECTS = [
  "University Website",
  "Timesheet System",
  "Faculty Website",
  "Content Development",
  "Research and Publication",
  "Other",
];

export async function getCurrentEmployee() {
  const existingEmployee = await prisma.employee.findUnique({
    where: { employeeNumber: DEVELOPMENT_EMPLOYEE_NUMBER },
    select: { id: true },
  });

  if (existingEmployee) {
    return existingEmployee;
  }

  return prisma.$transaction(async (transaction) => {
    const department = await transaction.department.upsert({
      where: { name: "University Library" },
      update: {},
      create: {
        name: "University Library",
        code: "LIB",
      },
    });

    const campus = await transaction.campus.upsert({
      where: { name: "Busitema Campus" },
      update: {},
      create: {
        name: "Busitema Campus",
        location: "Busitema, Uganda",
      },
    });

    const user = await transaction.user.upsert({
      where: { email: "godwin.malinde@busitema.ac.ug" },
      update: {},
      create: {
        email: "godwin.malinde@busitema.ac.ug",
        passwordHash: "DEVELOPMENT_ACCOUNT_LOGIN_DISABLED",
      },
    });

    const employee = await transaction.employee.create({
      data: {
        userId: user.id,
        employeeNumber: DEVELOPMENT_EMPLOYEE_NUMBER,
        firstName: "Godwin",
        lastName: "Malinde",
        jobTitle: "ICT Fellow",
        employmentType: "FULL_TIME",
        dateJoined: new Date("2025-01-06T00:00:00.000Z"),
        departmentId: department.id,
        campusId: campus.id,
      },
      select: { id: true },
    });

    await transaction.project.createMany({
      data: DEVELOPMENT_PROJECTS.map((name) => ({
        name,
        status: "ACTIVE" as const,
        departmentId: department.id,
      })),
      skipDuplicates: true,
    });

    return employee;
  });
}
