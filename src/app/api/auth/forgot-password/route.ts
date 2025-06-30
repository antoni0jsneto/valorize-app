import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// Função para enviar e-mail (simples - substitua por seu provedor)
async function sendResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  // Aqui você pode integrar com Resend, SendGrid, etc.
  console.log(`Enviar e-mail para: ${email}`);
  console.log(`Link: ${resetLink}`);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    try {
      // Save the reset token in the database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // TODO: Send email with reset link
      // For now, we'll just log it
      console.log(
        `Reset link: ${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
      );

      return NextResponse.json(
        { message: "Reset instructions sent successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating user with reset token:", error);
      return NextResponse.json(
        { error: "Failed to generate reset token" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
