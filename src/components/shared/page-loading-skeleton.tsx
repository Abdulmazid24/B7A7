import { Skeleton } from "@/components/ui/skeleton";

export function PageLoadingSkeleton() {
  return (
    <div className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8" role="status" aria-label="Loading page content">
      <Skeleton className="h-8 w-56 max-w-full rounded-lg" />
      <Skeleton className="h-4 w-80 max-w-full rounded-md" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((item) => <Skeleton key={item} className="h-36 rounded-xl" />)}
      </div>
      <Skeleton className="h-72 rounded-xl" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
