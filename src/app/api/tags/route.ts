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

    const tags = await prisma.tag.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("[TAGS_GET]", error);
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
    const { name } = body;

    if (!name) {
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

    const tag = await prisma.tag.create({
      data: {
        name,
        userId: user.id,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("[TAGS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}