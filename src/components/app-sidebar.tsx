"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronFirst,
  ChevronLast,
  Menu,
  PieChart,
  Receipt,
  FileBarChart,
  Wallet,
  Bell,
  Tags,
  CreditCard,
  AlertCircle,
  Activity,
  Heart,
  Sliders,
  FolderTree,
  BellDot,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react";
import { FaChartPie } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
  type?: "separator";
  submenu?: MenuItem[];
}

export function AppSidebar() {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasNotifications] = useState(true);
  const { data: session } = useSession();
  const pathname = usePathname();

  const isMenuItemActive = (href: string) => {
    // Check if it's a submenu item
    if (href.startsWith("/configuracoes/")) {
      return pathname === href;
    }
    // Check if it's the main settings menu
    if (href === "/configuracoes") {
      return pathname.startsWith("/configuracoes");
    }
    return pathname === href;
  };

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

  const menuItems: MenuItem[] = [
    { label: "Visão Geral", icon: PieChart, href: "/dashboard" },
    { label: "Lançamentos", icon: Receipt, href: "/lancamentos" },
    { label: "Relatórios", icon: FileBarChart, href: "/relatorios" },
    { label: "Limite de Gastos", icon: Wallet, href: "/limite-de-gastos" },
    { label: "", icon: PieChart, href: "", type: "separator" },
    {
      label: "Configurações",
      icon: Settings,
      href: "/configuracoes",
      submenu: [
        { label: "Contas", icon: Wallet, href: "/configuracoes/contas" },
        {
          label: "Cartões de Crédito",
          icon: CreditCard,
          href: "/configuracoes/cartoes-de-credito",
        },
        {
          label: "Categorias",
          icon: FolderTree,
          href: "/configuracoes/categorias",
        },
        {
          label: "Preferências",
          icon: Sliders,
          href: "/configuracoes/preferencias",
        },
        { label: "Meu Plano", icon: Heart, href: "/configuracoes/plano" },
        { label: "Tags", icon: Tags, href: "/configuracoes/tags" },
        { label: "Alertas", icon: AlertCircle, href: "/configuracoes/alertas" },
        {
          label: "Atividades",
          icon: Activity,
          href: "/configuracoes/atividades",
        },
      ],
    },
  ];

  const SidebarContent = () => (
    <div
      className={`h-screen flex flex-col ${
        isMobile ? "w-full" : expanded ? "w-64" : "w-20"
      } bg-white border-r shadow-sm rounded-r-md`}
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
            {menuItems.map((item, index) => {
              if (item.type === "separator") {
                return <Separator key={index} className="my-4" />;
              }

              const Icon = item.icon;

              if (item.submenu) {
                return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={
                          isMenuItemActive(item.href) ? "green" : "ghost"
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
                        <Icon size={22} />
                        {(expanded || isMobile) && (
                          <>
                            <span className="flex-1 text-left">
                              {item.label}
                            </span>
                            <ChevronRight size={16} className="ml-auto" />
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side={expanded || isMobile ? "right" : "right"}
                      className="w-56"
                      align={expanded || isMobile ? "start" : "start"}
                      sideOffset={expanded || isMobile ? 10 : 0}
                    >
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isActive = isMenuItemActive(subItem.href);
                        return (
                          <DropdownMenuItem key={subItem.label} asChild>
                            <Link
                              href={subItem.href}
                              className={`flex items-center gap-2 w-full ${
                                isActive ? "bg-emerald-50 text-emerald-600" : ""
                              }`}
                            >
                              <SubIcon
                                size={18}
                                className={isActive ? "text-emerald-600" : ""}
                              />
                              <span>{subItem.label}</span>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={
                          isMenuItemActive(item.href) ? "green" : "ghost"
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
                        <Icon size={22} />
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
              );
            })}
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
            <>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-medium truncate">
                  {session?.user?.name}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut color="red" size={20} />
              </Button>
            </>
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
