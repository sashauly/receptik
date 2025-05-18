import { getUniqueSlug } from "@/lib/utils";
import { logWarn } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";

const recipesTable = db.recipes;

export const getAllRecipes = async (): Promise<Recipe[]> => {
  return await recipesTable.toArray();
};

export const getRecipeById = async (
  id: string
): Promise<Recipe | undefined> => {
  return await recipesTable.get(id);
};

export const getRecipeBySlug = async (
  slug: string
): Promise<Recipe | undefined> => {
  return await recipesTable.get({ slug });
};

export const addRecipe = async (
  recipeData: Omit<Recipe, "id" | "slug" | "createdAt" | "updatedAt">
): Promise<Recipe> => {
  const allRecipes = await recipesTable.toArray();
  const existingSlugs = allRecipes
    .map((r) => r.slug)
    .filter((slug): slug is string => slug !== undefined);

  const slug = getUniqueSlug(recipeData.name, existingSlugs);

  const newRecipe: Recipe = {
    ...recipeData,
    id: uuidv4(),
    slug: slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await recipesTable.add(newRecipe);

  return newRecipe;
};

export const updateRecipe = async (
  id: string,
  updates: Omit<Recipe, "createdAt" | "updatedAt">
): Promise<Recipe | undefined> => {
  const existingRecipe = await getRecipeById(id);

  if (!existingRecipe) {
    logWarn(`Recipe with id ${id} not found for update.`);
    return undefined;
  }

  const needsNewSlug =
    updates.name !== undefined && existingRecipe.name !== updates.name;

  let updatedSlug = existingRecipe.slug;
  if (needsNewSlug) {
    const otherRecipes = await recipesTable.where("id").notEqual(id).toArray();
    const existingSlugs = otherRecipes
      .map((r) => r.slug)
      .filter((slug): slug is string => slug !== undefined);

    updatedSlug = getUniqueSlug(updates.name as string, existingSlugs);
  }

  const updatedData: Partial<Recipe> = {
    ...updates,
    slug: updatedSlug,
    updatedAt: new Date(),
  };

  await recipesTable.update(id, updatedData);

  return getRecipeById(id);
};

export const deleteRecipe = async (id: string): Promise<void> => {
  const existingRecipe = await getRecipeById(id);
  if (!existingRecipe) {
    logWarn(`Recipe with id ${id} not found for delete.`);
    return;
  }

  await recipesTable.delete(id);
};

export const deleteAllRecipes = async (): Promise<void> => {
  await recipesTable.clear();
};

export const importRecipes = async (
  recipesToImport: Recipe[]
): Promise<void> => {
  await db.transaction("rw", [recipesTable], async () => {
    for (const recipeData of recipesToImport) {
      const existingRecipe = await getRecipeById(recipeData.id);

      if (existingRecipe) {
        if (existingRecipe.updatedAt < recipeData.updatedAt) {
          await recipesTable.put({
            ...recipeData,
          });
        } else {
          logWarn(
            `Skipping import of recipe with id ${recipeData.id} as existing recipe is newer.`
          );
        }
      } else {
        await recipesTable.add({
          ...recipeData,
        });
      }
    }
  });
};

export const getAllKeywords = async (): Promise<string[]> => {
  const recipes = await recipesTable.toArray();
  const allKeywords = recipes.flatMap((recipe) => recipe.keywords || []);
  return [...new Set(allKeywords)];
};

// export const filterRecipes = async (
//   searchQuery: string,
//   activeKeyword: string
// ): Promise<Recipe[]> => {
//   const recipes = await recipesTable.toArray();

//   return recipes.filter((recipe) => {
//     const matchesSearch =
//       recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       recipe.keywords?.some((keyword) =>
//         keyword.toLowerCase().includes(searchQuery.toLowerCase())
//       );

//     if (activeKeyword === "all") return matchesSearch;
//     return matchesSearch && recipe.keywords?.includes(activeKeyword);
//   });
// };

export const deleteDatabase = async (): Promise<void> => {
  await db.delete();
};

export const searchRecipes = async (searchTerm: string): Promise<Recipe[]> => {
  // return await recipesTable
  //   .where("name")
  //   .startsWithIgnoreCase(searchTerm)
  //   .or("keywords")
  //   .anyOfIgnoreCase(searchTerm.split(" "))
  //   .toArray();
  //   const recipes = await recipesTable.toArray();
  const recipe = await recipesTable.toArray();

  return recipe.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // if (activeKeyword === "all") return matchesSearch;
    // return matchesSearch && recipe.keywords?.includes(activeKeyword);
    return matchesSearch;
  });
};

export interface FilterOptions {
  category?: string;
  cuisine?: string;
  keywords?: string[];
}

export const filterRecipes = async ({
  //   category,
  //   cuisine,
  keywords,
}: FilterOptions): Promise<Recipe[]> => {
  let collection = recipesTable.toCollection();

  //   if (category) {
  //     collection = collection.where("category").equals(category);
  //   }

  //   if (cuisine) {
  //     collection = collection.and((recipe) => recipe.cuisine === cuisine); // Chain conditions
  //   }

  if (keywords && keywords.length > 0) {
    collection = collection.and((recipe) =>
      keywords.some((keyword) => recipe.keywords?.includes(keyword))
    );
  }

  return await collection.toArray();
};
