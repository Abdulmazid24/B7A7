import { Skeleton } from "@/components/ui/skeleton";

export default function AcademicsLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12" aria-label="Loading academic catalog">
      <div className="space-y-3 text-center">
        <Skeleton className="mx-auto h-4 w-52" />
        <Skeleton className="mx-auto h-10 w-80 max-w-full" />
        <Skeleton className="mx-auto h-5 w-[34rem] max-w-full" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((item) => <Skeleton key={item} className="h-48 rounded-xl" />)}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className="h-44 rounded-xl" />)}
      </div>
    </main>
  );
}
