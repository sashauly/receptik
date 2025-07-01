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

// Helper to convert base64 string to Blob
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteString = atob(base64.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}

export const importRecipes = async (
  recipesToImport: Recipe[]
): Promise<void> => {
  if (!recipesToImport || recipesToImport.length === 0) {
    throw new Error("No recipes provided for import.");
  }

  await db.transaction("rw", recipesTable, async () => {
    for (const recipeData of recipesToImport) {
      if (!recipeData.id || !recipeData.name) {
        logWarn(
          `Skipping invalid recipe data: missing ID or name. Data:`,
          recipeData
        );
        continue;
      }

      // Convert image data from base64 string to Blob if needed
      let images = recipeData.images;
      if (images && images.length > 0) {
        images = images.map((img) => {
          const image = img as
            | { data: string; type: string }
            | { data: Blob; type: string };
          if (
            typeof image.data === "string" &&
            image.data &&
            image.data.startsWith("data:")
          ) {
            // Convert base64 string to Blob
            return {
              ...img,
              data: base64ToBlob(image.data, image.type),
            };
          }
          return img;
        });
      }

      const parsedRecipeData: Recipe = {
        ...recipeData,
        images,
        createdAt: new Date(recipeData.createdAt),
        updatedAt: new Date(recipeData.updatedAt),
      };

      const existingRecipe = await recipesTable.get(parsedRecipeData.id);

      if (existingRecipe) {
        if (
          parsedRecipeData.updatedAt instanceof Date &&
          existingRecipe.updatedAt instanceof Date &&
          parsedRecipeData.updatedAt.getTime() >
            existingRecipe.updatedAt.getTime()
        ) {
          await recipesTable.put(parsedRecipeData);
        } else {
          logWarn(
            `Skipping import of recipe with id ${recipeData.id} as existing recipe is newer or same.`
          );
        }
      } else {
        await recipesTable.add(parsedRecipeData);
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
  if (!searchTerm || searchTerm.trim() === "") {
    return recipesTable.toArray();
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return await recipesTable
    .filter((recipe) => {
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
