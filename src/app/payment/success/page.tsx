"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Clock3, FileText } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { PaymentRecord } from "@/types";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data: payment, isLoading, isError } = useQuery({
    queryKey: ["payment", "verify", sessionId],
    enabled: Boolean(sessionId),
    retry: 1,
    queryFn: async () => (await api.get<PaymentRecord | null>("/payments/verify", { session_id: sessionId! })).data,
  });
  const isPaid = payment?.status === "COMPLETED";
  const StatusIcon = isPaid ? CheckCircle2 : isError || !sessionId ? AlertCircle : Clock3;

  return (
    <Card className="max-w-md w-full border-emerald-200 shadow-xl overflow-hidden">
      <div className={`h-2 ${isPaid ? "bg-emerald-500" : isError ? "bg-rose-500" : "bg-amber-500"}`} />
      <CardContent className="p-8 text-center space-y-5">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isPaid ? "bg-emerald-100 text-emerald-600" : isError || !sessionId ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
          <StatusIcon className="h-10 w-10" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <span className={`text-xs font-bold uppercase tracking-wider ${isPaid ? "text-emerald-600" : "text-amber-700"}`}>
            {!sessionId ? "Session ID missing" : isLoading ? "Verifying payment" : isPaid ? "Payment Confirmed" : isError ? "Verification unavailable" : "Payment pending"}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isPaid ? "Tuition Fee Settled" : isLoading ? "Checking Stripe status" : "Payment status not confirmed"}
          </h1>
          <p className="text-xs text-slate-500">
            {isPaid
              ? "Stripe confirmed your payment. Your invoice will reflect the updated balance shortly."
              : isError
                ? "We could not verify this session. Check your invoices before trying another payment."
                : "Stripe has not confirmed this payment yet. Check your invoices again in a moment."}
          </p>
        </div>

        {sessionId && (
          <div className="rounded-lg bg-slate-50 border p-3 text-left space-y-1 text-xs font-mono text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Stripe Session ID</span>
            <p className="truncate">{sessionId}</p>
          </div>
        )}

        {!sessionId && <p className="text-sm text-rose-600">No Stripe session ID was provided, so this payment cannot be verified.</p>}

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
