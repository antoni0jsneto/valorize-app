"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X, Upload } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setImageUrl(data.url);
        toast.success("Imagem enviada com sucesso!");
      } else {
        toast.error(data.error || "Erro ao fazer upload da imagem");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Erro ao fazer upload da imagem: ${error.message}`);
      } else {
        toast.error("Erro ao fazer upload da imagem");
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          image: imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Cadastro realizado com sucesso!");
        // Sign in the user after successful registration
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Erro ao realizar cadastro");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Erro ao realizar cadastro: ${error.message}`);
      } else {
        toast.error("Erro ao realizar cadastro");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
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
            <CardTitle className="text-center text-2xl">Criar Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Continuar com Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-2 text-muted-foreground">
                  Ou cadastre-se com e-mail
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>
                      {formData.name ? formData.name[0].toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  {imageUrl && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Escolher foto
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">E-mail</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Confirmar Senha</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <span className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
