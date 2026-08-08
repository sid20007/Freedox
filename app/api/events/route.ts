import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    const { title, date, venue, budget, eventType, status } = body;

    if (!title || !date || !venue || !eventType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        venue,
        budget: parseFloat(budget) || 0,
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
