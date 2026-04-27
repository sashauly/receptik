import { Spinner } from "@/components/ui/spinner";
import { type ComponentType, type ReactNode, Suspense, lazy } from "react";
import { DelayedFallback } from "./DelayedFallback";

/**
 * Anti-flicker loading options
 */
type LoaderOptions = {
  /**
   * Don't show loading state if component loads faster than this (in ms)
   * @default 300
   */
  delay?: number;

  /**
   * Minimum time to show loading state once visible (in ms)
   * @default 700
   */
  minimumLoading?: number;
};

/**
 * Simple utility to create a delay
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a lazy-loaded component with built-in anti-flickering protection
 *
 * @example
 * // Basic usage
 * const HomePage = lazyLoad(() => import('./pages/Home'));
 *
 * // With custom loading component
 * const Dashboard = lazyLoad(() => import('./pages/Dashboard'), {
 *   fallback: <CustomSpinner />
 * });
 *
 * // With custom anti-flicker timing
 * const Settings = lazyLoad(() => import('./pages/Settings'), {
 *   delay: 500,
 *   minimumLoading: 1000
 * });
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: LoaderOptions & {
    fallback?: ReactNode;
  },
) {
  // Default options
  const {
    delay = 300,
    minimumLoading = 700,
    fallback = <Spinner>{"Loading..."}</Spinner>,
  } = options || {};

  // Create a lazy component with anti-flicker protection
  const LazyComponent = lazy(() => {
    const startTime = performance.now();

    return importFn().then((module) => {
      const loadTime = performance.now() - startTime;

      // Don't delay if loaded quickly or already waited long enough
      if (
        loadTime < delay ||
        (loadTime > delay && loadTime > delay + minimumLoading)
      ) {
        return module;
      }

      // Otherwise, wait for minimum loading time to prevent flickering
      return sleep(delay + minimumLoading - loadTime).then(() => module);
    });
  });

  // Return the wrapped component
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<DelayedFallback delay={delay} fallback={fallback} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Default export for convenience
export default lazyLoad;
