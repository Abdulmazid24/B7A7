"use client";

import React, { useState } from "react";
import { Award, Save, CheckCircle2, Calculator, Info } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGradeBadgeClasses } from "@/lib/utils";
import { calculateGrade } from "@/lib/grading";

interface StudentMarkRow {
  studentId: string;
  name: string;
  enrollmentId: string;
  classTest: number;
  midterm: number;
  final: number;
}

export default function FacultyGradingPage() {
  const [students, setStudents] = useState<StudentMarkRow[]>([
    {
      studentId: "STU-2026-001",
      name: "Tanvir Hossain",
      enrollmentId: "enr-1",
      classTest: 18,
      midterm: 27,
      final: 46,
    },
    {
      studentId: "STU-2026-002",
      name: "Nusrat Jahan",
      enrollmentId: "enr-2",
      classTest: 16,
      midterm: 24,
      final: 38,
    },
    {
      studentId: "STU-2026-003",
      name: "Rafiqul Islam",
      enrollmentId: "enr-3",
      classTest: 14,
      midterm: 21,
      final: 32,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);


  const handleScoreChange = (
    index: number,
    field: "classTest" | "midterm" | "final",
    val: number
  ) => {
    const updated = [...students];
    const maxVal = field === "classTest" ? 20 : field === "midterm" ? 30 : 50;
    const clamped = Math.min(maxVal, Math.max(0, isNaN(val) ? 0 : val));
    updated[index][field] = clamped;
    setStudents(updated);
  };

  const handleSaveGrades = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    toast.success("Academic marks published successfully to Official Student Transcripts!");
  };

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Continuous Assessment & Grading Matrix"
        subtitle="Submit student evaluation marks (Class Test 20, Midterm 30, Final 50) with automated Letter Grade computation."
        action={
          <Button size="sm" onClick={handleSaveGrades} isLoading={isSaving} className="gap-1.5 text-xs">
            <Save className="h-3.5 w-3.5" />
            Publish All Grades
          </Button>
        }
      />

      <div className="px-6 space-y-6">
        {/* Info Banner */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 flex items-center justify-between text-xs text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-300">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>
              Grading Scheme: Class Test (20%) + Midterm Exam (30%) + Final Examination (50%) = 100 Total.
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] bg-white border-indigo-200">
            Active Grading Session
          </Badge>
        </div>

        {/* Grading Matrix Table */}
        <Card className="border-slate-200/80 overflow-hidden shadow-sm">
          <CardHeader className="py-4 px-6 border-b border-slate-100">
            <CardTitle className="text-sm font-bold">
              CSE101: Introduction to Computer Science (Section 01)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider dark:bg-slate-900 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-6">Student ID</th>
                    <th className="py-3 px-6">Student Name</th>
                    <th className="py-3 px-4 text-center">Class Test (20)</th>
                    <th className="py-3 px-4 text-center">Midterm (30)</th>
                    <th className="py-3 px-4 text-center">Final (50)</th>
                    <th className="py-3 px-4 text-center">Total (100)</th>
                    <th className="py-3 px-6 text-center">Letter Grade</th>
                    <th className="py-3 px-6 text-center">Grade Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students.map((st, idx) => {
                    const total = st.classTest + st.midterm + st.final;
                    const { letter, point } = calculateGrade(total);

                    return (
                      <tr key={st.studentId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-6 font-mono font-bold text-indigo-600">
                          {st.studentId}
                        </td>
                        <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                          {st.name}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={st.classTest}
                            onChange={(e) =>
                              handleScoreChange(idx, "classTest", parseInt(e.target.value))
                            }
                            className="w-16 h-8 text-center font-bold text-slate-900 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={st.midterm}
                            onChange={(e) =>
                              handleScoreChange(idx, "midterm", parseInt(e.target.value))
                            }
                            className="w-16 h-8 text-center font-bold text-slate-900 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={st.final}
                            onChange={(e) =>
                              handleScoreChange(idx, "final", parseInt(e.target.value))
                            }
                            className="w-16 h-8 text-center font-bold text-slate-900 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-sm text-slate-900 dark:text-white">
                          {total}
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${getGradeBadgeClasses(
                              letter
                            )}`}
                          >
                            {letter}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                          {point.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
