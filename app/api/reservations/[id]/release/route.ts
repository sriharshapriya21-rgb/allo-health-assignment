import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    await prisma.inventory.update({
      where: {
        id: reservation.inventoryId,
      },
      data: {
        reservedQuantity: {
          decrement: reservation.quantity,
        },
      },
    });

    await prisma.reservation.update({
      where: {
        id: reservation.id,
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
      { error: "Failed to cancel reservation" },
      { status: 500 }
    );
  }
}