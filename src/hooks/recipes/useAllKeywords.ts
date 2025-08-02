import { getAllKeywords } from "@/data/recipeService";
import { logError } from "@/utils/logger";
import { useEffect, useState } from "react";

export const useAllKeywords = () => {
  const [allKeywords, setAllKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAllKeywords = async () => {
      setLoading(true);
      setError(null);

      try {
        const allKeywords = await getAllKeywords();
        setAllKeywords(allKeywords);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
        logError("Error fetching all keywords:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllKeywords();
  }, []);

  return { allKeywords, loading, error };
};
