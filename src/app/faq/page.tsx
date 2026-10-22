"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FAQS = [
  {
    category: "Academic & Course Registration",
    question: "How does the ACID-Safe Course Registration prevent seat overselling?",
    answer:
      "All course enrollments and seat allocations are encapsulated within a Prisma database transaction ($transaction). When multiple students attempt to register for the final seat simultaneously, the transaction guarantees row-level concurrency lock—allowing only the first confirmed request to succeed while safely returning a seat-capacity error to the others.",
  },
  {
    category: "Academic & Course Registration",
    question: "What are prerequisite requirements and how are they enforced?",
    answer:
      "Courses with prerequisites require you to complete those courses first. The backend checks published enrollment and grade records, and blocks registration when the prerequisite has not been passed.",
  },
  {
    category: "Grading & Transcripts",
    question: "How are Letter Grades and Cumulative CGPA calculated?",
    answer:
      "Faculty members submit scores across Continuous Assessment (20%), Midterm Exam (30%), and Final Examination (50%). The server maps the total 100-point score to standard letter grades: 80+ = A+ (4.00), 75-79 = A (3.75), 70-74 = A- (3.50), etc. Cumulative CGPA is automatically updated via credit-weighted summation across all completed semesters.",
  },
  {
    category: "Tuition Billing & Stripe",
    question: "How does online tuition payment work with Stripe?",
    answer:
      "When you register for a course, the backend assesses tuition at its configured rate of $500 per credit. Invoices show the current balance, and Stripe Checkout confirms completed payments through a signed webhook or a server-side session verification.",
  },
  {
    category: "User Roles & Evaluation",
    question: "How do evaluators test the 3 distinct roles in this project?",
    answer:
      "The Login page (/login) features one-click demo access for Admin, Faculty, and Student. Demo access depends on the role accounts configured in the connected backend.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-slate-50 border-b border-slate-200/80 py-16 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Knowledge Base & Answers
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="max-w-2xl mx-auto text-sm text-slate-500 leading-relaxed">
              Find answers to common questions about enrollment rules, grading metrics, Stripe billing, and evaluator guidelines.
            </p>
          </div>
        </section>

        {/* Accordion FAQ */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <Card
                  key={idx}
                  className="border-slate-200/80 transition-all cursor-pointer select-none"
                  onClick={() => toggle(idx)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                          {faq.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-indigo-600" : ""
                        }`}
                      />
                    </div>

                    {isOpen && (
                      <p className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Quick Link Card */}
            <div className="mt-12 rounded-2xl bg-indigo-50 border border-indigo-100 p-8 text-center space-y-3 dark:bg-indigo-950/30 dark:border-indigo-900/40">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Still have questions regarding your academic plan?
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Our support team and academic advisors are always available to guide you.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link href="/contact">
                  <Button size="sm">Contact Campus Desk</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Open Demo Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
