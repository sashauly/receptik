import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Recipe } from "@/types/recipe";
import { generateSlug } from "@/lib/utils";
import { sampleRecipes } from "@/lib/sample-data";
import { idbStorage } from "@/lib/storage";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recipes from IndexedDB on component mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        let loadedRecipes = await idbStorage.getRecipes();

        if (loadedRecipes.length === 0) {
          // If IndexedDB is empty, load sample recipes and save to IndexedDB
          loadedRecipes = sampleRecipes;
          await Promise.all(
            sampleRecipes.map((recipe) => idbStorage.saveRecipe(recipe))
          ); // Save samples
        }

        // Check if we need to add slugs to existing recipes
        const needsSlugs = loadedRecipes.some((recipe) => !recipe.slug);

        if (needsSlugs) {
          // Add slugs to recipes that don't have them
          const updatedRecipes = loadedRecipes.map((recipe) => {
            if (!recipe.slug) {
              return {
                ...recipe,
                slug: generateSlug(recipe.title),
              };
            }
            return recipe;
          });

          setRecipes(updatedRecipes);

          //update the recipes on indexDB as well
          await Promise.all(
            updatedRecipes.map((recipe) => idbStorage.updateRecipe(recipe))
          );
        } else {
          setRecipes(loadedRecipes);
        }
      } catch (error) {
        console.error("Error loading recipes from IndexedDB:", error);
        // Handle the error appropriately, maybe set an error state
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, []);

  const addRecipe = useCallback(
    async (recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt" | "slug">) => {
      const newRecipe: Recipe = {
        id: uuidv4(),
        slug: generateSlug(recipe.title),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...recipe,
      };

      try {
        await idbStorage.saveRecipe(newRecipe);
        setRecipes((prev) => [...prev, newRecipe]);
        return newRecipe;
      } catch (error) {
        console.error("Error adding recipe to IndexedDB:", error);
        // Handle the error appropriately
        throw error; // Re-throw to allow the component to handle it
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
          updatedAt: new Date().toISOString(),
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
      // Handle error appropriately
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

  const getAllTags = useCallback(() => {
    return Array.from(new Set(recipes.flatMap((recipe) => recipe.tags)));
  }, [recipes]);

  const filterRecipes = useCallback(
    (searchQuery: string, activeTag: string) => {
      return recipes.filter((recipe) => {
        const matchesSearch =
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          );

        if (activeTag === "all") return matchesSearch;
        return matchesSearch && recipe.tags.includes(activeTag);
      });
    },
    [recipes]
  );

  return {
    recipes,
    isLoading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    getRecipeBySlug,
    getAllTags,
    filterRecipes,
  };
}
