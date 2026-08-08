import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitizeString } from "@/lib/security";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const responses = await prisma.feedbackResponse.findMany({
      where: { eventId: params.id },
      include: {
        question: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const ratingResponses = responses.filter(
      (r) => r.ratingValue !== null && r.ratingValue !== undefined
    );

    const averageRating =
      ratingResponses.length > 0
        ? ratingResponses.reduce((acc, curr) => acc + (curr.ratingValue || 0), 0) /
          ratingResponses.length
        : null;

    return NextResponse.json({
      responses,
      averageRating: averageRating ? parseFloat(averageRating.toFixed(2)) : null,
      totalResponses: responses.length,
      ratingCount: ratingResponses.length,
    });
  } catch (error) {
    console.error("Error fetching feedback responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback responses" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    let { studentName, responses } = body;

    studentName = sanitizeString(studentName, 100) || "Anonymous Student";

    if (!Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json(
        { error: "No valid responses submitted" },
        { status: 400 }
      );
    }

    // Rate limiting / spam guard: cap max responses per request to 10
    if (responses.length > 10) {
      return NextResponse.json(
        { error: "Too many response items in submission" },
        { status: 400 }
      );
    }

    const createdResponses = [];

    for (const r of responses) {
      const { questionId, answer } = r;
      if (!questionId || answer === undefined) continue;

      const sanitizedAnswer = sanitizeString(String(answer), 1000);
      const numVal = parseFloat(answer);
      const isRating = !isNaN(numVal) && numVal >= 1 && numVal <= 5;

      const created = await prisma.feedbackResponse.create({
        data: {
          eventId: params.id,
          questionId,
          studentName,
          answer: sanitizedAnswer,
          ratingValue: isRating ? numVal : null,
        },
      });

      createdResponses.push(created);
    }

    return NextResponse.json(createdResponses, { status: 201 });
  } catch (error) {
    console.error("Error saving feedback responses:", error);
    return NextResponse.json(
      { error: "Failed to save feedback responses" },
      { status: 500 }
    );
  }
}
