import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a student account in the University Management System.",
};

export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
