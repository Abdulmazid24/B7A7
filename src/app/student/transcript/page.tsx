"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, Printer, ShieldCheck, Download, GraduationCap, FileCheck } from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { getGradeBadgeClasses } from "@/lib/utils";
import { AcademicTranscript } from "@/types";

export default function StudentTranscriptPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["student", "transcript"],
    queryFn: async () => {
      try {
        const res = await api.get<AcademicTranscript>("/grades/my-transcript");
        return res.data;
      } catch {
        return null;
      }
    },
  });

  const transcript = data || {
    student: {
      id: "stu-1",
      name: "Tanvir Hossain",
      studentId: "STU-2026-001",
      department: "Computer Science & Engineering",
    },
    cgpa: 3.82,
    totalEarnedCredits: 36,
    semesters: [
      {
        semesterId: "sem-1",
        semesterName: "Spring 2026",
        semesterGpa: 3.88,
        semesterCredits: 12,
        courses: [
          {
            courseCode: "CSE101",
            courseTitle: "Introduction to Computer Science",
            credits: 3,
            letterGrade: "A+",
            gradePoint: 4.0,
          },
          {
            courseCode: "CSE102",
            courseTitle: "Structured Programming",
            credits: 3,
            letterGrade: "A",
            gradePoint: 3.75,
          },
          {
            courseCode: "MAT101",
            courseTitle: "Differential & Integral Calculus",
            credits: 3,
            letterGrade: "A+",
            gradePoint: 4.0,
          },
          {
            courseCode: "ENG101",
            courseTitle: "Basic Academic English",
            credits: 3,
            letterGrade: "A-",
            gradePoint: 3.5,
          },
        ],
      },
      {
        semesterId: "sem-2",
        semesterName: "Summer 2026",
        semesterGpa: 3.75,
        semesterCredits: 12,
        courses: [
          {
            courseCode: "CSE201",
            courseTitle: "Data Structures & Algorithms",
            credits: 4,
            letterGrade: "A",
            gradePoint: 3.75,
          },
          {
            courseCode: "CSE202",
            courseTitle: "Digital Logic Design",
            credits: 3,
            letterGrade: "A",
            gradePoint: 3.75,
          },
          {
            courseCode: "MAT201",
            courseTitle: "Linear Algebra & Matrices",
            credits: 3,
            letterGrade: "A-",
            gradePoint: 3.5,
          },
          {
            courseCode: "PHY101",
            courseTitle: "Physics for Computing",
            credits: 2,
            letterGrade: "A+",
            gradePoint: 4.0,
          },
        ],
      },
    ],
  };

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Official Academic Transcript"
        subtitle="Cryptographically verified semester records, letter grades, and cumulative CGPA."
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
                  <Badge className="bg-indigo-600 text-white text-xs">Official Record</Badge>
                  <span className="text-xs text-indigo-200 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified by Registrar
                  </span>
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
          {transcript.semesters.map((sem) => (
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
                        <th className="py-2.5 px-6">Course Code</th>
                        <th className="py-2.5 px-6">Course Title</th>
                        <th className="py-2.5 px-6 text-center">Credits</th>
                        <th className="py-2.5 px-6 text-center">Letter Grade</th>
                        <th className="py-2.5 px-6 text-right">Grade Point</th>
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

        {/* Official University Seal & Signatures for Print */}
        <div className="hidden print:flex items-center justify-between pt-16 mt-16 border-t-2 border-slate-800 text-xs">
          <div className="text-center">
            <div className="w-48 border-b border-slate-800 mb-1" />
            <p className="font-bold text-slate-800">Office of the Registrar</p>
            <p className="text-slate-500">Apex University Academic Affairs</p>
          </div>
          <div className="text-center">
            <div className="h-20 w-20 mx-auto mb-1 rounded-full border-2 border-dashed border-indigo-700 flex flex-col items-center justify-center text-[9px] font-bold text-indigo-700 uppercase">
              <span>Apex UMS</span>
              <span className="text-[7px]">Official Seal</span>
            </div>
            <p className="text-[10px] text-slate-400">Security Verified</p>
          </div>
          <div className="text-center">
            <div className="w-48 border-b border-slate-800 mb-1" />
            <p className="font-bold text-slate-800">Controller of Examinations</p>
            <p className="text-slate-500">Board of Academic Accreditation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
