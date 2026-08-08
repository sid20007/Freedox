import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const venue = searchParams.get("venue")?.trim();
    const dateStr = searchParams.get("date");
    const excludeEventId = searchParams.get("excludeEventId");

    if (!venue || !dateStr) {
      return NextResponse.json({ hasConflict: false, conflictingEvent: null });
    }

    const inputDate = new Date(dateStr);
    if (isNaN(inputDate.getTime())) {
      return NextResponse.json({ hasConflict: false, conflictingEvent: null });
    }

    // Define calendar day bounds (start of day to end of day)
    const startOfDay = new Date(inputDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(inputDate);
    endOfDay.setHours(23, 59, 59, 999);

    const conflictingEvent = await prisma.event.findFirst({
      where: {
        id: excludeEventId ? { not: excludeEventId } : undefined,
        venue: {
          equals: venue,
        },
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["approved", "completed"],
        },
      },
      select: {
        id: true,
        title: true,
        date: true,
        venue: true,
        status: true,
      },
    });

    if (conflictingEvent) {
      return NextResponse.json({
        hasConflict: true,
        conflictingEvent,
      });
    }

    return NextResponse.json({
      hasConflict: false,
      conflictingEvent: null,
    });
  } catch (error) {
    console.error("Error checking venue conflict:", error);
    return NextResponse.json(
      { error: "Failed to check venue conflict" },
      { status: 500 }
    );
  }
}
