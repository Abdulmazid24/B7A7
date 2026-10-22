"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, MapPin, Clock } from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryErrorState } from "@/components/shared/query-error-state";
import { api } from "@/lib/api-client";
import { CourseOffering } from "@/types";

export default function AdminOfferingsPage() {
  const { data: offerings, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "course-offerings"],
    queryFn: async () => {
      const res = await api.get<CourseOffering[]>("/course-offerings");
      return res.data;
    },
  });

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Course Offerings & Section Scheduling"
        subtitle="Manage semester section capacities, classroom assignments, and faculty instructor rosters."
      />

      <div className="px-6 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <QueryErrorState title="Course offerings could not be loaded" onRetry={() => void refetch()} />
        ) : (offerings || []).length === 0 ? (
          <EmptyState
            title="No Course Offerings Scheduled"
            description="No courses are currently offered for the active semester."
          />
        ) : (
          <div className="space-y-6">
            {(offerings || []).map((offering) => (
              <Card key={offering.id} className="border-slate-200/80 overflow-hidden">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-6 dark:bg-slate-900/60 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Badge variant="secondary" className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50">
                        {offering.course?.code || "COURSE"}
                      </Badge>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {offering.course?.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>Term: {offering.semester?.name || "Current Term"}</span>
                      <span>•</span>
                      <span>{offering.course?.credits} Credits</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Scheduled Sections ({offering.sections?.length || 0})
                    </h4>
                    {(offering.sections || []).length === 0 ? (
                      <EmptyState title="No sections configured" description="Add a section to this course offering to assign a room, schedule, capacity, and faculty member." />
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(offering.sections || []).map((sec) => (
                        <div
                          key={sec.id}
                          className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-2 dark:border-slate-800 dark:bg-slate-950"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-indigo-600">
                              Section {sec.sectionNumber}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {sec.enrolledCount} / {sec.capacity} Enrolled
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              <span>{sec.schedule}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              <span>Room: {sec.room || "Room TBA"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1 text-slate-700 font-medium dark:text-slate-300">
                              <Users className="h-3.5 w-3.5 text-slate-400" />
                              <span>
                                Faculty:{" "}
                                {sec.faculty?.profile?.firstName
                                  ? `${sec.faculty.profile.firstName} ${sec.faculty.profile.lastName}`
                                  : sec.faculty?.email || "Unassigned"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
