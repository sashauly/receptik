import { type ReactNode, useEffect, useState } from "react";

/**
 * Delayed fallback component to prevent flickering
 */
export function DelayedFallback({
  delay,
  fallback,
}: {
  delay: number;
  fallback: ReactNode;
}) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return showFallback ? <>{fallback}</> : null;
}
