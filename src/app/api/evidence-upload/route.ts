import { NextResponse } from "next/server";

import { getCurrentEmployee } from "../../../../lib/current-employee";
import prisma from "../../../../lib/prisma";

const maxFileSize = 25 * 1024 * 1024;

export async function POST(request: Request) {
  const employee = await getCurrentEmployee();

  const formData = await request.formData();
  const file = formData.get("evidenceFile");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "Please choose an evidence file." }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json({ message: "The evidence file must be 25 MB or smaller." }, { status: 400 });
  }

  const evidenceFile = await prisma.evidenceFile.create({
    data: {
      employeeId: employee.id,
      fileName: file.name.slice(0, 255),
      mimeType: file.type || null,
      fileSize: file.size,
      data: Buffer.from(await file.arrayBuffer()),
    },
    select: { id: true, fileName: true },
  });

  return NextResponse.json({
    id: evidenceFile.id,
    fileName: evidenceFile.fileName,
  });
}
