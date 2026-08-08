import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action, approverName, role, comment } = await request.json();

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'." },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const approval = await prisma.approval.create({
      data: {
        eventId: params.id,
        approverName: approverName || "Dean of Student Affairs",
        role: role || "Dean",
        comment: comment || null,
      },
    });

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: { status: newStatus },
      include: {
        approvals: true,
        reports: true,
        photos: true,
        feedbacks: true,
        pressClippings: true,
      },
    });

    return NextResponse.json({ approval, event: updatedEvent });
  } catch (error) {
    console.error("Error processing approval:", error);
    return NextResponse.json(
      { error: "Failed to process approval" },
      { status: 500 }
    );
  }
}
