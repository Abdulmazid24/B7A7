import React from "react";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";

export const metadata = {
  title: "Student Academic Hub & Enrollment Portal",
  description: "Course enrollment, academic records, CGPA calculations, and tuition payments via Stripe.",
};

export default function StudentLayout({
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
