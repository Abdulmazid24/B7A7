"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Award, CreditCard, PlusCircle, FileText, Clock, Sparkles } from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { StatCard } from "@/components/shared/stat-card";
import { BentoActionCard } from "@/components/shared/bento-action-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api-client";
import { Enrollment, AcademicTranscript, TuitionFee } from "@/types";
import { EmptyState } from "@/components/shared/empty-state";

export default function StudentOverviewPage() {
  const { user } = useAuthStore();

  const { data: enrollments = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student", "my-courses"],
    queryFn: async () => (await api.get<Enrollment[]>("/enrollments/my-courses")).data,
  });
  const transcriptQuery = useQuery({
    queryKey: ["student", "transcript"],
    queryFn: async () => (await api.get<AcademicTranscript>("/grades/my-transcript")).data,
  });
  const invoiceQuery = useQuery({
    queryKey: ["student", "invoices"],
    queryFn: async () => (await api.get<{ tuitionFees: TuitionFee[] }>("/payments/my-invoices")).data.tuitionFees,
  });
  const enrolledCredits = enrollments.reduce((sum, enrollment) =>
    sum + (enrollment.section?.offering?.course?.credits ?? enrollment.courseOffering?.course?.credits ?? 0), 0);
  const currentSemester = enrollments[0]?.section?.offering?.semester?.name
    ?? enrollments[0]?.courseOffering?.semester?.name
    ?? "Current semester";
  const outstanding = invoiceQuery.data?.reduce((sum, invoice) => sum + invoice.dueAmount, 0);
  const degreeName = user?.profile?.department?.name || "Academic program";

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title={`Student Academic Portal • ${user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user?.email ?? "Student"}`}
        subtitle={`Student ID: ${user?.studentId || "Not assigned"} • ${degreeName}`}
        action={
          <div className="flex items-center gap-2">
            <Link href="/student/registration">
              <Button size="sm" className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                <PlusCircle className="h-3.5 w-3.5" />
                Enroll Courses
              </Button>
            </Link>
          </div>
        }
      />

      <div className="px-6 space-y-8">
        {/* STUDENT ACADEMIC BANNER */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-6 text-white shadow-xl dark:border-emerald-950">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
                  Academic Standing
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{currentSemester} • {enrolledCredits} Active Credit Hours</span>
                <Sparkles className="h-4 w-4 text-amber-300" />
              </h3>
              <p className="text-xs text-emerald-200/80 max-w-xl">
                {transcriptQuery.data
                  ? `Cumulative CGPA: ${transcriptQuery.data.cgpa.toFixed(2)} / 4.00. Earned ${transcriptQuery.data.totalEarnedCredits} credits.`
                  : "Your academic standing will appear after grades are published."}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/student/transcript">
                <Button size="sm" className="bg-white text-emerald-950 hover:bg-emerald-50 font-semibold text-xs gap-1.5 shadow">
                  <FileText className="h-3.5 w-3.5" />
                  Academic Transcript
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Cumulative CGPA"
            value={transcriptQuery.data ? `${transcriptQuery.data.cgpa.toFixed(2)} / 4.00` : "—"}
            description={transcriptQuery.isLoading ? "Loading academic record" : transcriptQuery.isError ? "Academic record unavailable" : "Published academic record"}
            icon={Award}
            trend={transcriptQuery.data ? `${transcriptQuery.data.totalEarnedCredits} credits earned` : undefined}
            iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
          />
          <StatCard
            title="Current Term Load"
            value={`${enrolledCredits} Credits`}
            description={`${enrollments.length} Courses Registered`}
            icon={BookOpen}
            iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
          />
          <StatCard
            title="Tuition Billing"
            value={invoiceQuery.isLoading ? "Loading" : invoiceQuery.isError || outstanding === undefined ? "Unavailable" : outstanding === 0 ? "No balance" : "Balance due"}
            description={invoiceQuery.isError ? "Invoice summary unavailable" : outstanding === undefined ? "Invoice summary" : `Outstanding: ${outstanding.toFixed(2)}`}
            icon={CreditCard}
            iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400"
          />
        </div>

        {/* BENTO ACTION HUB FOR STUDENT */}
        <div>
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Student Academic Hub</span>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-200 text-emerald-700 bg-emerald-50">
                Action Launchers
              </Badge>
            </h3>
            <p className="text-xs text-slate-500">
              Quick access to course enrollment, certified transcripts, and Stripe tuition payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <BentoActionCard
              title="Course Registration"
              description="ACID seat locking & prerequisite validation"
              href="/student/registration"
              icon={PlusCircle}
              gradientClass="from-indigo-500 to-indigo-600 shadow-indigo-500/25"
              metrics={[
                { label: "Status", value: "Registration", color: "emerald" },
                { label: "Selected", value: `${enrolledCredits} Cr`, color: "indigo" },
              ]}
            />

            <BentoActionCard
              title="Academic Transcript"
              description="Published grades, credits, and cumulative GPA"
              href="/student/transcript"
              icon={Award}
              gradientClass="from-emerald-500 to-teal-600 shadow-emerald-500/25"
              metrics={[
                { label: "CGPA", value: transcriptQuery.data?.cgpa.toFixed(2) ?? "—", color: "emerald" },
                { label: "Credits", value: `${transcriptQuery.data?.totalEarnedCredits ?? 0} Earned`, color: "blue" },
              ]}
            />

            <BentoActionCard
              title="Tuition Statements"
              description="Instant Stripe Checkout Session integration"
              href="/student/invoices"
              icon={CreditCard}
              gradientClass="from-blue-500 to-cyan-600 shadow-blue-500/25"
              metrics={[
                { label: "Gateway", value: "Stripe Test", color: "blue" },
                { label: "Dues", value: outstanding === undefined ? "—" : outstanding.toFixed(2), color: "amber" },
              ]}
            />
          </div>
        </div>

        {/* Current Enrolled Courses */}
        <Card className="border-slate-200/80 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold">Current Semester Enrolled Sections</CardTitle>
                <CardDescription className="text-xs">
                  Courses registered under ACID concurrency guarantees with seat confirmation.
                </CardDescription>
              </div>
              <Link href="/student/transcript">
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Full Transcript
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-3">{[0, 1].map((item) => <Skeleton key={item} className="h-20 w-full rounded-xl" />)}</div>
            ) : isError ? (
              <EmptyState title="Courses could not be loaded" description={error instanceof Error ? error.message : "Try again."} icon={BookOpen} actionLabel="Retry" onAction={() => void refetch()} />
            ) : enrollments.length === 0 ? (
              <EmptyState title="No enrolled courses" description="Your registered course sections will appear here." icon={BookOpen} />
            ) : (
            <div className="space-y-4">
              {enrollments.map((enr) => (
                (() => {
                  const section = enr.section;
                  const offering = enr.courseOffering;
                  const course = section?.offering?.course ?? offering?.course;
                  const sectionNumber = section?.sectionNumber ?? offering?.sectionNumber;
                  return (
                <div
                  key={enr.id}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs text-indigo-700 bg-indigo-50">
                        {course?.code || "Course"}
                      </Badge>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {course?.title || "Course title unavailable"}
                      </h4>
                      <Badge variant="outline" className="text-[10px]">
                        Section {sectionNumber ?? "—"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {section?.schedule || offering?.scheduleTime || "Schedule unavailable"}
                      </span>
                      <span>{section?.room || offering?.roomNumber || "Room not assigned"}</span>
                      {(section?.faculty || offering?.faculty) && <span>Instructor: {(section?.faculty || offering?.faculty)?.profile?.firstName} {(section?.faculty || offering?.faculty)?.profile?.lastName}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="success" className="text-xs">
                      Enrolled
                    </Badge>
                  </div>
                </div>
                  );
                })()
              ))}
            </div>) }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
