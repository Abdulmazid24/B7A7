import React from "react";
import Link from "next/link";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-center dark:bg-slate-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 mb-6 dark:bg-indigo-950/60 dark:text-indigo-400">
        <GraduationCap className="h-8 w-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
        Error 404
      </span>
      <h1 className="text-4xl font-extrabold text-slate-900 mt-2 sm:text-5xl dark:text-white">
        Academic Record Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-500 leading-relaxed">
        The requested university portal URL, course page, or syllabus does not exist or has been relocated to another academic department.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Return to Homepage
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" className="gap-2">
            Sign In to Portals
          </Button>
        </Link>
      </div>
    </div>
  );
}
