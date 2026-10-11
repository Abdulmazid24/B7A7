"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BentoActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  gradientClass?: string;
  iconColorClass?: string;
  badgeText?: string;
  metrics?: {
    label: string;
    value: string | number;
    color?: "indigo" | "emerald" | "amber" | "blue" | "purple";
  }[];
  quickAction?: {
    label: string;
    onClick: (e: React.MouseEvent) => void;
  };
}

export function BentoActionCard({
  title,
  description,
  href,
  icon: Icon,
  gradientClass = "from-indigo-500 to-violet-600 shadow-indigo-500/20",
  iconColorClass = "text-white",
  badgeText,
  metrics,
  quickAction,
}: BentoActionCardProps) {
  const metricColorMap = {
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  };

  return (
    <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-500/50">
      <Link href={href} className="flex items-center gap-4">
        {/* Left Gradient Icon Container */}
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr shadow-lg transition-transform duration-300 group-hover:scale-105",
            gradientClass
          )}
        >
          <Icon className={cn("h-7 w-7", iconColorClass)} />
        </div>

        {/* Center Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              {title}
            </h4>
            {badgeText && (
              <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                {badgeText}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>

          {/* Quick Metrics Row */}
          {metrics && metrics.length > 0 && (
            <div className="mt-2.5 flex items-center gap-2">
              {metrics.map((m, idx) => {
                const color = m.color || "indigo";
                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[11px] font-semibold",
                      metricColorMap[color]
                    )}
                  >
                    <span className="opacity-75">{m.label}:</span>
                    <span>{m.value}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2">
          {quickAction && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                quickAction.onClick(e);
              }}
              title={quickAction.label}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-indigo-500/30 dark:bg-slate-800 dark:group-hover:bg-indigo-600">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </div>
  );
}
