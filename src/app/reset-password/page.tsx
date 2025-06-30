"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Token inválido.");
      return;
    }

    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success("Senha redefinida com sucesso!");
      router.push("/login");
    } else {
      toast.error(data.error || "Erro ao redefinir senha.");
    }
  };

  return (
    <>
      <div className="relative">
        <div className="absolute top-2 left-2">
          <Link href="/">
            <h1 className="text-xl font-bold tracking-tight text-emerald-600 whitespace-nowrap">
              Valorize
              <span className="text-emerald-500 font-extrabold">App</span>
            </h1>
          </Link>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Redefinir Senha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nova senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Confirmar senha</label>
                <Input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
