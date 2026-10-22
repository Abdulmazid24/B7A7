import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentSuccessLoading() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center p-6" aria-label="Verifying payment">
      <div className="w-full max-w-md space-y-5 rounded-xl border p-8">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto h-7 w-56" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </main>
  );
}
