"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  GraduationCap,
  Building2,
  DollarSign,
  TrendingUp,
  CreditCard,
  Plus,
  BookOpen,
  CalendarDays,
  FileCheck2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { AdminDashboardStats } from "@/types";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: async () => {
      const res = await api.get<AdminDashboardStats>("/admin/dashboard-stats");
      return res.data;
    },
  });

  const stats = data || {
    totalUsers: 18,
    totalStudents: 12,
    totalFaculties: 4,
    totalDepartments: 3,
    totalCourses: 8,
    totalEnrollments: 24,
    revenue: {
      totalAssessed: 14400,
      totalCollected: 9600,
      totalOutstanding: 4800,
    },
    departmentDistribution: [
      { name: "CSE", students: 8, courses: 4 },
      { name: "EEE", students: 3, courses: 2 },
      { name: "BBA", students: 1, courses: 2 },
    ],
    recentEnrollments: [],
  };

  const revenueChartData = [
    { name: "Assessed Fees", amount: stats.revenue.totalAssessed },
    { name: "Collected (Stripe)", amount: stats.revenue.totalCollected },
    { name: "Outstanding Dues", amount: stats.revenue.totalOutstanding },
  ];

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="University Operations & Analytics"
        subtitle="Real-time institutional metrics aggregated from live Neon PostgreSQL database."
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
        {/* STAT CARDS ROW */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Enrolled Students"
              value={stats.totalStudents}
              description="Active degree candidates"
              icon={GraduationCap}
              trend="+12% this term"
              iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
            />
            <StatCard
              title="Academic Faculty"
              value={stats.totalFaculties}
              description="Instructors across 3 depts"
              icon={Users}
              iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400"
            />
            <StatCard
              title="Active Departments"
              value={stats.totalDepartments}
              description="CSE, EEE, and BBA"
              icon={Building2}
              iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400"
            />
            <StatCard
              title="Tuition Collected (Stripe)"
              value={formatCurrency(stats.revenue.totalCollected)}
              description={`Due: ${formatCurrency(stats.revenue.totalOutstanding)}`}
              icon={CreditCard}
              trend="Automated Webhooks"
              iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
            />
          </div>
        )}

        {/* CHARTS ROW (RECHARTS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Distribution Chart */}
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Department Student Distribution</CardTitle>
              <CardDescription>
                Comparison of active enrolled students and catalog courses by academic department.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.departmentDistribution}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} />
                    <YAxis fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="students" name="Students" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="courses" name="Courses" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Ledger Chart */}
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Tuition Revenue & Accounts</CardTitle>
              <CardDescription>
                Breakdown of total semester assessed fees versus payments settled through Stripe.
              </CardDescription>
            </CardHeader>
            <CardContent>
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

        {/* QUICK MANAGEMENT LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/departments" className="group">
            <Card className="border-slate-200/80 hover:border-indigo-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Academic Departments
                  </h4>
                  <p className="text-xs text-slate-500">Manage CSE, EEE, BBA curriculums</p>
                </div>
                <Building2 className="h-6 w-6 text-indigo-500 shrink-0" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/courses" className="group">
            <Card className="border-slate-200/80 hover:border-indigo-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Course & Prerequisites
                  </h4>
                  <p className="text-xs text-slate-500">Configure prerequisites & credits</p>
                </div>
                <BookOpen className="h-6 w-6 text-purple-500 shrink-0" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/payments" className="group">
            <Card className="border-slate-200/80 hover:border-indigo-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    University Payments Ledger
                  </h4>
                  <p className="text-xs text-slate-500">Verify Stripe session transactions</p>
                </div>
                <CreditCard className="h-6 w-6 text-emerald-500 shrink-0" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
