"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  User,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Plus,
  MoreHorizontal,
} from "lucide-react";

export function TransactionsHeader() {
  return (
    <div className="bg-white border-b mx-2">
      <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="text-orange-800 text-sm">
                Há 229 lançamentos pendentes que ainda não foram pagos
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-orange-600 hover:text-orange-800"
            >
              ×
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              Lançamentos
            </h1>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Month Navigation and Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-gray-900">Julho 2025</span>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Filtrar por..." className="pl-10 w-48" />
            </div>
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
