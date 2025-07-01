import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { CategoryType, defaultCategories } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const type = request.nextUrl.searchParams.get("type") as CategoryType;
    const where = type
      ? { type, userId: session.user.id }
      : { userId: session.user.id };

    let categories = await prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        subcategories: {
          where: { isArchived: false },
          orderBy: { name: "asc" },
        },
      },
    });

    // If user has no categories, create default ones
    if (categories.length === 0) {
      const defaultCategoriesData = defaultCategories.map((category) => ({
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
        userId: session.user.id,
      }));

      await prisma.category.createMany({
        data: defaultCategoriesData,
      });

      categories = await prisma.category.findMany({
        where,
        orderBy: { name: "asc" },
        include: {
          subcategories: {
            where: { isArchived: false },
            orderBy: { name: "asc" },
          },
        },
      });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, icon, color, type } = await request.json();

    const category = await prisma.category.create({
      data: {
        name,
        icon,
        color,
        type,
        userId: session.user.id,
      },
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
