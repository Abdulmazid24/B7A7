"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, MinusCircle, Clock, MapPin, CheckCircle2, BookOpen, ShieldCheck, ArrowRight, ArrowLeft, Sparkles, CreditCard, Printer } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { soundManager } from "@/lib/audio";
import { api } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import { CourseOffering } from "@/types";
import { Enrollment, TuitionFee } from "@/types";
import { EmptyState } from "@/components/shared/empty-state";

export default function StudentRegistrationPage() {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { data: offerings = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student", "registration-offerings"],
    queryFn: async () => {
      const res = await api.get<CourseOffering[]>("/course-offerings");
      return res.data;
    },
  });

  const enrollmentsQuery = useQuery({
    queryKey: ["student", "my-courses"],
    queryFn: async () => (await api.get<Enrollment[]>("/enrollments/my-courses")).data,
  });
  const invoicesQuery = useQuery({
    queryKey: ["student", "invoices"],
    queryFn: async () => (await api.get<{ tuitionFees: TuitionFee[] }>("/payments/my-invoices")).data.tuitionFees,
  });

  const currentSemester = offerings.find((offering) => offering.semester?.isCurrent)?.semester;
  const currentOfferings = offerings.filter((offering) => offering.semesterId === currentSemester?.id);
  const availableSections = currentOfferings.flatMap((offering) =>
    (offering.sections ?? []).map((section) => ({ offering, section }))
  );
  const activeEnrollments = (enrollmentsQuery.data ?? []).filter((enrollment) =>
    enrollment.status === "ENROLLED" && enrollment.section?.offering?.semester?.id === currentSemester?.id
  );
  const enrolledSections = new Set(activeEnrollments.map((enrollment) => enrollment.sectionId ?? enrollment.section?.id).filter((id): id is string => Boolean(id)));
  const enrolledCredits = activeEnrollments.reduce((sum, enrollment) => sum + (enrollment.section?.offering?.course?.credits ?? 0), 0);
  const tuitionFee = invoicesQuery.data?.find((invoice) => invoice.semesterId === currentSemester?.id);

  const toggleSection = async (sectionId: string, courseCode: string) => {
    setIsProcessing(true);
    const alreadyEnrolled = enrolledSections.has(sectionId);
    try {
      if (!alreadyEnrolled) {
        const selected = availableSections.find(({ section }) => section.id === sectionId);
        const credits = selected?.offering.course?.credits ?? 0;
        if (enrolledCredits + credits > 15) {
        toast.error("Credit Limit Reached! Maximum 15 credits per academic term allowed.");
          setIsProcessing(false);
          return;
        }
        await api.post("/enrollments/register", { sectionId });
      } else {
        await api.post("/enrollments/withdraw", { sectionId });
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["student", "my-courses"] }),
        queryClient.invalidateQueries({ queryKey: ["student", "registration-offerings"] }),
        queryClient.invalidateQueries({ queryKey: ["student", "invoices"] }),
      ]);
      if (alreadyEnrolled) {
        toast.info(`${courseCode} section withdrawn. The updated balance is shown in invoices.`);
      } else {
        soundManager.playSuccessChime();
        toast.success(`${courseCode} section registered successfully.`);
      }
    } catch (requestError) {
      toast.error(requestError instanceof Error ? requestError.message : "Registration could not be updated.");
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: "Academic Policies", subtitle: "Clearance & Prereqs" },
    { number: 2, title: "Course Selection", subtitle: "Sections & Schedule" },
    { number: 3, title: "Tuition Review", subtitle: "Fee Assessment" },
    { number: 4, title: "Confirmation", subtitle: "Enrolled Schedule" },
  ];

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Course Registration Wizard (ACID Guaranteed)"
        subtitle="Step-by-step academic course enrollment with prerequisite verification and live seat locking."
      />

      <div className="px-6 space-y-8">
        {/* WIZARD STEPPER HEADER */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((s) => {
              const isPassed = currentStep > s.number;
              const isCurrent = currentStep === s.number;

              return (
                <div
                  key={s.number}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isCurrent
                      ? "bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800"
                      : isPassed
                      ? "bg-emerald-50/60 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : "opacity-60"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                      isCurrent
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                        : isPassed
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="h-4 w-4" /> : s.number}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                      {s.title}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{s.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stepper Progress bar */}
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Academic Standing & Policies */}
        {currentStep === 1 && (
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <span>Step 1: Academic Standing & Prerequisite Clearance</span>
              </CardTitle>
              <CardDescription>
                Please verify your active academic status and term policies before selecting course sections.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 dark:border-slate-800 dark:bg-slate-900/40">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Term Active</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{currentSemester?.name ?? "No active semester"}</p>
                  <p className={`text-[11px] font-medium ${currentSemester?.isRegistrationOpen ? "text-emerald-600" : "text-amber-600"}`}>
                    {currentSemester?.isRegistrationOpen ? "Registration window open" : "Registration window closed"}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 dark:border-slate-800 dark:bg-slate-900/40">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Credit Ceiling</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Maximum 15.0 Credits</p>
                  <p className="text-[11px] text-indigo-600 font-medium">Full-Time Undergraduate</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 dark:border-slate-800 dark:bg-slate-900/40">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Prerequisites Cleared</p>
                  <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Checked by server</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">Prerequisites are checked when you register for a course.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 text-xs text-indigo-950 space-y-2 dark:border-indigo-900 dark:bg-indigo-950/20 dark:text-indigo-200">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span>Important ACID Concurrency Notice</span>
                </p>
                <p>
                  Registration requests are validated and committed by the backend transaction. A seat is confirmed only after the API accepts the request.
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep(2)} className="gap-2 text-xs">
                  <span>Continue to Course Selection</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Course & Section Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Step 2: Select Course Sections
                </h3>
                <p className="text-xs text-slate-500">
                  Choose your preferred lecture timeslots and campus rooms.
                </p>
              </div>

              <Badge variant="outline" className="text-xs font-semibold bg-indigo-50 border-indigo-200 text-indigo-700">
                {enrolledCredits} / 15 Credits Selected
              </Badge>
            </div>

            {isLoading || enrollmentsQuery.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 rounded-xl" />
                ))}
              </div>
            ) : isError || enrollmentsQuery.isError ? (
              <EmptyState
                title="Registration data could not be loaded"
                description={error instanceof Error ? error.message : enrollmentsQuery.error instanceof Error ? enrollmentsQuery.error.message : "Please try again."}
                icon={BookOpen}
                actionLabel="Retry"
                onAction={() => { void refetch(); void enrollmentsQuery.refetch(); }}
              />
            ) : availableSections.length === 0 ? (
              <EmptyState title="No sections available" description={currentSemester ? "No course sections are published for the current semester." : "The university has not marked an active semester."} icon={BookOpen} />
            ) : (
              <div className="space-y-4">
                {availableSections.map(({ offering, section }) => {
                  const isEnrolled = enrolledSections.has(section.id);
                  return (
                    <Card key={section.id} className="border-slate-200/80 overflow-hidden">
                      <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-6 dark:bg-slate-900/60 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <Badge variant="secondary" className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50">
                              {offering.course?.code || "Course"}
                            </Badge>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {offering.course?.title || "Course title unavailable"}
                            </h4>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {offering.course?.credits ?? 0} Credit Hours • {offering.course?.department?.code ?? "Department unavailable"}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 dark:border-slate-800 dark:bg-slate-950">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-indigo-600">
                                Section {section.sectionNumber}
                              </span>
                              <Badge variant="outline" className="text-[10px]">
                                Seats: {section.enrolledCount} / {section.capacity}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {section.schedule || "Schedule not set"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                {section.room || "Room not set"}
                              </span>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant={isEnrolled ? "destructive" : "default"}
                            className="text-xs h-9 gap-1.5 shrink-0"
                            disabled={isProcessing || (!isEnrolled && (!currentSemester?.isRegistrationOpen || section.enrolledCount >= section.capacity))}
                            onClick={() => toggleSection(section.id, offering.course?.code || "Course")}
                          >
                            {isEnrolled ? (
                              <>
                                <MinusCircle className="h-4 w-4" />
                                Drop Section
                              </>
                            ) : (
                              <>
                                <PlusCircle className="h-4 w-4" />
                                Add Section
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2 text-xs">
                <ArrowLeft className="h-4 w-4" />
                Previous Step
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                disabled={enrolledSections.size === 0}
                className="gap-2 text-xs"
              >
                Continue to Tuition Review ({enrolledCredits} Cr)
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Tuition Billing Assessment */}
        {currentStep === 3 && (
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                <span>Step 3: Tuition Assessment & Billing Summary</span>
              </CardTitle>
              <CardDescription>
                Real-time assessment of term tuition based on registered credit hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
                  <span>Registered Credit Hours</span>
                  <span>{enrolledCredits} Credits</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                  <span>Assessed amount</span>
                  <span>{tuitionFee ? formatCurrency(tuitionFee.totalAmount) : "No invoice yet"}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                  <span>Paid to date</span>
                  <span>{formatCurrency(tuitionFee?.paidAmount ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total Assessed Term Balance</span>
                  <span className="text-emerald-600 text-base font-mono">
                    {tuitionFee ? formatCurrency(tuitionFee.dueAmount) : "Not assessed"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 text-xs text-emerald-950 flex items-center gap-3 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>
                  Stripe Test Gateway Integration: You can settle your tuition in one click via debit/credit card under Student Invoices.
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-2 text-xs">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Course Selection
                </Button>
                <Button
                  onClick={() => {
                    soundManager.playSuccessChime();
                    setCurrentStep(4);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs shadow-md shadow-emerald-500/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Review Registered Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: Registration Summary */}
        {currentStep === 4 && (
          <Card className="border-slate-200/80 shadow-xl overflow-hidden text-center p-8 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Registration Summary
              </h3>
              <p className="text-xs text-slate-500">
                The API currently reports these enrolled sections for {currentSemester?.name ?? "the active semester"}.
              </p>
            </div>

            <div className="inline-flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
              <span><strong>Enrolled Load:</strong> {enrolledCredits} Credits</span>
              <span>•</span>
              <span><strong>Balance:</strong> {formatCurrency(tuitionFee?.dueAmount ?? 0)}</span>
              <span>•</span>
              <span><strong>Status:</strong> {enrolledSections.size > 0 ? "ENROLLED" : "NO ENROLLMENTS"}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link href="/student/transcript">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Printer className="h-3.5 w-3.5" />
                  Print Schedule & Transcript
                </Button>
              </Link>
              <Link href="/student/invoices">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs shadow">
                  <CreditCard className="h-3.5 w-3.5" />
                  Pay with Stripe Checkout
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="text-xs text-slate-500"
              >
                Modify Courses
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
