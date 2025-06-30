"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { IoMdLogIn } from "react-icons/io";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Loading from "@/components/loading";

export default function LoginPage() {
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error("Ocorreu um erro ao fazer login com o Google");
    }
  }, [error]);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Email ou senha inválidos");
      } else {
        toast.success("Login realizado com sucesso");
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao fazer login");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await signIn("google", {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      toast.error("Ocorreu um erro ao fazer login com o Google");
      console.error("Google login error:", error);
      setGoogleLoading(false);
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
              Entrar no Valorize
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <IoMdLogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </div>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Ou continue com
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Conectando com Google...
                </div>
              ) : (
                <>
                  <FcGoogle className="mr-2" />
                  Entrar com Google
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <span className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
