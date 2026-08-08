import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitizeString } from "@/lib/security";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    let { url, type, latitude, longitude } = await request.json();

    url = sanitizeString(url, 1000);
    type = type === "geo_tagged" ? "geo_tagged" : "normal";

    const parsedLat = latitude ? parseFloat(latitude) : null;
    const parsedLong = longitude ? parseFloat(longitude) : null;

    if (
      (parsedLat !== null && (parsedLat < -90 || parsedLat > 90)) ||
      (parsedLong !== null && (parsedLong < -180 || parsedLong > 180))
    ) {
      return NextResponse.json(
        { error: "Invalid latitude or longitude range" },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.create({
      data: {
        eventId: params.id,
        url: url || "https://images.unsplash.com/photo-1511578314322-379afb476865",
        type,
        latitude: parsedLat,
        longitude: parsedLong,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Error adding photo:", error);
    return NextResponse.json(
      { error: "Failed to save photo" },
      { status: 500 }
    );
  }
}
