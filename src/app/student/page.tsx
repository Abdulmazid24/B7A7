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
  Sparkles,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { StatCard } from "@/components/shared/stat-card";
import { BentoActionCard } from "@/components/shared/bento-action-card";
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

  const enrolledList = enrollments && enrollments.length > 0 ? enrollments : [
    {
      id: "enr-1",
      courseOfferingId: "off-1",
      courseOffering: {
        id: "off-1",
        course: { code: "CSE101", title: "Introduction to Computer Science", credits: 3 },
        sectionNumber: 1,
        scheduleTime: "Sun, Tue 10:00 AM - 11:30 AM",
        roomNumber: "Building 3, Room 402",
        faculty: { profile: { firstName: "Dr. Rafiqul", lastName: "Islam" } },
      },
    },
    {
      id: "enr-2",
      courseOfferingId: "off-2",
      courseOffering: {
        id: "off-2",
        course: { code: "CSE201", title: "Data Structures & Algorithms", credits: 3 },
        sectionNumber: 1,
        scheduleTime: "Mon, Wed 02:00 PM - 03:30 PM",
        roomNumber: "Building 2, Lab 101",
        faculty: { profile: { firstName: "Dr. Farhana", lastName: "Ahmed" } },
      },
    },
  ];

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title={`Student Academic Portal • ${user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : "Tanvir Hossain"}`}
        subtitle={`Student ID: ${user?.studentId || "STU-2026-001"} • B.Sc. in Computer Science & Engineering`}
        action={
          <div className="flex items-center gap-2">
            <Link href="/student/registration">
              <Button size="sm" className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                <PlusCircle className="h-3.5 w-3.5" />
                Enroll Courses
              </Button>
            </Link>
          </div>
        }
      />

      <div className="px-6 space-y-8">
        {/* STUDENT ACADEMIC BANNER */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-6 text-white shadow-xl dark:border-emerald-950">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
                  Academic Standing: Excellent (Dean's Honor List)
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Semester Spring 2026 • 12 Active Credit Hours</span>
                <Sparkles className="h-4 w-4 text-amber-300" />
              </h3>
              <p className="text-xs text-emerald-200/80 max-w-xl">
                Cumulative CGPA: 3.82 / 4.00. Earned 36 / 130 credits towards Bachelor of Science graduation requirements.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/student/transcript">
                <Button size="sm" className="bg-white text-emerald-950 hover:bg-emerald-50 font-semibold text-xs gap-1.5 shadow">
                  <FileText className="h-3.5 w-3.5" />
                  Official Transcript
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Cumulative CGPA"
            value="3.82 / 4.00"
            description="Verified Academic Standing"
            icon={Award}
            trend="Dean's List Honoree"
            iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
          <StatCard
            title="Current Term Load"
            value="12 Credits"
            description="4 Courses Registered"
            icon={BookOpen}
            iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
          />
          <StatCard
            title="Tuition Billing"
            value="Stripe Active"
            description="Fee status: Assessed"
            icon={CreditCard}
            iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400"
          />
        </div>

        {/* BENTO ACTION HUB FOR STUDENT */}
        <div>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Student Academic Hub</span>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-200 text-emerald-700 bg-emerald-50">
                Action Launchers
              </Badge>
            </h3>
            <p className="text-xs text-slate-500">
              Quick access to course enrollment, certified transcripts, and Stripe tuition payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <BentoActionCard
              title="Course Registration"
              description="ACID seat locking & prerequisite validation"
              href="/student/registration"
              icon={PlusCircle}
              gradientClass="from-indigo-500 to-indigo-600 shadow-indigo-500/25"
              metrics={[
                { label: "Status", value: "Window Open", color: "emerald" },
                { label: "Max", value: "15 Cr", color: "indigo" },
              ]}
            />

            <BentoActionCard
              title="Academic Transcript"
              description="Certified record with official university seal"
              href="/student/transcript"
              icon={Award}
              gradientClass="from-emerald-500 to-teal-600 shadow-emerald-500/25"
              metrics={[
                { label: "CGPA", value: "3.82", color: "emerald" },
                { label: "Credits", value: "36 Earned", color: "blue" },
              ]}
            />

            <BentoActionCard
              title="Tuition Statements"
              description="Instant Stripe Checkout Session integration"
              href="/student/invoices"
              icon={CreditCard}
              gradientClass="from-blue-500 to-cyan-600 shadow-blue-500/25"
              metrics={[
                { label: "Gateway", value: "Stripe Test", color: "blue" },
                { label: "Dues", value: "$1,200", color: "amber" },
              ]}
            />
          </div>
        </div>

        {/* Current Enrolled Courses */}
        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold">Current Semester Enrolled Sections</CardTitle>
                <CardDescription className="text-xs">
                  Courses registered under ACID concurrency guarantees with seat confirmation.
                </CardDescription>
              </div>
              <Link href="/student/transcript">
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Full Transcript
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {enrolledList.map((enr) => (
                <div
                  key={enr.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs text-indigo-700 bg-indigo-50">
                        {enr.courseOffering?.course?.code || "CSE101"}
                      </Badge>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {enr.courseOffering?.course?.title || "Course Title"}
                      </h4>
                      <Badge variant="outline" className="text-[10px]">
                        Section {enr.courseOffering?.sectionNumber || 1}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {enr.courseOffering?.scheduleTime || "Class Time"}
                      </span>
                      <span>{enr.courseOffering?.roomNumber || "Campus Room"}</span>
                      {enr.courseOffering?.faculty && (
                        <span>
                          Instructor: {enr.courseOffering.faculty.profile?.firstName}{" "}
                          {enr.courseOffering.faculty.profile?.lastName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="success" className="text-xs">
                      Enrolled
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
