"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Users, GraduationCap, Building2, CreditCard, Plus, BookOpen, CalendarDays, Layers, CheckCircle2, Activity, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { StatCard } from "@/components/shared/stat-card";
import { BentoActionCard } from "@/components/shared/bento-action-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { AdminDashboardStats } from "@/types";
import { EmptyState } from "@/components/shared/empty-state";
import { UNIVERSITY_NAME } from "@/lib/constants";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: async () => {
      const res = await api.get<AdminDashboardStats>("/admin/dashboard-stats");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="flex-1 space-y-6 p-6" aria-label="Loading dashboard">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-32 rounded-xl" />)}</div>
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>;
  }

  if (isError || !data) {
    return <div className="flex-1 px-6 py-8">
      <EmptyState title="Dashboard metrics could not be loaded" description={error instanceof Error ? error.message : "Please try again."} icon={Activity} actionLabel="Retry" onAction={() => void refetch()} />
    </div>;
  }

  const stats = {
    totalUsers:
      data.overview.totalStudents + data.overview.totalFaculty + data.overview.totalAdmins,
    totalStudents: data.overview.totalStudents,
    totalFaculties: data.overview.totalFaculty,
    totalDepartments: data.overview.totalDepartments,
    totalCourses: data.overview.totalCourses,
    totalEnrollments: data.overview.totalEnrollments,
    revenue: {
      totalCollected: data.overview.totalRevenueCollected,
      totalOutstanding: data.overview.totalOutstandingDue,
    },
  };
  const activeSemester = data.activeSemester;
  const recentEnrollments = data.recentActivity?.recentEnrollments ?? [];

  const revenueChartData = [
    { name: "Collected (Stripe)", amount: stats.revenue.totalCollected },
    { name: "Outstanding Dues", amount: stats.revenue.totalOutstanding },
  ];

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="University Operations & Central Command"
        subtitle="Operational overview of departments, courses, users, and payment records."
        action={
          <div className="flex items-center gap-2">
            <Link href="/admin/departments">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <Building2 className="h-3.5 w-3.5" />
                Departments
              </Button>
            </Link>
            <Link href="/admin/courses">
              <Button size="sm" className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                Add Course
              </Button>
            </Link>
          </div>
        }
      />

      <div className="px-6 space-y-8">
        {/* EXECUTIVE SYSTEM STATUS BANNER */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 p-6 text-white shadow-xl dark:border-indigo-950">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
                  University operations
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{UNIVERSITY_NAME} Operations</span>
                <Sparkles className="h-4 w-4 text-amber-300" />
              </h3>
              <p className="text-xs text-indigo-200/80 max-w-xl">
                Current records include {stats.totalEnrollments} enrollments across {stats.totalCourses} courses.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-md border border-white/10 text-right">
                <p className="text-[10px] uppercase font-semibold text-indigo-200">Term Registration</p>
                <p className="text-xs font-bold text-white flex items-center gap-1 justify-end">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{activeSemester ? (activeSemester.isRegistrationOpen ? "WINDOW OPEN" : "WINDOW CLOSED") : "NO ACTIVE TERM"}</span>
                </p>
              </div>
              <Link href="/admin/offerings">
                <Button size="sm" className="bg-white text-indigo-950 hover:bg-indigo-50 font-semibold text-xs gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  View Offerings
                </Button>
              </Link>
            </div>
          </div>
          {/* Subtle background glow */}
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        {/* STAT CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Enrolled Students"
              value={stats.totalStudents}
              description="Active degree candidates"
              icon={GraduationCap}
              iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
            />
            <StatCard
              title="Academic Faculty"
              value={stats.totalFaculties}
              description="Active faculty accounts"
              icon={Users}
              iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400"
            />
            <StatCard
              title="Active Departments"
              value={stats.totalDepartments}
              description="Institutional catalog"
              icon={Building2}
              iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400"
            />
            <StatCard
              title="Tuition Collected (Stripe)"
              value={formatCurrency(stats.revenue.totalCollected)}
              description={`Due: ${formatCurrency(stats.revenue.totalOutstanding)}`}
              icon={CreditCard}
              trend="Recorded payments"
              iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
            />
          </div>

        {/* BENTO ACTION HUB (ACTION LAUNCHER MATRIX) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Central Management Hub</span>
                <Badge variant="outline" className="text-[10px] font-mono border-indigo-200 text-indigo-700 bg-indigo-50">
                  Quick Actions
                </Badge>
              </h3>
              <p className="text-xs text-slate-500">
                Action-oriented launcher for primary administrative entities and academic workflows.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <BentoActionCard
              title="Academic Departments"
              description="Configure faculties, programs, and curriculum divisions"
              href="/admin/departments"
              icon={Building2}
              gradientClass="from-indigo-500 to-indigo-600 shadow-indigo-500/25"
              metrics={[
                { label: "Active", value: stats.totalDepartments, color: "indigo" },
                { label: "Courses", value: stats.totalCourses, color: "blue" },
              ]}
            />

            <BentoActionCard
              title="Course Catalog & Curricula"
              description="Credit structures, prerequisite trees, and syllabi"
              href="/admin/courses"
              icon={BookOpen}
              gradientClass="from-purple-500 to-violet-600 shadow-purple-500/25"
              metrics={[
                { label: "Courses", value: stats.totalCourses, color: "purple" },
                { label: "Level", value: "Undergrad", color: "indigo" },
              ]}
            />

            <BentoActionCard
              title="Academic Semesters"
              description="Manage terms, registration windows, and schedules"
              href="/admin/semesters"
              icon={CalendarDays}
              gradientClass="from-blue-500 to-cyan-600 shadow-blue-500/25"
              metrics={[
                { label: "Current", value: activeSemester?.name ?? "None", color: "blue" },
                { label: "Window", value: activeSemester ? (activeSemester.isRegistrationOpen ? "OPEN" : "CLOSED") : "—", color: "emerald" },
              ]}
            />

            <BentoActionCard
              title="Section Offerings & Rooms"
              description="Room allocations, seat capacities, and faculty staffing"
              href="/admin/offerings"
              icon={Layers}
              gradientClass="from-amber-500 to-orange-600 shadow-amber-500/25"
              metrics={[
                { label: "Enrollments", value: stats.totalEnrollments, color: "amber" },
                { label: "ACID", value: "Protected", color: "emerald" },
              ]}
            />

            <BentoActionCard
              title="User Governance & RBAC"
              description="Directory of Admin, Faculty, and Student accounts"
              href="/admin/users"
              icon={Users}
              gradientClass="from-teal-500 to-emerald-600 shadow-teal-500/25"
              metrics={[
                { label: "Users", value: stats.totalUsers, color: "emerald" },
                { label: "Students", value: stats.totalStudents, color: "indigo" },
              ]}
            />

            <BentoActionCard
              title="Tuition & Stripe Ledger"
              description="Review recorded tuition payment transactions"
              href="/admin/payments"
              icon={CreditCard}
              gradientClass="from-emerald-500 to-green-600 shadow-emerald-500/25"
              metrics={[
                { label: "Collected", value: formatCurrency(stats.revenue.totalCollected), color: "emerald" },
                { label: "Outstanding", value: formatCurrency(stats.revenue.totalOutstanding), color: "amber" },
              ]}
            />
          </div>
        </div>

        {/* CHARTS ROW (RECHARTS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest registrations from the backend activity feed */}
          <Card className="border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
              <CardTitle className="text-sm font-bold">Recent Enrollments</CardTitle>
              <CardDescription className="text-xs">
                Latest course registrations recorded by the academic API.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-5">
              {recentEnrollments.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-500">No recent enrollments are available.</p>
              ) : recentEnrollments.map((enrollment) => {
                const studentName = [enrollment.student.profile?.firstName, enrollment.student.profile?.lastName]
                  .filter(Boolean)
                  .join(" ") || enrollment.student.email;

                return (
                  <div key={enrollment.id} className="flex flex-col gap-1 rounded-lg border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{studentName}</p>
                      <p className="truncate text-xs text-slate-500">{enrollment.section.offering.course.code} · {enrollment.section.offering.course.title}</p>
                    </div>
                    <time className="shrink-0 text-xs text-slate-500" dateTime={enrollment.enrolledAt}>
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </time>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Revenue Ledger Chart */}
          <Card className="border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
              <CardTitle className="text-sm font-bold">Tuition Revenue & Accounts</CardTitle>
              <CardDescription className="text-xs">
                Breakdown of total semester assessed fees versus payments settled through Stripe.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis type="number" fontSize={12} tickFormatter={(v) => `$${v}`} />
                    <YAxis type="category" dataKey="name" fontSize={12} width={120} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                      formatter={(val) => formatCurrency(Number(val))}
                    />
                    <Bar dataKey="amount" name="Amount (USD)" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
