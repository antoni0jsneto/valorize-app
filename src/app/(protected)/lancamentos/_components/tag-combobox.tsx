"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Tag as TagIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQueryClient } from "@tanstack/react-query";

interface Tag {
  id: string;
  name: string;
}

interface TagComboboxProps {
  value?: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

export function TagCombobox({
  value = [],
  onValueChange,
  placeholder = "Selecione ou crie tags",
  emptyText = "Nenhuma tag encontrada.",
  className,
}: TagComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();

  // Carregar tags existentes
  React.useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    fetchTags();
  }, []);

  // Criar nova tag
  const createTag = async (name: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tag");
      }

      const newTag = await response.json();
      setTags((prev) => [...prev, newTag]);
      await queryClient.invalidateQueries({ queryKey: ["tags"] });
      return newTag;
    } catch (error) {
      console.error("Failed to create tag:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();

      // Verificar se a tag já existe
      const existingTag = tags.find(
        (tag) => tag.name.toLowerCase() === inputValue.toLowerCase()
      );

      if (existingTag) {
        // Se a tag existe, apenas seleciona
        if (!value.includes(existingTag.id)) {
          onValueChange([...value, existingTag.id]);
        }
      } else {
        // Se a tag não existe, cria e seleciona
        const newTag = await createTag(inputValue);
        if (newTag) {
          onValueChange([...value, newTag.id]);
        }
      }
      setInputValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={isLoading}
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {value.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                return (
                  <div
                    key={tagId}
                    className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full text-sm"
                  >
                    <TagIcon className="h-3 w-3" />
                    <span>{tag?.name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
          />
          <CommandEmpty className="py-2 px-2 text-sm">
            {inputValue ? (
              <div className="flex items-center gap-2">
                <span>{emptyText}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={async () => {
                    const newTag = await createTag(inputValue);
                    if (newTag) {
                      onValueChange([...value, newTag.id]);
                      setInputValue("");
                    }
                  }}
                  disabled={isLoading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar "{inputValue}"
                </Button>
              </div>
            ) : (
              emptyText
            )}
          </CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {tags
              .filter((tag) =>
                tag.name.toLowerCase().includes(inputValue.toLowerCase())
              )
              .map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => {
                    onValueChange(
                      value.includes(tag.id)
                        ? value.filter((id) => id !== tag.id)
                        : [...value, tag.id]
                    );
                  }}
                >
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-4 w-4" />
                    <span>{tag.name}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value.includes(tag.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
