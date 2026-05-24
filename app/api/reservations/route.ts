import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { productId, warehouseId, quantity } = body;

    const inventory = await prisma.inventory.findFirst({
      where: {
        productId,
        warehouseId,
      },
    });

    if (!inventory) {
      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }

    const availableStock =
      inventory.totalQuantity - inventory.reservedQuantity;

    if (availableStock < quantity) {
      return NextResponse.json(
        { error: "Not enough stock available" },
        { status: 409 }
      );
    }

    await prisma.inventory.update({
      where: {
        id: inventory.id,
      },
      data: {
        reservedQuantity: {
          increment: quantity,
        },
      },
    });

    const reservation = await prisma.reservation.create({
      data: {
        inventoryId: inventory.id,
        quantity,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return NextResponse.json(reservation, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Reservation failed" },
      { status: 500 }
    );
  }
}