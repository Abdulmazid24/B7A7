import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FacultyLoading() {
  return (
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
