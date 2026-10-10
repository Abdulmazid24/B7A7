import { useEffect, useState } from "react";

/**
 * Universal hook that delays updating value until delayMs has elapsed
 * @param value Current reactive state
 * @param delayMs Milliseconds delay (defaults to 300ms)
 * @returns Debounced state
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
