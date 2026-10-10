import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Target,
  Award,
  BookOpen,
  ArrowRight,
  Globe2,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UNIVERSITY_NAME } from "@/lib/constants";

export const metadata = {
  title: "About University Heritage & Accreditation",
  description: "Learn about our academic governance, accreditation, campus mission, and institutional excellence.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-slate-50 border-b border-slate-200/80 py-16 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Institutional Heritage & Mission
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
              Shaping Tomorrow's Visionaries & Engineers
            </h1>
            <p className="max-w-2xl mx-auto text-sm text-slate-500 leading-relaxed">
              Founded on the pillars of academic integrity, rigorous research, and state-of-the-art technological leadership, {UNIVERSITY_NAME} fosters transformative education for global impact.
            </p>
          </div>
        </section>

        {/* Pillars Grid */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-slate-200/80 p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center dark:bg-indigo-950/50">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Our Mission</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  To provide accessible, high-caliber higher education powered by enterprise digital platforms, ensuring ethical leadership, technological competence, and analytical rigor.
                </p>
              </Card>

              <Card className="border-slate-200/80 p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/50">
                  <Globe2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Global Vision</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  To stand at the frontier of international academia through multidisciplinary research, industry collaborations, and transparent academic administration.
                </p>
              </Card>

              <Card className="border-slate-200/80 p-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950/50">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Accreditation</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Chartered and accredited by the National Higher Education Commission, adhering strictly to global credit transfer systems (ECTS & US Standard Semester Credits).
                </p>
              </Card>
            </div>

            {/* Leadership Statement */}
            <div className="mt-16 rounded-2xl bg-indigo-600 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  From the Vice Chancellor's Desk
                </span>
                <h3 className="text-2xl font-bold">
                  "Education is not merely the transmission of knowledge, but the architecture of character."
                </h3>
                <p className="text-sm text-indigo-100 leading-relaxed">
                  Our digital university management system guarantees complete transparency in student admissions, course evaluations, and grading metrics.
                </p>
              </div>
              <Link href="/login" className="shrink-0">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold gap-2">
                  Explore Campus Portals
                  <ArrowRight className="h-4 w-4" />
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
