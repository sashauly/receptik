import { searchRecipes as performSearch } from "@/data/recipeService";
import { logError } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";

export const useSearchRecipes = (searchTerm: string) => {
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      setError(null);

      if (!searchTerm) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        const results = await performSearch(searchTerm);
        setSearchResults(results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        logError("Error searching recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [searchTerm]);

  return { searchResults, loading, error };
};
