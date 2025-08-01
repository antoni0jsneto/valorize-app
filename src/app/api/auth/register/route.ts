import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, image } = await req.json();

    console.log("Registration request:", { name, email, image });

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    console.log("Creating user and wallet...");

    // Create user and wallet in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user first
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          image,
        },
      });

      console.log("User created:", user.id);

      // Create default wallet account
      const wallet = await tx.bankAccount.create({
        data: {
          name: "Carteira",
          type: "WALLET",
          icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 7v12a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',
          iconColor: "#64748b",
          userId: user.id,
        },
      });

      console.log("Wallet created:", wallet.id);

      // Verify if wallet was created
      const verifyWallet = await tx.bankAccount.findFirst({
        where: {
          id: wallet.id,
        },
      });

      console.log("Wallet verification:", verifyWallet);

      return { user, wallet };
    });

    console.log("Transaction completed successfully");

    // Verify if the wallet exists after transaction
    const verifyWalletAfterTransaction = await prisma.bankAccount.findFirst({
      where: {
        userId: result.user.id,
      },
    });

    console.log("Final wallet verification:", verifyWalletAfterTransaction);

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        user: {
          ...result.user,
          bankAccounts: [result.wallet],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erro ao criar usuário: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
