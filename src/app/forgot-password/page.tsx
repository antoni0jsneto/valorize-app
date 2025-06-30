"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Se houver uma conta associada a este e-mail, você receberá as instruções para redefinir sua senha."
        );
        // We don't redirect here to prevent email enumeration
      } else if (data.error === "USER_NOT_FOUND") {
        // Redirect to register if user doesn't exist
        toast.info("Conta não encontrada. Redirecionando para o cadastro...");
        setTimeout(() => router.push("/register"), 2000);
      } else {
        toast.error(data.error || "Erro ao processar a solicitação.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Erro ao processar a solicitação: ${error.message}`);
      } else {
        toast.error("Erro ao processar a solicitação");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Esqueceu sua senha?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-6">
            Digite seu e-mail e enviaremos instruções para redefinir sua senha.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar instruções"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Voltar para o login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
