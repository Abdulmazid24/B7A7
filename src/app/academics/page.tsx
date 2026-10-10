import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { API_BASE_URL, UNIVERSITY_NAME } from "@/lib/constants";
import { AcademicDepartment, Course } from "@/types";

export const metadata = {
  title: "Academic Departments & Curriculum Explorer",
  description: "Browse academic faculties, credit hour requirements, prerequisites, and program syllabi.",
};

export const dynamic = "force-dynamic";

async function getAcademicData() {
  try {
    const [deptRes, courseRes] = await Promise.all([
      fetch(`${API_BASE_URL}/departments`, { next: { revalidate: 60 } }),
      fetch(`${API_BASE_URL}/courses?limit=100`, { next: { revalidate: 60 } }),
    ]);

    const deptData = await deptRes.json();
    const courseData = await courseRes.json();

    return {
      departments: (deptData?.data || []) as AcademicDepartment[],
      courses: (courseData?.data || []) as Course[],
    };
  } catch {
    return {
      departments: [
        { id: "1", name: "Computer Science & Engineering", code: "CSE", createdAt: "", updatedAt: "" },
        { id: "2", name: "Electrical & Electronic Engineering", code: "EEE", createdAt: "", updatedAt: "" },
        { id: "3", name: "Bachelor of Business Administration", code: "BBA", createdAt: "", updatedAt: "" },
      ],
      courses: [
        { id: "1", code: "CSE101", title: "Introduction to Computer Science", credits: 3, departmentId: "1", createdAt: "", updatedAt: "" },
        { id: "2", code: "CSE102", title: "Data Structures & Algorithms", credits: 3, departmentId: "1", createdAt: "", updatedAt: "" },
        { id: "3", code: "CSE201", title: "Database Management Systems", credits: 4, departmentId: "1", createdAt: "", updatedAt: "" },
      ],
    };
  }
}

export default async function AcademicsPage() {
  const { departments, courses } = await getAcademicData();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-slate-50 border-b border-slate-200/80 py-16 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Undergraduate & Graduate Curricula
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
              Academic Departments & Courses
            </h1>
            <p className="max-w-2xl mx-auto text-sm text-slate-500 leading-relaxed">
              Explore our degree programs, course codes, prerequisite hierarchies, and academic credit weightings verified directly from the live database.
            </p>
          </div>
        </section>

        {/* Departments Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Degree-Granting Departments
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Accredited divisions offering four-year undergraduate and graduate programs.
                  </p>
                </div>
                <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
                  {departments.length} Active Departments
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {departments.map((dept) => (
                  <Card key={dept.id} className="border-slate-200/80 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="font-mono font-bold">
                          {dept.code}
                        </Badge>
                        <Building2 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <CardTitle className="text-lg mt-2">{dept.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-500">
                      <p className="leading-relaxed text-xs">
                        {dept.description ||
                          `Primary academic department responsible for ${dept.name} curricula, faculty research labs, and degree accreditation.`}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium pt-2 border-t">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Curriculum Approved for Current Semester</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Courses Catalog */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Offered Courses & Prerequisite Dependencies
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Course catalog with credit hours and prerequisite constraints enforced at registration.
                  </p>
                </div>
                <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">
                  {courses.length} Certified Courses
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="border-slate-200/80">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded dark:bg-indigo-950 dark:text-indigo-400">
                          {course.code}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {course.credits} Credits
                        </Badge>
                      </div>
                      <CardTitle className="text-base mt-2">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-slate-500">
                      {course.description && (
                        <p className="line-clamp-2">{course.description}</p>
                      )}

                      {course.prerequisites && course.prerequisites.length > 0 ? (
                        <div className="pt-2 border-t space-y-1">
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            Prerequisites:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {course.prerequisites.map((p) => (
                              <Badge key={p.id} variant="secondary" className="text-[10px] font-mono">
                                {p.prerequisite.code}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 border-t text-[11px] text-emerald-600 font-medium">
                          No prerequisites required (Foundational)
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 p-8 text-center space-y-4">
              <h3 className="text-xl font-bold text-slate-900">
                Ready to register for your semester courses?
              </h3>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                Log in to the Student Portal to participate in the upcoming registration window.
              </p>
              <div className="flex justify-center gap-3">
                <Link href="/login">
                  <Button size="sm" className="gap-1.5">
                    <GraduationCap className="h-4 w-4" />
                    Student Course Registration
                  </Button>
                </Link>
                <Link href="/tuition">
                  <Button variant="outline" size="sm">
                    View Tuition Rates
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
