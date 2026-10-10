import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { UNIVERSITY_NAME } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${UNIVERSITY_NAME} | Enterprise Academic Portal`,
    template: `%s | ${UNIVERSITY_NAME}`,
  },
  description:
    "Official Next.js Fullstack University Management System (UMS) portal with role-based access for Administrators, Faculty members, and Students.",
  keywords: [
    "University Management System",
    "UMS",
    "Course Registration",
    "Student Portal",
    "Faculty Grading",
    "Higher Education ERP",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-sans selection:bg-indigo-500/20 selection:text-indigo-600">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
