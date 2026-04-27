import type {
  FilterOptions} from "@/data/recipeService";
import {
  filterRecipes as performFilter,
} from "@/data/recipeService";
import { logError } from "@/utils/logger";
import type { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";

export const useFilterRecipes = (filterOptions: FilterOptions) => {
  const [filteredResults, setFilteredResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const filter = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await performFilter(filterOptions);

        setFilteredResults(results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        logError("Error filtering recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    filter();
  }, [filterOptions]);

  return { filteredResults, loading, error };
};
