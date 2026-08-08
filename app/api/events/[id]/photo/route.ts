import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { url, type, latitude, longitude } = await request.json();

    const photo = await prisma.photo.create({
      data: {
        eventId: params.id,
        url: url || "https://images.unsplash.com/photo-1511578314322-379afb476865",
        type: type === "geo_tagged" ? "geo_tagged" : "normal",
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
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
