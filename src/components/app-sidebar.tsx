"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  LogOut,
  User,
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
import { signOut, useSession } from "next-auth/react";

export function AppSidebar() {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasNotifications] = useState(true);
  const { data: session } = useSession();

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
    { label: "Visão Geral", icon: PieChart },
    { label: "Lançamentos", icon: Receipt },
    { label: "Relatórios", icon: FileBarChart },
    { label: "Limite de Gastos", icon: Wallet },
  ];

  const settingsItems = [
    { label: "Categorias", icon: FolderTree },
    { label: "Contas", icon: Wallet },
    { label: "Cartões de Crédito", icon: CreditCard },
    { label: "Preferências", icon: Sliders },
    { label: "Meu Plano", icon: Heart },
    { label: "Tags", icon: Tags },
    { label: "Alertas", icon: AlertCircle },
    { label: "Atividades", icon: Activity },
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
                  <Button
                    variant="ghost"
                    className={`
                      w-full relative hover:bg-gray-100
                      ${expanded ? "justify-start gap-3" : "justify-center p-2"}
                      ${isMobile && "justify-start gap-3"}
                    `}
                  >
                    <item.icon size={22} />
                    {(expanded || isMobile) && <span>{item.label}</span>}
                  </Button>
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
                      variant="ghost"
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
                  <DropdownMenuItem key={item.label} className="gap-2">
                    <item.icon size={18} />
                    <span>{item.label}</span>
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
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`
                      w-full relative hover:bg-gray-100
                      ${expanded ? "justify-start gap-3" : "justify-center p-2"}
                      ${isMobile && "justify-start gap-3"}
                    `}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    {(expanded || isMobile) && (
                      <div className="flex flex-col items-start flex-1">
                        <span className="text-sm font-medium">
                          {session?.user?.name || "Usuário"}
                        </span>
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              {!expanded && !isMobile && (
                <TooltipContent side="right" sideOffset={10}>
                  Usuário
                </TooltipContent>
              )}
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <User size={18} />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 text-red-600"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>
    </div>
  );

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  return (
    <>
      {/* Mobile View */}
      {isMobile ? (
        <div className="fixed top-0 left-0 right-0 z-50 border-b bg-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaChartPie className="text-emerald-500 text-2xl" />
            <h1 className="text-lg font-bold tracking-tight text-emerald-600">
              Valorize
              <span className="text-emerald-500 font-extrabold">App</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              {hasNotifications && (
                <div className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              )}
              <Bell size={20} />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <SheetDescription className="sr-only">
                  Menu principal do aplicativo com opções de navegação e
                  configurações
                </SheetDescription>
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      ) : (
        // Desktop View
        <SidebarContent />
      )}
    </>
  );
}
