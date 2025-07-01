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

    // Verify if user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      try {
        // Create categories one by one to avoid unique constraint issues
        for (const category of defaultCategories) {
          try {
            await prisma.category.create({
              data: {
                name: category.name,
                icon: category.icon,
                color: category.color,
                type: category.type,
                userId: session.user.id,
              },
            });
          } catch (error) {
            console.error(`Error creating category ${category.name}:`, error);
            // Continue with the next category if this one fails
            continue;
          }
        }

        // Fetch all categories again after creation
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
      } catch (error) {
        console.error("Error creating default categories:", error);
        return NextResponse.json(
          { error: "Error creating default categories" },
          { status: 500 }
        );
      }
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
