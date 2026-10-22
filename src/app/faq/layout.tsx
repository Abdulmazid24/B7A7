import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about course registration, grading, tuition payments, and role access in the UMS demo.",
};

export default function FAQLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
