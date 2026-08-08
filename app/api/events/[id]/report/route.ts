import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { description, outcomes, participantCount } = await request.json();

    const report = await prisma.report.create({
      data: {
        eventId: params.id,
        description,
        outcomes,
        participantCount: parseInt(participantCount) || 0,
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
