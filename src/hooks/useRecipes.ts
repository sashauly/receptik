import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Recipe } from "@/types/recipe";
import { generateSlug } from "@/lib/utils";
// import { sampleRecipes } from "@/lib/sample-data";
import { idbStorage } from "@/lib/storage";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRecipes = useCallback(async () => {
    try {
      const loadedRecipes = await idbStorage.getRecipes();

      const needsSlugs = loadedRecipes.some((recipe) => !recipe.slug);

      if (needsSlugs) {
        const updatedRecipes = loadedRecipes.map((recipe) => {
          if (!recipe.slug) {
            return {
              ...recipe,
              slug: generateSlug(recipe.name),
            };
          }
          return recipe;
        });

        setRecipes(updatedRecipes);

        await Promise.all(
          updatedRecipes.map((recipe) => idbStorage.updateRecipe(recipe))
        );
      } else {
        setRecipes(loadedRecipes);
      }
    } catch (error) {
      console.error("Error loading recipes from IndexedDB:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const addRecipe = useCallback(
    async (recipe: Omit<Recipe, "id" | "dateCreated" | "dateModified" | "slug">) => {
      const newRecipe: Recipe = {
        id: uuidv4(),
        slug: generateSlug(recipe.name),
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        ...recipe,
      };

      try {
        await idbStorage.saveRecipe(newRecipe);
        setRecipes((prev) => [...prev, newRecipe]);
        return newRecipe;
      } catch (error) {
        console.error("Error adding recipe to IndexedDB:", error);
        throw error;
      }
    },
    []
  );

  const updateRecipe = useCallback(
    async (id: string, recipe: Partial<Recipe>) => {
      try {
        const existingRecipe = await idbStorage.getRecipeById(id);

        if (!existingRecipe) {
          console.warn(`Recipe with id ${id} not found for update.`);
          return;
        }

        const updatedRecipe: Recipe = {
          ...existingRecipe,
          ...recipe,
          dateModified: new Date().toISOString(),
        };

        await idbStorage.updateRecipe(updatedRecipe);

        setRecipes((prev) =>
          prev.map((r) => (r.id === id ? updatedRecipe : r))
        );
      } catch (error) {
        console.error("Error updating recipe in IndexedDB:", error);
      }
    },
    []
  );

  const deleteRecipe = useCallback(async (id: string) => {
    try {
      await idbStorage.deleteRecipe(id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error("Error deleting recipe from IndexedDB:", error);
    }
  }, []);

  const deleteAllRecipes = useCallback(async () => {
    try {
      await idbStorage.deleteAllRecipes();
      setRecipes([]);
    } catch (error) {
      console.error("Error deleting all recipes from IndexedDB:", error);
    }
  }, []);

  const getRecipeById = useCallback(
    (id: string) => {
      return recipes.find((recipe) => recipe.id === id) || null;
    },
    [recipes]
  );

  const getRecipeBySlug = useCallback(
    (slug: string) => {
      return recipes.find((recipe) => recipe.slug === slug) || null;
    },
    [recipes]
  );

  const getAllKeywords = useCallback(() => {
    return Array.from(
      new Set(recipes.flatMap((recipe) => recipe.keywords || []))
    );
  }, [recipes]);

  const filterRecipes = useCallback(
    (searchQuery: string, activeKeyword: string) => {
      return recipes.filter((recipe) => {
        const matchesSearch =
          recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(searchQuery.toLowerCase())
          );

        if (activeKeyword === "all") return matchesSearch;
        return matchesSearch && recipe.keywords?.includes(activeKeyword);
      });
    },
    [recipes]
  );

  const importRecipes = useCallback(
    async (recipesToImport: Recipe[]) => {
      try {
        setIsLoading(true);
        await idbStorage.importRecipes(recipesToImport);
        await loadRecipes();
      } catch (error) {
        console.error("Error importing recipes:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [loadRecipes]
  );

  return {
    recipes,
    isLoading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    deleteAllRecipes,
    getRecipeById,
    getRecipeBySlug,
    getAllKeywords,
    filterRecipes,
    importRecipes,
  };
}
