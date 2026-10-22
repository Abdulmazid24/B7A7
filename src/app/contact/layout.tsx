import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact and inquiry information for the University Management System demo.",
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
