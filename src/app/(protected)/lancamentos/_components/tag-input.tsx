"use client";

import * as React from "react";
import { Tag as TagIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagsQueryKey } from "@/app/(protected)/configuracoes/tags/_components/use-tags";

interface Tag {
  id: string;
  name: string;
}

interface TagInputProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  availableTags: Tag[];
  placeholder?: string;
}

export function TagInput({
  value = [],
  onValueChange,
  availableTags,
  placeholder = "Adicionar tag...",
}: TagInputProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const queryClient = useQueryClient();

  const createTagMutation = useMutation({
    mutationFn: async (tagName: string) => {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName }),
      });
      if (!response.ok) throw new Error("Failed to create tag");
      return response.json();
    },
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: tagsQueryKey });
      onValueChange([...value, newTag.id]);
      setSearchValue("");
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim() !== "") {
      e.preventDefault();
      const existingTag = availableTags.find(
        (tag) => tag.name.toLowerCase() === searchValue.trim().toLowerCase()
      );
      if (existingTag) {
        if (!value.includes(existingTag.id)) {
          onValueChange([...value, existingTag.id]);
        }
      } else {
        createTagMutation.mutate(searchValue.trim());
      }
      setSearchValue("");
    }
  };

  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Select
          value={value[value.length - 1] || ""}
          onValueChange={(tagId) => {
            if (!value.includes(tagId)) {
              onValueChange([...value, tagId]);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4" />
              <SelectValue placeholder="Adicionar tag..." />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <div className="px-3 py-2">
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pesquisar ou criar tag..."
                  className="h-8"
                />
              </div>
              {filteredTags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>
                  <div className="flex items-center gap-2">
                    <TagIcon className="h-4 w-4" />
                    <span>{tag.name}</span>
                  </div>
                </SelectItem>
              ))}
              {searchValue && !filteredTags.length && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Pressione Enter para criar "{searchValue}"
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tagId) => {
          const tag = availableTags.find((t) => t.id === tagId);
          return tag ? (
            <div
              key={tag.id}
              className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
            >
              <TagIcon className="h-3 w-3 mr-1" />
              {tag.name}
              <button
                type="button"
                onClick={() =>
                  onValueChange(value.filter((id) => id !== tag.id))
                }
                className="ml-1 -mr-0.5 h-4 w-4 rounded-full hover:bg-blue-200 inline-flex items-center justify-center"
              >
                <span className="sr-only">Remove</span>×
              </button>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
