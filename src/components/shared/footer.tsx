import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { UNIVERSITY_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {UNIVERSITY_NAME}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Leading the future of higher education with cutting-edge academic curricula, transparent grading, and integrated campus ERP systems.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              Accredited by National Academic Council
            </div>
          </div>

          {/* Col 2: Academics */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Academics
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/academics" className="hover:text-indigo-600 transition-colors">
                  Computer Science & Engineering
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-indigo-600 transition-colors">
                  Electrical & Electronic Eng.
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-indigo-600 transition-colors">
                  Business Administration (BBA)
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-indigo-600 transition-colors">
                  Curriculum & Prerequisites
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Campus Portals
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  Student Portal Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  Faculty Grading Desk
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  Admin ERP Console
                </Link>
              </li>
              <li>
                <Link href="/tuition" className="hover:text-indigo-600 transition-colors">
                  Tuition Billing & Stripe
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Campus Office
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>University Avenue, Tech City</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>+1 (800) 555-UNIV</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>admissions@university.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {UNIVERSITY_NAME}. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono">
            Powered by Next.js 16 • Prisma ORM • Neon PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
