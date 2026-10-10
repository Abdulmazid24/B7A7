"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  GraduationCap,
  BookOpen,
  Award,
  CreditCard,
  PlusCircle,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api-client";
import { Enrollment } from "@/types";

export default function StudentOverviewPage() {
  const { user } = useAuthStore();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["student", "my-courses"],
    queryFn: async () => {
      try {
        const res = await api.get<Enrollment[]>("/enrollments/my-courses");
        return res.data;
      } catch {
        return [];
      }
    },
  });

  const enrolledList = enrollments || [];

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title={`Hello, ${user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : "Student"}`}
        subtitle={`Student ID: ${user?.studentId || "STU-2026-001"} • Department of ${user?.profile?.department?.name || "Computer Science"}`}
        action={
          <div className="flex items-center gap-2">
            <Link href="/student/registration">
              <Button size="sm" className="gap-1.5 text-xs">
                <PlusCircle className="h-3.5 w-3.5" />
                Register Courses
              </Button>
            </Link>
          </div>
        }
      />

      <div className="px-6 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Cumulative CGPA"
            value="3.85 / 4.00"
            description="Verified Academic Standing"
            icon={Award}
            trend="Dean's List Honoree"
            iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
          <StatCard
            title="Registered Credits"
            value="12 Credits"
            description="Active Semester Enrolled"
            icon={BookOpen}
            iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
          />
          <StatCard
            title="Tuition Billing"
            value="Stripe Active"
            description="Invoices assessed dynamically"
            icon={CreditCard}
            iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400"
          />
        </div>

        {/* Current Enrolled Courses */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Current Semester Enrolled Sections</CardTitle>
                <CardDescription>
                  Courses registered under ACID concurrency guarantees with seat confirmation.
                </CardDescription>
              </div>
              <Link href="/student/transcript">
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  View Transcript
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50">
                        CSE101 - Sec 01
                      </Badge>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        Introduction to Computer Science
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500">
                      Instructor: Dr. Farhan Ahmed • Mon / Wed 10:00 AM • Room 301
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      3 Credits
                    </Badge>
                    <Badge variant="success" className="text-[10px]">
                      Confirmed Active
                    </Badge>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50">
                        CSE201 - Sec 01
                      </Badge>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        Database Management Systems
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500">
                      Instructor: Dr. Farhan Ahmed • Tue / Thu 02:00 PM • Lab 402
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      4 Credits
                    </Badge>
                    <Badge variant="success" className="text-[10px]">
                      Confirmed Active
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/student/registration" className="group">
            <Card className="border-slate-200/80 hover:border-indigo-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Add or Withdraw Course Sections
                  </h4>
                  <p className="text-xs text-slate-500">
                    Live registration wizard with prerequisite checking
                  </p>
                </div>
                <PlusCircle className="h-6 w-6 text-indigo-500 shrink-0" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/student/invoices" className="group">
            <Card className="border-slate-200/80 hover:border-indigo-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Tuition Invoices & Stripe Checkout
                  </h4>
                  <p className="text-xs text-slate-500">
                    Settle semester bills with test card credentials
                  </p>
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
