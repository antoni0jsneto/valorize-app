"use client";

import { useState } from "react";
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
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAccounts } from "./use-accounts";
import { useCategories, type CategoryWithIcon } from "./use-categories";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload, Check } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

interface ExpenseModalProps {
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

const formSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "A descrição é obrigatória"),
  amount: z.string().min(1, "O valor é obrigatório"),
  date: z.date(),
  account: z.string().min(1, "Selecione uma conta ou cartão"),
  category: z.string().min(1, "Selecione uma categoria"),
  isRecurring: z.boolean().default(false),
  recurrenceType: z.string().optional(),
  recurrenceFrequency: z.string().optional(),
  installments: z.number().optional(),
  notes: z.string().default(""),
  attachments: z.array(z.custom<File>()).default([]),
  tags: z.array(z.string()).default([]),
});

export function ExpenseModal({ open, onOpenChange }: ExpenseModalProps) {
  const { data: accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const [showNotes, setShowNotes] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showTags, setShowTags] = useState(false);

  const resetModal = () => {
    form.reset({
      description: "",
      amount: "0,00",
      date: new Date(),
      account: "",
      category: "",
      isRecurring: false,
      recurrenceType: undefined,
      recurrenceFrequency: undefined,
      installments: undefined,
      notes: "",
      attachments: [],
      tags: [],
    });
    setShowNotes(false);
    setShowAttachments(false);
    setShowTags(false);
  };

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "R$ 0,00",
      date: new Date(),
      isRecurring: false,
      notes: "",
      attachments: [],
      tags: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      // TODO: Implementar a chamada à API aqui
      resetModal();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      // TODO: Mostrar mensagem de erro
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(opened) => {
        if (!opened) {
          resetModal();
        }
        onOpenChange(opened);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova despesa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite a descrição da despesa"
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
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            locale={ptBR}
                            weekStartsOn={0}
                            ISOWeek={false}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            classNames={{
                              months:
                                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                              month: "space-y-4",
                              caption:
                                "flex justify-center pt-1 relative items-center",
                              caption_label: "text-sm font-medium",
                              nav: "space-x-1 flex items-center",
                              nav_button:
                                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                              nav_button_previous: "absolute left-1",
                              nav_button_next: "absolute right-1",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell:
                                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                              row: "flex w-full mt-2",
                              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                              day_selected:
                                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                              day_today: "bg-accent text-accent-foreground",
                              day_outside: "text-muted-foreground opacity-50",
                              day_disabled: "text-muted-foreground opacity-50",
                              day_range_middle:
                                "aria-selected:bg-accent aria-selected:text-accent-foreground",
                              day_hidden: "invisible",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta/Cartão</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma conta ou cartão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingAccounts ? (
                          <SelectItem value="loading">Carregando...</SelectItem>
                        ) : (
                          accounts?.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              <div className="flex items-center gap-2">
                                <div className="relative w-4 h-4">
                                  {account.icon && (
                                    <Image
                                      src={account.icon}
                                      alt={account.name}
                                      fill
                                      className="object-contain"
                                    />
                                  )}
                                </div>
                                {account.name}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      {isLoadingCategories ? (
                        <Button
                          variant="outline"
                          disabled
                          className="w-full justify-start"
                        >
                          <span className="text-muted-foreground">
                            Carregando categorias...
                          </span>
                        </Button>
                      ) : (
                        <Combobox
                          items={
                            categories
                              ?.filter(
                                (cat: CategoryWithIcon) =>
                                  cat.type === "EXPENSE"
                              )
                              .map((category: CategoryWithIcon) => ({
                                value: category.id,
                                label: category.name,
                                icon: category.icon,
                                color: category.color,
                              })) || []
                          }
                          value={field.value || ""}
                          onValueChange={(value) => field.onChange(value)}
                          placeholder="Selecione uma categoria"
                          renderItem={(item) => (
                            <div className="flex items-center gap-2">
                              {item.icon && (
                                <div
                                  className="h-6 w-6 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: item.color }}
                                >
                                  <item.icon className="h-4 w-4 text-white" />
                                </div>
                              )}
                              <span>{item.label}</span>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  field.value === item.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                          )}
                        />
                      )}
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
                            <SelectItem value="fixed">Despesa Fixa</SelectItem>
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
                      <Select
                        onValueChange={(value) => {
                          const currentTags = field.value || [];
                          if (!currentTags.includes(value)) {
                            field.onChange([...currentTags, value]);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione as tags" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tag1">Tag 1</SelectItem>
                          <SelectItem value="tag2">Tag 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
