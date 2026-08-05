import { NextResponse } from "next/server";

import { getCurrentEmployee } from "../../../../../lib/current-employee";
import prisma from "../../../../../lib/prisma";

type EvidenceFileRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: EvidenceFileRouteContext) {
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  const employee = await getCurrentEmployee();

  if (!Number.isInteger(id)) {
    return NextResponse.json({ message: "Invalid evidence file." }, { status: 400 });
  }

  const evidenceFile = await prisma.evidenceFile.findFirst({
    where: { id, employeeId: employee.id },
    select: { fileName: true, mimeType: true, data: true },
  });

  if (!evidenceFile) {
    return NextResponse.json({ message: "Evidence file not found." }, { status: 404 });
  }

  return new Response(evidenceFile.data, {
    headers: {
      "Content-Type": evidenceFile.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(evidenceFile.fileName)}`,
    },
  });
}
