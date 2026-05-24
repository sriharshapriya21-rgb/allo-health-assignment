import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const reservation = await prisma.reservation.update({
      where: {
        id,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Confirmation failed",
      },
      {
        status: 500,
      }
    );
  }
}