import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { linkOrReference } = await request.json();

    const press = await prisma.pressClipping.create({
      data: {
        eventId: params.id,
        linkOrReference,
      },
    });

    return NextResponse.json(press, { status: 201 });
  } catch (error) {
    console.error("Error adding press clipping:", error);
    return NextResponse.json(
      { error: "Failed to save press clipping" },
      { status: 500 }
    );
  }
}
