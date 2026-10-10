"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, Clock, MapPin, Search, GraduationCap } from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { CourseOffering } from "@/types";

export default function FacultySectionsPage() {
  const [selectedSectionId, setSelectedSectionId] = useState<string>("sec-1");

  const { data: offerings, isLoading } = useQuery({
    queryKey: ["faculty", "sections"],
    queryFn: async () => {
      const res = await api.get<CourseOffering[]>("/course-offerings");
      return res.data;
    },
  });

  // Demo student roster for active section
  const studentRoster = [
    {
      id: "1",
      studentId: "STU-2026-001",
      name: "Tanvir Hossain",
      email: "student@university.edu",
      enrolledAt: "2026-10-08T16:59:29.737Z",
      status: "ENROLLED",
    },
    {
      id: "2",
      studentId: "STU-2026-002",
      name: "Nusrat Jahan",
      email: "nusrat.jahan@student.university.edu",
      enrolledAt: "2026-10-09T10:15:20.000Z",
      status: "ENROLLED",
    },
    {
      id: "3",
      studentId: "STU-2026-003",
      name: "Rafiqul Islam",
      email: "rafiqul.islam@student.university.edu",
      enrolledAt: "2026-10-09T14:40:11.000Z",
      status: "ENROLLED",
    },
  ];

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Assigned Sections & Student Rosters"
        subtitle="Inspect enrolled students, verify attendance eligibility, and check section capacities."
      />

      <div className="px-6 space-y-6">
        {/* Section Picker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className={`border-2 cursor-pointer transition-all ${
              selectedSectionId === "sec-1"
                ? "border-indigo-600 bg-indigo-50/20 shadow-sm dark:bg-indigo-950/20"
                : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setSelectedSectionId("sec-1")}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-mono text-xs font-bold text-indigo-700">
                  CSE101 - Sec 01
                </Badge>
                <span className="text-xs font-bold text-slate-700">35 / 40 Enrolled</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">Intro to Computer Science</h4>
              <p className="text-xs text-slate-500">Mon/Wed 10:00 AM • Room 301</p>
            </CardContent>
          </Card>

          <Card
            className={`border-2 cursor-pointer transition-all ${
              selectedSectionId === "sec-2"
                ? "border-indigo-600 bg-indigo-50/20 shadow-sm dark:bg-indigo-950/20"
                : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setSelectedSectionId("sec-2")}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-mono text-xs font-bold text-indigo-700">
                  CSE201 - Sec 01
                </Badge>
                <span className="text-xs font-bold text-slate-700">28 / 30 Enrolled</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">Database Management Systems</h4>
              <p className="text-xs text-slate-500">Tue/Thu 02:00 PM • Lab 402</p>
            </CardContent>
          </Card>
        </div>

        {/* Student Roster Table */}
        <Card className="border-slate-200/80 overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Enrolled Student Roster</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Eligible students registered under ACID concurrency guarantees.
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {studentRoster.length} Students Active
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider dark:bg-slate-900 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-6">Student ID</th>
                    <th className="py-3 px-6">Candidate Name</th>
                    <th className="py-3 px-6">Academic Email</th>
                    <th className="py-3 px-6">Enrolled Date</th>
                    <th className="py-3 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {studentRoster.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-bold text-indigo-600">
                        {s.studentId}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 font-mono text-[11px]">
                        {s.email}
                      </td>
                      <td className="py-3.5 px-6 text-slate-500">
                        {formatDate(s.enrolledAt)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Badge variant="success" className="text-[10px]">
                          {s.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
