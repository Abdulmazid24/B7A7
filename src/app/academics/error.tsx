"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";

export default function AcademicCatalogError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <section role="alert" className="w-full max-w-lg rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center dark:border-amber-900/60 dark:bg-amber-950/20">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">Catalog temporarily unavailable</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">We could not load academic programs</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-300">The catalog service did not return the course and department records. Try again in a moment.</p>
          <Button type="button" onClick={reset} className="mt-6 gap-2">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Retry catalog
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
