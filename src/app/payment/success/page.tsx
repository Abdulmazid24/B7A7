"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, FileText, CreditCard } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <Card className="max-w-md w-full border-emerald-200 shadow-xl overflow-hidden">
      <div className="h-2 bg-emerald-500" />
      <CardContent className="p-8 text-center space-y-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Payment Confirmed
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tuition Fee Settled
          </h2>
          <p className="text-xs text-slate-500">
            Your payment has been successfully captured and processed via Stripe.
          </p>
        </div>

        {sessionId && (
          <div className="rounded-lg bg-slate-50 border p-3 text-left space-y-1 text-xs font-mono text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Stripe Session ID</span>
            <p className="truncate">{sessionId}</p>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/student/invoices" className="w-full">
            <Button className="w-full gap-2">
              <FileText className="h-4 w-4" />
              View Student Invoices
            </Button>
          </Link>
          <Link href="/student" className="w-full">
            <Button variant="outline" className="w-full">
              Student Dashboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div className="p-8 text-center">Verifying payment session...</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
