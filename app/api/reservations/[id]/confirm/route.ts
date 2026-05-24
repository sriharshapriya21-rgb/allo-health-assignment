import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  context: any
) {
  try {
    const id = context.params.id;

    const reservation = await prisma.reservation.update({
      where: {
        id: id,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    return NextResponse.json({
      message: "Reservation confirmed",
      reservation,
    });
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