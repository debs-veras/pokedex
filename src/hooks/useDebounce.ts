import { useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function useDebounce(fn: Function, delay: number) {
  const timeoutRef: any = useRef<ReturnType<typeof setTimeout> | null>(null);

  function debounceFn(...args) {
    if (timeoutRef == null) return;

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      fn(...args);
    }, delay);
  }

  return debounceFn;
}
