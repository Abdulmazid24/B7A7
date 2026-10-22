"use client";

import { useCallback, useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};

export function useUrlSearchParam(name: string) {
  const getSnapshot = useCallback(
    () => new URLSearchParams(window.location.search).get(name) ?? "",
    [name]
  );
  const value = useSyncExternalStore(subscribe, getSnapshot, () => "");
  const setValue = useCallback((nextValue: string) => {
    const url = new URL(window.location.href);
    if (nextValue.trim()) url.searchParams.set(name, nextValue.trim());
    else url.searchParams.delete(name);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, [name]);
  return [value, setValue] as const;
}
