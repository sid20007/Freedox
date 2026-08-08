import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await prisma.event.update({
      where: { id: params.id },
      data: { status: "completed" },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error marking event as completed:", error);
    return NextResponse.json(
      { error: "Failed to complete event" },
      { status: 500 }
    );
  }
}
