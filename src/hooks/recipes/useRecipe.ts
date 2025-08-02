import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";
import { Recipe } from "@/types/recipe";
import { logError } from "@/utils/logger";

export const useRecipe = ({ id, slug }: { id?: string; slug?: string }) => {
  const recipe = useLiveQuery(async () => {
    if (!id && !slug) {
      return null;
    }

    try {
      let fetchedRecipe: Recipe | undefined;
      if (id) {
        fetchedRecipe = await db.recipes.get(id);
      } else if (slug) {
        fetchedRecipe = await db.recipes.get({ slug });
      }

      return fetchedRecipe;
    } catch (err) {
      logError(
        `Error fetching recipe with ${id ? "ID " + id : "slug " + slug}:`,
        err
      );
      return null;
    }
  }, [id, slug]);

  return { recipe };
};
