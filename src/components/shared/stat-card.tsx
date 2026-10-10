import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: string;
  trendDirection?: "up" | "down";
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendDirection = "up",
  iconColor = "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400",
}: StatCardProps) {
  return (
    <Card className="overflow-hidden relative">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              {value}
            </h4>
          </div>
          <div className={cn("p-3 rounded-xl shrink-0", iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {(description || trend) && (
          <div className="mt-3 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  "font-semibold",
                  trendDirection === "up" ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {trend}
              </span>
            )}
            {description && (
              <span className="text-slate-500 dark:text-slate-400">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
