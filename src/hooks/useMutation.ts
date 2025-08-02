import { useState } from "react";
import { logError } from "@/utils/logger";

/**
 * A generic hook for managing async mutations (e.g., add, update, delete).
 * It abstracts away the loading and error state management.
 * @param {function} mutationFn - The asynchronous function that performs the mutation.
 * @returns An object with the mutation function and its current state.
 */
export const useMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) => {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: TVariables) => {
    setIsLoading(true);
    setError(null);
    setData(undefined);

    try {
      const result = await mutationFn(variables);
      setData(result);
      return result;
    } catch (err) {
      const mutationError =
        err instanceof Error ? err : new Error("An unknown error occurred.");
      setError(mutationError);
      logError("Mutation failed:", mutationError);
      throw mutationError; // Re-throw the error so the caller can catch it
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, isLoading, error };
};
