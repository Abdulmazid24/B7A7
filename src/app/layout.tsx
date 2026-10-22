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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://b7-a7-lac.vercel.app"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
  title: {
    default: `${UNIVERSITY_NAME} | University Management System`,
    template: `%s | ${UNIVERSITY_NAME}`,
  },
  description:
    "University Management System demo portal with role based access for administrators, faculty members, and students.",
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
    url: "https://b7-a7-lac.vercel.app",
    title: `${UNIVERSITY_NAME} | University Management System`,
    description: "University Management System demo with student registration, faculty grading, and administration workflows.",
    siteName: UNIVERSITY_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${UNIVERSITY_NAME} | University Management System`,
    description: "University Management System demo built with Next.js and TypeScript.",
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
          <div id="main-content" tabIndex={-1} className="flex-1 flex flex-col focus:outline-none">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
