import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.feedbackQuestion.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching feedback questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback questions" },
      { status: 500 }
    );
  }
}
