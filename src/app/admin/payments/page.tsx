"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Receipt, Download } from "lucide-react";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryErrorState } from "@/components/shared/query-error-state";
import { api } from "@/lib/api-client";
import { formatCurrency, formatDate, getStatusBadgeClasses } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import { PaymentRecord } from "@/types";
import { useUrlSearchParam } from "@/lib/use-url-search-param";

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useUrlSearchParam("q");

  const { data: payments, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "payments"],
    queryFn: async () => {
      const res = await api.get<PaymentRecord[]>("/payments?limit=50");
      return res.data;
    },
  });

  const filtered = (payments || []).filter((p) => {
    const studentEmail = p.student?.email || "";
    const name = `${p.student?.profile?.firstName || ""} ${p.student?.profile?.lastName || ""}`;
    const session = p.stripeSessionId || "";
    return (
      studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleExportCSV = () => {
    const rows = filtered.map((p) => ({
      ID: p.id,
      StudentName: `${p.student?.profile?.firstName || ""} ${p.student?.profile?.lastName || ""}`,
      StudentEmail: p.student?.email || "",
      Amount: p.amount,
      Currency: p.currency,
      Status: p.status,
      StripeSessionId: p.stripeSessionId || "N/A",
      Date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A",
    }));
    exportToCSV("university_payment_ledger", rows);
  };

  return (
    <div className="flex-1 space-y-8 pb-12">
      <DashboardHeader
        title="University Payment Transactions & Ledger"
        subtitle="Review recorded tuition payment transactions and export the current result set."
      />

      <div className="px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              aria-label="Search payments by student, email, or Stripe ID"
              placeholder="Search by student, email, or Stripe ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={filtered.length === 0}
              className="gap-1.5 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Badge variant="outline" className="text-xs">
              {filtered.length} Recorded Transactions
            </Badge>
          </div>
        </div>

        <Card className="border-slate-200/80 overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Stripe Payment Ledger</CardTitle>
              <span className="text-xs text-slate-500">Payment ledger</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : isError ? (
              <QueryErrorState title="Payment records could not be loaded" onRetry={() => void refetch()} />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No Payments Recorded"
                description="Stripe tuition transactions will appear here after the backend records them."
                icon={Receipt}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider dark:bg-slate-900 dark:border-slate-800">
                    <tr>
                      <th scope="col" className="py-3 px-6">Transaction ID</th>
                      <th scope="col" className="py-3 px-6">Student</th>
                      <th scope="col" className="py-3 px-6">Amount</th>
                      <th scope="col" className="py-3 px-6">Method</th>
                      <th scope="col" className="py-3 px-6">Status</th>
                      <th scope="col" className="py-3 px-6">Captured Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 px-6 font-mono text-[11px] text-slate-500">
                          {pay.stripeSessionId ? `${pay.stripeSessionId.slice(0, 16)}...` : pay.id.slice(0, 8)}
                        </td>
                        <td className="py-3.5 px-6">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {pay.student?.profile?.firstName
                                ? `${pay.student.profile.firstName} ${pay.student.profile.lastName}`
                                : pay.student?.email}
                            </span>
                            <span className="text-[11px] text-slate-500">{pay.student?.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">
                          {formatCurrency(pay.amount, pay.currency)}
                        </td>
                        <td className="py-3.5 px-6">
                          <Badge variant="outline" className="text-[10px] uppercase font-mono">
                            {pay.paymentMethod || "STRIPE"}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClasses(
                              pay.status
                            )}`}
                          >
                            {pay.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-500 font-mono text-[11px]">
                          {formatDate(pay.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
