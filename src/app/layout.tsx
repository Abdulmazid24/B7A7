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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://b7-a7-ums.vercel.app"),
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
  authors: [{ name: "Abdul Mazid" }],
  creator: "Abdul Mazid",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://b7-a7-ums.vercel.app",
    title: `${UNIVERSITY_NAME} | Enterprise Academic Portal`,
    description: "Fullstack Higher Education ERP with Student Registration, Faculty Grading & Admin Controls.",
    siteName: UNIVERSITY_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${UNIVERSITY_NAME} | Enterprise Academic Portal`,
    description: "Enterprise University Management System built with Next.js 16, TypeScript & Tailwind CSS.",
  },
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Skip to main content
        </a>
        <QueryProvider>
          <main id="main-content" className="flex-1 flex flex-col focus:outline-none">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
