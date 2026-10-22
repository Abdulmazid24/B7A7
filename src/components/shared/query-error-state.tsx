import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QueryErrorStateProps {
  title?: string;
  description?: string;
  onRetry: () => void;
}

export function QueryErrorState({
  title = "This information could not be loaded",
  description = "Check your connection and try again.",
  onRetry,
}: QueryErrorStateProps) {
  return (
    <section role="alert" className="my-4 flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50/70 px-6 py-10 text-center dark:border-rose-900/60 dark:bg-rose-950/20">
      <AlertCircle className="mb-3 h-8 w-8 text-rose-600 dark:text-rose-400" aria-hidden="true" />
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-slate-600 dark:text-slate-300">{description}</p>
      <Button type="button" variant="outline" size="sm" onClick={onRetry} className="mt-5 gap-2">
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Try again
      </Button>
    </section>
  );
}
