import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
  // Create warehouse
  const warehouse = await prisma.warehouse.create({
    data: {
      name: "Main Warehouse",
      location: "Hyderabad",
    },
  });

  // Create Laptop product
  const laptop = await prisma.product.create({
    data: {
      name: "Laptop",
      description: "Gaming Laptop",
    },
  });

  // Create Laptop inventory
  const laptopInventory = await prisma.inventory.create({
    data: {
      productId: laptop.id,
      warehouseId: warehouse.id,
      totalQuantity: 10,
    },
  });

  // Create iPhone product
  const iphone = await prisma.product.create({
    data: {
      name: "iPhone",
      description: "Apple Phone",
    },
  });

  // Create iPhone inventory
  const iphoneInventory = await prisma.inventory.create({
    data: {
      productId: iphone.id,
      warehouseId: warehouse.id,
      totalQuantity: 5,
    },
  });

  return NextResponse.json({
    warehouse,
    laptop,
    laptopInventory,
    iphone,
    iphoneInventory,
  });
}