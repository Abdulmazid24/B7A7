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
} from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { StatCard } from "@/components/shared/stat-card";
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
        title={`Welcome, ${user?.profile?.firstName ? `Dr. ${user.profile.firstName} ${user.profile.lastName}` : "Faculty Member"}`}
        subtitle="Manage your lecture sections, monitor student enrollments, and publish academic grades."
      />

      <div className="px-6 space-y-8">
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
            title="Grading Status"
            value="Active Term"
            description="Finals deadline: Nov 15"
            icon={Award}
            iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
        </div>

        {/* Assigned Lecture Schedules */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Current Semester Teaching Schedule</CardTitle>
                <CardDescription>
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
          <CardContent>
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
                        <Badge variant="secondary" className="font-mono text-xs font-bold text-blue-700 bg-blue-50">
                          {offering.course?.code || "COURSE"}
                        </Badge>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {offering.course?.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500">
                        {offering.semester?.name} • {offering.course?.credits} Credits
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>Mon / Wed 10:00 AM - 11:30 AM</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>Room: Block B - Lab 402</span>
                      </div>
                      <Link href="/faculty/grading">
                        <Button size="sm" className="text-xs gap-1">
                          Submit Marks
                          <ArrowRight className="h-3 w-3" />
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
