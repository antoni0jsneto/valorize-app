import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { expenseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const expenseId = params.expenseId;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const expense = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!expense) {
      return new NextResponse("Expense not found", { status: 404 });
    }

    const updatedExpense = await prisma.expense.update({
      where: {
        id: expenseId,
      },
      data: {
        isPaid: !expense.isPaid,
      },
      include: {
        category: true,
        tags: true,
        bankAccount: true,
        creditCard: true,
      },
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("[EXPENSE_TOGGLE_PAID]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
