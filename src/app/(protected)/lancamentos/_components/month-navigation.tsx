"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthNavigationProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
}

export function MonthNavigation({
  currentDate,
  onMonthChange,
}: MonthNavigationProps) {
  const handlePreviousMonth = () => {
    onMonthChange(addMonths(currentDate, -1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentDate, 1));
  };

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="font-medium">
        {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
      </span>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
