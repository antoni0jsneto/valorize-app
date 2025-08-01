import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new NextResponse("Start date and end date are required", {
        status: 400,
      });
    }

    const expenses = await prisma.expense.findMany({
      where: {
        user: {
          email: session.user.email,
        },
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        category: true,
        tags: true,
        bankAccount: true,
        creditCard: true,
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    // Calculate summary
    const actualIncome = expenses
      .filter((e) => e.type === "INCOME" && e.isPaid)
      .reduce((sum, e) => sum + e.amount, 0);

    const expectedIncome = expenses
      .filter((e) => e.type === "INCOME")
      .reduce((sum, e) => sum + e.amount, 0);

    const actualExpenses = expenses
      .filter((e) => e.type === "EXPENSE" && e.isPaid)
      .reduce((sum, e) => sum + e.amount, 0);

    const expectedExpenses = expenses
      .filter((e) => e.type === "EXPENSE")
      .reduce((sum, e) => sum + e.amount, 0);

    const summary = {
      currentBalance: actualIncome - actualExpenses,
      expectedBalance: expectedIncome - expectedExpenses,
      actualIncome,
      expectedIncome,
      actualExpenses,
      expectedExpenses,
    };

    return NextResponse.json({
      transactions: expenses,
      summary,
    });
  } catch (error) {
    console.error("[EXPENSES_GET]", error);
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

    const {
      description,
      amount,
      date,
      type,
      isRecurring,
      recurrenceType,
      recurrenceFrequency,
      installments,
      notes,
      account: accountId,
      category: categoryId,
      tags,
    } = body;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Validate account/card
    let bankAccountId: string | undefined;
    let creditCardId: string | undefined;

    if (accountId) {
      const creditCard = await prisma.creditCard.findFirst({
        where: {
          id: accountId,
          userId: user.id,
        },
      });

      if (creditCard) {
        creditCardId = accountId;
      } else {
        const bankAccount = await prisma.bankAccount.findFirst({
          where: {
            id: accountId,
            userId: user.id,
          },
        });

        if (bankAccount) {
          bankAccountId = accountId;
        } else {
          return new NextResponse("Account or credit card not found", {
            status: 404,
          });
        }
      }
    }

    // Validate category
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: user.id,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    // Prepare data
    const amountValue =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."))
        : amount;

    // Validate required fields
    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!date) {
      return new NextResponse("Date is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category is required", { status: 400 });
    }

    if (!type || !["EXPENSE", "INCOME"].includes(type)) {
      return new NextResponse("Invalid transaction type", { status: 400 });
    }

    if (isRecurring && !recurrenceType) {
      return new NextResponse(
        "Recurrence type is required for recurring transactions",
        { status: 400 }
      );
    }

    if (recurrenceType === "installments" && !installments) {
      return new NextResponse(
        "Number of installments is required for installment transactions",
        { status: 400 }
      );
    }

    const data = {
      description,
      amount: amountValue,
      date: new Date(date),
      type,
      isRecurring,
      recurrenceType,
      recurrenceFrequency,
      installments: installments ? parseInt(String(installments)) : undefined,
      notes,
      isPaid: false,
      user: {
        connect: {
          id: user.id,
        },
      },
      category: {
        connect: {
          id: categoryId,
        },
      },
      ...(bankAccountId
        ? {
            bankAccount: {
              connect: {
                id: bankAccountId,
              },
            },
          }
        : {}),
      ...(creditCardId
        ? {
            creditCard: {
              connect: {
                id: creditCardId,
              },
            },
          }
        : {}),
      ...(tags?.length
        ? {
            tags: {
              connect: tags.map((tagId: string) => ({ id: tagId })),
            },
          }
        : {}),
    };

    const expense = await prisma.expense.create({
      data,
      include: {
        category: true,
        tags: true,
        bankAccount: true,
        creditCard: true,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("[EXPENSES_POST]", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
