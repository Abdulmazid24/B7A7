"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Printer, FileCheck } from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { getGradeBadgeClasses } from "@/lib/utils";
import { AcademicTranscript } from "@/types";
import { EmptyState } from "@/components/shared/empty-state";

export default function StudentTranscriptPage() {
  const { data: transcript, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student", "transcript"],
    queryFn: async () => {
      const res = await api.get<AcademicTranscript>("/grades/my-transcript");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="flex-1 space-y-4 p-6" aria-label="Loading transcript">
      {[0, 1, 2].map((item) => <Skeleton key={item} className="h-40 w-full rounded-xl" />)}
    </div>;
  }

  if (isError || !transcript) {
    return <div className="px-6 py-8">
      <EmptyState
        title={isError ? "Transcript could not be loaded" : "No transcript available"}
        description={isError && error instanceof Error ? error.message : "Published grades will appear here when they are available."}
        icon={FileCheck}
        actionLabel={isError ? "Retry" : undefined}
        onAction={isError ? () => void refetch() : undefined}
      />
    </div>;
  }

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Academic Transcript"
        subtitle="Published semester grades, letter grades, and cumulative GPA from your academic record."
        action={
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="gap-1.5 text-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Transcript
          </Button>
        }
      />

      <div className="px-6 space-y-6 max-w-5xl">
        {/* Student Details Certificate Card */}
        <Card className="border-slate-200/80 shadow-sm overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-600 text-white text-xs">Published Academic Record</Badge>
                </div>
                <h2 className="text-2xl font-bold">{transcript.student.name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-200">
                  <span className="font-mono">ID: {transcript.student.studentId}</span>
                  <span>•</span>
                  <span>Program: {transcript.student.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shrink-0">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-200 block">
                    Cumulative CGPA
                  </span>
                  <span className="text-3xl font-extrabold text-emerald-400">
                    {transcript.cgpa.toFixed(2)}
                  </span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-200 block">
                    Earned Credits
                  </span>
                  <span className="text-3xl font-extrabold text-white">
                    {transcript.totalEarnedCredits}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Semester-wise breakdown */}
        <div className="space-y-6">
          {transcript.semesters.length === 0 ? (
            <EmptyState title="No published grades yet" description="Your transcript will be available after faculty publish semester grades." icon={FileCheck} />
          ) : transcript.semesters.map((sem) => (
            <Card key={sem.semesterId} className="border-slate-200/80 overflow-hidden shadow-sm">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-6 dark:bg-slate-900/60 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                    {sem.semesterName}
                  </CardTitle>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-slate-500">{sem.semesterCredits} Credits</span>
                    <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
                      Term GPA: {sem.semesterGpa.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/40 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider dark:bg-slate-900 dark:border-slate-800">
                      <tr>
                        <th scope="col" className="py-2.5 px-6">Course Code</th>
                        <th scope="col" className="py-2.5 px-6">Course Title</th>
                        <th scope="col" className="py-2.5 px-6 text-center">Credits</th>
                        <th scope="col" className="py-2.5 px-6 text-center">Letter Grade</th>
                        <th scope="col" className="py-2.5 px-6 text-right">Grade Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {sem.courses.map((c) => (
                        <tr key={c.courseCode} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-6 font-mono font-bold text-indigo-600">
                            {c.courseCode}
                          </td>
                          <td className="py-3 px-6 font-bold text-slate-900 dark:text-white">
                            {c.courseTitle}
                          </td>
                          <td className="py-3 px-6 text-center">{c.credits}</td>
                          <td className="py-3 px-6 text-center">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${getGradeBadgeClasses(
                                c.letterGrade
                              )}`}
                            >
                              {c.letterGrade}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                            {c.gradePoint.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="hidden print:block border-t pt-4 text-center text-xs text-slate-500">
          Generated from published University Management System records. Request a registrar-issued copy for official certification.
        </p>
      </div>
    </div>
  );
}
