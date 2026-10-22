import React from "react";
import Link from "next/link";
import { GraduationCap, Shield, BookOpen, Award, ArrowRight, CheckCircle2, Sparkles, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "University Management System Demo",
  description: "Explore role-based university administration, course registration, academic records, and Stripe test payment workflows.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-radial from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-950 dark:to-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                Next.js 16 • Enterprise University Management System
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white leading-[1.15]">
                Empowering Excellence in{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                  Higher Education
                </span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                A unified campus management demo for role-based administration, course registration, academic records, and Stripe test payments.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-indigo-600/20">
                    Access Portal Login
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    Try 1-Click Role Demos
                  </Button>
                </Link>
                <Link href="/academics">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                    <BookOpen className="h-4 w-4" />
                    Explore Curricula
                  </Button>
                </Link>
              </div>

              {/* Platform capabilities */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Role-based workspaces
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Course registration workflow
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Stripe test checkout
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS / STATS SECTION */}
        <section className="border-y border-slate-200/80 bg-slate-50/60 py-12 dark:border-slate-800/80 dark:bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">3</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  Role-based workspaces
                </p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-extrabold text-indigo-600">4</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  Registration steps
                </p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">100</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  Grading points
                </p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-extrabold text-emerald-600">Stripe</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  Test checkout
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 ROLES SHOWCASE SECTION */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Role-Based Architecture
              </h2>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
                Tailored Workflows for Every Campus Stakeholder
              </h3>
              <p className="text-sm text-slate-500 mt-3">
                Each role has a focused workspace for its day-to-day academic tasks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Role 1: Administrator */}
              <Card className="relative overflow-hidden border-slate-200/80 hover:border-purple-300 transition-all">
                <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600" />
                <CardContent className="p-8 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/50">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      Administrator Console
                    </h4>
                    <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider mt-0.5">
                      Executive Governance
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Manage departments, semesters, course offerings, user access, and payment records from one operations workspace.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t">
                    <li className="flex items-center gap-2">✓ API-backed operations overview</li>
                    <li className="flex items-center gap-2">✓ Department and course management</li>
                    <li className="flex items-center gap-2">✓ User roles and payment records</li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="w-full gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50">
                        Launch Admin Demo <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Role 2: Faculty */}
              <Card className="relative overflow-hidden border-slate-200/80 hover:border-blue-300 transition-all">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
                <CardContent className="p-8 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      Faculty Grading Desk
                    </h4>
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mt-0.5">
                      Instructors & Evaluators
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    View assigned sections, access enrolled student rosters, and input continuous assessments, midterms, and finals with automated Letter Grade computation.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t">
                    <li className="flex items-center gap-2">✓ Assigned section rosters</li>
                    <li className="flex items-center gap-2">✓ Dynamic 100-Point Marks Matrix</li>
                    <li className="flex items-center gap-2">✓ Automated Letter Grade / Grade Point</li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="w-full gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50">
                        Launch Faculty Demo <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Role 3: Student */}
              <Card className="relative overflow-hidden border-slate-200/80 hover:border-emerald-300 transition-all">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <CardContent className="p-8 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      Student Academic Hub
                    </h4>
                    <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mt-0.5">
                      Learners & Candidates
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Register for course sections, view cumulative CGPA records, and pay semester tuition fees through Stripe Checkout.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t">
                    <li className="flex items-center gap-2">✓ Prerequisite & Credit Validation</li>
                    <li className="flex items-center gap-2">✓ Academic transcript & GPA calculation</li>
                    <li className="flex items-center gap-2">✓ Direct Stripe Checkout Sessions</li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="w-full gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                        Launch Student Demo <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="bg-slate-900 text-white py-16 dark:bg-slate-950 border-t border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to experience modern academic administration?
            </h2>
              <p className="mx-auto max-w-xl text-sm text-slate-400">
                Explore the system with a demo role, or review the platform and its sample workflows.
              </p>
              <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2 bg-indigo-600 hover:bg-indigo-500 sm:w-auto">
                    Launch Quick Demo Login
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 sm:w-auto">
                    About the platform
                  </Button>
                </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
