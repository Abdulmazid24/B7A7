"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Info, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { api } from "@/lib/api-client";
import { calculateGrade } from "@/lib/grading";
import { getGradeBadgeClasses } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { CourseOffering, StudentGrade } from "@/types";

interface GradingRoster {
  id: string;
  sectionNumber: string | number;
  offering: { course: { code: string; title: string }; semester: { name: string } };
  enrollments: Array<{
    id: string;
    student: { id: string; email: string; profile?: { firstName: string; lastName: string; studentId?: string | null } | null };
    grade?: StudentGrade | null;
  }>;
}

type MarkValues = { assessmentMarks: number; midtermMarks: number; finalMarks: number };

export default function FacultyGradingPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [marks, setMarks] = useState<Record<string, MarkValues>>({});
  const [isSaving, setIsSaving] = useState(false);

  const offeringsQuery = useQuery({
    queryKey: ["faculty", "grading-offerings", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => (await api.get<CourseOffering[]>("/course-offerings", { facultyId: user!.id, limit: 100 })).data,
  });
  const assignedSections = useMemo(() => (offeringsQuery.data ?? []).flatMap((offering) =>
    (offering.sections ?? []).filter((section) => section.facultyId === user?.id).map((section) => ({ offering, section }))
  ), [offeringsQuery.data, user?.id]);

  const activeSectionId = assignedSections.some(({ section }) => section.id === selectedSectionId)
    ? selectedSectionId
    : assignedSections[0]?.section.id ?? "";
  const selected = assignedSections.find(({ section }) => section.id === activeSectionId);
  const rosterQuery = useQuery({
    queryKey: ["faculty", "grading-roster", activeSectionId],
    enabled: Boolean(activeSectionId),
    queryFn: async () => (await api.get<GradingRoster>(`/enrollments/section/${activeSectionId}`)).data,
  });
  const enrollments = rosterQuery.data?.enrollments ?? [];

  const getMarks = (enrollmentId: string, grade?: StudentGrade | null): MarkValues => marks[enrollmentId] ?? {
    assessmentMarks: grade?.assessmentMarks ?? 0,
    midtermMarks: grade?.midtermMarks ?? 0,
    finalMarks: grade?.finalMarks ?? 0,
  };

  const updateMark = (enrollmentId: string, field: keyof MarkValues, value: number, max: number, grade?: StudentGrade | null) => {
    const current = getMarks(enrollmentId, grade);
    setMarks((previous) => ({
      ...previous,
      [enrollmentId]: { ...current, [field]: Math.min(max, Math.max(0, Number.isFinite(value) ? value : 0)) },
    }));
  };

  const handleSaveGrades = async () => {
    if (!enrollments.length) return;
    setIsSaving(true);
    try {
      await Promise.all(enrollments.map((enrollment) => api.post("/grades/submit", {
        enrollmentId: enrollment.id,
        ...getMarks(enrollment.id, enrollment.grade),
        isPublished: true,
      })));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["faculty", "grading-roster", activeSectionId] }),
        queryClient.invalidateQueries({ queryKey: ["student", "transcript"] }),
      ]);
      setMarks({});
      toast.success("Grades published for this section.");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Some grades could not be published. Review the roster and retry.");
      void rosterQuery.refetch();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Continuous Assessment & Grading Matrix"
        subtitle="Enter assessment marks (20), midterm marks (30), and final marks (50). Published grades update student transcripts."
        action={<Button size="sm" onClick={handleSaveGrades} isLoading={isSaving} disabled={!enrollments.length || rosterQuery.isLoading || rosterQuery.isError} className="gap-1.5 text-xs"><Save className="h-3.5 w-3.5" />Publish Section Grades</Button>}
      />

      <div className="px-6 space-y-6">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 flex items-center gap-3 text-xs text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-300">
          <Info className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>Assessment (20) + Midterm (30) + Final (50) = 100 points. Values are validated by the backend before saving.</span>
        </div>

        {offeringsQuery.isLoading ? (
          <Skeleton className="h-24 w-full rounded-xl" />
        ) : offeringsQuery.isError ? (
          <EmptyState title="Teaching sections could not be loaded" description={offeringsQuery.error instanceof Error ? offeringsQuery.error.message : "Please retry."} icon={BookOpen} actionLabel="Retry" onAction={() => void offeringsQuery.refetch()} />
        ) : assignedSections.length === 0 ? (
          <EmptyState title="No sections assigned" description="Grading becomes available after a course section is assigned to your faculty account." icon={BookOpen} />
        ) : (
          <div className="flex flex-wrap gap-2">
            {assignedSections.map(({ offering, section }) => (
              <Button key={section.id} type="button" variant={activeSectionId === section.id ? "default" : "outline"} onClick={() => { setSelectedSectionId(section.id); setMarks({}); }}>
                {offering.course?.code ?? "Course"} · Section {section.sectionNumber}
              </Button>
            ))}
          </div>
        )}

        {selected && (
          <Card className="border-slate-200/80 overflow-hidden shadow-sm">
            <CardHeader className="py-4 px-6 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold">{selected.offering.course?.code}: {selected.offering.course?.title} · Section {selected.section.sectionNumber} · {selected.offering.semester?.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {rosterQuery.isLoading ? (
                <div className="p-6 space-y-3">{[0, 1, 2].map((item) => <Skeleton key={item} className="h-12 w-full" />)}</div>
              ) : rosterQuery.isError ? (
                <EmptyState title="Section roster could not be loaded" description={rosterQuery.error instanceof Error ? rosterQuery.error.message : "Please retry."} icon={BookOpen} actionLabel="Retry" onAction={() => void rosterQuery.refetch()} />
              ) : enrollments.length === 0 ? (
                <EmptyState title="No enrolled students" description="Students appear here after registering for this section." icon={BookOpen} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider dark:bg-slate-900 dark:border-slate-800">
                      <tr><th scope="col" className="py-3 px-6">Student</th><th scope="col" className="py-3 px-3 text-center">Assessment /20</th><th scope="col" className="py-3 px-3 text-center">Midterm /30</th><th scope="col" className="py-3 px-3 text-center">Final /50</th><th scope="col" className="py-3 px-3 text-center">Total /100</th><th scope="col" className="py-3 px-4 text-center">Grade</th><th scope="col" className="py-3 px-4 text-center">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {enrollments.map((enrollment) => {
                        const values = getMarks(enrollment.id, enrollment.grade);
                        const { letter, point } = calculateGrade(values.assessmentMarks + values.midtermMarks + values.finalMarks);
                        const studentName = enrollment.student.profile ? `${enrollment.student.profile.firstName} ${enrollment.student.profile.lastName}` : enrollment.student.email;
                        return <tr key={enrollment.id}>
                          <td className="py-3.5 px-6"><span className="block font-semibold text-slate-900 dark:text-white">{studentName}</span><span className="text-[10px] font-mono text-slate-500">{enrollment.student.profile?.studentId ?? enrollment.student.email}</span></td>
                          {([ ["assessmentMarks", 20], ["midtermMarks", 30], ["finalMarks", 50] ] as const).map(([field, max]) => <td key={field} className="py-3.5 px-3 text-center"><input type="number" min="0" max={max} step="0.5" aria-label={`${studentName} ${field}`} value={values[field]} onChange={(event) => updateMark(enrollment.id, field, Number(event.target.value), max, enrollment.grade)} className="w-20 h-9 text-center font-semibold rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950" /></td>)}
                          <td className="py-3.5 px-3 text-center font-bold">{values.assessmentMarks + values.midtermMarks + values.finalMarks}</td>
                          <td className="py-3.5 px-4 text-center"><Badge variant="outline" className={getGradeBadgeClasses(letter)}>{letter} · {point.toFixed(2)}</Badge></td>
                          <td className="py-3.5 px-4 text-center text-slate-500">{enrollment.grade?.isPublished ? "Published" : "Draft"}</td>
                        </tr>;
                      })}
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
