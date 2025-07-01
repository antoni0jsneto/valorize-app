"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ICON_MAP, IconName, Icon } from "./icon-map";
import { useState } from "react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: "EXPENSE" | "INCOME";
}

interface CategoryDialogProps {
  trigger: React.ReactNode;
  type: "EXPENSE" | "INCOME";
  onSubmit: (data: { name: string; icon: string; color: string }) => void;
  category?: Category;
}

export function CategoryDialog({
  trigger,
  type,
  onSubmit,
  category,
}: CategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name || "");
  const [selectedIcon, setSelectedIcon] = useState<IconName>(
    (category?.icon as IconName) || "wallet"
  );
  const [color, setColor] = useState(category?.color || "#000000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!selectedIcon) {
      toast.error("Ícone é obrigatório");
      return;
    }

    if (!color) {
      toast.error("Cor é obrigatória");
      return;
    }

    onSubmit({
      name,
      icon: selectedIcon,
      color,
    });

    setOpen(false);
    setName("");
    setSelectedIcon("wallet");
    setColor("#000000");
  };

  const dialogTitle = category
    ? `Editar Categoria de ${type === "EXPENSE" ? "Despesa" : "Receita"}`
    : `Nova Categoria de ${type === "EXPENSE" ? "Despesa" : "Receita"}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {category
              ? "Edite os detalhes da categoria existente"
              : "Crie uma nova categoria preenchendo os campos abaixo"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da categoria"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Cor</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-20 p-1"
                  />
                  <Input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Ícone</label>
              <ScrollArea className="h-[300px] rounded-md border p-2">
                <div className="grid grid-cols-6 gap-2">
                  {Object.keys(ICON_MAP).map((name) => (
                    <Button
                      key={name}
                      type="button"
                      variant={selectedIcon === name ? "icon" : "outline"}
                      className="h-10 w-10 p-0"
                      onClick={() => setSelectedIcon(name as IconName)}
                    >
                      <Icon
                        name={name as IconName}
                        className="h-4 w-4"
                        style={{ color }}
                      />
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">{category ? "Salvar" : "Criar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
