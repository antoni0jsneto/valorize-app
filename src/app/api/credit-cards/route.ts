import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const creditCards = await prisma.creditCard.findMany({
      where: {
        userId: user.id,
      },
      include: {
        bankAccount: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(creditCards);
  } catch (error) {
    console.error("[CREDIT_CARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, icon, iconColor, limit, closingDay, dueDay, bankAccountId } =
      body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!icon) {
      return new NextResponse("Icon is required", { status: 400 });
    }

    if (!limit) {
      return new NextResponse("Limit is required", { status: 400 });
    }

    if (!closingDay) {
      return new NextResponse("Closing day is required", { status: 400 });
    }

    if (!dueDay) {
      return new NextResponse("Due day is required", { status: 400 });
    }

    if (!bankAccountId) {
      return new NextResponse("Bank account is required", { status: 400 });
    }

    const creditCard = await prisma.creditCard.create({
      data: {
        name,
        icon,
        iconColor,
        limit,
        closingDay,
        dueDay,
        userId: user.id,
        bankAccountId,
      },
    });

    return NextResponse.json(creditCard);
  } catch (error) {
    console.error("[CREDIT_CARDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
