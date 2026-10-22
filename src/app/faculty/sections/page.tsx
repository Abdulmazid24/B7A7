"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Users, BookOpen } from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import { useAuthStore } from "@/store/auth-store";
import { CourseOffering } from "@/types";

interface RosterStudent {
  id: string;
  email: string;
  profile?: { studentId?: string | null; firstName: string; lastName: string } | null;
}

interface SectionRoster {
  enrollments: Array<{
    id: string;
    status: string;
    enrolledAt: string;
    student: RosterStudent;
  }>;
}

export default function FacultySectionsPage() {
  const { user } = useAuthStore();
  const [selectedSectionId, setSelectedSectionId] = useState("");

  const { data: offerings = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["faculty", "sections", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => (await api.get<CourseOffering[]>("/course-offerings", { facultyId: user!.id, limit: 100 })).data,
  });

  const assignedSections = useMemo(
    () => offerings.flatMap((offering) =>
      (offering.sections ?? [])
        .filter((section) => section.facultyId === user?.id)
        .map((section) => ({ section, offering }))
    ),
    [offerings, user?.id]
  );

  const activeSectionId = assignedSections.some(({ section }) => section.id === selectedSectionId)
    ? selectedSectionId
    : assignedSections[0]?.section.id ?? "";
  const selected = assignedSections.find(({ section }) => section.id === activeSectionId);
  const rosterQuery = useQuery({
    queryKey: ["faculty", "roster", activeSectionId],
    enabled: Boolean(activeSectionId),
    queryFn: async () => (await api.get<SectionRoster>(`/enrollments/section/${activeSectionId}`)).data,
  });
  const roster = rosterQuery.data?.enrollments ?? [];

  const handleExportRoster = () => {
    const rows = roster.map(({ student, enrolledAt, status }) => ({
      StudentID: student.profile?.studentId ?? "",
      Name: `${student.profile?.firstName ?? ""} ${student.profile?.lastName ?? ""}`.trim(),
      Email: student.email,
      EnrolledAt: new Date(enrolledAt).toLocaleDateString(),
      Status: status,
    }));
    exportToCSV(`Section_${activeSectionId}_Student_Roster`, rows);
  };

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Assigned Sections & Student Rosters"
        subtitle="View your assigned course sections and enrolled students."
      />

      <div className="px-6 space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[0, 1, 2].map((item) => <Skeleton key={item} className="h-28 rounded-xl" />)}</div>
        ) : isError ? (
          <EmptyState title="Sections could not be loaded" description={error instanceof Error ? error.message : "Please retry."} icon={BookOpen} actionLabel="Retry" onAction={() => void refetch()} />
        ) : assignedSections.length === 0 ? (
          <EmptyState title="No sections assigned" description="Sections assigned to your faculty account will appear here." icon={BookOpen} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assignedSections.map(({ section, offering }) => (
              <button
                type="button"
                key={section.id}
                onClick={() => setSelectedSectionId(section.id)}
                aria-pressed={activeSectionId === section.id}
                className={`rounded-xl border-2 p-4 text-left transition-colors ${activeSectionId === section.id ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20" : "border-slate-200 hover:border-slate-300 dark:border-slate-800"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">{offering.course?.code ?? "Course"} · Sec {section.sectionNumber}</Badge>
                  <span className="text-xs font-semibold text-slate-600">{section.enrolledCount ?? 0} / {section.capacity} enrolled</span>
                </div>
                <h3 className="mt-3 font-bold text-sm text-slate-900 dark:text-white">{offering.course?.title ?? "Course title unavailable"}</h3>
                <p className="mt-1 text-xs text-slate-500">{section.schedule || "Schedule not set"} · {section.room || "Room not set"}</p>
                <p className="mt-1 text-xs text-slate-500">{offering.semester?.name ?? "Semester unavailable"}</p>
              </button>
            ))}
          </div>
        )}

        {selected && (
          <Card className="border-slate-200/80 overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between dark:border-slate-800">
              <div>
                <CardTitle className="text-sm font-bold">{selected.offering.course?.code} · Section {selected.section.sectionNumber} roster</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Currently enrolled students for {selected.offering.semester?.name ?? "this semester"}.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleExportRoster} disabled={roster.length === 0 || rosterQuery.isLoading} className="gap-1.5 text-xs">
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </Button>
                <Badge variant="outline" className="text-xs"><Users className="mr-1 h-3 w-3" />{roster.length} Students</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {rosterQuery.isLoading ? (
                <div className="p-6 space-y-3">{[0, 1, 2].map((item) => <Skeleton key={item} className="h-10 w-full" />)}</div>
              ) : rosterQuery.isError ? (
                <EmptyState title="Roster could not be loaded" description={rosterQuery.error instanceof Error ? rosterQuery.error.message : "Please retry."} icon={Users} actionLabel="Retry" onAction={() => void rosterQuery.refetch()} />
              ) : roster.length === 0 ? (
                <EmptyState title="No students enrolled" description="Students appear here after they register for this section." icon={Users} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider dark:bg-slate-900 dark:border-slate-800">
                      <tr><th scope="col" className="py-3 px-6">Student ID</th><th scope="col" className="py-3 px-6">Name</th><th scope="col" className="py-3 px-6">Email</th><th scope="col" className="py-3 px-6">Enrolled</th><th scope="col" className="py-3 px-6 text-right">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {roster.map(({ id, student, enrolledAt, status }) => (
                        <tr key={id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-6 font-mono font-bold text-indigo-600">{student.profile?.studentId || "—"}</td>
                          <td className="py-3.5 px-6 font-semibold text-slate-900 dark:text-white">{student.profile ? `${student.profile.firstName} ${student.profile.lastName}` : "Name unavailable"}</td>
                          <td className="py-3.5 px-6 text-slate-500">{student.email}</td>
                          <td className="py-3.5 px-6 text-slate-500">{formatDate(enrolledAt)}</td>
                          <td className="py-3.5 px-6 text-right"><Badge variant="success" className="text-[10px]">{status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
