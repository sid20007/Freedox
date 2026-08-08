import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitizeString } from "@/lib/security";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    let { description, outcomes, participantCount } = await request.json();

    description = sanitizeString(description, 5000);
    outcomes = sanitizeString(outcomes, 2000);

    const parsedCount = parseInt(participantCount);
    if (!description || isNaN(parsedCount) || parsedCount < 0) {
      return NextResponse.json(
        { error: "Invalid report data or missing description" },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        eventId: params.id,
        description,
        outcomes,
        participantCount: parsedCount,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}
