import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key: string) => searchParams.get(key);

  const updateParams = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      // Update or remove each parameter
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      // Use replace to avoid creating new history entries
      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const clearParams = useCallback(() => {
    // Remove all search parameters
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    getParam,
    updateParams,
    clearParams,
    searchParams,
  };
}
