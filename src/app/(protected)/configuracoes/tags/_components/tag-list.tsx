"use client";

import { Card } from "@/components/ui/card";
import { Tag } from "./use-tags";
import { Separator } from "@/components/ui/separator";
import { Tag as TagIcon } from "lucide-react";

interface TagListProps {
  tags: Tag[];
}

export function TagList({ tags }: TagListProps) {
  return (
    <div className="grid grid-cols-1 gap-1 bg-white rounded-lg px-2">
      {tags.map((tag, index) => {
        const isLastItem = index === tags.length - 1;

        return (
          <div key={tag.id}>
            <Card className="px-4 flex flex-row items-center gap-4 cursor-pointer transition-colors border-none shadow-none">
              <div className="h-12 w-12 rounded-full flex items-center justify-center border ring-1 ring-gray-100">
                <TagIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium">{tag.name}</h3>
              </div>
            </Card>
            {!isLastItem && <Separator className="my-2" />}
          </div>
        );
      })}
    </div>
  );
}
