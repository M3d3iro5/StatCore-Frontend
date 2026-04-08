"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  BarChart3,
  ClipboardList,
  Settings,
  Download,
  Plus,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onPageChange?: (page: string) => void;
  onNewAnalysis?: () => void;
}

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "analises", icon: BarChart3, label: "Analises" },
  { id: "historico", icon: ClipboardList, label: "Historico" },
  { id: "configuracoes", icon: Settings, label: "Configuracoes" },
  { id: "exportar", icon: Download, label: "Exportar" },
];

export function DashboardLayout({
  children,
  currentPage = "dashboard",
  onPageChange,
  onNewAnalysis,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const getPageLabel = () => {
    const page = navItems.find((item) => item.id === currentPage);
    return page?.label || "Dashboard";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Activity className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              ERF Analytics
            </span>
            <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50">
              Integridade Estrutural
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-sidebar-foreground lg:hidden hover:bg-sidebar-accent"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* New Analysis Button */}
        <div className="px-4 pt-5 pb-2">
          <Button
            onClick={onNewAnalysis}
            className="w-full gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-lg shadow-sidebar-primary/25"
          >
            <Plus className="h-4 w-4" />
            Nova Analise
          </Button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = item.id === currentPage;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onPageChange?.(item.id);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.label}
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4 text-sidebar-primary" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Alerts Indicator */}
        <div className="mx-4 mb-4 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F59E0B]/20">
              <Bell className="h-3.5 w-3.5 text-[#F59E0B]" />
            </div>
            <div>
              <p className="font-medium text-sidebar-foreground">3 alertas</p>
              <p className="text-sidebar-foreground/50">Requerem atencao</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {getPageLabel()}

          {/* Breadcrumb */}
          <nav className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex">
            <span>ERF Analytics</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">Dashboard</span>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F59E0B] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F59E0B]" />
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-3">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      EC
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline-flex">
                    Eng. Carlos
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Preferencias</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
