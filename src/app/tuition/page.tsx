import React from "react";
import Link from "next/link";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UNIVERSITY_NAME } from "@/lib/constants";

export const metadata = {
  title: "Tuition Structure, Fees & Stripe Billing",
  description: "Comprehensive tuition rates, per-credit hour assessments, and secure Stripe online payment gateway policies.",
};

export default function TuitionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-slate-50 border-b border-slate-200/80 py-16 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Financial Services & Student Accounts
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
              Tuition, Credit Rates & Stripe Payments
            </h1>
            <p className="max-w-2xl mx-auto text-sm text-slate-500 leading-relaxed">
              Transparent per-credit tuition calculations, automated semester assessment upon course registration, and real-time online checkout.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            {/* Rate Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-slate-200/80 p-6 space-y-4">
                <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
                  Undergraduate
                </Badge>
                <div className="space-y-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">$150</span>
                  <span className="text-xs text-slate-500"> / credit hour</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Applies to standard courses across Computer Science, Electrical Engineering, and Business Administration.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t">
                  <li className="flex items-center gap-2">✓ Automated credit computation</li>
                  <li className="flex items-center gap-2">✓ Laboratory and library access included</li>
                  <li className="flex items-center gap-2">✓ Settle via Stripe Checkout</li>
                </ul>
              </Card>

              <Card className="border-indigo-300 shadow-md p-6 space-y-4 relative bg-gradient-to-b from-indigo-50/40 to-white dark:from-indigo-950/20 dark:to-slate-900">
                <div className="flex items-center justify-between">
                  <Badge className="bg-indigo-600 text-white">Full-Time Semester (12 Cr)</Badge>
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="space-y-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">$1,800</span>
                  <span className="text-xs text-slate-500"> / semester base</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Standard undergraduate full-time enrollment block (12 credits across 4 registered sections).
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t">
                  <li className="flex items-center gap-2">✓ Full course registration quota (15 cr max)</li>
                  <li className="flex items-center gap-2">✓ Comprehensive transcript issuance</li>
                  <li className="flex items-center gap-2">✓ Instant webhook payment confirmation</li>
                </ul>
              </Card>

              <Card className="border-slate-200/80 p-6 space-y-4">
                <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                  Graduate & Honors
                </Badge>
                <div className="space-y-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">$220</span>
                  <span className="text-xs text-slate-500"> / credit hour</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Specialized graduate research credits, thesis advisement, and advanced faculty laboratory modules.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t">
                  <li className="flex items-center gap-2">✓ Research lab allocations</li>
                  <li className="flex items-center gap-2">✓ Direct faculty mentorship</li>
                  <li className="flex items-center gap-2">✓ Official degree completion records</li>
                </ul>
              </Card>
            </div>

            {/* Stripe Integration Info Banner */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 flex flex-col md:flex-row items-center justify-between gap-6 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shrink-0">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Integrated with Stripe Payment Gateway
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                    Students can pay their semester tuition directly from the Student Portal. Our server securely creates a Stripe Checkout session and confirms payments through cryptographic webhook signatures (`whsec_...`).
                  </p>
                </div>
              </div>

              <Link href="/login">
                <Button className="shrink-0 gap-2">
                  Log in to Pay Tuition
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
