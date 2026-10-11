"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  GraduationCap,
  Users,
  Award,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
  CheckCircle2,
  FileCheck2,
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
import { CourseOffering } from "@/types";

export default function FacultyOverviewPage() {
  const { user } = useAuthStore();

  const { data: offerings, isLoading } = useQuery({
    queryKey: ["faculty", "my-offerings"],
    queryFn: async () => {
      const res = await api.get<CourseOffering[]>("/course-offerings");
      return res.data;
    },
  });

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title={`Academic Faculty Desk • ${user?.profile?.firstName ? `Dr. ${user.profile.firstName} ${user.profile.lastName}` : "Faculty Member"}`}
        subtitle="Manage assigned sections, monitor ACID student rosters, and publish academic grades."
      />

      <div className="px-6 space-y-8">
        {/* FACULTY BANNER */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-6 text-white shadow-xl dark:border-blue-950">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
                  Active Faculty Appointment • Department of CSE
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Spring 2026 Academic Instruction Hub</span>
                <Sparkles className="h-4 w-4 text-amber-300" />
              </h3>
              <p className="text-xs text-blue-200/80 max-w-xl">
                Continuous assessment window is open. Enter Class Test (/20), Midterm (/30), and Final (/50) marks directly into the grading matrix.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/faculty/grading">
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs gap-1.5 shadow-lg shadow-emerald-500/20">
                  <Award className="h-3.5 w-3.5" />
                  Enter Grades
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Assigned Sections"
            value={(offerings || []).length || 2}
            description="Active teaching assignments"
            icon={BookOpen}
            iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400"
          />
          <StatCard
            title="Total Enrolled Students"
            value="48"
            description="Across active course sections"
            icon={Users}
            iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
          />
          <StatCard
            title="Grading Matrix Status"
            value="Term Open"
            description="Publish directly to student transcripts"
            icon={Award}
            iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
        </div>

        {/* BENTO ACTION HUB FOR FACULTY */}
        <div>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Faculty Workspaces</span>
              <Badge variant="outline" className="text-[10px] font-mono border-blue-200 text-blue-700 bg-blue-50">
                Action Launchers
              </Badge>
            </h3>
            <p className="text-xs text-slate-500">
              Rapid access to student rosters, continuous grading, and lecture schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BentoActionCard
              title="Student Rosters & Attendance"
              description="Inspect eligible candidates enrolled under ACID concurrency guarantees"
              href="/faculty/sections"
              icon={Users}
              gradientClass="from-blue-500 to-indigo-600 shadow-blue-500/25"
              metrics={[
                { label: "Active", value: "3 Enrolled", color: "blue" },
                { label: "CSV Export", value: "Enabled", color: "emerald" },
              ]}
            />

            <BentoActionCard
              title="100-Point Grading Matrix"
              description="Continuous evaluation: Class Test /20, Midterm /30, and Final /50 with auto UGC GPA"
              href="/faculty/grading"
              icon={Award}
              gradientClass="from-emerald-500 to-teal-600 shadow-emerald-500/25"
              metrics={[
                { label: "Scale", value: "UGC 4.0", color: "emerald" },
                { label: "Sync", value: "Live Transcripts", color: "indigo" },
              ]}
            />
          </div>
        </div>

        {/* Assigned Lecture Schedules */}
        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold">Current Semester Teaching Schedule</CardTitle>
                <CardDescription className="text-xs">
                  Sections, weekly class hours, and designated campus rooms.
                </CardDescription>
              </div>
              <Link href="/faculty/sections">
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  View Rosters
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {(offerings || []).slice(0, 3).map((offering) => (
                  <div
                    key={offering.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 dark:border-slate-800 dark:bg-slate-900/40"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {offering.course?.code || "CSE101"}
                        </Badge>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {offering.course?.title || "Database Systems"}
                        </h4>
                        <Badge variant="outline" className="text-[10px]">
                          Section {offering.sectionNumber || 1}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {offering.scheduleTime || "Sun, Tue 10:00 AM - 11:30 AM"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {offering.roomNumber || "Building 3, Room 402"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href="/faculty/grading">
                        <Button size="sm" variant="outline" className="text-xs gap-1.5">
                          <Award className="h-3.5 w-3.5 text-emerald-600" />
                          Grading
                        </Button>
                      </Link>
                      <Link href="/faculty/sections">
                        <Button size="sm" className="text-xs gap-1.5">
                          Roster
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
