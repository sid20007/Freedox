import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitizeString } from "@/lib/security";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    let { linkOrReference } = await request.json();
    linkOrReference = sanitizeString(linkOrReference, 1000);

    if (!linkOrReference) {
      return NextResponse.json(
        { error: "Press clipping link or reference is required" },
        { status: 400 }
      );
    }

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
