import React from "react";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";

export const metadata = {
  title: "Faculty Academic Desk & Grading Hub",
  description: "Manage teaching schedules, section student rosters, and publish academic marks.",
};

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
