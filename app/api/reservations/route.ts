import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(
  request: NextRequest,
  context: any
) {
  try {
    const id = context.params.id;

    await prisma.reservation.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json({
      message: "Reservation cancelled",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Cancel failed",
      },
      {
        status: 500,
      }
    );
  }
}