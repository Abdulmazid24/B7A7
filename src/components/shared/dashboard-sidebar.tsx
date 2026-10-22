"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, Building2, CalendarDays, BookOpen, Layers, Users, Receipt, Award, PlusCircle, FileText, CreditCard, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import {
  ADMIN_NAV_LINKS,
  FACULTY_NAV_LINKS,
  STUDENT_NAV_LINKS,
  UNIVERSITY_NAME,
} from "@/lib/constants";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Building2,
  CalendarDays,
  BookOpen,
  Layers,
  Users,
  Receipt,
  GraduationCap,
  Award,
  PlusCircle,
  FileText,
  CreditCard,
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const role = user?.role || "STUDENT";
  const links =
    role === "ADMIN"
      ? ADMIN_NAV_LINKS
      : role === "FACULTY"
      ? FACULTY_NAV_LINKS
      : STUDENT_NAV_LINKS;

  const roleColor =
    role === "ADMIN"
      ? "bg-purple-500/10 text-purple-700 border-purple-200"
      : role === "FACULTY"
      ? "bg-blue-500/10 text-blue-700 border-blue-200"
      : "bg-emerald-500/10 text-emerald-700 border-emerald-200";

  return (
    <aside className="relative z-40 w-full shrink-0 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:justify-between lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMobileNavOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-sm font-bold leading-tight text-slate-900 dark:text-white">{UNIVERSITY_NAME}</span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-indigo-600">{role} Portal</span>
          </div>
        </Link>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-slate-900 lg:hidden"
          aria-label={isMobileNavOpen ? "Close dashboard navigation" : "Open dashboard navigation"}
          aria-expanded={isMobileNavOpen}
          aria-controls="dashboard-navigation"
          onClick={() => setIsMobileNavOpen((open) => !open)}
        >
          {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={`${isMobileNavOpen ? "block" : "hidden"} lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:justify-between`}>
       <div className="overflow-y-auto">
        {/* User Identity Pill */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.profile?.firstName
                  ? `${user.profile.firstName} ${user.profile.lastName}`
                  : user?.email || "Authenticated User"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant="outline" className={cn("text-[10px] py-0 px-1.5", roleColor)}>
                  {role}
                </Badge>
                {user?.studentId && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {user.studentId}
                  </span>
                )}
                {user?.facultyId && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {user.facultyId}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav id="dashboard-navigation" aria-label="Dashboard navigation" className="px-3 py-2 space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </p>
          {links.map((link) => {
            const Icon = ICON_MAP[link.icon] || LayoutDashboard;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileNavOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-500")} />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
       </div>

      {/* Bottom Footer Actions */}
      <div className="space-y-2 border-t border-slate-200 p-4 dark:border-slate-800 lg:shrink-0">
        <Link href="/" className="block" onClick={() => setIsMobileNavOpen(false)}>
          <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-slate-500 gap-2">
            <BookOpen className="h-3.5 w-3.5" />
            Public Campus Website
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { logout(); setIsMobileNavOpen(false); }}
          className="w-full justify-start text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 gap-2"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
      </div>
    </aside>
  );
}
