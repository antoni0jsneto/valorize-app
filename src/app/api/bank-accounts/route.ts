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

    const accounts = await prisma.bankAccount.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        icon: true,
        iconColor: true,
        creditCards: {
          select: {
            id: true,
            name: true,
            icon: true,
            iconColor: true,
            bankAccount: {
              select: {
                id: true,
                name: true,
                icon: true,
                iconColor: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("[BANK_ACCOUNTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, icon, iconColor } = body;

    if (!name || !icon || !iconColor) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const account = await prisma.bankAccount.create({
      data: {
        name,
        icon,
        iconColor,
        userId: user.id,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error("[BANK_ACCOUNTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
