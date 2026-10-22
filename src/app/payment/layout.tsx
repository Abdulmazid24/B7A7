import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment status",
  description: "Review the status of a Stripe tuition payment and return to student billing.",
};

export default function PaymentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
