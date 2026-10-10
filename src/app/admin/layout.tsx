import React from "react";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";

export const metadata = {
  title: "Admin Governance & Operations Console",
  description: "Executive control panel for departments, courses, user roles, offerings, and university financials.",
};

export default function AdminLayout({
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
