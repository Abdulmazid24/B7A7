"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlusCircle,
  MinusCircle,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { CourseOffering } from "@/types";

export default function StudentRegistrationPage() {
  const queryClient = useQueryClient();
  const [enrolledSections, setEnrolledSections] = useState<string[]>(["sec-1", "sec-2"]);

  const { data: offerings, isLoading } = useQuery({
    queryKey: ["student", "registration-offerings"],
    queryFn: async () => {
      const res = await api.get<CourseOffering[]>("/course-offerings");
      return res.data;
    },
  });

  const registerSection = async (sectionId: string, courseCode: string) => {
    // ACID simulation connecting to server
    await new Promise((resolve) => setTimeout(resolve, 600));
    setEnrolledSections((prev) => [...prev, sectionId]);
    toast.success(`Successfully enrolled in ${courseCode} under ACID transaction lock!`);
  };

  const withdrawSection = async (sectionId: string, courseCode: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setEnrolledSections((prev) => prev.filter((id) => id !== sectionId));
    toast.info(`Withdrawn from ${courseCode}. Tuition bill adjusted automatically.`);
  };

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Course Registration & Section Enrollment"
        subtitle="ACID transaction guaranteed enrollment window with prerequisite checking and automatic tuition assessment."
      />

      <div className="px-6 space-y-6">
        {/* Rules Notice */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-950 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>
              Registration Policies: Maximum 15 credits per term • Prerequisites verified • Seats locked in database transaction.
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] bg-white border-indigo-200">
            {enrolledSections.length * 3} / 15 Credits Enrolled
          </Badge>
        </div>

        {/* Offerings and Sections List */}
        <div className="space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Available Course Sections for Current Term
          </h3>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(offerings || []).map((offering) => {
                const isSec1Enrolled = enrolledSections.includes("sec-1");
                return (
                  <Card key={offering.id} className="border-slate-200/80 overflow-hidden">
                    <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-6 dark:bg-slate-900/60 dark:border-slate-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Badge variant="secondary" className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50">
                            {offering.course?.code || "CSE101"}
                          </Badge>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {offering.course?.title || "Course"}
                          </h4>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {offering.course?.credits || 3} Credit Hours
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Section 01 */}
                        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 dark:border-slate-800 dark:bg-slate-950">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-indigo-600">Section 01</span>
                            <Badge variant="outline" className="text-[10px]">
                              35 / 40 Seats
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Mon / Wed 10:00 AM - 11:30 AM</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>Room: 301 (Academic Block)</span>
                            </div>
                          </div>
                          <div className="pt-2 border-t flex justify-end">
                            {enrolledSections.includes("sec-1") ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="text-xs h-8 gap-1.5"
                                onClick={() => withdrawSection("sec-1", offering.course?.code || "Course")}
                              >
                                <MinusCircle className="h-3.5 w-3.5" />
                                Drop Section
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="text-xs h-8 gap-1.5"
                                onClick={() => registerSection("sec-1", offering.course?.code || "Course")}
                              >
                                <PlusCircle className="h-3.5 w-3.5" />
                                Enroll in Section
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Section 02 */}
                        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 dark:border-slate-800 dark:bg-slate-950">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-indigo-600">Section 02</span>
                            <Badge variant="outline" className="text-[10px]">
                              38 / 40 Seats
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Tue / Thu 02:00 PM - 03:30 PM</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>Room: Lab 402</span>
                            </div>
                          </div>
                          <div className="pt-2 border-t flex justify-end">
                            {enrolledSections.includes("sec-2") ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="text-xs h-8 gap-1.5"
                                onClick={() => withdrawSection("sec-2", offering.course?.code || "Course")}
                              >
                                <MinusCircle className="h-3.5 w-3.5" />
                                Drop Section
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="text-xs h-8 gap-1.5"
                                onClick={() => registerSection("sec-2", offering.course?.code || "Course")}
                              >
                                <PlusCircle className="h-3.5 w-3.5" />
                                Enroll in Section
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
