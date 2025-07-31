"use server";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { ArrowLeftRight } from "lucide-react";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Procurar a categoria de transferência
    let transferCategory = await prisma.category.findFirst({
      where: {
        userId: user.id,
        name: "Transferência",
        type: "TRANSFER",
      },
    });

    // Se não existir, criar
    if (!transferCategory) {
      transferCategory = await prisma.category.create({
        data: {
          name: "Transferência",
          icon: "ArrowLeftRight",
          color: "#3b82f6", // blue-500
          type: "TRANSFER",
          userId: user.id,
        },
      });
    }

    return NextResponse.json(transferCategory);
  } catch (error) {
    console.error("[TRANSFER_CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
