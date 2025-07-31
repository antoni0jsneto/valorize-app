"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { expensesQueryKey } from "./use-expenses";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAccounts } from "./use-accounts";
import { useTags } from "./use-tags";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { TagInput } from "./tag-input";
import { cn } from "@/lib/utils";

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const repeatOptions = [
  { value: "daily", label: "Diário" },
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quinzenal" },
  { value: "monthly", label: "Mensal" },
  { value: "bimonthly", label: "Bimestral" },
  { value: "quarterly", label: "Trimestral" },
  { value: "semiannually", label: "Semestral" },
  { value: "annually", label: "Anual" },
];

const formSchema = z
  .object({
    id: z.string().optional(),
    description: z.string().min(1, "A descrição é obrigatória"),
    amount: z.string().min(1, "O valor é obrigatório"),
    date: z.date(),
    fromAccount: z.string().min(1, "Selecione a conta de origem"),
    toAccount: z.string().min(1, "Selecione a conta de destino"),
    isRecurring: z.boolean().default(false),
    recurrenceType: z.string().optional(),
    recurrenceFrequency: z.string().optional(),
    installments: z.number().optional(),
    notes: z.string().default(""),
    attachments: z.array(z.custom<File>()).default([]),
    tags: z.array(z.string()).default([]),
  })
  .refine((data) => data.fromAccount !== data.toAccount, {
    message: "A conta de origem e destino não podem ser a mesma",
    path: ["toAccount"],
  });

export function TransferModal({ open, onOpenChange }: TransferModalProps) {
  const queryClient = useQueryClient();
  const { data: accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { data: tags } = useTags();
  const [showNotes, setShowNotes] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [transferCategory, setTransferCategory] = useState<string>();

  // Buscar ou criar a categoria de transferência
  useEffect(() => {
    const fetchTransferCategory = async () => {
      try {
        const response = await fetch("/api/categories/transfer");
        if (!response.ok) throw new Error("Failed to fetch transfer category");
        const category = await response.json();
        setTransferCategory(category.id);
      } catch (error) {
        console.error("Error fetching transfer category:", error);
      }
    };

    fetchTransferCategory();
  }, []);

  const resetModal = () => {
    form.reset({
      description: "Transferência",
      amount: "",
      date: new Date(),
      fromAccount: "",
      toAccount: "",
      isRecurring: false,
      recurrenceType: undefined,
      recurrenceFrequency: undefined,
      installments: undefined,
      notes: "",
      attachments: [],
      tags: [],
    });
    form.clearErrors();
    setShowNotes(false);
    setShowAttachments(false);
    setShowTags(false);
  };

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "Transferência",
      amount: "",
      date: new Date(),
      fromAccount: "",
      toAccount: "",
      isRecurring: false,
      recurrenceType: undefined,
      recurrenceFrequency: undefined,
      installments: undefined,
      notes: "",
      attachments: [],
      tags: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!transferCategory) {
      console.error("Transfer category not found");
      return;
    }
    try {
      // Remover o prefixo "R$ " e converter para número
      const numericAmount = parseFloat(
        values.amount.replace(/[^\d,]/g, "").replace(",", ".")
      );

      // Criar a saída (débito)
      const debitResponse = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: values.description,
          amount: numericAmount,
          date: values.date,
          account: values.fromAccount,
          category: transferCategory,
          type: "EXPENSE",
          isRecurring: values.isRecurring,
          recurrenceType: values.recurrenceType,
          recurrenceFrequency: values.recurrenceFrequency,
          installments: values.installments,
          notes: values.notes,
          tags: values.tags,
        }),
      });

      if (!debitResponse.ok) {
        throw new Error("Failed to create debit transaction");
      }

      // Criar a entrada (crédito)
      const creditResponse = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: values.description,
          amount: numericAmount,
          date: values.date,
          account: values.toAccount,
          category: transferCategory,
          type: "INCOME",
          isRecurring: values.isRecurring,
          recurrenceType: values.recurrenceType,
          recurrenceFrequency: values.recurrenceFrequency,
          installments: values.installments,
          notes: values.notes,
          tags: values.tags,
        }),
      });

      if (!creditResponse.ok) {
        throw new Error("Failed to create credit transaction");
      }

      await queryClient.invalidateQueries({ queryKey: expensesQueryKey });
      resetModal();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      // TODO: Mostrar mensagem de erro
    }
  };

  // Filtra apenas contas bancárias (não inclui cartões de crédito)
  const bankAccounts = accounts?.filter((account) => {
    // Considera como conta bancária se a conta existe e tem um ID
    const isValid = !!account && !!account.id;

    return isValid;
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(opened) => {
        if (!opened) {
          resetModal();
        }
        onOpenChange(opened);
      }}
      onClose={resetModal}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transferência entre contas</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fromAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saiu da conta</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a conta de origem" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingAccounts ? (
                        <SelectItem value="loading">Carregando...</SelectItem>
                      ) : bankAccounts && bankAccounts.length > 0 ? (
                        bankAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center gap-2">
                              <div className="relative w-4 h-4 rounded-full overflow-hidden">
                                {account.icon && (
                                  <Image
                                    src={`/banks/${account.icon}.png`}
                                    alt={account.name}
                                    fill
                                    className="object-contain rounded-full"
                                  />
                                )}
                              </div>
                              {account.name}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          Nenhuma conta disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entrou na conta</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a conta de destino" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingAccounts ? (
                        <SelectItem value="loading">Carregando...</SelectItem>
                      ) : bankAccounts && bankAccounts.length > 0 ? (
                        bankAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center gap-2">
                              <div className="relative w-4 h-4 rounded-full overflow-hidden">
                                {account.icon && (
                                  <Image
                                    src={`/banks/${account.icon}.png`}
                                    alt={account.name}
                                    fill
                                    className="object-contain rounded-full"
                                  />
                                )}
                              </div>
                              {account.name}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          Nenhuma conta disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite a descrição da transferência"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          R$
                        </span>
                        <Input
                          className="pl-9"
                          placeholder="0,00"
                          {...field}
                          value={field.value.replace(/^R\$\s?/, "")}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            const formattedValue = (
                              Number(value) / 100
                            ).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            });
                            field.onChange(formattedValue);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="repeat">Repetir</Label>
                <Switch
                  id="repeat"
                  checked={form.watch("isRecurring")}
                  onCheckedChange={(checked) =>
                    form.setValue("isRecurring", checked)
                  }
                />
              </div>

              {form.watch("isRecurring") && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recurrenceType"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de repetição" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fixed">
                              Transferência Fixa
                            </SelectItem>
                            <SelectItem value="installments">
                              Parcelado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  {form.watch("recurrenceType") === "fixed" && (
                    <FormField
                      control={form.control}
                      name="recurrenceFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Frequência" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {repeatOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch("recurrenceType") === "installments" && (
                    <>
                      <FormField
                        control={form.control}
                        name="installments"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Número de parcelas"
                                min={2}
                                max={480}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="recurrenceFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Frequência" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {repeatOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notes">Observação</Label>
                <Switch
                  id="notes"
                  checked={showNotes}
                  onCheckedChange={setShowNotes}
                />
              </div>

              {showNotes && (
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Digite suas observações aqui"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="attachments">Anexos</Label>
                <Switch
                  id="attachments"
                  checked={showAttachments}
                  onCheckedChange={setShowAttachments}
                />
              </div>

              {showAttachments && (
                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  Clique para fazer upload ou arraste e solte
                                </p>
                                <p className="text-xs text-gray-500">
                                  PDF ou imagens (máx. 10MB)
                                </p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,image/*"
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(
                                    e.target.files || []
                                  );
                                  const currentFiles = field.value
                                    ? Array.from(field.value)
                                    : [];
                                  field.onChange([...currentFiles, ...files]);
                                }}
                              />
                            </label>
                          </div>

                          {field.value && field.value.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                              {Array.from(field.value).map(
                                (file: File, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 border rounded"
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      {file.type.startsWith("image/") ? (
                                        <img
                                          src={URL.createObjectURL(file)}
                                          alt={file.name}
                                          className="w-8 h-8 object-cover rounded"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                          PDF
                                        </div>
                                      )}
                                      <span className="text-sm truncate">
                                        {file.name}
                                      </span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700"
                                      onClick={() => {
                                        const currentFiles = field.value
                                          ? Array.from(field.value)
                                          : [];
                                        currentFiles.splice(index, 1);
                                        field.onChange(currentFiles);
                                      }}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="tags">Tags</Label>
                <Switch
                  id="tags"
                  checked={showTags}
                  onCheckedChange={setShowTags}
                />
              </div>

              {showTags && (
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TagInput
                          value={field.value}
                          onValueChange={field.onChange}
                          availableTags={tags || []}
                          placeholder="Adicionar tag..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetModal();
                  onOpenChange(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
