"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-center dark:bg-slate-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 mb-6 dark:bg-rose-950/60 dark:text-rose-400">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
        Application Error
      </span>
      <h1 className="text-3xl font-extrabold text-slate-900 mt-2 sm:text-4xl dark:text-white">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-500 leading-relaxed">
        We could not complete this request. Please try again. If the issue continues, contact the platform administrator.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
        </Link>
      </div>
      {error.digest && <p className="mt-4 text-xs text-slate-400">Reference: {error.digest}</p>}
    </div>
  );
}
