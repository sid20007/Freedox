import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitizeString } from "@/lib/security";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        approvals: true,
        reports: true,
        photos: true,
        feedbacks: true,
        pressClippings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { title, date, venue, budget, eventType, status } = body;

    title = sanitizeString(title, 200);
    venue = sanitizeString(venue, 200);
    eventType = sanitizeString(eventType, 100);

    if (!title || !date || !venue || !eventType) {
      return NextResponse.json(
        { error: "Missing required fields or invalid text length" },
        { status: 400 }
      );
    }

    const parsedBudget = parseFloat(budget);
    if (isNaN(parsedBudget) || parsedBudget < 0 || parsedBudget > 100000000) {
      return NextResponse.json(
        { error: "Invalid budget amount" },
        { status: 400 }
      );
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        date: eventDate,
        venue,
        budget: parsedBudget,
        eventType,
        status: status === "pending_approval" ? "pending_approval" : "draft",
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
