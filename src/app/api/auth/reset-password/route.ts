import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json(
      { error: "Token e nova senha são obrigatórios." },
      { status: 400 }
    );
  }

  // 1. Verifica se o token existe
  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!tokenRecord) {
    return NextResponse.json(
      { error: "Token inválido ou expirado." },
      { status: 400 }
    );
  }

  // 2. Verifica se ainda está válido
  const now = new Date();
  if (tokenRecord.expiresAt < now) {
    return NextResponse.json({ error: "Token expirado." }, { status: 400 });
  }

  // 3. Atualiza a senha do usuário
  const hashedPassword = await hash(password, 10);
  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { password: hashedPassword },
  });

  // 4. Remove o token após uso
  await prisma.passwordResetToken.delete({
    where: { token },
  });

  return NextResponse.json({ success: true });
}
