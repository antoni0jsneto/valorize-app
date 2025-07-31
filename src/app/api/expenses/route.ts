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

    const expenses = await prisma.expense.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      include: {
        category: true,
        tags: true,
        bankAccount: true,
        creditCard: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(expenses);
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
    console.log("Request body:", body);

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

    console.log("Account ID:", accountId);
    console.log("Category ID:", categoryId);

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Validar se a conta/cartão existe e pertence ao usuário
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

    // Validar se a categoria existe e pertence ao usuário
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: user.id,
      },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    // Preparar os dados
    const amountValue =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."))
        : amount;

    // Validar campos obrigatórios
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

    console.log("Prepared data:", data);

    // Criar a despesa
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
