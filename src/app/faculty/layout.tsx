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
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900 lg:flex-row">
      <DashboardSidebar />
      <main className="min-w-0 flex-1 flex flex-col overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
