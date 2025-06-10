import { db } from "@/data/db";
import { logError } from "@/lib/utils/logger";
import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";

interface UseRecipesOptions {
  searchTerm?: string;
}

export const useRecipes = ({ searchTerm = "" }: UseRecipesOptions = {}) => {
  const recipes = useLiveQuery(() => {
    if (searchTerm.trim() !== "") {
      return db.recipes
        .filter((recipe) => {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          const nameMatches = recipe.name
            .toLowerCase()
            .includes(lowerCaseSearchTerm);
          const keywordsMatch =
            recipe.keywords?.some((keyword) =>
              keyword.toLowerCase().includes(lowerCaseSearchTerm)
            ) || false;
          return nameMatches || keywordsMatch;
        })
        .toArray();
    } else {
      return db.recipes.toArray();
    }
  }, [searchTerm]);

  const isLoading = recipes === undefined;
  const error: Error | null = null;

  useEffect(() => {
    if (error) {
      logError("Error fetching recipes with liveQuery:", error);
    }
  }, [error]);

  return { recipes: recipes || [], loading: isLoading, error };
};
