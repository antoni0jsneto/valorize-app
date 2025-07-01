"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronFirst,
  ChevronLast,
  Menu,
  PieChart,
  Receipt,
  FileBarChart,
  Wallet,
  Settings,
  Bell,
  Tags,
  CreditCard,
  AlertCircle,
  Activity,
  Heart,
  Sliders,
  FolderTree,
  BellDot,
} from "lucide-react";
import { FaChartPie } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasNotifications] = useState(true);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setExpanded(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    { label: "Visão Geral", icon: PieChart, href: "/dashboard" },
    { label: "Lançamentos", icon: Receipt, href: "/dashboard/transactions" },
    { label: "Relatórios", icon: FileBarChart, href: "/dashboard/reports" },
    { label: "Limite de Gastos", icon: Wallet, href: "/dashboard/limits" },
  ];

  const settingsItems = [
    { label: "Categorias", icon: FolderTree, href: "/settings/categories" },
    { label: "Contas", icon: Wallet, href: "/settings/accounts" },
    {
      label: "Cartões de Crédito",
      icon: CreditCard,
      href: "/settings/credit-cards",
    },
    { label: "Preferências", icon: Sliders, href: "/settings/preferences" },
    { label: "Meu Plano", icon: Heart, href: "/settings/plan" },
    { label: "Tags", icon: Tags, href: "/settings/tags" },
    { label: "Alertas", icon: AlertCircle, href: "/settings/alerts" },
    { label: "Atividades", icon: Activity, href: "/settings/activities" },
  ];

  const SidebarContent = () => (
    <div
      className={`h-screen flex flex-col ${
        isMobile ? "w-full" : expanded ? "w-64" : "w-20"
      } bg-white border-r shadow-sm`}
    >
      {/* Logo Section */}
      <div
        className={`p-4 pb-2 flex items-center relative ${
          expanded ? "justify-between" : "justify-center"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden transition-all duration-300 mt-2">
          <FaChartPie
            className={`text-emerald-500 flex-shrink-0 ${
              expanded ? "text-3xl" : "text-2xl"
            }`}
          />
          {expanded && (
            <h1 className="text-xl font-bold tracking-tight text-emerald-600 whitespace-nowrap">
              Valorize
              <span className="text-emerald-500 font-extrabold">App</span>
            </h1>
          )}
        </div>

        {!isMobile && (
          <div className="absolute right-0 top-0">
            <Button
              onClick={() => setExpanded((prev) => !prev)}
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              {expanded ? (
                <ChevronFirst size={20} />
              ) : (
                <ChevronLast size={20} />
              )}
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-3">
        <TooltipProvider>
          {/* Main Menu */}
          <div className="space-y-2 py-4">
            {menuItems.map((item) => (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={`
                        w-full relative hover:bg-gray-100
                        ${
                          expanded
                            ? "justify-start gap-3"
                            : "justify-center p-2"
                        }
                        ${isMobile && "justify-start gap-3"}
                      `}
                    >
                      <item.icon size={22} />
                      {(expanded || isMobile) && <span>{item.label}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {!expanded && !isMobile && (
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}

            {/* Settings Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={
                        pathname.startsWith("/settings") ? "green" : "ghost"
                      }
                      className={`
                        w-full relative hover:bg-gray-100
                        ${
                          expanded
                            ? "justify-start gap-3"
                            : "justify-center p-2"
                        }
                        ${isMobile && "justify-start gap-3"}
                      `}
                    >
                      <Settings size={22} />
                      {(expanded || isMobile) && <span>Configurações</span>}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                {!expanded && !isMobile && (
                  <TooltipContent side="right" sideOffset={10}>
                    Configurações
                  </TooltipContent>
                )}
              </Tooltip>
              <DropdownMenuContent className="w-56" align="start" side="right">
                {settingsItems.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator className="my-4" />

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={`
                  w-full relative hover:bg-gray-100
                  ${expanded ? "justify-start gap-3" : "justify-center p-2"}
                  ${isMobile && "justify-start gap-3"}
                `}
              >
                {hasNotifications ? <BellDot size={22} /> : <Bell size={22} />}
                {(expanded || isMobile) && <span>Notificações</span>}
              </Button>
            </TooltipTrigger>
            {!expanded && !isMobile && (
              <TooltipContent side="right" sideOffset={10}>
                Notificações
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image ?? ""} />
            <AvatarFallback>
              {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          {(expanded || isMobile) && (
            <div className="flex-1 overflow-hidden">
              <h4 className="text-sm font-medium truncate">
                {session?.user?.name}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return isMobile ? (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0"
        title="Menu de Navegação"
        description="Menu principal do aplicativo com opções de navegação e configurações"
      >
        <SidebarContent />
      </SheetContent>
    </Sheet>
  ) : (
    <SidebarContent />
  );
}
