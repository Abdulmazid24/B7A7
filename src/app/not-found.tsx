import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <SearchX className="mb-5 h-12 w-12 text-indigo-600" aria-hidden="true" />
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">404 · Page not found</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">We can&apos;t find that page</h1>
      <p className="mt-3 max-w-md text-sm text-slate-500">The link may be outdated, or the page may have moved.</p>
      <Link href="/" className="mt-6"><Button className="gap-2"><Home className="h-4 w-4" />Go to home</Button></Link>
    </main>
  );
}
