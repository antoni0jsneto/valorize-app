import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";

// Função para enviar e-mail (simples - substitua por seu provedor)
async function sendResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  // Aqui você pode integrar com Resend, SendGrid, etc.
  console.log(`Enviar e-mail para: ${email}`);
  console.log(`Link: ${resetLink}`);
}

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "E-mail é obrigatório" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ success: true }); // Não expõe se o e-mail existe
  }

  const token = uuidv4();
  const expiresAt = addHours(new Date(), 2);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  await sendResetEmail(email, token);

  return NextResponse.json({ success: true });
}
