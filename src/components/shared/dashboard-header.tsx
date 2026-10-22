"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, action }: DashboardHeaderProps) {
  const { logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex flex-col justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 sm:min-h-16 sm:flex-row sm:items-center sm:py-2 sm:px-6">
      <div className="min-w-0">
        <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-white sm:text-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {action}

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

      <div className="flex shrink-0 items-center justify-between gap-2 sm:justify-end">
          <Badge variant="outline" className="hidden bg-slate-50 px-2.5 py-1 text-xs sm:inline-flex">
            Academic workspace
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-xs text-slate-500 hover:text-rose-600 gap-1 hidden sm:flex"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
