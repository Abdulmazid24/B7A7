import React from "react";
import Link from "next/link";
import { XCircle, ArrowRight, RefreshCw, CreditCard } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-rose-200 shadow-xl overflow-hidden">
          <div className="h-2 bg-rose-500" />
          <CardContent className="p-8 text-center space-y-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 mx-auto">
              <XCircle className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Payment Interrupted
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Transaction Cancelled
              </h2>
              <p className="text-xs text-slate-500">
                The Stripe Checkout session was cancelled or timed out. No amount has been deducted from your card.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/student/invoices" className="w-full">
                <Button className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry Payment
                </Button>
              </Link>
              <Link href="/student" className="w-full">
                <Button variant="outline" className="w-full">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
