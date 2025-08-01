"use client";

// ... (mantenha os imports existentes)
import { AccountSelect } from "./account-select";

// ... (mantenha o código até o grid de account/category)

<div className="grid grid-cols-2 gap-4">
  <AccountSelect control={form.control} />

  <FormField
    control={form.control}
    name="category"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Categoria</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {isLoadingCategories ? (
              <SelectItem value="loading" disabled>
                Carregando categorias...
              </SelectItem>
            ) : (
              categories
                ?.filter((cat: CategoryWithIcon) => cat.type === "INCOME")
                .map((category: CategoryWithIcon) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.icon && (
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: category.color,
                          }}
                        >
                          <category.icon className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <span>{category.name}</span>
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
</div>;

// ... (mantenha o resto do código igual)
