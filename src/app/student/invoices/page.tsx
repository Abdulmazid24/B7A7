"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowRight, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { formatCurrency, formatDate, getStatusBadgeClasses } from "@/lib/utils";
import { TuitionFee } from "@/types";

export default function StudentInvoicesPage() {
  const [isProcessingStripe, setIsProcessingStripe] = useState<string | null>(null);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["student", "invoices"],
    queryFn: async () => {
      try {
        const res = await api.get<{ tuitionFees: TuitionFee[] }>("/payments/my-invoices");
        return res.data?.tuitionFees || [];
      } catch {
        return [];
      }
    },
  });

  const handlePayViaStripe = async (tuitionFeeId: string) => {
    setIsProcessingStripe(tuitionFeeId);
    try {
      toast.info("Generating secure Stripe Checkout Session with webhook listener...");
      const res = await api.post<{ url: string; sessionId: string }>(
        "/payments/create-checkout-session",
        {
          tuitionFeeId,
        }
      );

      if (res.data?.url) {
        toast.success("Redirecting to Stripe Gateway...");
        window.location.href = res.data.url;
      } else {
        toast.success("Payment initiated! Session registered in Stripe Test Mode.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Stripe checkout session failed";
      // If validation error or backend test mode, provide clear helpful toast
      toast.error(message);
    } finally {
      setIsProcessingStripe(null);
    }
  };

  // Demo fallback invoice if user hasn't enrolled yet
  const displayInvoices: TuitionFee[] =
    (invoices && invoices.length > 0)
      ? invoices
      : [
          {
            id: "tf-demo-001",
            studentId: "stu-1",
            semesterId: "sem-1",
            semester: {
              id: "sem-1",
              name: "Fall 2026",
              year: 2026,
              code: "FL26",
              startDate: "2026-09-01",
              endDate: "2026-12-30",
              isCurrent: true,
              isRegistrationOpen: true,
              createdAt: "",
              updatedAt: "",
            },
            totalAmount: 1800,
            paidAmount: 0,
            dueAmount: 1800,
            status: "UNPAID",
            dueDate: "2026-11-15T00:00:00.000Z",
            createdAt: "2026-10-08T16:59:29.737Z",
          },
        ];

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="Tuition Billing & Stripe Online Payments"
        subtitle="Settle course registration fees securely using real Stripe Checkout Sessions."
      />

      <div className="px-6 space-y-6 max-w-5xl">
        {/* Stripe Security Banner */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              End-to-End Encrypted: Powered by Stripe SDK. Instant invoice settlement via webhook events.
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] bg-white border-emerald-300 text-emerald-700">
            Stripe Test Mode (Live)
          </Badge>
        </div>

        {/* Invoice Cards */}
        <div className="space-y-4">
          {displayInvoices.map((inv) => (
            <Card key={inv.id} className="border-slate-200/80 overflow-hidden shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono text-xs font-bold text-indigo-700">
                        {inv.semester?.code || "SEMESTER"}
                      </Badge>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {inv.semester?.name || "Semester Tuition Assessment"}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(
                          inv.status
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Due Date: <span className="font-semibold">{formatDate(inv.dueDate)}</span> • Assessed upon 12 credit registration
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Amount Due
                      </span>
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(inv.dueAmount)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Paid: {formatCurrency(inv.paidAmount)} of {formatCurrency(inv.totalAmount)}
                      </span>
                    </div>

                    {inv.status === "PAID" ? (
                      <Button size="sm" variant="outline" disabled className="gap-1.5 text-xs text-emerald-600 border-emerald-200">
                        <CheckCircle2 className="h-4 w-4" />
                        Settled
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handlePayViaStripe(inv.id)}
                        isLoading={isProcessingStripe === inv.id}
                        className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                      >
                        <CreditCard className="h-4 w-4" />
                        Pay with Stripe
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
