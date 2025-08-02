import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";
import { logError } from "@/utils/logger";
import { Recipe } from "@/types/recipe";

interface UseRecipesOptions {
  searchTerm?: string;
}

export const useRecipes = ({ searchTerm = "" }: UseRecipesOptions = {}) => {
  const recipes = useLiveQuery<Recipe[] | null | undefined>(async () => {
    try {
      let results;
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      if (lowerCaseSearchTerm.trim() !== "") {
        results = await db.recipes
          .filter((recipe) => {
            const nameMatches = recipe.name
              .toLowerCase()
              .includes(lowerCaseSearchTerm);
            const keywordsMatch =
              recipe.keywords?.some((keyword) =>
                keyword.toLowerCase().includes(lowerCaseSearchTerm),
              ) || false;
            return nameMatches || keywordsMatch;
          })
          .toArray();
      } else {
        results = await db.recipes.toArray();
      }

      return results;
    } catch (err) {
      logError("Error fetching recipes with liveQuery:", err);
      // Explicitly return null on a query error
      return null;
    }
  }, [searchTerm]);

  return { recipes };
};
