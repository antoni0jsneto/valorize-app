"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { accountsQueryKey } from "@/app/(protected)/lancamentos/_components/use-accounts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { bankIcons, type BankIconType } from "./icon-map";
import { cn } from "@/lib/utils";

interface BankAccountDialogProps {
  children: React.ReactNode;
}

export function BankAccountDialog({ children }: BankAccountDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<BankIconType>("wallet");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/bank-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          icon: selectedIcon,
          iconColor: bankIcons[selectedIcon].color,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create bank account");
      }

      await queryClient.invalidateQueries({ queryKey: accountsQueryKey });
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error("Error creating bank account:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group icons by category
  const iconCategories = {
    "Ícones Genéricos": Object.entries(bankIcons).filter(([key]) =>
      ["wallet", "piggybank", "bank"].includes(key)
    ),
    "Bancos Digitais": Object.entries(bankIcons).filter(([key]) =>
      [
        "nubank",
        "neon",
        "next",
        "c6",
        "digio",
        "original",
        "pan",
        "nuconta",
        "rappibank",
      ].includes(key)
    ),
    "Bancos Tradicionais": Object.entries(bankIcons).filter(([key]) =>
      [
        "itau",
        "santander",
        "caixa",
        "daycoval",
        "sicoob",
        "sicredi",
        "mercantilbrasil",
      ].includes(key)
    ),
    "Serviços de Pagamento": Object.entries(bankIcons).filter(([key]) =>
      [
        "picpay",
        "mercadopago",
        "pagbank",
        "pagseguro",
        "paypal",
        "recargapay",
        "stone",
        "sumup",
        "wise",
        "celcoin",
      ].includes(key)
    ),
    "Cartões e Benefícios": Object.entries(bankIcons).filter(([key]) =>
      ["alelo", "sodexo", "ticket", "vr", "caju"].includes(key)
    ),
    "Investimentos e Crypto": Object.entries(bankIcons).filter(([key]) =>
      ["xp", "rico", "nuinvest", "toroinvestimentos", "cryptocom"].includes(key)
    ),
    "Varejo e Serviços": Object.entries(bankIcons).filter(([key]) =>
      [
        "magalupay",
        "carrefour",
        "renner",
        "riachuelo",
        "ca",
        "capay",
        "ifoodcard",
        "ifoodconta",
      ].includes(key)
    ),
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nova Conta</DialogTitle>
            <DialogDescription>
              Crie uma nova conta bancária ou carteira.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <ScrollArea className="h-[400px] pr-4">
              {Object.entries(iconCategories).map(([category, icons]) => (
                <div key={category} className="mb-6">
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                    {category}
                  </h4>
                  <div className="grid grid-cols-4 gap-2 px-1">
                    {icons.map(([key, value]) => {
                      const Icon = value.icon;
                      return (
                        <Button
                          key={key}
                          type="button"
                          variant="link"
                          className={cn(
                            "h-20 flex flex-col gap-1 items-center justify-center text-xs p-1 rounded-full",
                            selectedIcon === key && "ring-2 ring-gray-400"
                          )}
                          style={{
                            backgroundColor: "transparent",
                            color:
                              selectedIcon === key ? "#6a7282" : value.color,
                          }}
                          onClick={() => setSelectedIcon(key as BankIconType)}
                        >
                          <Icon className="h-10 w-10" />
                          <span className="text-[10px] text-center line-clamp-2  text-gray-400">
                            {value.name}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="grid gap-2">
              <label htmlFor="name">Nome da conta</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Nubank Principal"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !name}>
              {loading ? "Criando..." : "Criar conta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
